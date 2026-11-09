import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, GestureResponderEvent } from 'react-native';

interface TouchCoord {
  x: number;
  y: number;
}

type TouchesMap = {
  [identifier: number]: TouchCoord;
};

export default function FingerPickerScreen() {
  const [touches, setTouches] = useState<TouchesMap>({});
  const [selectedTouchId, setSelectedTouchId] = useState<number | null>(null);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Aggiorna la mappa dei tocchi attivi leggendo direttamente l'evento nativo
  const updateTouches = (event: GestureResponderEvent) => {
    const activeTouches = event.nativeEvent.touches;
    const newTouches: TouchesMap = {};

    for (let i = 0; i < activeTouches.length; i++) {
      const t = activeTouches[i];
      newTouches[t.identifier] = {
        x: t.locationX,
        y: t.locationY,
      };
    }

    setTouches(newTouches);
    return activeTouches;
  };

  const handleTouchStartOrMove = (event: GestureResponderEvent) => {
    const activeTouches = updateTouches(event);

    if (activeTouches.length >= 2) {
      if (!timerRef.current) {
        setSelectedTouchId(null);
        timerRef.current = setTimeout(() => {
          const currentActive = event.nativeEvent.touches;
          if (currentActive.length > 0) {
            const randomIndex = Math.floor(Math.random() * currentActive.length);
            setSelectedTouchId(currentActive[randomIndex].identifier);
          }
        }, 1500);
      }
    } else {
      resetTimerAndSelection();
    }
  };

  const handleTouchEnd = (event: GestureResponderEvent) => {
    // Aggiorniamo i tocchi rimasti dopo il rilascio
    const activeTouches = updateTouches(event);

    // Se rimangono meno di 2 dita, resettiamo tutto immediatamente
    if (activeTouches.length < 2) {
      resetTimerAndSelection();
    }
  };

  const resetTimerAndSelection = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setSelectedTouchId(null);
  };

  const touchKeys = Object.keys(touches).map(Number);

  return (
    <View
      style={styles.container}
      onTouchStart={handleTouchStartOrMove}
      onTouchMove={handleTouchStartOrMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {touchKeys.length === 0 ? (
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>Tieni premuto con più dita sullo schermo...</Text>
        </View>
      ) : (
        touchKeys.map((id) => {
          const touch = touches[id];
          if (!touch) return null;

          const isSelected = selectedTouchId !== null && id === selectedTouchId;
          const isDimmed = selectedTouchId !== null && !isSelected;

          if (isDimmed) return null;

          return (
            <View
              key={id}
              style={[
                styles.circle,
                {
                  left: touch.x - 40,
                  top: touch.y - 40,
                  backgroundColor: isSelected ? '#4CAF50' : '#FF5722',
                  borderColor: isSelected ? '#2E7D32' : '#D84315',
                },
              ]}
            >
              <View style={styles.innerCircle} />
            </View>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  instructionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  instructionText: {
    color: '#aaa',
    fontSize: 18,
    textAlign: 'center',
  },
  circle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    elevation: 8,
  },
  innerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
});