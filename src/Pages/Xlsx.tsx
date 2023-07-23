import { utils, writeFileXLSX } from "xlsx";
import { useState } from "react";
import Input from "../Components/Input";

const Xlsx = () => {
  const [title, setTitle] = useState("id");
  const [content, setContent] = useState("");

  const convert = (src: string) => {
    const ids = src.match(/\b\d{6,}\b/g);
    const result = ids
      ?.filter((id) => {
        return id.length === 6 || (id.length === 9 && id.endsWith("000"));
      })
      .map((id) => {
        return id.length === 6 ? id + "000" : id;
      });
    return result;
  };

  const ouputHandler = () => {
    const src = convert(content);
    if (src) {
      const workBook = utils.book_new();
      const workSheet = utils.aoa_to_sheet([[], ...src.map((id) => [id])]);
      utils.book_append_sheet(workBook, workSheet, title || "id");
      writeFileXLSX(workBook, (title || "id") + ".xlsx");
      setContent("");
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
        <button className="btn py-4 px-12 block" onClick={ouputHandler}>
          Submit
        </button>
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-xl font-bold">Result</h3>
        <p className="min-w-[80%]">{convert(content)?.join(", ")}</p>
      </div>
    </div>
  );
};

export default Xlsx;
