import { WebSocketServer, createWebSocketStream } from 'ws';
import * as net from 'net';


// We Allow configuration through environmental variables.
// If a MPD_UNIX_SOCKET is set it will override the host and port combination.
const MPD_HOST = process.env.MPD_HOST ?? 'localhost';
const MPD_PORT = parseInt(process.env.MPD_PORT ?? '6600');
const MPD_UNIX_SOCKET = process.env.MPD_UNIX_SOCKET;


const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  const webSocket = createWebSocketStream(ws, {decodeStrings: false});

  webSocket.on('error', console.error);
  const mpdSocket = MPD_UNIX_SOCKET ? 
    net.connect(MPD_UNIX_SOCKET) :  
    net.connect(MPD_PORT, MPD_HOST);
  mpdSocket.setEncoding('utf-8')

  webSocket.pipe(mpdSocket);
  mpdSocket.pipe(webSocket);
});