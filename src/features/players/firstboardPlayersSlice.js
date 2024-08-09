import {createSlice} from '@reduxjs/toolkit';
import { act } from 'react';
import ContextMenu from '../../components/ContextMenu';

const initialState={
    players:[],
    Playeroptions:[
        { number: 1, color: '#8B0000' }, // Dark Red
        { number: 1, color: '#FFD700' }, // Gold
        { number: 1, color: '#8A2BE2' }, // BlueViolet
        { number: 1, color: '#32CD32' }, // LimeGreen
        { number: 1, color: '#0000FF' }, // Blue
        { number: 1, color: '#FF4500' }, // OrangeRed
        { number: 1, color: '#00CED1' }, // DarkTurquoise
        { number: 1, color: '#FFFFFF' }, // White
        { number: 1, color: '#000000' }, // Black
      ],
    optionsindex:0,
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
        },
        setOptionsIndex:(state,action)=>{
            state.optionsindex=action.payload;
        },
        addoneinoptions:(state)=>{
            state.Playeroptions[state.optionsindex].number+=1;
        },
        updatexy2: (state, action) => {
            state.players = state.players.map((player) => {
              if (player.id === action.payload.id) {
                player.x2 = action.payload.x;
                player.y2 = action.payload.y;
              }
              return player;
            });
          },
          
          updatexy: (state) => {
            state.players = state.players.map((player) => {
              player.x = player.x2;
              player.y = player.y2;
              return player;
            });
          }
          
        
    }
})

export const {addplayers,removeplayer, changeplayernumber,ContextMenuStatechange, setContextMenuDetails, GetPlayer ,ChangePlayername, ChangeColor, setOptionsIndex, addoneinoptions, updatexy2, updatexy}=boardonePlayerSlice.actions;

export default boardonePlayerSlice.reducer;