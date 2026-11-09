import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

export default function DiceScreen() {
  const [faces, setFaces] = useState<number>(6);
  const [result, setResult] = useState<number | null>(null);
  const [rolling, setRolling] = useState<boolean>(false);

  const rollDice = () => {
    setRolling(true);
    setTimeout(() => {
      const randomNumber = Math.floor(Math.random() * faces) + 1;
      setResult(randomNumber);
      setRolling(false);
    }, 200);
  };

  const faceOptions: number[] = [];
  for (let i = 6; i <= 20; i++) {
    faceOptions.push(i);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Seleziona il numero di facce ({faces}):</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.facesScroll}>
        {faceOptions.map((num) => (
          <TouchableOpacity
            key={num}
            style={[styles.faceButton, faces === num && styles.faceButtonActive]}
            onPress={() => setFaces(num)}
          >
            <Text style={[styles.faceButtonText, faces === num && styles.faceButtonTextActive]}>
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.diceContainer}>
        <Text style={styles.diceText}>
          {rolling ? '...' : (result !== null ? result : '?')}
        </Text>
      </View>

      <TouchableOpacity style={styles.rollButton} onPress={rollDice}>
        <Text style={styles.rollButtonText}>ROLLA DADO</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  facesScroll: {
    maxHeight: 60,
    marginBottom: 30,
  },
  faceButton: {
    width: 45,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginRight: 8,
  },
  faceButtonActive: {
    backgroundColor: '#6200ee',
  },
  faceButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  faceButtonTextActive: {
    color: '#fff',
  },
  diceContainer: {
    width: 150,
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  diceText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  rollButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
  },
  rollButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});