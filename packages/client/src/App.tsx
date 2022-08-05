import { useEffect, useState } from 'react';
import { connect, Socket } from 'socket.io-client';
import HomePage from './pages/HomePage';

import './App.css';
import 'papercss/dist/paper.min.css';
import FloatingMenu from './components/FloatingMenu';

function App() {
  const [urlParams, setUrlParams] = useState<URLSearchParams>();
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setUrlParams(params);
  }, []);

  useEffect(() => {
    const newSocket = connect('http://localhost:8090', {
      transports: ['websocket'],
    });
    setSocket(newSocket);
  }, [setSocket]);

  return (
    <div className="App">
      <FloatingMenu />
      <HomePage socket={socket} urlParams={urlParams} />
    </div>
  );
}

export default App;
