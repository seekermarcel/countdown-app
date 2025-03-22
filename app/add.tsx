import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import CalendarPicker from 'react-native-calendar-picker';
import { CountdownEntry } from '../types';
import { loadCountdownEntries, saveCountdownEntries } from '../utils/storage';

export default function AddScreen() {
  const params = useLocalSearchParams<{ id?: string; name?: string; date?: string }>();
  const [name, setName] = useState(params.name || '');
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    params.date ? new Date(params.date) : null
  );

  const handleSave = async () => {
    if (!name || !selectedDate) return;

    const existingEntries = await loadCountdownEntries();
    let updatedEntries: CountdownEntry[];

    if (params.id) {
      // Editing existing countdown
      updatedEntries = existingEntries.map(entry => {
        if (entry.id === params.id) {
          return {
            ...entry,
            name,
            targetDate: selectedDate,
          };
        }
        return entry;
      });
    } else {
      // Creating new countdown
      const newEntry: CountdownEntry = {
        id: Date.now().toString(),
        name,
        targetDate: selectedDate,
        createdAt: new Date(),
      };
      updatedEntries = [...existingEntries, newEntry];
    }

    await saveCountdownEntries(updatedEntries);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter countdown name"
        placeholderTextColor="#9e9e9e"
      />

      <Text style={styles.label}>Select Date</Text>
      <CalendarPicker
        onDateChange={(date: Date | null) => setSelectedDate(date)}
        minDate={new Date()}
        width={340}
        todayBackgroundColor="#1e1e1e"
        selectedDayColor="#5d12a8"
        selectedDayTextColor="#FFFFFF"
        textStyle={{ color: '#ffffff' }}
      />

      <TouchableOpacity
        style={[styles.saveButton, (!name || !selectedDate) && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={!name || !selectedDate}
      >
        <Text style={styles.saveButtonText}>
          {params.id ? 'Update Countdown' : 'Save Countdown'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#121212',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ffffff',
  },
  input: {
    backgroundColor: '#1e1e1e',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
    color: '#ffffff',
  },
  saveButton: {
    backgroundColor: '#5d12a8',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonDisabled: {
    backgroundColor: '#333',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 