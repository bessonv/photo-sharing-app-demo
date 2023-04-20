import { Socket } from "socket.io";
import { EmitEvent, ReciveEvent } from "../../enums";
import { UserController } from "../controllers/user.controller";
import { Database } from "sqlite3";
import { DatabaseError, LoginError, NotFoundError, ValidationError } from "../helpers/errors";


export function configurateUserSocket(socket: Socket, database: Database) {
  try {
    const userController = new UserController(database);

    socket.on(ReciveEvent.login, async (data) => {
      const user = await userController.logUser(data.username, data.password);
      socket.emit(EmitEvent.loginSuccess, {
        message: "Login successfully",
        data: {
          _id: user.user_id,
          _email: user.email,
        },
      });
    });

    socket.on(ReciveEvent.register, async (data) => {
      await userController.registerUser(data.email, data.username, data.password);
      return socket.emit(EmitEvent.registerSuccess, "Account created successfully!");
    });
  } catch(error) {
    if (error instanceof LoginError) {
      console.log(error.message);
      return socket.emit(EmitEvent.loginError, `Incorrect credentials, ${error.message}`);
    }
    if (error instanceof NotFoundError) {
      console.error(error.message);
      return socket.emit(EmitEvent.notFoundError, {
        error_message: error.message
      });
    }
    if (
      error instanceof DatabaseError ||
      error instanceof ValidationError
    ) {
      console.error(error.message);
      return;
    }
  }
}
