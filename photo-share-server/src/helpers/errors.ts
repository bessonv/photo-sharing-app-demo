
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
