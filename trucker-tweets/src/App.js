"use client";
import './App.css';
import { useState, useEffect, useMemo, useRef, useNavigate } from "react";
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {createRoot} from 'react-dom/client';

// import Homepage from '../pages/homepage';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef, useMap, useMapsLibrary } from "@vis.gl/react-google-maps"
import { DirectionsRenderer, Marker } from "@react-google-maps/api";
import React from "react"
import FriendsList from "./components/FriendsList"




function App() {
    const center = useMemo(() => ({ lat: 39.7392, lng: -104.9903}), []);
    const [ clickedLatLng, setClickedLatLng ] = useState({ lat: 39.7392, lng: -104.9903})

    // directions setters
    const [ origin, setOrigin ] = useState("")
    const [ destination, setDestination ] = useState("")
    const [ directionsResponse, setDirectionsResponse ] = useState(null)
    const [ directionReady, setDirectionReady ] = useState(false)

    // tweet setters
    const [ selectedTweet, setSelectedTweet ] = useState(null)
    const [ user, setUser ] = useState(null)
    const [ allTweets, setAllTweets ] = useState([])
    const [ allFriends, setAllFriends ] = useState([])
    const [ friendBTN, setFriendBTN ] = useState(false)

    const [ username, setUsername ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ loginUsername, setLoginUsername ] = useState("")
    const [ loginPassword, setLoginPassword ] = useState("")
    // const [markerRef, marker ] = useAdvancedMarkerRef();
    
    // button setters
    const [ open, setOpen ] = useState(false)
    const [ createTweetBtn, setCreateTweetBtn ] = useState(false)
    const [ signUpBTN, setSignUpBTN ]= useState(false)
    const [ editTweetBTN, setEditTweetBTN ] = useState(false)
    const [ newTweetMSG, setNewTweetMSG ] = useState("")
    const [ editTweetMSG, setEditTweetMSG ] = useState("")
    
    
    

    useEffect(() => {
        fetch("http://127.0.0.1:4000/check_session").then((r)=> {
            if (r.ok){
                r.json().then((user) => setUser(user))
            }
        })
    }, [])
    
    useEffect(() => {
        fetch("http://127.0.0.1:4000/comments")
        .then((r) => r.json())
        .then((a) => setAllTweets(a))
        
    }, [])

    // ,{
    //     method: "GET",
    //     headers: {"Content-type":"application/json"},
    // }

    useEffect(()=> {
        fetch("http://127.0.0.1:4000/friends")
        .then((r) => r.json())
        .then(setAllFriends)
    },[])

    const onAddTweet = (newTweet) => {
        setAllTweets([...allTweets, newTweet])
        console.log(allTweets)
    }
    console.log(allTweets)
    // console.log(selectedTweet)

    function handleLoginSubmit(e){
        e.preventDefault()
        fetch("http://127.0.0.1:4000/login", {
            method: "POST",
            headers: {"Content-type":"application/json"},
            body: JSON.stringify({
                username: loginUsername,
                password: loginPassword
            })
        }, [])
        .then(r => r.json())
        .then(data => setUser(data))
        
    }
    function handleSignupSubmit(e){
        e.preventDefault()
        fetch("http://127.0.0.1:4000/signup", {
            method: "POST",
            headers: {"Content-type":"application/json"},
            body: JSON.stringify({
                username: username,
                password: password
            })
        }, [] )
        .then(r => r.json())
        .then(data => setUser(data))
    }
    function handleLogout(){
        fetch("http://127.0.0.1:4000/logout")
        .then(r=> r.json())
        .then(data => setUser(null))
        setLoginUsername("")
        setLoginPassword("")
        setUsername("")
        setPassword("")

    }
    function handleSignUpBTN(){
        setSignUpBTN(!signUpBTN)
    }
    
   
    function handleMapClick(e){
        // console.log(e)
        // console.log(e.detail.latLng)
        setClickedLatLng(e.detail.latLng)
        // console.log(clickedLatLng, typeof clickedLatLng.lat)
    }

    function handleCreateTweetBTN(){
        // console.log("Button Clicked")
        setCreateTweetBtn(true)
        setEditTweetBTN(false)
    }
    function handleSetTweetMessage(e){
        // console.log("handleSetTweetMessage accessed")
        setNewTweetMSG(e.target.value)
    }
    async function handleSendTweet(e){
        e.preventDefault()
        console.log(e)
        const newTweet = {
            // id: (allTweets.length + 1),
            user_id: user.id,
            lat: Number(clickedLatLng.lat),
            lng: Number(clickedLatLng.lng),
            tweet: newTweetMSG
        }
        await fetch("http://127.0.0.1:4000/comments", {
            method: "POST",
            headers: {"Content-type":"application/json"},
            body: JSON.stringify(newTweet)
        })
        .then((r) => r.json())
        .then((tweet) => {
            onAddTweet(tweet)
        })
        onAddTweet(newTweet)
        setSelectedTweet(newTweet)
    }

    async function handleDeleteTweet(){
        //check if user id matches user logged in
        setCreateTweetBtn(false)
        setEditTweetBTN(true)
        
        console.log(selectedTweet)
        if(selectedTweet){
            if (user.id === selectedTweet.user_id){
                console.log("true")
                await fetch(`http://127.0.0.1:4000/comments/${selectedTweet.id}`,{
                    method: "DELETE",
                    headers: {'Content-Type':'application/json'}
                })
                const filteredTweets = allTweets.filter((tweet) => tweet.id !== selectedTweet.id)
                setAllTweets(filteredTweets)
                setSelectedTweet(null)
            }
            else{
                console.log("false")
                console.log(selectedTweet.user_id)
                console.log(user.id)
            }
        }
        else{
            console.log("please select a tweet")
        }
        
        
        //update frontend
        
    }

    function handleEditTweetMessage(e){
        setEditTweetMSG(e.target.value)
    }
    function handleEditTweetBTN(){
        setCreateTweetBtn(false)
        setEditTweetBTN(!editTweetBTN)
    }
    function handleEditTweet(e){
        e.preventDefault()
        //check if user id matches user logged in
        if(selectedTweet){
            if(user.id === selectedTweet.user_id){
                console.log("true")
                const updatedTweet = {
                    tweet: editTweetMSG
                }
                fetch(`http://127.0.0.1:4000/comments/${selectedTweet.id}`, {
                    method: "PATCH",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(updatedTweet)
                })
                .then(r => r.json())
                .then((updatedData) => {
                    setAllTweets((prevTweets) => prevTweets.map((prev) => 
                    prev.id === updatedData.id ? updatedData : prev
                    ))
                })
                // setEditTweetBTN(false)
                // setEditTweetMSG("")
                .catch((error) => {
                    console.error("cannot update", error)
                })
            }
            else{
                console.log("else")
            }
        }
        else{
            console.log("please select a tweet")
        }
        
        //update frontend
    }

    function handleShowFriends(){
        setFriendBTN(!friendBTN)
    }
    // id: (allFriends.length + 1),
    function handleAddFriend(e){
        e.preventDefault()
        if(selectedTweet){
            const newFriend = {
                id: (allFriends.length + 1),
                selfuser_id: user.id,
                friend_id: selectedTweet.user_id
            }
            fetch("http://127.0.0.1:4000/friends", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(newFriend)
            })
            .then((r) => r.json())
            // .then((data) => onAddFriend(data))
            .then(()=> {
                // console.log(newFriend)
                // const updatedFriends = {...allFriends}
                // updatedFriends[newFriend.id] = newFriend
                // setAllFriends(updatedFriends)
                setAllFriends(allFriends => [...allFriends, newFriend])
            })
            
            // onAddFriend(newFriend)
        }
        else{
            console.log("please select a tweet")
        }
        

    }
    // const onAddFriend = (newFriend) => {
    //     console.log(newFriend)
    //     // const updatedFriends = {...allFriends}
    //     // updatedFriends[newFriend.id] = newFriend
    //     // setAllFriends(updatedFriends)
    //     // console.log(updatedFriends)
    // }
   
    
    // console.log(selectedTweet)
    // console.log(user)
    function handleWhereTo(e){
        e.preventDefault()
        // console.log(origin)
        // console.log(destination)
        setOrigin(e.target.value)
        setDestination(e.target.value)
        console.log(origin)
        console.log(destination)
        console.log(directionReady)
        handleSendTrip()
        // .then(()=> {
        //     return (
        //         <Directions directions={directionsResponse} origin={origin} destination={destination}/>
        //     )
        // })
        
        
        
    }
    function handleSendTrip(){

        const newTrip = {
            user_id: user.id,
            start: origin,
            destination: destination
            
        }
        fetch("http://127.0.0.1:4000/trips", {
            method: "POST",
            headers: {"Content-type":"application/json"},
            body: JSON.stringify(newTrip)
        })
        .then((r) => r.json())
        // .then(setDirectionReady(!directionReady))
        .then(()=> {
            setOrigin(origin)
            setDestination(destination)
        })
        setDirectionReady(!directionReady)
    }

    
    

    
    function Directions({origin, destination}) {
        const map = useMap();
        const routesLibrary = useMapsLibrary('routes');
        const [directionsService, setDirectionsService] =
          useState();
        const [directionsRenderer, setDirectionsRenderer] =
          useState();
        const [routes, setRoutes] = useState([]);
        const [routeIndex, setRouteIndex] = useState(0);
        const selected = routes[routeIndex];
        const leg = selected?.legs[0];
      
        // Initialize directions service and renderer
        useEffect(() => {
          if (!routesLibrary || !map) return;
          setDirectionsService(new routesLibrary.DirectionsService());
          setDirectionsRenderer(new routesLibrary.DirectionsRenderer({map}));
        }, [routesLibrary, map]);
      
        // Use directions service
        useEffect(() => {
          if (!directionsService || !directionsRenderer) return;
      
          directionsService
            .route({
              origin: origin,
              destination: destination,
              // eslint-disable-next-line no-undef
              travelMode: google.maps.TravelMode.DRIVING,
              provideRouteAlternatives: true
            })
            .then(response => {
              directionsRenderer.setDirections(response);
              setRoutes(response.routes);
            });
      
          return () => directionsRenderer.setMap(null);
        }, [directionsService, directionsRenderer]);
      
        // Update direction route
        useEffect(() => {
          if (!directionsRenderer) return;
          directionsRenderer.setRouteIndex(routeIndex);
        }, [routeIndex, directionsRenderer]);
    
        
      
        if (!leg) return null;
    
      
        return (
          <div className="directions">
           
            <h2>{selected.summary}</h2>
            <p>
              {leg.start_address.split(',')[0]} to {leg.end_address.split(',')[0]}
            </p>
            <p>Distance: {leg.distance?.text}</p>
            <p>Duration: {leg.duration?.text}</p>
      
            <h2>Other Routes</h2>
            <ul>
              {routes.map((route, index) => (
                <li key={route.summary}>
                  <button onClick={() => setRouteIndex(index)}>
                    {route.summary}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      }
    
    if(!user){
        return(
            <>
            <div className="App">
                <h1>Welcome to TruckerTweets</h1>
            </div>
            
            {signUpBTN ? 
            <div className="App">
                <form onSubmit={handleSignupSubmit}>
                    <h2>Username</h2>
                    <input type="text" value={username} onChange={(e)=> setUsername(e.target.value)}></input>
                    <h2>Password</h2>
                    <input type="text" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                    <br></br>
                    <button type="submit">Signup</button>
                </form>
                <br></br>
                <p>Already have an account?</p>
                <button onClick={()=> handleSignUpBTN()}>Go to Log in</button>
                
            </div>
            :
            <div className="App">
                <form onSubmit={handleLoginSubmit}>
                    <h2>Username</h2>
                    <input type="text" value={loginUsername} onChange={(e)=> setLoginUsername(e.target.value)}></input>
                    <h2>Password</h2>
                    <input type="text" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)}></input>
                    <br></br>
                    <button type="submit">Login</button>
                </form>
                <br></br>
                <p>Register a new account</p>
                <button onClick={()=> handleSignUpBTN()}>Go to Sign up</button>
                <div>
                    <p>
                        for testing use<br></br>
                        Username: Bonesaw <br></br> 
                        Password: 123
                    </p>
                </div>
            </div>
                
            
            }
            </>
        )
    }
    else{
        return (
            <div>
                
                <div className="App">
                    <h1> Welcome to Trucker Tweets, {user.username}</h1>
                    <button onClick={()=> handleLogout()}>Log out</button>
                </div>
                <div className="map">
                    <APIProvider apiKey={process.env.REACT_APP_API_KEY}>
                        <div style={{ height: "80vh", width: "100%" }}>
                            <Map defaultZoom={9} defaultCenter={center} mapId={process.env.REACT_APP_API_MAP_ID} onClick={(e) => handleMapClick(e)}> 
                               
                                <Directions directions={directionsResponse} origin={origin} destination={destination}/>

                                <Marker points={clickedLatLng}/>
                                {createTweetBtn ? 
                                    <AdvancedMarker position={clickedLatLng}></AdvancedMarker>
                                    
                                :
                                    <></>
                                }
                                <Marker points={allTweets} />
                                    {allTweets?.map((i) => (
                                        <AdvancedMarker key={i.id} position={{lat: Number(i.lat), lng: Number(i.lng)}} onClick={()=>setSelectedTweet(i)} title={i.tweet}>
                                            
                                            <Pin
                                                background={'#22ccff'}
                                                borderColor={'#1e89a1'}
                                                glyphColor={'#0f677a'}
                                                >
                                            </Pin>
                                            {selectedTweet ?
                                            
                                                <InfoWindow position={{lat: Number(selectedTweet.lat), lng: Number(selectedTweet.lng)}} onCloseClick={() => setSelectedTweet(null)}> {selectedTweet.tweet} by: {selectedTweet.user_id} </InfoWindow>
                                                
                                            :
                                                <></>
                                            }
                                        </AdvancedMarker>
                                    ))} 
                                
                                       
                            </Map>
                        </div>
                    </APIProvider>
                </div>
                <div className="App">
                    <form onSubmit={(e) => handleWhereTo(e)}>
                        <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)}/>
                        <input type="text" value={destination} onChange={(e)=> setDestination(e.target.value)}/>
                        <input type="submit" />
                    </form>
                    
                
                    <button onClick={(e) => handleAddFriend(e)}> Add Friend </button>
                    {/* {friendBTN ? 
                        <form>
                            <input type="text" value={allFriends} onChange={(e) => handleAddFriend(e)}/>
                            <input type="submit" value="add"/>
                        </form>
                    :
                    <>
                    </> 
                    } */}
                    <button onClick={()=> handleCreateTweetBTN()}>Create Tweet</button>
                    <button onClick={()=> handleDeleteTweet()}>Delete Tweet</button>
                    <button onClick={()=> handleEditTweetBTN()}>Edit Tweet</button>
                    <button onClick={()=> handleShowFriends()}>Show Friends</button>
                    {editTweetBTN ? 
                    <form onSubmit={(e) => handleEditTweet(e)}>
                        <input type="text" name="tweet" value={editTweetMSG} placeholder={selectedTweet?.tweet} onChange={(e) => handleEditTweetMessage(e)}/>
                        <input type="submit" value="Add"/>
                    </form>
                    :
                    <></>
                    }
                    {createTweetBtn ? 
                    <form onSubmit={(e) => handleSendTweet(e)}>
                        <input type="text" name="tweet" value={newTweetMSG}  onChange={(e) => handleSetTweetMessage(e)}/>
                        <input type="submit" value="Add" />
                    </form>
                    : 
                    <></>
                    }
                    {friendBTN ? 
                    <FriendsList allFriends={allFriends} setAllFriends={setAllFriends} user={user}/>
                    :
                    <></>
                    }
                    
                    
                    <p>{clickedLatLng.lat}, {clickedLatLng.lng}</p>
                </div>
            </div>
            );
    }
    

}


  


export default App;

  

// type Point = google.maps.LatLngLiteral & {key: string}
// type Props = { points: Point[]}

// 
export function renderToDom(container: HTMLElement) {
    const root = createRoot(container);
  
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
