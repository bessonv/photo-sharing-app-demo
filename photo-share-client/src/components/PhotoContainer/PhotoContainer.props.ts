import { Socket } from "socket.io-client"; 

interface PhotoContainerProps {
  socket: Socket,
  photos: Image[]
}

export default PhotoContainerProps;