import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import * as SecureStore from 'expo-secure-store';


function BadgerLoginScreen(props) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
        <Text>Username</Text>
        <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input}/>
        <Text>Password</Text>
        <TextInput placeholder="Password" value={password} secureTextEntry={true} onChangeText={setPassword} style={styles.input}/>
        <Button color="crimson" title="Login" onPress={() => {
            fetch("https://cs571.org/api/f23/hw9/login", {
                headers: {
                    "Content-Type": "application/json",
                    "X-CS571-ID" : "bid_0c47a04638fd0a86ab54f5c439c264073ee82bffa92f99d85adc99014524614b"
                },
                method: "POST",
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }).then(response => response.json())
            .then(data => {
                if (data.msg === "Successfully authenticated.") {
                    props.handleLogin(username, password);           
                    // use expo-secure-store to store the JWT
                    SecureStore.setItemAsync(data.user.username, data.token);
                } else {
                    Alert.alert(data.msg);
                }
            })
        }} />
        <Button color="grey" title="Signup" onPress={() => props.setIsRegistering(true)} />
        <Button color="grey" title="Continue as guest" onPress={() => props.handleGuest()} />
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input:{
        width: '80%',
        padding: 10,
        marginVertical: 10,
        borderBottomColor: 'black',
        borderWidth: 1, 
    }
});

export default BadgerLoginScreen;