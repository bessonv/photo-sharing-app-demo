import { ValidationError } from "../helpers/errors";

export class UserValidator {

  validateId(userId: number) {
    if (!(typeof userId == "number")) {
      throw new ValidationError(`User Id has wrong type ${typeof userId}, must be number`);
    }
  }

  validateName(username: string) {
    if (!(typeof username == "string")) {
      throw new ValidationError(`Username has wrong type ${typeof username}, must be string`);
    }
  }

  validatePassword(password: string) {
    if (!(typeof password == "string")) {
      throw new ValidationError(`Password has wrong type ${typeof password}, must be string`);
    }
  }

  validateEmail(email: string) {
    if (!(typeof email == "string")) {
      throw new ValidationError(`Email has wrong type ${typeof email}, must be string`);
    }
    const ifValidEmail = email.toLowerCase().match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    if (!ifValidEmail) {
      throw new ValidationError(`Email address has wrong format ${email}`);
    }
  }
}
