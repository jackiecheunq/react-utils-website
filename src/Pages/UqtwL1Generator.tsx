import { useState, useRef } from "react";

interface textInfoType {
  [eventTag: string]: {
    title: string;
    category: string;
    price: string;
    original_price: string;
    activity: string;
    url: string;
    logo: Array<string>;
  };
}

// TODO
const UqtwL1Generator = () => {
  const [html, setHtml] = useState("");
  const [data, setData] = useState("");

  const htmlFileUploadRef = useRef<HTMLInputElement>(null);

  const htmlParse = (html: string) => {
    let result: textInfoType = {};
    const container = document.createElement("div");
    container.innerHTML = html;
    container.querySelectorAll(".outer-swiper-slide").forEach((slide) => {
      slide.querySelectorAll(".inner-swiper-slide").forEach((el) => {
        const anchor = el.querySelector("a");
        if (anchor !== null) {
          const eventInfo = anchor
            .getAttribute("onclick")
            ?.match(/dataLayer\.push\(([^)]+)/)?.[1];
          const position =
            eventInfo && JSON.parse(eventInfo.replace(/'/g, '"')).eventLabel;
        }
      });
    });
  };
};

export default UqtwL1Generator;
