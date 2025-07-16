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

export function formatISOToYYYYMMDD(isoString) {
  const date = new Date(isoString);

  if (isNaN(date)) {
    throw new Error("Invalid ISO date string");
  }

  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const yyyy = date.getFullYear();

  return `${yyyy}-${mm}-${dd}`;
}

export function convertDDMMYYYYToYYYYMMDD(dateStr) {
  if (!dateStr) return '';
  const [day, month, year] = dateStr.split('-');
  if (!year || !month || !day) return dateStr;
  return `${year}-${month}-${day}`;
}

export function getDateFromDDMMYYYY(dateStr) {
  // Converts 'dd-mm-yyyy' to a Date object
  if (!dateStr) return null;
  const [day, month, year] = dateStr.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export function getYYYYMMDDFromDate(date) {
  // Converts a Date object to 'yyyy-mm-dd'
  if (!(date instanceof Date)) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYYYYMMDDFromISOString(isoString) {
  // Converts an ISO date string to 'yyyy-mm-dd'
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  return getYYYYMMDDFromDate(date);
}

export function getDDMMYYYYFromISOString(isoString) {
  // Converts an ISO date string to 'dd-mm-yyyy'
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}