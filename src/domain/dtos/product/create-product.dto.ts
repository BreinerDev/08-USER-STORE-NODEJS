import { Validators } from "../../../config";

export class CreateProductDto {
  private constructor(
    public readonly name: string,
    public readonly available: boolean,
    public readonly price: number,
    public readonly description: string,
    public readonly user: string,
    public readonly category: string
  ) {}

  static create(props: { [key: string]: any }): [string?, CreateProductDto?] {
    const {
      name,
      available = false,
      price,
      description,
      user,
      category,
    } = props;

    if (!name) return ["Missing name"];
    if (!user) return ["Missing user"];
    if (!Validators.isMondoID(user)) return ["Invalid User ID"];

    if (!category) return ["Missing category"];
    if (!Validators.isMondoID(category)) return ["Invalid Category ID"];

    return [
      undefined,
      new CreateProductDto(
        name,
        !!available,
        price,
        description,
        user,
        category
      ),
    ];
  }
}
