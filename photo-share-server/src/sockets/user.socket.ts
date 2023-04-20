import { Socket } from "socket.io";
import { EmitEvent, ReciveEvent } from "../../enums";
import { UserController } from "../controllers/user.controller";
import { Database } from "sqlite3";


export function configurateUserSocket(socket: Socket, database: Database) {
  const userController = new UserController(database);

  socket.on(ReciveEvent.login, async (data) => {
    try {
      const user = await userController.logUser(data.username, data.password);
      socket.emit(EmitEvent.loginSuccess, {
        message: "Login successfully",
        data: {
          _id: user.user_id,
          _email: user.email,
        },
      });
    } catch(error) {
      return socket.emit("loginError", "Incorrect credentials");
    }
  });

  socket.on(ReciveEvent.register, async (data) => {
    try {
      await userController.registerUser(data.email, data.username, data.password);
      return socket.emit(EmitEvent.registerSuccess, "Account created successfully!");
    } catch(error) {
      return socket.emit(EmitEvent.registerError, error);
    }
  });  
}
