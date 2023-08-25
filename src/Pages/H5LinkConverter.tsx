import { useState, useMemo } from "react";
import Input from "../Components/Input";
import { copyHandler, outputHandler } from "../utils/converter";

const H5LinkConverter = () => {
  const [title, setTitle] = useState("l2_h5");
  const [content, setContent] = useState("");

  const [langFormat, setLangFormat] = useState("zh_HK");

  const convert = (src: string) => {
    const relativePathReplacer = '${fileServer}${pcPath}/';
    const htmlReplacer = /(?<!https:\/\/www.uniqlo.com.hk\/public\/[^\s]+index)\.html/g
    src = src
      .replaceAll(relativePathReplacer, '/home/')
      .replaceAll(htmlReplacer, '')
      .replaceAll("/home/product-detail?productCode=", "/product?pid=")
      .replaceAll("bundlingArr=", "productCodeList=")
      .replaceAll("/home/search?", "/search?")
      .replaceAll("/home/c/", "/home/c_mobile/");

    if (langFormat === "zh_HK") {
      src = src
        .replaceAll('/home/', '/zh_HK/home/')
        .replaceAll('/product?', '/zh_HK/product?')
        .replaceAll('/search?', '/zh_HK/search?')
        .replaceAll("/en/", "/zh/");
    } else if (langFormat === "en_GB") {
      src = src
        .replaceAll('/home/', '/en_GB/home/')
        .replaceAll('/product?', '/en_GB/product?')
        .replaceAll('/search?', '/en_GB/search?')
        .replaceAll("/zh/", "/en/");
    }

    return src;
  };

  const convertedValue = useMemo(() => {
    return convert(content);
  }, [content, langFormat]);

  return (
    <div className="w-full bg-slate-100 p-32 flex flex-col justify-center items-center [&>*]:mb-20">
      <h1 className="mb-3 font-bold text-4xl">H5LinkConverter</h1>
      <div className="flex flex-col items-center [&>*]:mb-3">
        <Input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          placeholder="title"
          value={title}
        />
        <textarea
          rows={4}
          cols={50}
          className="input"
          placeholder="source string"
          onChange={(event) => {
            setContent(event.target.value);
          }}
          value={content}
        />
        <div className="flex [&>*]:mr-6">
          <div
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setLangFormat(event.target.value);
            }}
            className="border p-3 border-black"
          >
            <legend>
              Select a <span className="font-bold">Lang</span> format:{" "}
            </legend>

            <div>
              <input
                type="radio"
                id="zh_HK"
                name="langFormat"
                value="zh_HK"
                checked={langFormat === "zh_HK"}
                readOnly
              />
              <label htmlFor="zh_HK">zh_HK</label>
            </div>

            <div>
              <input
                type="radio"
                id="en_GB"
                name="langFormat"
                value="en_GB"
                checked={langFormat === "en_GB"}
                readOnly
              />
              <label htmlFor="en_GB">en_GB</label>
            </div>
          </div>
        </div>

        <div className="flex">
          <button
            className="btn py-4 px-12 block disabled:cursor-not-allowed disabled:opacity-75 mr-3"
            onClick={() => copyHandler(convertedValue,setContent.bind(null, "") )}
            disabled={!content}
          >
            Copy
          </button>
          <button
            className="btn py-4 px-12 block disabled:cursor-not-allowed disabled:opacity-75 mr-3"
            onClick={() => outputHandler(convertedValue, title, setContent.bind(null, ""))}
            disabled={!content}
          >
            Output
          </button>
          <button
            className="btn py-4 px-12 block disabled:cursor-not-allowed disabled:opacity-75"
            onClick={setContent.bind(null, "")}
            disabled={!content}
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default H5LinkConverter;
