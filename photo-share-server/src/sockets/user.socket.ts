import { Socket } from "socket.io";
import { EmitEvent, ReciveEvent } from "../../enums";
import { UserController } from "../controllers/user.controller";
import { Database } from "sqlite3";

export class UserSocket implements appSocket {
  database: Database;
  socket: Socket;

  constructor(db: Database, socket: Socket) {
    this.database = db;
    this.socket = socket;
  }

  async configurateSocket(event: string, data: any) {
    const userController = new UserController(this.database);
    
    if (event === ReciveEvent.login) {
      const user = await userController.logUser(data.username, data.password);
      this.socket.emit(EmitEvent.loginSuccess, {
        message: "Login successfully",
        data: {
          _id: user.user_id,
          _email: user.email,
        },
      });
    }
    if (event === ReciveEvent.register) {
      await userController.registerUser(data.email, data.username, data.password);
      this.socket.emit(EmitEvent.registerSuccess, "Account created successfully!");
    }
  }
}
