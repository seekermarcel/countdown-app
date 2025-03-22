import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Link, useNavigation, router } from 'expo-router';
import { CountdownEntry } from '../types';
import { loadCountdownEntries, saveCountdownEntries } from '../utils/storage';
import { calculateDaysUntil, formatDate } from '../utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';

type SortMethod = 'days' | 'alphabetical';

export default function HomeScreen() {
  const [entries, setEntries] = useState<CountdownEntry[]>([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [clearAllModalVisible, setClearAllModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortMethod, setSortMethod] = useState<SortMethod>('days');
  const navigation = useNavigation();

  const sortEntries = (entriesToSort: CountdownEntry[], method: SortMethod) => {
    if (method === 'days') {
      return [...entriesToSort].sort((a, b) => {
        const daysUntilA = calculateDaysUntil(a.targetDate);
        const daysUntilB = calculateDaysUntil(b.targetDate);
        return daysUntilA - daysUntilB;
      });
    } else {
      return [...entriesToSort].sort((a, b) => 
        a.name.toLowerCase().localeCompare(b.name.toLowerCase())
      );
    }
  };

  const loadEntries = async () => {
    const loadedEntries = await loadCountdownEntries();
    const sortedEntries = sortEntries(loadedEntries, sortMethod);
    setEntries(sortedEntries);
  };

  useEffect(() => {
    loadEntries();

    const unsubscribe = navigation.addListener('focus', () => {
      loadEntries();
    });

    return unsubscribe;
  }, [navigation, sortMethod]);

  const toggleSortMethod = () => {
    setSortMethod(current => current === 'days' ? 'alphabetical' : 'days');
  };

  const handleDelete = async (id: string) => {
    setSelectedId(id);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (selectedId) {
      const updatedEntries = entries.filter(entry => entry.id !== selectedId);
      await saveCountdownEntries(updatedEntries);
      setEntries(updatedEntries);
    }
    setDeleteModalVisible(false);
    setSelectedId(null);
  };

  const handleEdit = (entry: CountdownEntry) => {
    router.push({
      pathname: "/add",
      params: { 
        id: entry.id,
        name: entry.name,
        date: entry.targetDate.toISOString()
      }
    });
  };

  const handleClearAll = () => {
    setClearAllModalVisible(true);
  };

  const confirmClearAll = async () => {
    await saveCountdownEntries([]);
    setEntries([]);
    setClearAllModalVisible(false);
  };

  const renderItem = ({ item }: { item: CountdownEntry }) => {
    const daysUntil = calculateDaysUntil(item.targetDate);
    return (
      <View style={styles.entryCard}>
        <View style={styles.entryContent}>
          <Text style={styles.entryName}>{item.name}</Text>
          <Text style={styles.entryDate}>Target: {formatDate(item.targetDate)}</Text>
          <Text style={styles.daysUntil}>
            {daysUntil > 0 ? `${daysUntil} days until` : 'Past due'}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleEdit(item)}
          >
            <Ionicons name="pencil" size={20} color="#9e9e9e" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleDelete(item.id)}
          >
            <Ionicons name="trash" size={20} color="#9e9e9e" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.sortButton, entries.length === 0 && styles.disabledButton]} 
          onPress={handleClearAll}
          disabled={entries.length === 0}
        >
          <Ionicons 
            name="trash-outline" 
            size={18} 
            color="#ffffff" 
          />
          <Text style={styles.sortButtonText}>Clear All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.sortButton} 
          onPress={toggleSortMethod}
        >
          <Ionicons 
            name={sortMethod === 'days' ? 'time-outline' : 'text-outline'} 
            size={18} 
            color="#ffffff" 
          />
          <Text style={styles.sortButtonText}>
            {sortMethod === 'days' ? 'Days' : 'A-Z'}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <Link href="/add" asChild>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add New Countdown</Text>
        </TouchableOpacity>
      </Link>

      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setDeleteModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Countdown</Text>
            <Text style={styles.modalText}>Are you sure you want to delete this countdown?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteModalButton]}
                onPress={confirmDelete}
              >
                <Text style={[styles.modalButtonText, styles.deleteButtonText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={clearAllModalVisible}
        onRequestClose={() => setClearAllModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setClearAllModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Clear All Countdowns</Text>
            <Text style={styles.modalText}>Are you sure you want to delete all countdowns? This action cannot be undone.</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setClearAllModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteModalButton]}
                onPress={confirmClearAll}
              >
                <Text style={[styles.modalButtonText, styles.deleteButtonText]}>Clear All</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  listContainer: {
    padding: 16,
  },
  entryCard: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryContent: {
    flex: 1,
  },
  entryName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#ffffff',
  },
  entryDate: {
    fontSize: 14,
    color: '#9e9e9e',
    marginBottom: 4,
  },
  daysUntil: {
    fontSize: 16,
    color: '#831aed',
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  addButton: {
    backgroundColor: '#5d12a8',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#9e9e9e',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9e9e9e',
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  deleteModalButton: {
    backgroundColor: '#ff1744',
  },
  deleteButtonText: {
    color: '#ffffff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  disabledButton: {
    opacity: 0.5,
  },
  sortButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '500',
  },
});