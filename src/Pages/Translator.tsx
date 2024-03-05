import { useState, useRef, Fragment } from "react";
import { toast } from "react-toastify";
import { outputHandler } from "@/utils/converter";
import textFileOnChangeHandler from "@/utils/fileHandler";
import { getDirectText, replaceDirectText } from "@/utils/htmlUtils";
import Input from "@/Components/Input";
import faArrowRight from "@/assets/arrow-right-solid.svg";
import faEdit from "@/assets/pen-to-square-solid.svg";

const Translator = () => {
  const [html, setHtml] = useState("");
  const [data, setData] = useState("");
  const [replaceOptions, setReplaceOptions] = useState<Record<string, string>>({
    zh_HK: "en_GB",
    _tc: "_en",
    "/zh/": "/en/",
  });
  const [isEditReplaceOptionsMode, setIsEditReplaceOptionsMode] =
    useState(false);
  const [isAddReplaceOptionsMode, setIsAddReplaceOptionsMode] = useState(false);
  const [newReplaceOptionPair, setNewReplaceOptionPair] = useState<
    [string, string]
  >(["text", "text"]);
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
        let result = container.innerHTML;
        Object.entries(replaceOptions).forEach((optionPair) => {
          result = result.replaceAll(optionPair[0], optionPair[1]);
        });
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

  const clearAllFiles = () => {
    if (htmlFileUploadRef.current) htmlFileUploadRef.current.value = "";
    if (jsonFileUploadRef.current) jsonFileUploadRef.current.value = "";
    setData("");
    setHtml("");
  };
  const onOutputHandler = () => {
    outputHandler(convert(data), "result", "html", () => {
      clearAllFiles();
    });
  };

  const htmlUploadEl = (
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
  );

  const jsonUploadEl = (
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
  );

  const replaceOptionsListEl = (
    <Fragment>
      <p>Replace Options</p>
      {Object.entries(replaceOptions).map((option) => (
        <div className="flex [&>*:not(:last-child)]:mr-2 [&:not(:last-child)]:mb-6">
          <span className="p-2">{option[0]}</span>
          <img src={faArrowRight} alt="arrowRight" height={16} width={16} />
          <Input
            value={option[1]}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setReplaceOptions({
                ...replaceOptions,
                [option[0]]: e.target.value,
              })
            }
          />
          {isEditReplaceOptionsMode && (
            <button
              className="btn py-4 px-12 block text-white"
              onClick={() => {
                setReplaceOptions((currentOptions) => {
                  const newOptions = { ...currentOptions };
                  delete newOptions[option[0]];
                  return newOptions;
                });
              }}
            >
              -
            </button>
          )}
        </div>
      ))}
    </Fragment>
  );

  const newReplaceOptionPairEl = isAddReplaceOptionsMode && (
    <Fragment>
      <p>New Replace Option Pair</p>
      <div className="flex [&>*:not(:last-child)]:mr-2 [&:not(:last-child)]:mb-6">
        <Input
          value={newReplaceOptionPair[0]}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewReplaceOptionPair([e.target.value, newReplaceOptionPair[1]])
          }
        />
        <img src={faArrowRight} alt="arrowRight" height={16} width={16} />
        <Input
          value={newReplaceOptionPair[1]}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewReplaceOptionPair([newReplaceOptionPair[0], e.target.value])
          }
        />
      </div>
      <div className="flex [&>*:not(:last-child)]:mr-2 [&:not(:last-child)]:mb-6">
        <button
          className="btn py-4 px-12 block text-white mb-6"
          onClick={() => {
            if (!replaceOptions.hasOwnProperty(newReplaceOptionPair[0])) {
              setReplaceOptions({
                ...replaceOptions,
                [newReplaceOptionPair[0]]: newReplaceOptionPair[1],
              });
              setIsAddReplaceOptionsMode(false);
            } else {
              toast.error(
                "This key has already been one of the replace option key. Please edit that option directly or remove it first!"
              );
            }
          }}
        >
          Confirm this replace option
        </button>
        <button
          className="btn py-4 px-12 block text-white mb-6"
          onClick={setIsAddReplaceOptionsMode.bind(null, false)}
        >
          Hide
        </button>
      </div>
    </Fragment>
  );

  const toggleEditReplaceOptionsBtn = (
    <button
      className="btn py-4 px-12 block"
      onClick={setIsEditReplaceOptionsMode.bind(
        null,
        !isEditReplaceOptionsMode
      )}
    >
      <img src={faEdit} alt="faEdit" height={16} width={16} />
    </button>
  );

  return (
    <div className="w-full bg-slate-100 p-32 flex flex-col justify-center items-center [&>*]:mb-15">
      <h1 className="mb-3 font-bold text-4xl">HTML Translator</h1>
      {htmlUploadEl}
      {jsonUploadEl}
      <div className="p-10">
        {replaceOptionsListEl}
        {newReplaceOptionPairEl}
        {!isAddReplaceOptionsMode && (
          <button
            className="btn py-4 px-12 block mb-6"
            onClick={setIsAddReplaceOptionsMode.bind(
              null,
              !isAddReplaceOptionsMode
            )}
          >
            Add New Option
          </button>
        )}
        {toggleEditReplaceOptionsBtn}
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
