import { EmitEvent } from "../../enums";

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    this.message = `
      Database Error:
        ${message}
    `;
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.message = `
      Validation Error:
        ${message}
    `;
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends Error {
  statusCode = 400;
  constructor(message: string) {
    super(message);
    this.message = `
      404 Error:
        ${message}
    `;
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class UpvoteError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, UpvoteError.prototype);
  }
}

export class LoginError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, LoginError.prototype);
  }
}

export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.message = `Upload error`;
    Object.setPrototypeOf(this, UploadError.prototype);
  }
}

export function handleErrors(error: unknown) {
  if (error instanceof UploadError) {
    console.error(error.message);
    return { event: EmitEvent.uploadError, message: error.message };
  }
  if (error instanceof UpvoteError) {
    console.error(error.message);
    return { event: EmitEvent.upvoteError, message: error.message };
  }
  if (error instanceof NotFoundError) {
    console.error(error.message);
    return { event: EmitEvent.notFoundError, message: error.message };
  }
  if (error instanceof LoginError) {
    console.log(error.message);
    return { event: EmitEvent.loginError, message: `Incorrect credentials, ${error.message}`};
  }
  if (
    error instanceof DatabaseError ||
    error instanceof ValidationError
  ) {
    console.error(error.message);
    return null;
  }
  console.log(error);
  return null;
}