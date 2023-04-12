type Photo = {
  image_id: number,
  image_url: string,
  vote_count: number,
  user_id: number
}

type User = {
  user_id: number,
  username: string,
  password: string,
  email: string,
  images: Photo[]
}
