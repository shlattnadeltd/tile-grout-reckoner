import { useCallback, useMemo, useRef, useState } from 'react';
import { sumRooms } from '../game/reckoner';
import type { JobTotals, SavedRoom } from '../game/reckoner';

export type JobList = {
  rooms: SavedRoom[];
  totals: JobTotals;
  activeId: string | null;
  addRoom: (room: Omit<SavedRoom, 'id'>) => string;
  removeRoom: (id: string) => void;
  select: (id: string) => void;
  clear: () => void;
};

const ROOM_NAMES = [
  'BATHROOM FLOOR',
  'KITCHEN SPLASHBACK',
  'HALLWAY',
  'SHOWER WALL',
  'UTILITY ROOM',
  'BALCONY',
];

export function useJobList(): JobList {
  const [rooms, setRooms] = useState<SavedRoom[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const seq = useRef(0);

  const totals = useMemo(() => sumRooms(rooms), [rooms]);

  const addRoom = useCallback((room: Omit<SavedRoom, 'id'>) => {
    seq.current += 1;
    const id = `room${seq.current}`;
    const name =
      room.name || ROOM_NAMES[(seq.current - 1) % ROOM_NAMES.length];
    setRooms(prev => [...prev, { ...room, name, id }]);
    setActiveId(id);
    return id;
  }, []);

  const removeRoom = useCallback((id: string) => {
    setRooms(prev => prev.filter(r => r.id !== id));
    setActiveId(prev => (prev === id ? null : prev));
  }, []);

  const select = useCallback((id: string) => setActiveId(id), []);

  const clear = useCallback(() => {
    setRooms([]);
    setActiveId(null);
  }, []);

  return { rooms, totals, activeId, addRoom, removeRoom, select, clear };
}

export const nextRoomName = (count: number) =>
  ROOM_NAMES[count % ROOM_NAMES.length];

export default useJobList;
