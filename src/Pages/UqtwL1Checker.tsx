import Input from "@/Components/Input";
import { utils, writeFileXLSX } from "xlsx";
import { useState, useRef } from "react";
import textFileOnChangeHandler from "@/utils/fileHandler";
import { toast } from "react-toastify";

const replaceSpace = (text: string | null | undefined) => {
  return text && text.trim().replaceAll(/\n/g, "");
};

const UqtwL1Checker = () => {
  const [title, setTitle] = useState("CheckReport");
  const [content, setContent] = useState("");
  const [result, setResult] = useState([""]);
  const [generateReportOrNot, setGenerateReportOrNot] = useState(false);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  const clearAllFiles = () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.value = "";
      setContent("");
    }
  };

  const ouputHandler = () => {
    try {
      const container = document.createElement("div");
      container.innerHTML = content;
      const slideInfos = Array.from(
        container.querySelectorAll(".inner-swiper-slide")
      ).map((el) => {
        const anchor = el.querySelector("a");
        const eventInfo = anchor
          ?.getAttribute("onclick")
          ?.match(/dataLayer\.push\(([^)]+)/)?.[1] as string;
        const position =
          eventInfo &&
          (JSON.parse(eventInfo.replace(/'/g, '"')).eventLabel as string);
        if (position) {
          const url = anchor?.getAttribute("href");
          const titleEl = el.querySelector(".media-banner-title");
          const descEl = el.querySelector(".media-banner-category");
          const priceEl = el.querySelector(".media-banner-price");
          const price = replaceSpace(priceEl?.textContent);
          const originalPrice = replaceSpace(
            el.querySelector(".media-banner-price-original")?.textContent
          );
          const btnEl = el.querySelector(".media-banner-button");
          const copyrightEl = el.querySelector(".media-copyright");
          const activity = replaceSpace(
            el.querySelector(".media-banner-activity")?.textContent
          );
          const bannerContainer = el.querySelector(
            "div[class^='media-banner-container']"
          );
          const logoNumber = el.querySelectorAll(
            ".media-logo-container > img"
          ).length;
          const isBannerPositionRight =
            logoNumber > 1
              ? bannerContainer?.className.endsWith("center") ||
                bannerContainer?.className.endsWith("left")
              : true;
          let isPriceColorRight = true;
          if (priceEl && price) {
            isPriceColorRight =
              activity || originalPrice
                ? !priceEl.classList.contains("white")
                : priceEl.classList.contains("white");
          }
          const hasTargetBlank =
            anchor?.getAttribute("target") === "_blank" &&
            anchor.getAttribute("rel") === "noopener";

          let isAnchorSettingRight = true;
          if (url) {
            isAnchorSettingRight =
              url.includes("product-detail.html") ||
              !url.includes("https://www.uniqlo.com/tw/zh_TW/")
                ? hasTargetBlank
                : !hasTargetBlank;
          }
          const isAnchorNotEmpty = url !== "";
          return {
            position,
            url,
            title: replaceSpace(titleEl?.textContent),
            desc: replaceSpace(descEl?.textContent),
            price,
            originalPrice,
            btn: replaceSpace(btnEl?.textContent),
            activity,
            copyright: replaceSpace(copyrightEl?.textContent),
            isBannerPositionRight,
            isPriceColorRight,
            isAnchorSettingRight,
            isAnchorNotEmpty,
          };
        }
      });
      const slidesWithProblems = slideInfos.filter((info) => {
        if (info) {
          const isPassed =
            info.isBannerPositionRight &&
            info.isPriceColorRight &&
            info.isAnchorSettingRight &&
            info.isAnchorNotEmpty;
          return !isPassed;
        }
      });
      const result = slidesWithProblems.map(
        (slide) =>
          `${slide?.position}: isBannerPositionRight: ${slide?.isBannerPositionRight} ; isPriceColorRight: ${slide?.isPriceColorRight} ; isAnchorSettingRight:${slide?.isAnchorSettingRight} ; isAnchorNotEmpty: ${slide?.isAnchorNotEmpty}`
      );

      setResult(result);
      setContent("");
      if (result.length === 0) {
        toast.success("pass!");
      } else {
        toast.warn("fail!");
      }
      if (generateReportOrNot) {
        const workBook = utils.book_new();
        const workSheet = utils.json_to_sheet(slideInfos);
        utils.book_append_sheet(workBook, workSheet, title || "id");
        writeFileXLSX(workBook, (title || "CheckReport") + ".xlsx");
      }
      clearAllFiles();
      container.remove();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="w-full bg-slate-100 p-32 flex flex-col justify-center items-center [&>*]:mb-20">
      <h1 className="mb-3 font-bold text-4xl">UQTW L1 Checker</h1>
      <div className="flex flex-col items-center [&>*]:mb-3">
        <Input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          placeholder="title"
          value={title}
        />
        <div className="p-10">
          <p>HTML Upload</p>
          <input
            type="file"
            id="html"
            name="html"
            accept="text/html"
            ref={fileUploadRef}
            onChange={textFileOnChangeHandler(setContent)}
          />
        </div>
        <div
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setGenerateReportOrNot(event.target.value === "true");
          }}
          className="border p-3 border-black"
        >
          <legend>Generate Report Or Not:</legend>
          <div>
            <input
              type="radio"
              id="yes"
              name="generateReportSelection"
              value="true"
              checked={generateReportOrNot}
              readOnly
            />
            <label htmlFor="yes">Yes</label>
          </div>

          <div>
            <input
              type="radio"
              id="no"
              name="generateReportSelection"
              value="false"
              checked={!generateReportOrNot}
              readOnly
            />
            <label htmlFor="no">No</label>
          </div>
        </div>

        <button
          className="btn py-4 px-12 block disabled:cursor-not-allowed disabled:opacity-75"
          onClick={ouputHandler}
          disabled={!content}
        >
          Submit
        </button>
        <div className="flex flex-col justify-center">
          <h3 className="text-3xl font-bold">Result</h3>
          {result.map((r) => (
            <p className="min-w-[80%]">{r}</p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UqtwL1Checker;
