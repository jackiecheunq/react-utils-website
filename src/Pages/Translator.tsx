import { useState, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import { outputHandler } from "@/utils/converter";
import textFileOnChangeHandler from "@/utils/fileHandler";
import { getDirectText, replaceDirectText } from "@/utils/htmlUtils";

const Translator = () => {
  const [html, setHtml] = useState("");
  const [data, setData] = useState("");
  const htmlFileUploadRef = useRef<HTMLInputElement>(null);
  const jsonFileUploadRef = useRef<HTMLInputElement>(null);

  const convert = (src: string) => {
    try {
      if (src) {
        const transData: Record<string, string> = JSON.parse(src);
        const keys = Object.keys(transData);
        const container = document.createElement("div");
        container.innerHTML = html;
        for (let index = 0; index < keys.length; index++) {
          container.querySelectorAll("*:not(script,style)").forEach((el) => {
            const textForSearch = keys[index];
            if (
              el.nodeName === "IMG" &&
              el.getAttribute("alt") === textForSearch
            ) {
              el.setAttribute("alt", transData[textForSearch]);
              return;
            }
            const text = getDirectText(el);
            if (text === textForSearch) {
              replaceDirectText(el, transData[textForSearch]);
            }
          });
        }
        const result = container.innerHTML;
        container.remove();
        return result;
      }
      return "";
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
    return src;
  };

  const convertedValue = useMemo(() => {
    return convert(data);
  }, [data]);

  const clearAllFiles = () => {
    if (htmlFileUploadRef.current) htmlFileUploadRef.current.value = "";
    if (jsonFileUploadRef.current) jsonFileUploadRef.current.value = "";
    setData("");
    setHtml("");
  };
  const onOutputHandler = () => {
    outputHandler(convertedValue, "result", "html", () => {
      clearAllFiles();
    });
  };

  return (
    <div className="w-full bg-slate-100 p-32 flex flex-col justify-center items-center [&>*]:mb-15">
      <h1 className="mb-3 font-bold text-4xl">HTML Translator</h1>
      <div className="p-10">
        <p>HTML Upload</p>
        <input
          type="file"
          id="html"
          name="html"
          accept="text/html"
          ref={htmlFileUploadRef}
          onChange={textFileOnChangeHandler(setHtml)}
        />
      </div>
      <div className="p-10">
        <p>JSON Upload</p>
        <input
          type="file"
          id="json"
          name="json"
          accept="application/json"
          ref={jsonFileUploadRef}
          onChange={textFileOnChangeHandler(setData)}
        />
      </div>
      <div className="flex">
        <button
          className="btn py-4 px-12 block disabled:cursor-not-allowed disabled:opacity-75 mr-3"
          onClick={onOutputHandler}
          disabled={!data || !html}
        >
          Output
        </button>
        <button
          className="btn py-4 px-12 block disabled:cursor-not-allowed disabled:opacity-75 mr-3"
          onClick={clearAllFiles}
          disabled={!data || !html}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Translator;
