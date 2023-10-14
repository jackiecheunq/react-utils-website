import { useState, useMemo } from "react";
import BasicOutput from "../Components/BasicOutput";
import { toast } from "react-toastify";

const TransDataExtractor = () => {
  const [title, setTitle] = useState("transData");
  const [content, setContent] = useState("");

  function getDirectText(parentElement: Element) {
    const elChildNode = parentElement.childNodes;
    let result = "";
    elChildNode.forEach(function (value) {
      if (value.nodeValue && value.nodeType === Node.TEXT_NODE) {
        result += value.nodeValue.replace(/[\n]/g, "").trim();
      }
    });
    return result;
  }

  function removeRepeat(arr: Array<string>) {
    const set = new Set(arr);
    return Array.from(set);
  }

  function generateDict(arr: Array<string>) {
    const dict: Record<string, string> = {};
    arr.forEach((e) => {
      dict[e] = e;
    });
    return dict;
  }

  const convert = (src: string) => {
    try {
      const container = document.createElement("div");
      container.innerHTML = src;
      const regexOfChi = /[\u4E00-\u9FFF]/;
      const res: Array<string> = [];
      container.querySelectorAll("*").forEach((el) => {
        const text = getDirectText(el);
        if (typeof text === "string" && regexOfChi.test(text)) {
          res.push(text);
        }
      });
      container.remove();
      return JSON.stringify(generateDict(removeRepeat(res)));
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("unknown Error");
      }
    }

    return src;
  };
  const convertedValue = useMemo(() => {
    return convert(content);
  }, [content]);

  const input = {
    title,
    content,
    convertedValue,
    setTitle,
    setContent,
    extentsion: "json",
  };
  return (
    <div className="w-full bg-slate-100 p-32 flex flex-col justify-center items-center [&>*]:mb-20">
      <h1 className="mb-3 font-bold text-4xl">TransDataExtractor</h1>
      <BasicOutput input={input} />
    </div>
  );
};

export default TransDataExtractor;
