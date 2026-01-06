import { Request, Response } from "express";
import { CustomError, CreateCategoryDto, PaginationDto } from "../../domain";
import { CategoryService } from "../services";

export class CategoryController {
  //DI
  constructor(private readonly categoryService: CategoryService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);
    return res.status(500).json({ error: "Internal server error" });
  };

  getCategories = (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    const [error, paginationDto] = PaginationDto.static(+page, +limit);

    if (error) return res.status(400).json(error);

    this.categoryService
      .getCategory(paginationDto!)
      .then((categories) => res.status(200).json(categories))
      .catch((error) => this.handleError(error, res));
  };

  createCategory = (req: Request, res: Response) => {
    const [error, createCategoryDto] = CreateCategoryDto.create(req.body);

    if (error) return res.status(400).json({ error });

    this.categoryService
      .createCategory(createCategoryDto!, req.body.user)
      .then((category: any) => res.json(category))
      .catch((error) => this.handleError(error, res));
  };
}
