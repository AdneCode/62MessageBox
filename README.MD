# Tutorial on Socket IO chatbox

### Info

The repo contains a _server_ and a _client_ folder. The client started out as a "create-react-app". The server is a standard Codaisseur Express server combined with the socket IO server. The messagebox itself is global, which means it runs on the complete website. It also means that the connection is made once, so refreshing is not allowed without leaving the chatroom first. If you want a room specific messagebox or you want to get rid of the refresh thing, then send me a message in Slack or fix it yourself. Also if you have questions just ask, holy.

To run the repo itself, visit the _server_ folder and use
`npm install`. Then run the server using `npx nodemon`.

Next, in a different terminal, visit the _client_ folder and use once again `npm install` followed by `npm start`.

### Steps to reproduce

In your client folder, you need to install the `socket.io-client` package by using `npm install socket.io-client`. Keep in mind that you use a different package for the server!

First, we are going to add a SocketContext to the whole application. This is a little bit similar to providing the store through your whole application. Create a new file in `src/components`, I will name this file `socket.js`, but of course you can name it cow, pig, sheep whatever you like.

# socket.js

    import io from 'socket.io-client';
    import { apiUrl } from '../../config/constants';

    export const socket = io(socketUrl, {
    transports: ['websocket'],
    });
    export const SocketContext = React.createContext(socket);

Import the newly created socket and SocketContext in index.js, the one in the root of your project. Make sure it is at the top!

# index.js

    import { socket, SocketContext } from './components/socket';

Next, we wrap the App component around the newly created SocketContext. Compared this to how we apply the Provider when using Redux. **I am not using Redux in my example, but you might want to use this yourself (for example to store the messages that are provided). If that is the case, make sure to place the Provider from Redux on the outside of the SocketContext**

# index.js (without Redux)

    //<Provider store={store}>
    <SocketContext.Provider value={socket}>
                <App />
    </SocketContext.Provider>
    // </Provider>

Next, a component will be created `Chatroom.js`.
Of course you can name it and place it in any way you want, for now I place it in the root of the components folder. For the Chatroom, you definitely require to import useContext and useEffect. In addition to these two hooks, I will also use useState to store the messages (both placed and received messages). However, depending on what you want to do with your Chatroom, it can be recommended to use useDispatch here instead in order to store the messages in your Redux store.

My Chatroom.js starts out like this

# src/components/Chatroom.js

    import { useState, useEffect, useContext } from 'react';
    import { SocketContext } from './socket';

    function Chatroom() {
    const socket = useContext(SocketContext);
    return <></>;
    }

    export { Chatroom };

In your server folder, you need to install the `socket.io` package by using `npm install socket.io`
