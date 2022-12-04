import { useState, useEffect, useContext } from 'react';
import { SocketContext } from './socket';

function Chatroom() {
    //Get the socket out from the useContext
    const socket = useContext(SocketContext);

    //UseState to store the name and message inputs of the user, you can use Redux here whatever you want
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    //The messages will be stored in an array, which starts out empty. Note: through this whole file I use message and messages, keep in mind that one is plural!
    //Message (singular) is used for the input of the user, and is a string
    //Messages (plural) is used to store all messages that are known to the server, and is an array
    const [messages, setMessages] = useState([]);

    //We need to use a useEffect. Why? We declare whatever should happen when the socket is receiving a message. If we would not wrap this in useEffect
    //the logic would be applied every time the component is rendering again. In order to avoid messages from appearing more than once after multiple renders,
    //we want to wrap this in useEffect.
    useEffect(() => {
        //socket has two methods: "on" and "emit"
        //socket.emit can be used to send something. In this case we send a request client > server
        //we use "getPreviousMessages" to get all messages that were stored in the server, the ones before the client connected.
        //The way "getPreviousMessages" is used here is really similar to making a standard GET request. We only want to do this
        //the first time though. Alternatively, I could have used a new useEffect.
        if (!messages || messages.length === 0) {
            socket.emit('getPreviousMessages');
        }

        //Next, we are going to declare what should happen when we receive something server > client
        socket.on('receivePreviousMessages', (oldMessages) => {
            //We want to add all the previous messages to the array.
            const newMessages = [];
            oldMessages.map((i) => {
                //For each stored previous message, we are going to push the item into the newMessages array
                newMessages.push(i);
            });
            //Next we change the state of our empty array (from line 15)
            setMessages(newMessages);
        });

        socket.on('receiveMessage', (name, message) => {
            const newMessage = { name, message };
            //similarly as to "receivePreviousMessages" we are going to add the new message to the array (from line 15)
            setMessages([...messages, newMessage]);
        });

        //And that is it for the useEffect! To summarize: we make a request to get all previous messages, next we use the response to place the new ones
        //and finally, we also declare what should happen when a single message is received from the server.
    }, [messages]);
    //Note: messages is a dependency here (it is inside the array), why? Every time a new message is received, the endpoint
    //is looking at "messages" (from line 15). Because the state of messages is being updated after every received message, we also
    //need to update the socket endpoint itself. If messages is inside the array, the update will happen
    //every time a message is received.

    //The final thing we need to do is to make a function that is being activated when the button is pressed. I will name this sendMessage.
    const sendMessage = () => {
        //we emit client > server on the socket endpoint of "sendMessage"
        socket.emit('sendMessage', name, message);
        //Name and message is refering here to the name and message from the useState in lines 9 and 10. Compare it to a POST request.
        //Note that this is DIFFERENT from the usage in line 39 (ask me if you need help, I messed up the naming there a bit for clearence.
    };

    return (
        <>
            {/* Input for name */}
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
            />
            {/* Input for message */}
            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message"
            />
            {/* Button for sending the message */}
            <button onClick={() => sendMessage()}>Send message</button>

            {/* Mapping over the messages, this will update whenever a new message is being sent */}
            {messages.map((i, index) => {
                return (
                    <div key={index}>
                        <h1>{i.name}</h1> {i.message}
                    </div>
                );
            })}
        </>
    );
}

export { Chatroom };
