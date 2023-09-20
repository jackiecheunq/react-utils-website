import { utils, read, writeFileXLSX } from "xlsx";
import { useState, useRef, useMemo } from "react";
import textFileOnChangeHandler from "../utils/fileHandler";
import Input from "../Components/Input";
import { toast } from "react-toastify";

const AppLinkConverter = () => {
  const [title, setTitle] = useState("data");
  const [data, setData] = useState("");
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const clearAllFiles = () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.value = "";
      setData("");
    }
  };

  const convert = (src: string) => {
    if (src === "") {
      return src;
    }
    const wb = read(src, { type: "string" });
    const firstSheetName = wb.SheetNames[0];
    const ws = wb.Sheets[firstSheetName];
    const json = utils.sheet_to_json(ws);
    const newData = json.map((val) => {
      const value = val as Record<string, string | number>;
      if ("URL" in value && typeof value.URL === "string") {
        const url = value.URL;
        value.URL = url
          .replace(
            "https://m.uniqlo.com/tw/home/c_mobile/",
            "/wechat/c_wechat/"
          )
          .replace(
            /https:\/\/m.uniqlo.com\/tw\/home\/live-commerce(\d{1,})/,
            "https://www.uniqlo.com/tw/zh_TW/live-commerce$1.html"
          )
          .replace(/https:\/\/m.uniqlo.com\/tw(\/product\?pid=u\d+)/, "$1")
          .replace("https://m.uniqlo.com/tw/home/", "/wechat/");
      }
      return value;
    });
    wb.Sheets[firstSheetName] = utils.json_to_sheet(newData);
    return wb;
  };

  const convertedData = useMemo(() => {
    return convert(data);
  }, [data]);

  const ouputHandler = () => {
    if (convertedData) {
      writeFileXLSX(convertedData, (title || "data") + ".xlsx");
      toast.success("Success!");
      clearAllFiles();
    }
  };

  return (
    <div className="w-full bg-slate-100 p-32 flex flex-col justify-center items-center [&>*]:mb-20">
      <h1 className="mb-3 font-bold text-4xl">String to xlsx</h1>
      <div className="flex flex-col items-center [&>*]:mb-3">
        <Input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          placeholder="title"
          value={title}
        />
        <p>CSV Upload</p>
        <input
          type="file"
          id="csvFile"
          name="csvFile"
          accept="text/csv"
          ref={fileUploadRef}
          onChange={textFileOnChangeHandler(setData)}
        />
        <button
          className="btn py-4 px-12 block disabled:cursor-not-allowed disabled:opacity-75"
          onClick={ouputHandler}
          disabled={!convertedData}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AppLinkConverter;
