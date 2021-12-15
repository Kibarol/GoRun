import {createSlice} from '@reduxjs/toolkit';

export class Route {
    id;
    name;
    region;
    checkpoints = [];
    length;
    preview;

}
export const routesSlice = createSlice({
  name: 'routes',
  initialState: {
    routeList : new Map()
  },
  reducers: {
        updateRoute: (state, route),
        addRoute: (state,{payload}) => { state.routeList.set(payload.id, payload) },
        delRoute: (state,id) => { state.routeList.delete(payload) },
  }
})

export const { updateRoute, addRoute, delRoute } = routeSlice.actions;
export default routesSlice;
