export function getDirectText(parentElement: Element) {
  const elChildNode = parentElement.childNodes;
  let textNodeNumber = 0;
  let result: string = "";

  elChildNode.forEach(function (node) {
    if (node.nodeValue && node.nodeType === Node.TEXT_NODE) {
      if (node.nodeValue.includes(";")) {
        throw Error(
          "';' detected in textContent. Please remove it before extracting."
        );
      }
      result =
        result +
        ";".repeat(textNodeNumber) +
        node.nodeValue.replace(/[\n]/g, "").trim();
      textNodeNumber++;
    }
  });

  return result;
}

export function replaceDirectText(parentElement: Element, text: string) {
  const elChildNode = parentElement.childNodes;
  const textArr = text.split(";");
  let textNodeNumber = 0;
  elChildNode.forEach(function (node) {
    if (node.nodeValue && node.nodeType === Node.TEXT_NODE) {
      node.nodeValue = textArr[textNodeNumber];
      textNodeNumber++;
    }
  });
}
