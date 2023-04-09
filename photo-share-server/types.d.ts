type Image = {
  id?: number,
  image_url: string,
  vote_count: 0,
  user_id: number,
  // votedUsers: string[],
  _ref: string
}

type User = {
  id?: number,
  username: string,
  password: string,
  email: string,
  // images: Image[]
}
