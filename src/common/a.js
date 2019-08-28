const startTime = new Date("2019 08-26").getTime(); // 27 号开始，应该从 26开始算

const oneday = 60 * 60 * 1000 * 24
const week = 7;

const getIndex = () => {
  let d = new Date();
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  // let toDay = new Date(`${year} ${month}-${day}`);
  let toDay = new Date(`${year} ${9}-${14}`);
  const endTime = toDay.getTime();
  let offset = (endTime - startTime) / oneday;

  const weekDay = ~~(offset / week) * 2; // 需要减去的周末天数


  console.log((offset - weekDay) % 12, );
};


getIndex()
