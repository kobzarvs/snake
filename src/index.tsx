import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {App} from './App';
// import {app} from './pixi/base/application';
// import {AppProvider} from '@inlet/react-pixi';
import Peer, {DataConnection} from 'peerjs';
// import Peer from 'simple-peer';

const isProd = process.env.NODE_ENV === 'production';

const peer = new Peer({
  host: isProd ? 'snake.3dstyle.net' : 'localhost',
  port: isProd ? 443 : 9000,
  config: {
    iceServers: [
      // {urls: 'stun:stun01.sipphone.com'},
      // {urls: 'stun:stun.ekiga.net'},
      // {urls: 'stun:stun.fwdnet.net'},
      // {urls: 'stun:stun.ideasip.com'},
      // {urls: 'stun:stun.iptel.org'},
      // {urls: 'stun:stun.rixtelecom.se'},
      // {urls: 'stun:stun.schlund.de'},
      // {urls: 'stun:stun.l.google.com:19302'},
      // {urls: 'stun:stun1.l.google.com:19302'},
      // {urls: 'stun:stun2.l.google.com:19302'},
      // {urls: 'stun:stun3.l.google.com:19302'},
      // {urls: 'stun:stun4.l.google.com:19302'},
      // {urls: 'stun:stunserver.org'},
      // {urls: 'stun:stun.softjoys.com'},
      // {urls: 'stun:stun.voiparound.com'},
      // {urls: 'stun:stun.voipbuster.com'},
      // {urls: 'stun:stun.voipstunt.com'},
      // {urls: 'stun:stun.voxgratia.org'},
      // {urls: 'stun:stun.xten.com'},
      {
        urls: 'turn:numb.viagenie.ca',
        credential: 'muazkh',
        username: 'webrtc@live.com',
      },
      {
        urls: 'turn:192.158.29.39:3478?transport=udp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808',
      },
      {
        urls: 'turn:192.158.29.39:3478?transport=tcp',
        credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
        username: '28224511:1379330808',
      },
    ],
  },
  secure: isProd,
});

// @ts-ignore
window.peer = peer;
// @ts-ignore
window.Peer = Peer;

let peers: { conn: { [key: string]: DataConnection } } = {
  conn: {},
};
// @ts-ignore
window.peers = peers;

const bindConnection = (conn: DataConnection) => {
  const id = conn.peer;
  conn.on('open', () => {
    console.log('%c- conn.on.open', 'color:blue', conn.open, id);
    peers.conn[id].send(`Hello from ${peer.id}`);
  });
  conn.on('data', (e) => {
    console.log('%c- conn.on.data', 'color:blue', e);
  });
  conn.on('close', () => {
    console.log('%c- conn.on.close', 'color:red');
  });
  conn.on('error', (err) => {
    console.error('- conn.on.error', err);
  });
}

peer.on('connection', (conn) => {
  const destId = conn.peer;
  console.log(`%cpeer.on.connection from ${destId}`, 'color:darkgreen');
  bindConnection(conn);
  peers.conn[destId] = conn;
});

peer.on('open', id => {
  console.log('%cpeer.on.open', 'color:green', id);
  // peer.listAllPeers(ids => {
  //   for (id of ids) {
  //     if (id === peer.id) continue;
  //     // peer.connect(id);
  //   }
  // });
});

peer.on('call', (mc) => {
  console.log('%cpeer.on.call', 'color:orange', mc);
});

peer.on('close', () => {
  peers.conn = {};
  console.log('%cpeer.on.close', 'color:red');
});

peer.on('disconnected', () => {
  peers.conn = {};
  console.log('%cpeer.on.disconnected', 'color:red');
});

peer.on('error', err => console.error(err));

// @ts-ignore
peer.socket.on('message', (message) => {
  switch (message.type) {
    case 'SNAKE/ADD_PEER': {
      console.log(message);
      const id = message.payload;
      console.log('%cpeer.connect', 'color:#03c700', id);
      peers.conn[id] = peer.connect(id);
      bindConnection(peers.conn[id]);
      break;
    }
    case 'SNAKE/REMOVE_PEER': {
      console.log(message);
      const id = message.payload;
      // @ts-ignore
      delete peers.conn[id];
      break;
    }
  }
});


ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
