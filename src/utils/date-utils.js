// Converts 'yyyy-mm-dd' to 'dd-mm-yyyy'
export function formatDateToDDMMYYYY(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  return `${day}-${month}-${year}`;
}

// Converts 'yyyy-mm-ddTHH:MM:SS' to 'hh:mm:ss AM/PM dd-mm-yyyy'
export function formatDateTimeToReadable(dateTimeStr) {
  if (!dateTimeStr) return '';
  const date = new Date(dateTimeStr);
  if (isNaN(date.getTime())) return dateTimeStr;

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const hourStr = hours.toString().padStart(2, '0');

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${hourStr}:${minutes}:${seconds} ${ampm} ${day}-${month}-${year}`;
}
