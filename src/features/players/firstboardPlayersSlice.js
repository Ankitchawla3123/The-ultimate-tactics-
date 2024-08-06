import {createSlice} from '@reduxjs/toolkit';
import { act } from 'react';
import ContextMenu from '../../components/ContextMenu';

const initialState={
    players:[],
    ContextMenuState:false,
    ContextMenusave:{id:"",x:0,y:0},
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
        ContextMenuStatechange:(state,action)=>{
            state.ContextMenuState=action.payload;
        
        },
        GetPlayer:(state,action)=>{
            const player = state.players.find(player => player.id === action.payload); 
            return player;
        },
        changeplayernumber:(state,action)=>{
            state.players=state.players.map((player)=>{
                if(player.id==action.payload.id){
                    player.playernumber=action.payload.number
                }
                return player
            })
        },
        ChangeColor:(state,action)=>{
            state.players=state.players.map((player)=>{
                if(player.id===action.payload.id){
                    player.playercolor=action.payload.color;
                }
                return player 
            })
        },
        setContextMenuDetails:(state,action)=>   {
            state.ContextMenusave=action.payload;
            console.log(state.ContextMenusave)
        },
        ChangePlayername:(state,action)=>{
            state.players.map((player)=>{

                if(player.id===action.payload.id){
                    player.name=action.payload.name;
                }
                return player
            }    
        )
        }
    }
})

export const {addplayers,removeplayer, changeplayernumber,ContextMenuStatechange, setContextMenuDetails, GetPlayer ,ChangePlayername, ChangeColor}=boardonePlayerSlice.actions;

export default boardonePlayerSlice.reducer;