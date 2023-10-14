import { useState, useMemo } from "react";
import BasicOutput from "../Components/BasicOutput";

const TransDataExtractor = () => {
  const [title, setTitle] = useState("transData");
  const [content, setContent] = useState("");
  const convert = (src: string) => {
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
