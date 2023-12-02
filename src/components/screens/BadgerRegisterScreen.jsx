import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useState } from "react";
import * as SecureStore from 'expo-secure-store';


function BadgerRegisterScreen(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
        <Text>Username</Text>
        <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input}/>
        <Text>Password</Text>
        <TextInput placeholder="Password" value={password} secureTextEntry={true} onChangeText={setPassword} style={styles.input}/>
        <Text>Confirm Password</Text>
        <TextInput placeholder="Confirm Password" value={passwordConfirm} secureTextEntry={true} onChangeText={setPasswordConfirm} style={styles.input}/>
        <Button color="crimson" title="Signup" onPress={() => {
            if (password !== passwordConfirm) {
                Alert.alert("Passwords do not match!");
                return;
            }
            Alert.alert("Signing up...")
            fetch("https://cs571.org/api/f23/hw9/register", {
            headers: {
                "Content-Type": "application/json",
                "X-CS571-ID" : "bid_0c47a04638fd0a86ab54f5c439c264073ee82bffa92f99d85adc99014524614b"
            },
            method: "POST",
            body: JSON.stringify({
                username: username,
                password: password,
            })
            }).then(response => response.json())
            .then(data => {
                if (data.msg === "Successfully authenticated.") {
                    props.handleSignup(username, password);
                    // use expo-secure-store to store the JWT
                    SecureStore.setItemAsync(data.user.username, data.token);
                } else {
                    Alert.alert(data.msg);
                }
            })
        }
        } />
        <Button color="grey" title="Nevermind!" onPress={() => props.setIsRegistering(false)} />
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

export default BadgerRegisterScreen;