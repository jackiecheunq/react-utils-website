const textFileOnChangeHandler = (cb: (text: string) => void) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.readAsText(e.target.files[0], "utf-8");
        reader.onload = function () {
          if (reader.result) {
            const text = reader.result as string;
            cb(text);
          }
        };
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export default textFileOnChangeHandler;
