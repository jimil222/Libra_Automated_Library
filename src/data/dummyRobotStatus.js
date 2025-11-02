export const dummyRobotStatus = {
  status: 'idle',
  current_bin: null,
  target_bin: null,
  battery_level: 85,
  last_activity: '2024-01-23T10:30:00Z',
  bins: [
    { id: 1, location: 'A1', status: 'available', books_count: 12 },
    { id: 2, location: 'A2', status: 'available', books_count: 15 },
    { id: 3, location: 'B1', status: 'retrieving', books_count: 8 },
    { id: 4, location: 'B2', status: 'available', books_count: 20 },
    { id: 5, location: 'C1', status: 'available', books_count: 10 },
    { id: 6, location: 'C2', status: 'available', books_count: 18 },
    { id: 7, location: 'D1', status: 'available', books_count: 14 },
    { id: 8, location: 'D2', status: 'available', books_count: 16 }
  ]
};

