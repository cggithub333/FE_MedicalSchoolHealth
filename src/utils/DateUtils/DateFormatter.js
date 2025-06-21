
const monthMapper = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
}

// convert SQL format (yyyy-mm-dd) to user format: ex: Jun 12, 2019
export const convertSQLDateToUserDate = (sqlDate) => {

  const dateObj = new Date(sqlDate);

  if (isNaN(dateObj.getTime())) {
    throw new Error(`Input sqlDate='${sqlDate}' is not a sqlDate!`);
  }

  //else:
  const month = monthMapper[dateObj.getMonth() + 1];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();

  return `${month} ${day}, ${year}`;
}

/* Test:
const test1 = "2020-11-29"; // passed
const test2 = "2020/11/29"; // passed
const test3 = "2020?11?29"; // passed
const test4 = "2020.11.29"; // passed
console.log(test1);
console.log(convertSQLDateToUserDate(test1));
*/