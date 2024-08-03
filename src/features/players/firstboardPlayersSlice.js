import {createSlice} from '@reduxjs/toolkit';
import { act } from 'react';
import ContextMenu from '../../components/ContextMenu';

const initialState={
    players:[],
    ContextMenuState:false,
    ContextMenusave:{x:0,y:0},
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
        setContextMenuDetails:(state,action)=>   {
            state.ContextMenusave=action.payload;
            console.log(state.ContextMenusave)
        }
    }
})

export const {addplayers,removeplayer, changeplayername,ContextMenuStatechange, setContextMenuDetails }=boardonePlayerSlice.actions;

export default boardonePlayerSlice.reducer;