import React from "react";
import { Link } from "react-router-dom";
import faFileLine from "@/assets/file-lines-solid.svg";
import faExcel from "@/assets/file-excel-solid.svg";
import faLang from "@/assets/language-solid.svg";
import faChecker from "@/assets/check-to-slot-solid.svg";

const Footer: React.FC = () => {
  return (
    <footer className="h-30 w-full py-10 shrink-0 text-3xl text-neutral-500">
      <div className="flex justify-between items-center h-full">
        <ul className="flex [&>*]:mr-4">
          <li>Github @jackiecheunq 2023</li>
          <li>
            <span> • All right reserved.</span>
          </li>
        </ul>
        <div className="flex gap-x-4">
          <Link to="appLink" title="appLink">
            <img src={faExcel} alt="applink" height={16} width={16} />
          </Link>
          <Link to="transdata_extractor" title="transdata_extractor">
            <img
              src={faFileLine}
              alt="transdata_extractor"
              height={16}
              width={16}
            />
          </Link>
          <Link to="translator" title="translator">
            <img src={faLang} alt="translator" height={16} width={30} />
          </Link>
          <Link to="l1twchecker" title="l1twchecker">
            <img src={faChecker} alt="l1twchecker" height={16} width={25} />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
