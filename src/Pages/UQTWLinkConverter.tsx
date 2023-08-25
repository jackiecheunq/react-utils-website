import { useState, useMemo } from "react";
import Input from "../Components/Input";
import { toast } from "react-toastify";

const UQTWLinkConverter = () => {
  const [title, setTitle] = useState("l2_h5");
  const [content, setContent] = useState("");
  const convert = (src: string) => {
    src = src
      .replaceAll("https://www.uniqlo.com/tw/zh_TW/search.html?description=", "https://m.uniqlo.com/tw/search?description=")
      .replaceAll("https://www.uniqlo.com/tw/zh_TW/product-detail.html?productCode=", 'https://m.uniqlo.com/tw/product?pid=')
      .replaceAll("https://www.uniqlo.com/tw/zh_TW/c/", "https://m.uniqlo.com/tw/home/c_mobile/")
      .replaceAll("${fileServer}${pcPath}/", "https://m.uniqlo.com/tw/home/")
      .replaceAll("https://www.uniqlo.com/tw/zh_TW/", "https://m.uniqlo.com/tw/home/")
      .replaceAll(".html", "")
      .replaceAll("https://www.uniqlo.com/tw/zh_TW/stylingbook/stylehint/men", "https://m.uniqlo.com/tw/zh_TW/stylingbook/stylehint/men")
    return src;
  };

  const convertedValue = useMemo(() => {
    return convert(content);
  }, [content]);

  const copyHandler = () => {
    const clipboardObj = navigator.clipboard;
    clipboardObj.writeText(convertedValue).then(() => {
      setContent("");
      toast.success("Copy Successfully!");
    });
  };

  const outputHandler = () => {
    const textToSaveAsBlob = new Blob([convertedValue], { type: "text/plain" });
    const textToSaveAsURL = URL.createObjectURL(textToSaveAsBlob);
    const link = document.createElement("a");
    link.href = textToSaveAsURL;
    link.setAttribute("download", `${title || "l2_h5"}.html`);

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.remove();
    setContent("");
    toast.success("Ouput Successfully!");
  };
  return (
    <div className="w-full bg-slate-100 p-32 flex flex-col justify-center items-center [&>*]:mb-20">
      <h1 className="mb-3 font-bold text-4xl">UQTWLinkConverter</h1>
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
            onClick={copyHandler}
            disabled={!content}
          >
            Copy
          </button>
          <button
            className="btn py-4 px-12 block disabled:cursor-not-allowed disabled:opacity-75 mr-3"
            onClick={outputHandler}
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
    </div>
  );
};

export default UQTWLinkConverter;
