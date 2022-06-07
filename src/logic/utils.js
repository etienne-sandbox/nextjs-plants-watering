export function isPlainObject(value) {
  if (Object.prototype.toString.call(value) !== "[object Object]") {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

export function frequencyText(freq) {
  if (freq === 1) {
    return "tous les jours";
  }
  if (freq === 2) {
    return "tous les 2 jours";
  }
  return `tous les ${freq} jours`;
}

export function unauthorized(res) {
  return res
    .status(401)
    .json({ status: 401, message: "Unauthorized", error: "unauthorized" });
}
