type Image = {
  image_id?: number,
  image_url: string,
  vote_count: number,
  user_id: number,
  // votedUsers: string[],
  // _ref: string
}

type User = {
  user_id?: number,
  username: string,
  password: string,
  email: string,
  // images: Image[]
}

type Vote = {
  vote_id: number,
  user_id: number,
  image_id: number,
  value: -1 | 0 | 1
}
