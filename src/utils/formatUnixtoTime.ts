import { format } from 'date-fns';

export function formatUnixToTime(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);
  return format(date, 'HH:mm');
}