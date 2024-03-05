import { useState, useRef } from "react";
import BasicOutput from "../Components/BasicOutput";
import { toast } from "react-toastify";
import { getDirectText } from "@/utils/htmlUtils";
import { removeRepeat } from "@/utils/utils";
import textFileOnChangeHandler from "@/utils/fileHandler";

const TransDataExtractor = () => {
  const [title, setTitle] = useState("transData");
  const [content, setContent] = useState("");
  const [existedData, setExistedData] = useState("");
  const jsonFileUploadRef = useRef<HTMLInputElement>(null);

  function generateDict(
    arr: Array<string>,
    existedData: Record<string, string> | ""
  ) {
    const dict: Record<string, string> = {};

    arr.forEach((e) => {
      if (existedData && existedData.hasOwnProperty(e)) {
        dict[e] = existedData[e];
      } else {
        dict[e] = e;
      }
    });
    return dict;
  }

  const convert = (existedData: string, src: string) => {
    try {
      const container = document.createElement("div");
      container.innerHTML = src;
      const regexOfChi = /[\u4E00-\u9FFF]/;
      const res: Array<string> = [];
      container.querySelectorAll("*:not(script,style)").forEach((el) => {
        if (el.nodeName === "IMG") {
          const alt = el.getAttribute("alt");
          if (alt && regexOfChi.test(alt)) {
            res.push(alt);
          }
          return;
        }
        const text = getDirectText(el);
        if (typeof text === "string" && regexOfChi.test(text)) {
          res.push(text);
        }
      });
      container.remove();
      const joinedResult = generateDict(
        removeRepeat(res),
        existedData && JSON.parse(existedData)
      );
      return JSON.stringify(joinedResult);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("unknown Error");
      }
    }

    return src;
  };

  const input = {
    title,
    content,
    convert: convert.bind(null, existedData),
    setTitle,
    setContent,
    extentsion: "json",
  };
  return (
    <div className="w-full bg-slate-100 p-32 flex flex-col justify-center items-center [&>*]:mb-20">
      <h1 className="mb-3 font-bold text-4xl">TransDataExtractor</h1>
      <div className="p-10">
        <p>Existed Data Upload</p>
        <input
          type="file"
          id="json"
          name="json"
          accept="application/json"
          ref={jsonFileUploadRef}
          onChange={textFileOnChangeHandler(setExistedData)}
        />
      </div>
      <BasicOutput input={input} />
    </div>
  );
};

export default TransDataExtractor;
