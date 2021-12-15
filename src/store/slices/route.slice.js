import { createReducer, createSlice } from "@reduxjs/toolkit";
import { format } from 'date-fns';

export class Route {
  id;
  name;
  region;
  checkpoints = [];
  length;
  preview;

  clone() {
    const clone = new Route();

    clone.id = this.id;
    clone.name = this.name;
    clone.region = this.region
    clone.checkpoints = [...this.checkpoints];
    clone.length = this.length;
    clone.preview = this.preview;

    return clone;
  }
}
export class MyMap extends Array{
  set(key,value){
    this.push([key,value]);
  }
  get(findKey){
    return this.find(([key,value])=> key === findKey)?.value
  }
}

export const RouteSlice = createSlice({
  name: "routes",
  initialState: {
    list: [],
    current: [],
    zone: null,
    routeStartZone: "",
    currentName: null, 
    length: 0,  
    preview: null, 
  },
  reducers: {
    //Infos du marqueur :
    setMarkerZone: function(state, {payload}) {
      state.zone = payload;
    },
    
    
    //Infos des routes tracées : 
    setStartZone: function(state, {payload}) {
      state.routeStartZone = payload;
    },
    setRunLength: function(state, {payload}) {
      state.length = payload;
    },
    
    /**
     * @param {any} state
     * @param {Route} payload
     */
    setCurrentRoute: function(state, {payload}) {
      state.current = payload;
    },
    /**
     * 
     * @param {*} state 
     * @param 
     */
    addCP: function(state, {payload}){
      // console.log(payload);
      state.current.push(payload)
    },
    setStartPoint: function(state, {payload}){
      state.current.push(payload)
    },
    setRouteRegion: function(state, {payload}){
      state.current.region = payload
    },
    setRouteName: function(state, {payload}){
      state.currentName = payload
    },
    setPreview: function(state, {payload}){
      state.preview = JSON.stringify(payload._W)
    },
    /**
     * @param {any} state
     * @param {Route} payload
     */
    addRoute: function (state, {payload}) {
      //array [ id , nom donné, zone , length , [checkpoints] ]
      const id = `${format(new Date(), "yyyy-MM-dd-HH:mm")}_${state.routeStartZone}`;
      const name = (state.currentName === null) ? state.routeStartZone : state.currentName
      state.list.push([id, name, state.routeStartZone, state.length, state.preview, payload]);
      // const item = state.list.get(payload.id);

      // Réinitialisation du state;
      state.current = null;
      state.currentName = null;
      state.length = 0;
      state.zone = null;
      state.preview = null;
      state.routeStartZone = null;
    },
    /**
     * @param state
     * @param {string} payload correspondant à l'id
     */
    removeRoute: function(state, {payload}) {
      let index = 0;
      let found = false;
      state.list.forEach(element => {
        if(payload==element[0]) {index = state.list.indexOf(element); found = true}        
      })
      if (found) state.list.splice(index,1); 
    },
    /**
     * @param state
     * @param {{id: number, route: Route}} payload
     */
    updateRoute: function(state, {payload}) { state.list.set(payload.id, payload.route); }
  }
});

export const {setRunLength, setStartZone, setMarkerZone, addCP, setStartPoint, setRouteName, setRouteRegion, addRoute, removeRoute, updateRoute, setCurrentRoute, setPreview} = RouteSlice.actions;
export default RouteSlice.reducer;
