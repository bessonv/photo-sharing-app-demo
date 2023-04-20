export enum ReciveEvent {
  login = 'login',
  register = 'register',
  getMyPhotos = 'getMyPhotos',
  sharePhoto = 'sharePhoto',
  photoUpvote = 'photoUpvote',
  allPhotos = 'allPhotos',
  uploadPhoto = 'uploadPhoto',
}

export enum EmitEvent {
  loginSuccess = 'loginSuccess',
  loginError = 'loginError',
  registerSuccess = 'registerSuccess',
  registerError = 'registerError',
  getMyPhotosMessage = 'getMyPhotosMessage',
  upvoteSuccess = 'upvoteSuccess',
  upvoteError = 'upvoteError',
  uploadError = 'uploadError',
  notFoundError = 'notFoundError',
  allPhotosMessage = 'allPhotosMessage',
  sharePhotoMessage = 'sharePhotoMessage',
  uploadPhotoMessage = 'uploadPhotoMessage',
}
