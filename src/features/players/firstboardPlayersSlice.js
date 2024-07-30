import {createSlice} from '@reduxjs/toolkit';

const initialState={
    players:[],
    playersref:[],
};

const boardonePlayerSlice=createSlice({
    name:'board1players',
    initialState,
    reducers: {
        addplayers:(state,action){
            state.players.push(action.payload)
        },
        removeplayer:(state,action){
            state=state.players.filter((player)=> player.id!==action.payload)
        },
        setPlayersRef: (state, action) => {
            state.playersref = action.payload;
        },
    }
})

export const {addplayers,removeplayer, setPlayersRef}=boardonePlayerSlice.actions;

export default boardonePlayerSlice.reducer;