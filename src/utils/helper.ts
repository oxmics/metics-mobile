export function isValidEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

export const formatDateReverse = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
  const year = date.getFullYear();

  return `${year}-${month}-${day}`;
};

export const formatDateVerbose = (isoString: string) =>{
    const date = new Date(isoString);
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
};

export const formatDateString = (dateString: string): string => {
  const date = new Date(dateString);

  const year = date.getFullYear();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const month = monthNames[date.getMonth()];

  const day = date.getDate();
  const daySuffix = getDaySuffix(day);


  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return `${year}, ${month} ${day}${daySuffix} at ${hours}:${minutes} ${period}`;
};

const getDaySuffix = (day: number): string => {
  if (day >= 11 && day <= 13) {return 'th';}
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

export const capitalizeFirstLetter = (val: string) => {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
};

export const daysAgo = (dateString:string) => {
  const givenDate = new Date(dateString);
  const today = new Date();

  const diffInMs = today.getTime() - givenDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  return diffInDays > 0 ? `${diffInDays} days ago` : 'Today';
};
