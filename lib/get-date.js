const getDate = (date, sperator = ".", showTime = false) => {
  const day = date.getDate();
  const month = String(date.getMonth() + 1); // Aylar 0'dan başlar, bu yüzden +1 ekliyoruz
  const year = date.getFullYear();

  let sum = [day, month.padStart(2, "0"), year].join(sperator);

  if (showTime) {
    sum += ` ${date.getHours()}:${date.getMinutes()}`;
  }

  return sum;
};

export default getDate;
