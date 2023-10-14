import Input from "../Components/Input";
import { copyHandler, outputHandler } from "../utils/converter";
type inputType = {
  title: string;
  content: string;
  convertedValue: string;
  extentsion: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

const BasicOutput: React.FC<{ input: inputType }> = (props) => {
  const { title, content, convertedValue, extentsion, setTitle, setContent } =
    props.input;
  return (
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
      <div className="flex">
        <button
          className="btn py-4 px-12 block disabled:cursor-not-allowed disabled:opacity-75 mr-3"
          onClick={() => copyHandler(convertedValue, setContent.bind(null, ""))}
          disabled={!content}
        >
          Copy
        </button>
        <button
          className="btn py-4 px-12 block disabled:cursor-not-allowed disabled:opacity-75 mr-3"
          onClick={() =>
            outputHandler(
              convertedValue,
              title,
              extentsion,
              setContent.bind(null, "")
            )
          }
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
  );
};

export default BasicOutput;
