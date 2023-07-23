import React from "react";

const Input: React.FC<Record<string, any>> = (props) => {
  if ("className" in props) {
    return <input type="text" {...props} />;
  }
  return <input className="input" type="text" {...props} />;
};

export default Input;
