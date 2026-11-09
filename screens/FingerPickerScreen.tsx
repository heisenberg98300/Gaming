import React, { useState, useRef, ElementRef } from 'react';
import { StyleSheet, Text, View, GestureResponderEvent, LayoutChangeEvent } from 'react-native';

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
  const latestTouchesRef = useRef<{ identifier: number }[]>([]);
  const offsetRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<ElementRef<typeof View>>(null);

  // Ricava l'offset assoluto del container sullo schermo
  const handleLayout = (_e: LayoutChangeEvent) => {
    containerRef.current?.measureInWindow((x: any, y: any) => {
      offsetRef.current = { x, y };
    });
  };

  const updateTouches = (event: GestureResponderEvent) => {
    const activeTouches = event.nativeEvent.touches;
    const newTouches: TouchesMap = {};

    for (let i = 0; i < activeTouches.length; i++) {
      const t = activeTouches[i];
      newTouches[t.identifier] = {
        x: t.pageX - offsetRef.current.x,
        y: t.pageY - offsetRef.current.y,
      };
    }

    latestTouchesRef.current = activeTouches.map((t) => ({ identifier: t.identifier }));
    setTouches(newTouches);
    return activeTouches;
  };

  const handleTouchStartOrMove = (event: GestureResponderEvent) => {
    const activeTouches = updateTouches(event);

    if (activeTouches.length >= 2) {
      if (!timerRef.current) {
        setSelectedTouchId(null);
        timerRef.current = setTimeout(() => {
          // Usa i tocchi più recenti, non quelli catturati alla chiusura
          const currentActive = latestTouchesRef.current;
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
    const activeTouches = updateTouches(event);
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
      ref={containerRef}
      onLayout={handleLayout}
      style={styles.container}
      onTouchStart={handleTouchStartOrMove}
      onTouchMove={handleTouchStartOrMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      {touchKeys.length === 0 ? (
        <View style={styles.instructionContainer} pointerEvents="none">
          <Text style={styles.instructionText}>Tenere le dita sullo schermo in attesa di essere scelti...</Text>
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
              pointerEvents="none"
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