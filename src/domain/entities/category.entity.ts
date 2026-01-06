import { CustomError } from "../errors/custom.error";

interface ICategory {
  id: string;
  name: string;
  available: boolean;
}

export class CategoryEntity {
  //   constructor(public OBJ: ICategory) {}
  constructor(
    public id: string,
    public name: string,
    public available: boolean
  ) {}

  static fromObject(object: { [key: string]: any }): ICategory {
    const { id, _id, name, available } = object;

    if (!_id && !id) throw CustomError.badRequest("Missing id");
    if (!name) throw CustomError.badRequest("Missing name");

    // return new CategoryEntity({ id: _id || id, name, available });
    return new CategoryEntity(_id || id, name, available);
  }
}
