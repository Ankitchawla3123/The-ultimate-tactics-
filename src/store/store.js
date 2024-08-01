import { configureStore } from '@reduxjs/toolkit';
import boardonePlayerReducer from '../features/players/firstboardPlayersSlice';  // Adjust the path as necessary

const store = configureStore({
  reducer: {
    board1players: boardonePlayerReducer,
  },
});

export default store;
