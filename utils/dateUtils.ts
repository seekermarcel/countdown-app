import { differenceInDays } from 'date-fns';

export const calculateDaysUntil = (targetDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return differenceInDays(targetDate, today);
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
}; 