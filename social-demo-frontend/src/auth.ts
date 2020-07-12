export const setAuthen = (data: any): void => {
  localStorage.setItem("userData", JSON.stringify(data));
};

export const checkIsAuthen = (): boolean => {
  const value = localStorage.getItem("userData");
  if (!value) return false;
  return true;
};

export const getUserName = (): string => {
  const value = localStorage.getItem("userData");
  if (!value) return "";
  return JSON.parse(value).userName;
};

export const logout = () => {
  localStorage.removeItem("userData");
};
