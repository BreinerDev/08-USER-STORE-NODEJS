import { CategoryModels } from "../../data";
import {
  CategoryEntity,
  CreateCategoryDto,
  CustomError,
  PaginationDto,
  UserEntity,
} from "../../domain";

export class CategoryService {
  // DI
  constructor() {}

  public async createCategory(
    createCategoryDto: CreateCategoryDto,
    user: UserEntity
  ) {
    const existCategory = await CategoryModels.findOne({
      name: createCategoryDto.name,
    });

    if (existCategory) throw CustomError.badRequest("Category already exist");

    try {
      const category = new CategoryModels({
        ...createCategoryDto,
        user: user.id,
      });

      await category.save();

      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      throw CustomError.internalServer(`${error}`);
    }
  }

  public async getCategory({ page, limit }: PaginationDto) {
    try {
      const [total, categories] = await Promise.all([
        CategoryModels.countDocuments(),
        await CategoryModels.find()
          .skip((page - 1) * limit)
          .limit(limit),
      ]);

      return {
        page,
        limit,
        total,
        next: `/api/categories?page=${page + 1}&limit=${limit}`,
        prev:
          page - 1 > 0
            ? `/api/categories?page=${page - 1}&limit=${limit}`
            : null,
        categories: categories.map(CategoryEntity.fromObject),
      };
    } catch (error) {
      throw CustomError.internalServer();
    }
  }
}
