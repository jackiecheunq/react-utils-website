

function isValidTextNode(node: Node) {
  return node.nodeValue &&
    node.nodeType === Node.TEXT_NODE &&
    node.nodeValue.replace(/[\n]/g, "").trim()
    ? true
    : false;
}

export function getDirectText(parentElement: Element) {
  const elChildNode = parentElement.childNodes;
  let textNodeNumber = 0;
  let result: string = "";

  elChildNode.forEach(function (node) {
    if (isValidTextNode(node)) {
      if (node.nodeValue!.includes(";")) {
        throw Error(
          "';' detected in textContent. Please remove it before extracting."
        );
      }
      result =
        result +
        (textNodeNumber > 0 ? ";" : "") +
        node.nodeValue!.replace(/[\n]/g, "").trim();
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
    if (isValidTextNode(node)) {
      node.nodeValue = textArr[textNodeNumber];
      textNodeNumber++;
    }
  });
}
