
export function getAuthentificationId(): false | string {
  const id = localStorage.getItem("_id");
  return !id ? false : id;
}
