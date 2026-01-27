import { EventEmitter } from 'events';
import { Router } from 'mediasoup/node/lib/RouterTypes';
import { ROOM_STATE_EVENTS } from '../constants/state/room-event.state';

export default class RoomState extends EventEmitter {
  id: string;
  name: string;
  router: Router;
  autoAccept: boolean;
  peers: Map<string, any>;

  constructor(id: string, name: string, router: Router, autoAccept = false) {
    super();
    this.id = id;
    this.name = name;
    this.router = router;
    this.autoAccept = autoAccept;
    this.peers = new Map();
  }

  destroy(): void {
    // this.getAllPeers(undefined).forEach((peer: Peer) => {
    //   peer.close();
    // });
    this.router.close();

    // this is for clean up
    this.emit(ROOM_STATE_EVENTS.DESTROY);
  }
}
