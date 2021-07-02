export const convertDate = (inputFormat) => {
  function pad(s) {
    return s < 10 ? "0" + s : s;
  }
  var d = new Date(inputFormat);
  //return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join("-");
  return [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join("-");
};
