type Photo = {
  id: string,
  image_url: string,
  vote_count: number,
  vote_users?: string[],
  _ref: string
}

type User = {
  id: string,
  username: string,
  password: string,
  email: string,
  images: Photo[]
}
