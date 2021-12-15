// import { UPDATE_MARKER } from "../actions/marker-action";
//
// const initialState = {
//     content: ""
// };
//
// const markerReducer = (state = initialState, action) =>  {
//     switch (action.type) {
//         case UPDATE_MARKER :
//             return {
//                 content: action.payload
//             };
//             break;
//     }
//     return state
// }
//
// export default markerReducer

import {createSlice} from '@reduxjs/toolkit';

export const markerSlice = createSlice({
    name: 'marker',
    initialState: {
        latitude: 0,
        longitude: 0,
        zone: "Terre"
    },
    reducers: {
        updateMarkerZone: function(state, {payload}) { state.zone = payload; },
        updateMarkerLat: function(state, {payload}) { state.latitude = payload; },
        updateMarkerLng: function(state, {payload}) { state.longitude = payload; },
        hideMarker: function(state, {payload}) {state.zone = "Terre"; state.latitude = 0; state.longitude = 0}
    }
});

export const { updateMarkerZone, updateMarkerLat, updateMarkerLng, hideMarker } = markerSlice.actions;
export default markerSlice.reducer;
