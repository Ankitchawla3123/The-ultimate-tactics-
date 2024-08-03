import {createSlice} from '@reduxjs/toolkit';
import { act } from 'react';
import ContextMenu from '../../components/ContextMenu';

const initialState={
    players:[],
    ContextMenuState:false,
    ContextMenuid:"None"
}

const boardonePlayerSlice=createSlice({
    name:'board1players',
    initialState,
    reducers: {
        addplayers:(state,action)=>{
            state.players.push(action.payload)
        },
        removeplayer:(state,action)=>{
            state=state.players.filter((player)=> player.id!==action.payload)
        },
        ContextMenuStatechange:(state)=>{
            state.ContextMenuState=!state.ContextMenuState;
        
        },
        changeplayername:(state,action)=>{
            state.players=state.players.map((player)=>{
                if(player.id==action.payload){
                    player.position='rb'
                }
                return player
            })
        },
        setContextMenuId:(state,action)=>   {
            state.ContextMenuid=action.payload;
            console.log(state.ContextMenuid)
        }
    }
})

export const {addplayers,removeplayer, changeplayername,ContextMenuStatechange, setContextMenuId}=boardonePlayerSlice.actions;

export default boardonePlayerSlice.reducer;