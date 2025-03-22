import AsyncStorage from '@react-native-async-storage/async-storage';
import { CountdownEntry } from '../types';

const STORAGE_KEY = 'countdown_entries';

export const saveCountdownEntries = async (entries: CountdownEntry[]): Promise<void> => {
  try {
    const serializedEntries = entries.map(entry => ({
      ...entry,
      targetDate: entry.targetDate.toISOString(),
      createdAt: entry.createdAt.toISOString(),
    }));
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(serializedEntries));
  } catch (error) {
    console.error('Error saving countdown entries:', error);
  }
};

export const loadCountdownEntries = async (): Promise<CountdownEntry[]> => {
  try {
    const entries = await AsyncStorage.getItem(STORAGE_KEY);
    if (entries) {
      return JSON.parse(entries).map((entry: any) => ({
        ...entry,
        targetDate: new Date(entry.targetDate),
        createdAt: new Date(entry.createdAt),
      }));
    }
    return [];
  } catch (error) {
    console.error('Error loading countdown entries:', error);
    return [];
  }
}; 