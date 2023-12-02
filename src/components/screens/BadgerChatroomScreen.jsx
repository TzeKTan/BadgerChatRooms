import { useEffect,useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal, TextInput, Button } from "react-native";
import BadgerChatMessage from "../helper/BadgerChatMessage";
import { ScrollView } from "react-native-gesture-handler";
import * as SecureStore from 'expo-secure-store';

function BadgerChatroomScreen(props) {
    const [page, setPage] = useState(1);
    const [messages, setMessages] = useState([]);
    const totalPages = 4;
    const [postTitle, setPostTitle] = useState("");
    const [postContent, setPostContent] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [refresh, setRefresh] = useState(false);

    console.log(props)

    useEffect(() => {
        fetch(`https://cs571.org/api/f23/hw9/messages?chatroom=${props.name}&page=${page}`, {
            headers: {
                "content-type": "application/json",
                "X-CS571-ID": "bid_0c47a04638fd0a86ab54f5c439c264073ee82bffa92f99d85adc99014524614b"
            },
            method: "GET",
        }).then(response => response.json())
            .then(data => {
                if (data) {
                    // do something with the data
                    setMessages(data.messages);
                }
            }).catch(err => {
                Alert.alert("Error fetching chatrooms!");
            })
    }, [page, refresh]);

    const loadNextPage = (nextPage) => {
        setPage(nextPage);
    }

    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    }

    const handleCreatePost = async() => {
        const token = await SecureStore.getItemAsync(props.username);

        fetch(`https://cs571.org/api/f23/hw9/messages?chatroom=${props.name}`, {
            headers: {
                "content-type": "application/json",
                "X-CS571-ID": "bid_0c47a04638fd0a86ab54f5c439c264073ee82bffa92f99d85adc99014524614b",
                "Authorization": `Bearer ${token}`
            },
            method: "POST",
            body: JSON.stringify({
                title: postTitle,
                content: postContent,
            })
        }).then(response => response.json())
            .then(data => {
                Alert.alert(data.msg);
            }).catch(err => {
                Alert.alert("Error posting!");
            })
        // Close the modal
        toggleModal();
        // Reset the page to 1
        setPage(1);
        // Reset postTitle and postContent
        setPostTitle('');
        setPostContent('');
        // force a refresh and fetch
        setRefresh(!refresh);
    }

    const handleDeletePost = async(id) => {
        const token = await SecureStore.getItemAsync(props.username);

        fetch(`https://cs571.org/api/f23/hw9/messages?id=${id}`, {
            headers: {
                "content-type": "application/json",
                "X-CS571-ID": "bid_0c47a04638fd0a86ab54f5c439c264073ee82bffa92f99d85adc99014524614b",
                "Authorization": `Bearer ${token}`
            },
            method: "DELETE",
        }).then(response => response.json())
        .then(data => {
            Alert.alert(data.msg);
        }).catch(err => {
            Alert.alert("Error deleting!");
        })
        // Reset the page to 1
        setPage(1);
        // force a refresh and fetch
        setRefresh(!refresh);
    }

    const isPreviousDisabled = page === 1;
    const isNextDisabled = page === totalPages || messages.length === 0;


    return <View style={{ flex: 1 }}>
        <ScrollView>
            {messages.length === 0 ? (
                <Text>There's nothing here!</Text>
            ) : (
            messages.map((message) => (
                <BadgerChatMessage
                key={message.id} // Assuming messages have unique IDs
                {...message}
                username={props.username}
                handleDeletePost={handleDeletePost}
                />
                ))
            )}
        </ScrollView>

        <Text style={styles.pageText}>{`Page ${page} of ${totalPages}`}</Text>

        <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.paginationButton, isPreviousDisabled && styles.disabledButton]}
          disabled={isPreviousDisabled}
          onPress={() => loadNextPage(page - 1)}
        >
        <Text style={styles.addPostText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paginationButton, isNextDisabled && styles.disabledButton]}
          disabled={isNextDisabled}
          onPress={() => loadNextPage(page + 1)}
        >
        <Text style={styles.addPostText}>Next</Text>
        </TouchableOpacity>
        </View>

        {/* render button if isGuest is false */}
        { !props.isGuest &&
        <View style={styles.addPostContainer}>
            <TouchableOpacity 
                style={styles.addButton} onPress={toggleModal}
                disabled={props.isGuest}
            >
            <Text style={styles.addPostText}>Add Post</Text>
            </TouchableOpacity>
        </View>
        }   

        <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}
        >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create a Post</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={postTitle}
              onChangeText={setPostTitle}
            />
            <TextInput
              style={[styles.input, { height: 100 }]}
              placeholder="Body"
              multiline
              value={postContent}
              onChangeText={setPostContent}
            />
            <Button
              title="Create Post"
              onPress={handleCreatePost}
              disabled={!postTitle || !postContent}
            />
            <Button title="Cancel" onPress={toggleModal} />
          </View>
        </View>
        </Modal>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    addPostContainer: {
        paddingBottom: 20,
        paddingTop: 20,
        width: '100%',
    },
    paginationButton: {
        paddingBottom: 10,
        paddingTop: 10,
        backgroundColor: 'lightblue',
        borderRadius: 5,
        width: 200,
    },
    disabledButton: {
        backgroundColor: 'lightgrey',
        alignSelf: 'strecth',
    },
    addButton: {
        bottom: 20,
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 5,
    },
    pageText: {
        alignSelf: 'center',
    },
    addPostText: {
        alignSelf: 'center',
    },
});

export default BadgerChatroomScreen;