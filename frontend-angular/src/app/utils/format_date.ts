export function formatDueDate(date: Date): string {
  const now = new Date();
  const difference = date.getTime() - now.getTime();
  const oneHour = 60 * 60 * 1000;
  const oneDay = 24 * oneHour;

  const padZero = (n: number) => (n < 10 ? '0' + n : n.toString());

  if (difference <= 0) {
    return 'Task elapsed';
  } else if (difference <= oneHour) {
    const minutes = Math.floor(difference / (60 * 1000));
    return `In ${minutes} mins`;
  } else if (difference <= oneDay) {
    const hours = Math.floor(difference / oneHour);
    const minutes = Math.floor((difference % oneHour) / (60 * 1000));
    return `In ${hours}hrs ${minutes}mins`;
  } else if (date.getDate() === now.getDate() + 1) {
    const hours = date.getHours();
    const minutes = padZero(date.getMinutes());
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedTime = `${hours > 12 ? hours - 12 : hours}:${minutes}${ampm}`;
    return `Tomorrow (${formattedTime})`;
  } else {
    const formattedDate = `${padZero(date.getDate())}/${padZero(date.getMonth() + 1)}/${date.getFullYear()}`;
    return formattedDate;
  }
}
