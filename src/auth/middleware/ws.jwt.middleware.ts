import { Socket } from 'socket.io';

export const WebsocketJwtMiddleware: any = () => {
  return (_: Socket, next: any) => {
    try {
      next();
    } catch (error) {
      next(error);
    }
  };
};
