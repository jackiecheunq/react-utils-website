import { useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { utils, writeFileXLSX } from "xlsx";

function App() {
  const [state, setState] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  const convert = (src: string) => {
    const ids = src.match(/\d{6,}/g);
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
    const src = convert(state);
    if (src) {
      const workBook = utils.book_new();
      const workSheet = utils.aoa_to_sheet([[], ...src.map((id) => [id])]);
      utils.book_append_sheet(
        workBook,
        workSheet,
        titleRef?.current?.value || "id"
      );
      writeFileXLSX(workBook, (titleRef?.current?.value || "id") + ".xlsx");
    }
  };

  return (
    <>
      <div className="flex justify-center">
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="mb-3">String to xlsx</h1>
      <div className="flex flex-col items-center [&>*]:mb-3">
        <input id="title" ref={titleRef} />
        <textarea
          id="id-source"
          name="id-source"
          rows={4}
          cols={50}
          onChange={(event) => {
            setState(event.target.value);
          }}
          value={state}
        />
        <button onClick={ouputHandler}>Submit</button>
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="text-xl font-bold">Result</h3>
        <p className="min-w-[80%]">{convert(state)?.join(", ")}</p>
      </div>
    </>
  );
}

export default App;
