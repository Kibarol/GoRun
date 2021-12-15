import { createReducer, createSlice } from "@reduxjs/toolkit";
import { format } from 'date-fns';

export const UserSlice = createSlice({
    name:"appUser",
    initialState:{
        username: "Champion(ne)",
        pwd: null,
        email: null,
        birth: null,
        isLogged: false,
        isPublic: false,
        isRegistered: false,
        avgSpeed: 0,
        totLength: 0,
        avatar: null,
        currentScreen:"GoRun",
        userType: "—"
    },
    reducers: {
        setUsername: function(state, {payload}){
            state.username = payload;
        },
        setPwd: function(state, {payload}){
            state.pwd = payload;
        },
        setMail: function(state, {payload}){
            state.email = payload;
        },
        setIsLogged: function(state, {payload}){
            state.isLogged = payload;
        },
        setIsRegistered: function(state, {payload}){
            state.isRegistered = payload;
        },
        updateAvgSpeed: function(state, {payload}){
            state.avgSpeed = payload;
        },
        addToTotLength: function(state, {payload}){
            state.totLength = payload + totLength;
        },
        setAvatar: function(state, {payload}){
            state.avatar = payload;
        },
        deleteUser: function(state){
            state = initialState
        },
        setCurrentScreen: function(state, {payload}){
            // console.log('screenname', payload);
            state.currentScreen = payload
        },
        setUserType: function(state, {payload}){
            state.userType = payload
        }
    }
})
export const {setAvatar, setIsLogged, setMail, setPwd, setIsRegistered, setUsername, updateAvgSpeed, addToTotLength, deleteUser, setCurrentScreen, setUserType} = UserSlice.actions;
export default UserSlice.reducer