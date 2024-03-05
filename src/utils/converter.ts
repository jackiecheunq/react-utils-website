import { toast } from "react-toastify";

export function copyHandler(convertedValue: string, cb: () => void) {
  if (convertedValue) {
    const clipboardObj = navigator.clipboard;
    clipboardObj.writeText(convertedValue).then(() => {
      cb();
      toast.success("Copy Successfully!");
    });
  } else {
    toast.warn("convertedValue is empty.");
  }
}

export function outputHandler(
  convertedValue: string,
  title: string,
  extension: string,
  cb: () => void
) {
  try {
    if (convertedValue) {
      const textToSaveAsBlob = new Blob([convertedValue], {
        type: "text/plain",
      });
      const textToSaveAsURL = URL.createObjectURL(textToSaveAsBlob);
      const link = document.createElement("a");
      link.href = textToSaveAsURL;
      link.setAttribute("download", `${title || "file"}.${extension}`);

      // Append to html link element page
      document.body.appendChild(link);

      // Start download
      link.click();

      // Clean up and remove the link
      link.remove();
      cb();
      toast.success("Output Successfully!");
    } else {
      throw Error("convertedValue is empty.");
    }
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("unknown Error");
    }
  }
}
