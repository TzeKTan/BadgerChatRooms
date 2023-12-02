import { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from 'react-native';

import * as SecureStore from 'expo-secure-store';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';
import BadgerConversionScreen from './screens/BadgerConversionScreen';


const ChatDrawer = createDrawerNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [username, setUsername] = useState("");
  const [isGuest, setIsGuest] = useState(false);

  console.log("Username is: " + username);
  console.log("Is logged in: " + isLoggedIn);
  console.log("Is guest: " + isGuest);
  console.log("Is registering: " + isRegistering);

  useEffect(() => {
    // hmm... maybe I should load the chatroom names here
    fetch("https://cs571.org/api/f23/hw9/chatrooms", {
      headers: {
        "X-CS571-ID" : "bid_0c47a04638fd0a86ab54f5c439c264073ee82bffa92f99d85adc99014524614b"
      },
      method: "GET",
    }).then(response => response.json())
    .then(data => {
      if (data){
        setChatrooms(data);
      }
    }).catch(err => {
      Alert.alert("Error fetching chatrooms!");
    })
  }, []);

  function handleLogin(username, password) {
    // hmm... maybe this is helpful!
    // fetch is done in child
    setIsLoggedIn(true); // I should really do a fetch to login first!
    setUsername(username);
  }

  function handleSignup(username, password) {
    // hmm... maybe this is helpful!
    // fetch is done in child
    setIsLoggedIn(true); // I should really do a fetch to register first!
    setUsername(username);
  }

  function handleLogout() {
    console.log("Logged out!");
    SecureStore.deleteItemAsync(username);
    setIsLoggedIn(false); 
    setUsername("");
    
  }

  function handleGuest() {
    setIsGuest(true);
  }

  if (isLoggedIn || isGuest) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} username={username} isGuest={isGuest}/>}
              </ChatDrawer.Screen>
            })
          }
          {/*render conversion instead of logout when user isGues*/}
          { isGuest ? 
          <ChatDrawer.Screen name="Signup" >
            {(props) => <BadgerConversionScreen setIsRegistering={setIsRegistering} setIsGuest={setIsGuest}/>}
          </ChatDrawer.Screen>
          :
          <ChatDrawer.Screen name="Logout" >
            {(props) => <BadgerLogoutScreen handleLogout={handleLogout}/>}
          </ChatDrawer.Screen>
          }   
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} />
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} handleGuest={handleGuest}/>
  }
}