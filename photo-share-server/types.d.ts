type Image = {
  image_id?: number,
  image_url: string,
  vote_count: number,
  user_id: number,
}

type User = {
  user_id?: number,
  username: string,
  password: string,
  email: string,
}

type Vote = {
  vote_id: number,
  user_id: number,
  image_id: number,
  value: -1 | 0 | 1
}

interface appSocket {
  database: Database;
  socket: Socket;

  configurateSocket(event: string, data: any): void;
}
