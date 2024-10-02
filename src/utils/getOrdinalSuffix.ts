import { format, parseISO } from 'date-fns';

// Function to get the ordinal suffix (st, nd, rd, th)
function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

// Main function to format the date
export function formatDateWithSuffix(dateString: string): string {
  const parsedDate = parseISO(dateString);
  const day = format(parsedDate, 'd');
  const month = format(parsedDate, 'MMM');

  const dayNumber = parseInt(day, 10);
  const ordinalSuffix = getOrdinalSuffix(dayNumber);

  return `${dayNumber}${ordinalSuffix} ${month}`;
}