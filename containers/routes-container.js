import React, {useEffect, useState, useRef } from 'react'
import { ActivityIndicator, StyleSheet, Text, View, FlatList, Dimensions } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
// import { usePromiseTracker } from "react-promise-tracker";
// import { trackPromise } from 'react-promise-tracker';
import RouteDetails from '../components/route-details';
import { hardCodedRoute } from '../components/route-details';
const SCREEN_HEIGHT = Dimensions.get("window").height
const RoutesContainer = (props) => {
    const routes = useSelector((state) => state.routes.list)
    const [isLoading, setIsLoading] = useState(true)
    // const LoadingIndicator = (props) => {
    // const { promiseInProgress } = usePromiseTracker();        
    //     return (
    //     promiseInProgress && 
    //     <ActivityIndicator size="large" animating={isLoading} color="#5aa"/>
    //     );  
    // }
    useEffect(() => {
        setTimeout(()=>setIsLoading(false), 2000)
        console.log("oldu ! routes chargées");        
    }, [routes])
    const objectifyRoute = (route) =>{
        // console.log(route);
        return {
            id: route[0],
            runName: route[1],
            runZone: route[2],
            runLength: route[3],
            runPreview: route[4]
        }
    }
    const data = routes.map(element => 
        objectifyRoute(element)
    )
    
    return(
        <View style={{flex:1, backgroundColor:"#fff"}}>
            {
                console.log("renderlist", data)
            }
              
            {/* rendu automatisé des route-infos                 */}
                   {
                //    isLoading?(
                //    <View> 
                //         <ActivityIndicator size="large" animating={isLoading} color="#5aa"/>
                //         <Text style={styles.LoadingMsg}>...Chargement de vos parcours... </Text>
                //    </View>)
                //    :
                   (routes.length !== 0)?( <View>
                       <FlatList
                       style={{flexGrow:0,height:SCREEN_HEIGHT-130,}} 
                        data={data}
                        renderItem={({item, index}) =>
                        //   (<RouteDetails />)

                            <View 
                            style={{flex:1, height:"100%"}}
                            >
                                {
                                    console.log("test de l'id" , item)
                                }
                                {/* <Text>HI !</Text> */}
                                {/* <RouteDetails id={item[0]} runZone={item[2]} runLength={item[3]} runPreview={item[4]} runName={item[1]}/> */}
                                <RouteDetails id={item.id} runZone={item.runZone} runLength={item.runLength} runPreview={item.runPreview} runName={item.runName}/>
                            </View>
                        }
                        
                        extraData={routes}
                        keyExtractor={(item) => item.index}
                    /></View>  ) :(<Text style={styles.LoadingMsg}>Vous n'avez aucune route personnalisée</Text>)}      
                    {/* <RouteDetails /> */}
                    {/* <View style={{height:5}} />
                    <RouteDetails />
                    <View style={{height:5}} />

                    <RouteDetails />
                    <View style={{height:5}} />

                    <RouteDetails />
                    <View style={{height:5}} />
                    
                    <RouteDetails />
                    <View style={{height:5}} />
                    
                    <RouteDetails />
                    <View style={{height:5}} />
                    
                    <RouteDetails />
                    <View style={{height:5}} />

                    <RouteDetails /> */}
            
            
        </View>
    )
}
export default RoutesContainer

const styles = StyleSheet.create({
    Titre:{
        fontWeight: 'bold',
        fontSize: 20,
        alignSelf:"center",
    },
    LoadingMsg:{
        fontSize:15,
        alignSelf:"center",
        fontStyle:"italic",
        paddingTop:25
    }
})