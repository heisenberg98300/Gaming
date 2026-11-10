import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';

export default function ExtractionName() {
  const [inputText, setInputText] = useState('');
  const [namesList, setNamesList] = useState<string[]>([]);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  // Funzione per aggiungere un nome alla lista
  const handleAddName = () => {
    if (inputText.trim() === '') return;
    setNamesList([...namesList, inputText.trim()]);
    setInputText('');
    setSelectedName(null); // Resetta l'estrazione precedente se si aggiunge un nuovo nome
  };

  // Funzione per estrarre casualmente un nome dalla lista
  const handlePickRandom = () => {
    if (namesList.length === 0) return;
    const randomIndex = Math.floor(Math.random() * namesList.length);
    setSelectedName(namesList[randomIndex]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estrazione Casuale</Text>

      {/* Input per digitare il nome */}
      <TextInput
        style={styles.input}
        placeholder="Inserisci un nome..."
        placeholderTextColor="#888"
        value={inputText}
        onChangeText={setInputText}
      />

      <TouchableOpacity style={styles.button} onPress={handleAddName}>
        <Text style={styles.buttonText}>Aggiungi Nome</Text>
      </TouchableOpacity>

      {/* Box del risultato estratto */}
      {selectedName && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Nome Estratto:</Text>
          <Text style={styles.resultText}>{selectedName}</Text>
        </View>
      )}

      {/* Pulsante per avviare l'estrazione (visibile solo se ci sono nomi) */}
      {namesList.length > 0 && (
        <TouchableOpacity style={[styles.button, styles.pickButton]} onPress={handlePickRandom}>
          <Text style={styles.buttonText}>Estrai a Caso!</Text>
        </TouchableOpacity>
      )}

      {/* Elenco dei nomi inseriti */}
      <Text style={styles.subTitle}>Partecipanti ({namesList.length}):</Text>
      <FlatList
        data={namesList}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listText}>• {item}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#121212' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#1e1e1e', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#333' },
  button: { backgroundColor: '#6200ee', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  pickButton: { backgroundColor: '#03dac6', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  resultContainer: { backgroundColor: '#2d2d2d', padding: 15, borderRadius: 8, alignItems: 'center', marginVertical: 15, borderWidth: 1, borderColor: '#03dac6' },
  resultLabel: { color: '#aaa', fontSize: 14 },
  resultText: { color: '#03dac6', fontSize: 28, fontWeight: 'bold' },
  subTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  listItem: { paddingVertical: 5 },
  listText: { color: '#ddd', fontSize: 16 }
});