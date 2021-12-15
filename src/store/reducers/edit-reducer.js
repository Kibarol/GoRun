// import { UPDATE_EDIT } from "../actions/edit-actions";
//
// const initialState = {
//     content : false
// }
//
// const editReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case UPDATE_EDIT:
//             return {
//                 content: action.payload
//             };
//             break;
//         }
//     return state
// }
//
// export default editReducer;

import {createSlice} from '@reduxjs/toolkit';

export const editModeSlice = createSlice({
  name: 'editMode',
  initialState: {
    isActive: false
  },
  reducers: {
    setActive: (state) => { state.isActive = true; },
    setInactive: (state) => { state.isActive = false; }
  }
})

export const { setActive, setInactive } = editModeSlice.actions;
export default editModeSlice.reducer;
