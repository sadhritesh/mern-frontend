import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
    currentUser : null,
    loading : false,
    error : null
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers : {
        signInStart : (state) => {
            state.error = null
            state.loading = true
        },
        signInSuccess : (state, action) => {
            state.error = null 
            state.loading = false
            state.currentUser = action.payload
        },
        signInFailure : (state, action) => {
            state.error = action.payload 
            state.loading = false
        },
        updateStart : (state, action) => {
            state.error = null
            state.loading = true
        },
        updateSuccuss : (state, action) => {
            state.currentUser = action.payload
            state.loading = false 
            state.error = null 
        },
        updateFailure : (state, action) => {
            state.loading = false 
            state.error = action.payload
        },
        deleteUserStart : (state, action) => {
            state.loading = true 
            state.error = null 
        },
        deleteUserSuccess : (state, action) => {
            state.loading = false 
            state.error = null 
            state.currentUser = null 
        },
        deleteUserFailure : (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        signOutSuccess : (state, action) => {
            state.currentUser = null 
            state.error = null 
            state.loading = null
        }
    }
})

export const { 
    signInStart, 
    signInSuccess, 
    signInFailure, 
    updateStart,
    updateSuccuss,
    updateFailure,
    deleteUserStart,
    deleteUserFailure,
    deleteUserSuccess,
    signOutSuccess 
} = userSlice.actions;

export default userSlice.reducer;