export function setAuthentificationId(id: number) {
  localStorage.setItem("_id", id.toString());
}

export function setAuthentificationEmail(email: string) {
  localStorage.setItem("_myEmail", email);
}

export function getAuthentificationId(): null | number {
  const id = localStorage.getItem("_id");
  return !id ? null : parseInt(id);
}

export function getAuthentificationEmail(): null | string {
  const email = localStorage.getItem("_myEmail");
  return !email ? null : email;
}

export function removeAuthentificationIdEmail() {
  localStorage.removeItem("_id");
  localStorage.removeItem("_myEmail");
}
