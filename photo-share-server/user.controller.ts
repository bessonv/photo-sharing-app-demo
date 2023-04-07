interface UserController {
  // model: UserModel;

  addUser(user: User): void;
  
}

class UserController implements UserController {
  constructor() {
    // this.model = 1;
  }

  addUser(user: User) {
    return;
  }
}

module.exports = UserController;