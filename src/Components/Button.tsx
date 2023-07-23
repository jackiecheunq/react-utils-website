import React from "react";
import { Link } from "react-router-dom";

const Button: React.FC<{
  children: string;
  to: string;
  [props: string]: string;
}> = (props) => {
  return (
    <button className="btn">
      <Link className="py-4 px-12 block" {...props}>
        {props.children}
      </Link>
    </button>
  );
};

export default Button;
