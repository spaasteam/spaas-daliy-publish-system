const ONE_DAY = 60 * 60 * 1000 * 24;
const WEEK = 7;
const REPAIR_DAY = 3; // 要计算到周，但是我们是从周三开始的，所以加上

export const generatorDate = (d = new Date()) => {
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();

  return new Date(`${year} ${month}-${day}`);
};

const getUser = (data = [], date = new Date()) => {
  const d = generatorDate(date);

  const endTime = d.getTime();

  let offset = (endTime - START_TIME) / ONE_DAY;

  const weekDay = Math.floor((offset + REPAIR_DAY) / WEEK) * 2; // 需要减去的周末天数

  const index = (offset - weekDay) % data.length; // data.length 就是安排的周期，除余 得到对应人员

  return data[index];
};

const getRecentDays = (date = generatorDate(), data, days = 30) => {
  const result = [];
  for (let i = 0; i < days; i++) {
    const d = date + i * ONE_DAY;
    result.push({
      date: d,
      user: getUser(data, d)
    });
  }
};
