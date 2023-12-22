import { utils, writeFile } from "xlsx";
import { useMemo, useState } from "react";
import Input from "../Components/Input";
import { toast } from "react-toastify";
import { isChristmas } from "@/utils/utils";

const Xlsx = () => {
  const [title, setTitle] = useState("id");
  const [content, setContent] = useState("");
  const [numberLengthForFiltering, setNumberLengthForFiltering] =
    useState<number>(0);
  const [isSplitModeEnable, setIsSplitModeEnable] = useState(true);
  const separator = "@";

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
        if (res) {
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
      if (isChristmas()) {
        toast.success("Merry Christmas!");
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
              setIsSplitModeEnable(event.target.checked);
            }}
            className="border p-3 border-black"
          >
            <legend>
              Enable <span className="font-bold">Split</span> Mode: <br />
              (Separator: @)
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
          disabled={!convertedValue}
        >
          Submit
        </button>
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-3xl font-bold">Result</h3>
        <h3 className="text-3xl ">
          Total Number:{" "}
          <span className="font-bold text-red-600">
            {convertedValue?.flat().length || 0}
          </span>
        </h3>
        <div className="min-w-[80%]">
          {isSplitModeEnable
            ? convertedValue?.map((value, index) => (
                <p key={`group${index}`}>
                  Group {index}: {Array.isArray(value) ? value?.join(", ") : ""}
                </p>
              ))
            : convertedValue?.join(", ") || ""}
        </div>
      </div>
    </div>
  );
};

export default Xlsx;
