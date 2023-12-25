import { utils, writeFile } from "xlsx";
import { useMemo, useState } from "react";
import Input from "../Components/Input";
import { toast } from "react-toastify";
import { getEasterEgg } from "@/utils/utils";
import { Steps } from "intro.js-react";
import "intro.js/introjs.css";

const Xlsx = () => {
  const [title, setTitle] = useState("id");
  const [content, setContent] = useState("");
  const [numberLengthForFiltering, setNumberLengthForFiltering] =
    useState<number>(0);
  const [isSplitModeEnable, setIsSplitModeEnable] = useState(true);
  const separator = "@";
  const [isIntroEnabled, setIsIntroEnabled] = useState(false);

  const onExit = () => {
    setIsIntroEnabled(false);
  };

  const steps = [
    {
      title: "Welcome!",
      intro: "歡迎來到教程👋",
    },
    {
      element: "#title_input",
      intro: "你可以在這裡輸入「輸出文件」的標題",
      position: "right",
    },
    {
      element: "#content_input",
      intro: "在這裡貼上一段包括6位或9位數字的文字",
    },
    {
      element: "#split_setting",
      intro: `開啟或關閉「分割模式」。「分割模式」下可使用分隔符號「${separator}」來分開多段文字並分別輸出多個「輸出文件」`,
    },
    {
      element: "#filter_setting",
      intro:
        "設定過濾模式，可選擇只識別6位數字或只識別9位數字（預設模式為同時識別6位或9位數字）",
    },
    {
      element: "#total_number",
      intro: "顯示識別到的數字總數",
    },
    {
      element: "#result_list",
      intro: "顯示識別到的所有數字",
    },
    {
      element: "#submit_button",
      intro: "按此提交，下載將自動進行。同時右上角會出現成功提示",
    },
  ];

  const convert = (
    src: string,
    filterFn: (id: string) => boolean,
    isSplitModeEnable: boolean
  ) => {
    let result = [];
    const regex = /\b\d{6,}\b/g;
    const filterAndAdjust = (ids: RegExpMatchArray | null) => {
      return ids
        ?.filter((id) => {
          return filterFn(id);
        })
        .map((id) => {
          return id.length === 6 ? id + "000" : id;
        });
    };
    if (isSplitModeEnable) {
      const splitedString = src.split(separator);
      for (let index = 0; index < splitedString.length; index++) {
        const ids = splitedString[index].match(regex);
        const res = filterAndAdjust(ids);
        if (res && res.length > 0) {
          result.push([...new Set(res)]);
        }
      }
    } else {
      const ids = src.match(regex);
      const res = filterAndAdjust(ids);
      return res ? [...new Set(res)] : res;
    }

    return result;
  };

  const convertedValue = useMemo(() => {
    const numberLengthfilter = (id: string) => {
      if (numberLengthForFiltering > 0) {
        return id.length === numberLengthForFiltering;
      } else {
        return id.length === 6 || id.length === 9;
      }
    };
    return convert(content, numberLengthfilter, isSplitModeEnable);
  }, [content, numberLengthForFiltering, isSplitModeEnable]);

  const ouputHandler = () => {
    try {
      const src = convertedValue;
      const xlsxOupput = (src: string[]) => {
        const workBook = utils.book_new();
        const workSheet = utils.aoa_to_sheet([[], ...src.map((id) => [id])]);
        utils.book_append_sheet(workBook, workSheet, title || "id");
        writeFile(workBook, (title || "id") + ".xls");
      };
      if (Array.isArray(src)) {
        if (isSplitModeEnable) {
          src.forEach((stringArr) => {
            if (Array.isArray(stringArr)) {
              xlsxOupput(stringArr);
            }
          });
        } else {
          if (src.length > 0) {
            xlsxOupput(src as string[]);
          }
        }
      }

      setContent("");
      const icon = getEasterEgg();
      if (icon) {
        toast.success("Success!", {
          icon: icon,
        });
      } else {
        toast.success("Success!");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <Steps
        enabled={isIntroEnabled}
        steps={steps}
        initialStep={0}
        onExit={onExit}
        options={{
          nextLabel: "下一步",
          prevLabel: "上一步",
          doneLabel: "Thank you, Jacky!",
        }}
      />
      <div className="w-full bg-slate-100 p-32 flex flex-col justify-center items-center [&>*]:mb-20">
        <h1 className="mb-3 font-bold text-4xl">String to xlsx</h1>
        <div className="flex flex-col items-center [&>*]:mb-3">
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            placeholder="title"
            value={title}
            id="title_input"
          />
          <textarea
            rows={4}
            cols={50}
            className="input"
            id="content_input"
            placeholder="source string"
            onChange={(event) => {
              setContent(event.target.value);
            }}
            value={content}
          />
          <div className="flex [&>*]:mr-6">
            <div
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setIsSplitModeEnable(event.target.checked);
              }}
              className="border p-3 border-black"
              id="split_setting"
            >
              <legend>
                Enable <span className="font-bold">Split</span> Mode: <br />(
                {`Separator: ${separator}`})
              </legend>

              <div>
                <input
                  type="checkbox"
                  id="splitModeEnableCheckbox"
                  name="splitModeEnableCheckbox"
                  checked={isSplitModeEnable}
                  readOnly
                />
                <label htmlFor="splitModeEnableCheckbox"> Enable</label>
              </div>
            </div>
          </div>
          <div className="flex [&>*]:mr-6">
            <div
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setNumberLengthForFiltering(+event.target.value);
              }}
              className="border p-3 border-black"
              id="filter_setting"
            >
              <legend>
                Select a <span className="font-bold">filter</span> Mode:{" "}
              </legend>

              <div>
                <input
                  type="radio"
                  id="default"
                  name="numberLengthForFiltering"
                  value={0}
                  checked={numberLengthForFiltering === 0}
                  readOnly
                />
                <label htmlFor="default"> Default(6 or 9)</label>
              </div>

              <div>
                <input
                  type="radio"
                  id="six"
                  name="numberLengthForFiltering"
                  value={6}
                  checked={numberLengthForFiltering === 6}
                  readOnly
                />
                <label htmlFor="six"> Six(6)</label>
              </div>
              <div>
                <input
                  type="radio"
                  id="six"
                  name="numberLengthForFiltering"
                  value={9}
                  checked={numberLengthForFiltering === 9}
                  readOnly
                />
                <label htmlFor="six"> Nine(9)</label>
              </div>
            </div>
          </div>
          <button
            className="btn py-4 px-12 block disabled:cursor-not-allowed disabled:opacity-75"
            onClick={ouputHandler}
            disabled={!convertedValue || !(convertedValue?.flat().length > 0)}
            id="submit_button"
          >
            Submit
          </button>
          <button
            onClick={setIsIntroEnabled.bind(null, true)}
            className="underline"
          >
            教程
          </button>
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="text-3xl font-bold">Result</h3>
          <h3 className="text-3xl" id="total_number">
            Total Number:{" "}
            <span className="font-bold text-red-600">
              {convertedValue?.flat().length || 0}
            </span>
          </h3>
          <div className="min-w-[80%] min-h-[16px]" id="result_list">
            {isSplitModeEnable
              ? convertedValue?.map((value, index) => (
                  <p key={`group${index}`}>
                    Group {index}:{" "}
                    {Array.isArray(value) ? value?.join(", ") : ""}
                  </p>
                ))
              : convertedValue?.join(", ") || ""}
          </div>
        </div>
      </div>
    </>
  );
};

export default Xlsx;
