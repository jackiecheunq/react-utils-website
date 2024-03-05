import { useState, useRef, useEffect } from "react";
import Input from "../Components/Input";
import { copyHandler, outputHandler } from "../utils/converter";
import textFileOnChangeHandler from "@/utils/fileHandler";

type inputType = {
  title: string;
  content: string;
  convert: (text: string) => string;
  extentsion: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

const BasicOutput: React.FC<{ input: inputType }> = (props) => {
  const { title, content, convert, extentsion, setTitle, setContent } =
    props.input;
  const [inputFormat, setInputFormat] = useState("file");
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const clearAllFiles = () => {
    if (fileUploadRef.current) fileUploadRef.current.value = "";
    setContent("");
  };

  useEffect(() => {
    clearAllFiles();
  }, [inputFormat]);

  return (
    <div className="flex flex-col items-center [&>*]:mb-6">
      <Input
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setTitle(e.target.value)
        }
        placeholder="title"
        value={title}
      />
      <div className="flex [&>*]:mr-6">
        <div
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setInputFormat(event.target.value);
          }}
          className="border p-3 border-black"
        >
          <legend>
            Select a <span className="font-bold">Input</span> format:{" "}
          </legend>

          <div>
            <input
              type="radio"
              id="file"
              name="inputFormat"
              value="file"
              checked={inputFormat === "file"}
              readOnly
            />
            <label htmlFor="file">file</label>
          </div>

          <div>
            <input
              type="radio"
              id="textArea"
              name="inputFormat"
              value="textArea"
              checked={inputFormat === "textArea"}
              readOnly
            />
            <label htmlFor="textArea">textArea</label>
          </div>
        </div>
      </div>

      {inputFormat === "textArea" && (
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
      )}
      {inputFormat === "file" && (
        <div className="p-10">
          <p>HTML Upload</p>
          <input
            type="file"
            id="html"
            name="html"
            accept="text/html"
            ref={fileUploadRef}
            onChange={textFileOnChangeHandler(setContent)}
          />
        </div>
      )}
      <div className="flex">
        <button
          className="btn py-4 px-12 block disabled:cursor-not-allowed disabled:opacity-75 mr-3"
          onClick={() => copyHandler(convert(content), clearAllFiles)}
          disabled={!content}
        >
          Copy
        </button>
        <button
          className="btn py-4 px-12 block disabled:cursor-not-allowed disabled:opacity-75 mr-3"
          onClick={() =>
            outputHandler(convert(content), title, extentsion, clearAllFiles)
          }
          disabled={!content}
        >
          Output
        </button>
        <button
          className="btn py-4 px-12 block disabled:cursor-not-allowed disabled:opacity-75"
          onClick={clearAllFiles}
          disabled={!content}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default BasicOutput;
