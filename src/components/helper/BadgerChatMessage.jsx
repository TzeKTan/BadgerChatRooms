import { Text, Touchable, StyleSheet } from "react-native";
import BadgerCard from "./BadgerCard"
import { TouchableOpacity } from "react-native-gesture-handler";

function BadgerChatMessage(props) {

    const isOwner = props.poster === props.username;

    const dt = new Date(props.created);

    return <BadgerCard style={{ marginTop: 16, padding: 8, marginLeft: 8, marginRight: 8 }}>
        <Text style={{fontSize: 28, fontWeight: 600}}>{props.title}</Text>
        <Text style={{fontSize: 12}}>by {props.poster} | Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</Text>
        <Text></Text>
        <Text>{props.content}</Text>
        {/* render delete button if the post is from the user */}
        {isOwner && <TouchableOpacity style={styles.deleteButton} onPress={() => {
            props.handleDeletePost(props.id)}
            }
             >
            <Text style={styles.deleteText}>DELETE POST</Text>
            </TouchableOpacity>}
    </BadgerCard>
}

const styles = StyleSheet.create({
    deleteButton: {
        backgroundColor: "#ff0000",
        padding: 8,
        borderRadius: 4,
        marginTop: 8,
        width: '100%',
        alignItems: "center"
    },
    deleteText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16
    }
});

export default BadgerChatMessage;