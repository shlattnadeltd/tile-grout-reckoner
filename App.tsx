/**
 * TileGroutReckoner — state machine only. All gameplay (the estimator flow)
 * lives in the screens; this file just swaps them (rules #2, #12).
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BackHandler, StatusBar, StyleSheet, View } from 'react-native';
import { DEFAULTS } from './src/constants/config';
import theme from './src/constants/theme';
import useJobList, { nextRoomName } from './src/hooks/useJobList';
import type { RoomResult, SavedRoom } from './src/game/reckoner';
import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import type { Settings } from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import ResultScreen from './src/screens/ResultScreen';

type Screen = 'loader' | 'menu' | 'game' | 'gameover';

export default function App() {
  const [screen, setScreen] = useState<Screen>('loader');
  const [settings, setSettings] = useState<Settings>({
    unit: DEFAULTS.unit,
    joint: DEFAULTS.joint,
    waste: DEFAULTS.waste,
    bagWeight: DEFAULTS.bagWeight,
    haptics: DEFAULTS.haptics,
  });
  const [result, setResult] = useState<RoomResult | null>(null);
  const [gameKey, setGameKey] = useState(0);

  const job = useJobList();
  const screenRef = useRef<Screen>(screen);
  screenRef.current = screen;

  const goMenu = useCallback(() => setScreen('menu'), []);

  const startRoom = useCallback(() => {
    setGameKey(k => k + 1);
    setScreen('game');
  }, []);

  const handleGameOver = useCallback((r: RoomResult) => {
    setResult(r);
    setScreen('gameover');
  }, []);

  const handleSaveRoom = useCallback(
    (room: Omit<SavedRoom, 'id'>, snapshot: RoomResult) => {
      job.addRoom(room);
      setResult(snapshot);
    },
    [job],
  );

  const openTotals = useCallback(() => {
    if (result) {
      setScreen('gameover');
    }
  }, [result]);

  const changeSettings = useCallback((patch: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...patch }));
  }, []);

  // Android hardware back maps onto the state machine (RN guideline: handle back)
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const current = screenRef.current;
      if (current === 'game' || current === 'gameover') {
        setScreen('menu');
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar translucent backgroundColor="transparent" />

      {screen === 'loader' ? <LoaderScreen onDone={goMenu} /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          rooms={job.rooms}
          totals={job.totals}
          activeId={job.activeId}
          settings={settings}
          onChangeSettings={changeSettings}
          onStart={startRoom}
          onOpenTotals={openTotals}
          onSelectRoom={job.select}
          onRemoveRoom={job.removeRoom}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          key={gameKey}
          settings={settings}
          roomName={nextRoomName(job.rooms.length)}
          onBack={goMenu}
          onGameOver={handleGameOver}
          onSaveRoom={handleSaveRoom}
        />
      ) : null}

      {screen === 'gameover' && result ? (
        <ResultScreen
          result={result}
          totals={job.totals}
          roomsCount={job.rooms.length}
          onPlayAgain={startRoom}
          onMenu={goMenu}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bg.primary },
});
