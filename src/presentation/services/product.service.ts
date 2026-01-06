import { ProductModels } from "../../data";
import { CreateProductDto, CustomError, PaginationDto } from "../../domain";

export class ProductService {
  // DI
  constructor() {}

  public async createProduct(createProductDto: CreateProductDto) {
    const existProduct = await ProductModels.findOne({
      name: createProductDto.name,
    });

    if (existProduct) throw CustomError.badRequest("Product already exist");

    try {
      const product = new ProductModels(createProductDto);

      await product.save();

      return product;
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async getProducts({ page, limit }: PaginationDto) {
    try {
      const [total, products] = await Promise.all([
        ProductModels.countDocuments(),
        await ProductModels.find()
          .skip((page - 1) * limit)
          .limit(limit),
        // TODO: populate
      ]);

      return {
        page,
        limit,
        total,
        next: `/api/products?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0 ? `/api/products?page=${page - 1}&limit=${limit}` : null,
        products: products,
      };
    } catch (error) {
      throw CustomError.internalServer();
    }
  }
}
