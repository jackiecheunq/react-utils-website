export function getDirectText(parentElement: Element) {
  const elChildNode = parentElement.childNodes;
  let result = "";
  elChildNode.forEach(function (value) {
    if (value.nodeValue && value.nodeType === Node.TEXT_NODE) {
      result += value.nodeValue.replace(/[\n]/g, "").trim();
    }
  });
  return result;
}
