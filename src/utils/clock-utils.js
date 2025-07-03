
export const getCurrentTime = () => { // 24-hour format
  const now = new Date();
  return {
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds()
  };
}

const padZero = (num, length) => num.toString().padStart(length || 2, '0');

export const digitalClockContent = () => {
  const { hour, minute, second } = getCurrentTime();
  return `${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
}

export const digitalClockContentArgs = ({ hour, minute, second }) => {
  return `${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
}