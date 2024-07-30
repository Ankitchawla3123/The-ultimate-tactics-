import { configureStore } from "@reduxjs/toolkit";

import  boardOnePlayersReducer  from "../features/players/firstboardPlayersSlice";

export const store=configureStore({
    reducer: {
        boardOnePlayers:boardOnePlayersReducer,
    }
})