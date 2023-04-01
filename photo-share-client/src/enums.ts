export enum EmitEvent {
  login = 'login',
  register = 'register',
  getMyPhotos = 'getMyPhotos',
  sharePhoto = 'sharePhoto',
  photoUpvote = 'photoUpvote',
  allPhotos = 'allPhotos',
  uploadPhoto = 'uploadPhoto',
}

export enum ReciveEvent {
  loginSuccess = 'loginSuccess',
  loginError = 'loginError',
  registerSuccess = 'registerSuccess',
  registerError = 'registerError',
  getMyPhotosMessage = 'getMyPhotosMessage',
  upvoteSuccess = 'upvoteSuccess',
  upvoteError = 'upvoteError',
  allPhotosMessage = 'allPhotosMessage',
  sharePhotoMessage = 'sharePhotoMessage',
  uploadPhotoMessage = 'uploadPhotoMessage',
}