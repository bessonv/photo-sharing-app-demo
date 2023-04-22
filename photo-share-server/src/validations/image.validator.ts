import { ValidationError } from "../helpers/errors";

export class ImageValidator {

  validateId(id: number) {
    if (!(typeof id == "number")) {
      throw new ValidationError(`Image id has wrong type ${typeof id}, must be number`);
    }
  }

  validateUrl(image_url: string) {
    if (!(typeof image_url == "string")) {
      throw new ValidationError(`Image url has wrong type ${typeof image_url}, must be string`);
    }
  }
}
