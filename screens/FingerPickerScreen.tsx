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
  
  // Utilizziamo ReturnType<typeof setTimeout> per tipizzare correttamente il timer in TS
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTouch = (event: GestureResponderEvent) => {
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

    if (activeTouches.length >= 2) {
      if (!timerRef.current) {
        setSelectedTouchId(null);
        timerRef.current = setTimeout(() => {
          // Scegliamo un indice casuale basato sulle dita attive al momento dello scatto del timer
          const randomIndex = Math.floor(Math.random() * activeTouches.length);
          const winningTouch = activeTouches[randomIndex];
          setSelectedTouchId(winningTouch.identifier);
        }, 1500);
      }
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setSelectedTouchId(null);
    }
  };

  const handleTouchEnd = (event: GestureResponderEvent) => {
    handleTouch(event);
    if (event.nativeEvent.touches.length <= 1) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setSelectedTouchId(null);
    }
  };

  const touchKeys = Object.keys(touches).map(Number);

  return (
    <View
      style={styles.container}
      onTouchStart={handleTouch}
      onTouchMove={handleTouch}
      onTouchEnd={handleTouchEnd}
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

          if (isDimmed) return null; // Nasconde gli altri pallini quando il vincitore viene evidenziato

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