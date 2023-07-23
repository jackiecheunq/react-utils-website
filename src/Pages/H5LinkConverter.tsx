import { useEffect, useState, useMemo } from "react";
import Input from "../Components/Input";
import { toast } from "react-toastify";
import { isValidHttpUrl } from "../utils";
import { Link } from "react-router-dom";

const H5LinkConverter = () => {
  const [content, setContent] = useState("");
  const [pathFormat, setPathFormat] = useState("relative");
  const [langFormat, setLangFormat] = useState("zh_HK");
  const clipboardObj = navigator.clipboard;

  const isTW =
    content.includes("zh_TW") ||
    content.includes("/tw") ||
    content.includes(".tw");
  const isHK =
    content.includes("zh_HK") ||
    content.includes("/hk") ||
    content.includes(".hk");

  const isGU = content.includes("gu-global");
  const isUQ = content.includes("uniqlo");

  const wrongFormat = isHK && isTW;

  const convert = (src: string) => {
    if (!isValidHttpUrl(src)) {
      return "";
    }
    if (!isUQ && !isGU) {
      return src;
    }
    src = src
      .trim()
      .replace(/(?<=\/\/)www/, "m")
      .replace(
        /(?<lang>(zh_HK|zh_TW|en_GB))\/(?<page>\w+)(?=\.html)/,
        "$<lang>/home/$<page>"
      )
      .replace(/\.html/, "")
      .replace(/(zh_HK|zh_TW|en_GB)/, langFormat);

    if (pathFormat === "relative") {
      const relativePath = src.match(/\/(zh_HK|zh_TW|en_GB).+/);
      src = relativePath ? relativePath[0] : src;
    }
    if (isGU) {
      src.replace(/\/(zh_HK|zh_TW|en_GB)/, "");
    }

    return src;
  };

  const convertedValue = useMemo(() => {
    return convert(content);
  }, [content, pathFormat, langFormat]);

  useEffect(() => {
    if (wrongFormat) {
      toast.error(`Wrong Format.`);
      return;
    }
    if (isTW) {
      setLangFormat("zh_TW");
    }
    if (isHK) {
      if (langFormat === ("zh_HK" || "en_GB")) {
        setLangFormat(langFormat);
      } else {
        setLangFormat("zh_HK");
      }
    }
    if (isGU) {
      setPathFormat("absolute");
    }
  }, [content]);

  const outputHandler = () => {
    const result = convertedValue;
    if (!result) {
      return;
    }
    clipboardObj.writeText(result).then(() => {
      toast.success(`Copy "${result}" Successfully! `);
      setContent("");
    });
  };
  return (
    <div className="w-full bg-slate-100 p-32 flex flex-col justify-center items-center [&>*]:mb-20">
      <h1 className="mb-3 font-bold text-4xl">H5LinkConverter</h1>
      <div className="flex flex-col items-center [&>*]:mb-3">
        <Input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setContent(e.target.value)
          }
          placeholder="title"
          value={content}
        />

        <div className="flex [&>*]:mr-6">
          <div
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPathFormat(event.target.value);
            }}
            className="border p-3 border-black"
          >
            <legend>
              Select an <span className="font-bold">Path</span> format:
            </legend>

            <div>
              <input
                type="radio"
                id="relative"
                name="pathFormat"
                value="relative"
                checked={pathFormat === "relative"}
                readOnly
                disabled={isGU}
              />
              <label htmlFor="relative">Relative Path</label>
            </div>

            <div>
              <input
                type="radio"
                id="absolute"
                name="pathFormat"
                value="absolute"
                readOnly
                checked={pathFormat === "absolute"}
              />
              <label htmlFor="absolute">Absolute Path</label>
            </div>
          </div>

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
                disabled={isTW}
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
                disabled={isTW || isGU}
              />
              <label htmlFor="en_GB">en_GB</label>
            </div>
            <div>
              <input
                type="radio"
                id="zh_TW"
                name="langFormat"
                value="zh_TW"
                readOnly
                checked={langFormat === "zh_TW"}
                disabled={isHK}
              />
              <label htmlFor="zh_TW">zh_TW</label>
            </div>
          </div>
        </div>

        <button
          className="btn py-4 px-12 block disabled:cursor-not-allowed disabled:opacity-75"
          onClick={outputHandler}
          disabled={!convertedValue || wrongFormat}
        >
          Copy
        </button>
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-xl font-bold">Result ({pathFormat} path):</h3>
        {pathFormat === "relative" ? (
          <p>{convertedValue}</p>
        ) : (
          <Link to={convertedValue} target="_blank" rel="noopener noreferrer">
            {convertedValue}
          </Link>
        )}
      </div>
    </div>
  );
};

export default H5LinkConverter;
