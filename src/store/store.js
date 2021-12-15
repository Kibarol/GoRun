import { configureStore } from '@reduxjs/toolkit';
import markerReducer from './reducers/marker-reducer';
import editReducer from "./reducers/edit-reducer"
import routeSlice from "./slices/route.slice";
import userSlice from './slices/user-slice';


export default configureStore({
    reducer: {
        editMode: editReducer,
        marker: markerReducer,
        routes: routeSlice,
        appUser: userSlice,
    }
})

