import { useState, useRef } from "react";
import textFileOnChangeHandler from "../utils/fileHandler";
import { outputHandler } from "../utils/converter";

import ejs from "ejs";
import { toast } from "react-toastify";

const EjsConverter = () => {
  const [ejsContent, setEjsContent] = useState("");
  const [data, setData] = useState("");
  const ejsFileUploadRef = useRef<HTMLInputElement>(null);
  const jsonFileUploadRef = useRef<HTMLInputElement>(null);

  const clearAllFiles = () => {
    if (ejsFileUploadRef.current && jsonFileUploadRef.current) {
      ejsFileUploadRef.current.value = "";
      jsonFileUploadRef.current.value = "";
      setEjsContent("");
      setData("");
    }
  };
  const onOutputHandler = () => {
    try {
      const result = ejs.render(ejsContent, JSON.parse(data));
      outputHandler(result, "file", "html", () => {
        clearAllFiles();
      });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="w-full bg-slate-100 p-32 flex flex-col justify-center items-center [&>*]:mb-15">
      <h1 className="mb-3 font-bold text-4xl">EJS Converter</h1>
      <div className="p-10">
        <p>EJS Upload</p>
        <input
          type="file"
          id="ejsFile"
          name="ejsFile"
          accept="text/html"
          ref={ejsFileUploadRef}
          onChange={textFileOnChangeHandler(setEjsContent)}
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
          disabled={!ejsContent || !data}
        >
          Output
        </button>
        <button
          className="btn py-4 px-12 block disabled:cursor-not-allowed disabled:opacity-75 mr-3"
          onClick={clearAllFiles}
          disabled={!ejsContent || !data}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default EjsConverter;
