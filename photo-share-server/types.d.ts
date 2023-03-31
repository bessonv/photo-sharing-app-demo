type Image = {
  id: string,
  image_url: string,
  vote_count: 0,
  votedUsers: string[],
  _ref: string
}

type User = {
  id: string,
  username: string,
  password: string,
  email: string,
  images: Image[]
}
