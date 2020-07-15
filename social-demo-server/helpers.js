const convertUnixTimeStampToDate = (unixTimeStamp) => {
  if (!unixTimeStamp) return null;
  return new Date(unixTimeStamp * 1000);
};

const convertDateToString = (date) => {
  if (!date) return "";
  return date.toLocaleString();
};

const convertUnixToString = (unixTimeStamp) => {
  return convertDateToString(convertUnixTimeStampToDate(unixTimeStamp));
};

const getCurrentUnixTimeStamp = () => {
  return new Date().getTime() / 1000;
};

module.exports = {
  convertUnixTimeStampToDate,
  convertDateToString,
  convertUnixToString,
  getCurrentUnixTimeStamp,
};
