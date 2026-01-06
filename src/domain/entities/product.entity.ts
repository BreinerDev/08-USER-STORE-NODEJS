import { CustomError } from "../errors/custom.error";

interface IProduct {
  id: string;
  name: string;
  available: boolean;
  price: number;
  description: string;
  user: string;
  category: string;
}

export class ProductEntity {
  constructor(
    public id: string,
    public name: string,
    public available: boolean,
    public price: number,
    public description: string,
    public user: string,
    public category: string
  ) {}

  static fromObject(object: { [key: string]: any }): IProduct {
    const { id, _id, name, available, price, description, user, category } =
      object;

    if (!_id && !id) throw CustomError.badRequest("Missing id");
    if (!name) throw CustomError.badRequest("Missing name");
    if (!available) throw CustomError.badRequest("Missing available");
    if (!price) throw CustomError.badRequest("Missing price");
    if (!description) throw CustomError.badRequest("Missing description");
    if (!user) throw CustomError.badRequest("Missing user");
    if (!category) throw CustomError.badRequest("Missing category");

    return new ProductEntity(
      _id || id,
      name,
      available,
      price,
      description,
      user,
      category
    );
  }
}
