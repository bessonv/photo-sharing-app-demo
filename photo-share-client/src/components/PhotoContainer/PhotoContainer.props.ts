import { Socket } from "socket.io-client"; 

interface PhotoContainerProps {
  socket: Socket,
  photos: Photo[]
}

export default PhotoContainerProps;