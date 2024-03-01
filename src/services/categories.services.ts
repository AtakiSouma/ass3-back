import HttpStatusCodes from "../constants/HttpStatusCodes";
import { generateError } from "../libs/handlers/errorsHandlers";
import { Categories } from "../models/Categories";
import { Orchids } from "../models/Orchid";
import GenerateSlug from "../util/GenerateSlug";

interface IdParams {
  id: string;
}
interface SlugParams {
  slug: string;
}
interface ICategories {
  name: string;
  slug?: string;
  description: string;
  status?: boolean;
  id?: string;
}
interface IUpdateCategories {
  id: string;
  name: string;
  description: string;
}
interface IUpdateCategoriesBySlug {
  slug: string;
  name: string;
  description: string;
}

class CategoriesServices {
  private async checkExistCategoriesWithId({ id }: ICategories) {
    const existCategory = await Categories.findById({ _id: id });
    if (existCategory) {
      throw generateError(`${name} already exists !`, HttpStatusCodes.CONFLICT);
    } else {
      return true;
    }
  }

  public async createNewCategories({ name, description }: ICategories) {
    const existCategory = await Categories.findOne({
      name: name,
    });
    if (existCategory) {
      throw generateError(`${name} already exists !`, HttpStatusCodes.CONFLICT);
    }
    const newCategory = await Categories.create({
      name: name,
      slug: GenerateSlug(name),
      description: description,
    });
    return newCategory;
  }

  public async updateCategoriesById({
    id,
    name,
    description,
  }: IUpdateCategories) {
    const existCategory = await Categories.findOne({
      _id: id,
    });
    if (!existCategory) {
      throw generateError(`Category not found!`, HttpStatusCodes.NOT_FOUND);
    }
    const updatedCategory = await Categories.findByIdAndUpdate(
      { _id: id },
      {
        name: name,
        description: description,
      }
    );
    return updatedCategory;
  }

  public async updateCategoriesBySlug({
    slug,
    name,
    description,
  }: IUpdateCategoriesBySlug) {
    const existCategory = await Categories.findOne({
      slug: slug,
    });
    if (existCategory) {
      existCategory.name = name || existCategory.name;
      existCategory.description = description || existCategory.description;
    }
    const updatedCategory = await existCategory?.save();
    return updatedCategory;
  }

  public async getOneCategoryById({ id }: IdParams) {
    const existCategory = await Categories.findOne({
      _id: id,
    });
    if (!existCategory) {
      throw generateError(`Category not found!`, HttpStatusCodes.NOT_FOUND);
    }
    return existCategory;
  }

  public async getOneCategoryBySlug({ slug }: SlugParams) {
    const existCategory = await Categories.findOne({
      slug: slug,
    });
    if (!existCategory) {
      throw generateError(`Category not found!`, HttpStatusCodes.NOT_FOUND);
    }
    return existCategory;
  }

  public async DeleteOneCategoryBySlug({ slug }: SlugParams) {
    const existCategory = await Categories.findOne({
      slug: slug,
    });
    if (!existCategory) {
      throw generateError(`Category not found!`, HttpStatusCodes.NOT_FOUND);
    }
    await Categories.findOneAndDelete({
      slug: slug,
    });
    return true;
  }

  public async DeleteOneCategoryById({ id }: IdParams) {
    const existCategory = await Categories.findOne({
      _id: id,
    });
    if (!existCategory) {
      throw generateError(`Category not found!`, HttpStatusCodes.NOT_FOUND);
    }
    await Categories.findByIdAndDelete({
      _id: id,
    });
    return true;
  }
  public async getAllCategories(search: string, page: number, limit: number) {
    // const allCategories = await Categories.find();
    // return allCategories;
    try {
      const query = {
        status: true,
        name: { $regex: new RegExp(search, "i") },
      };
      const categoryList = await Categories.find(query)
        .sort({ create_at: "desc" })
        .skip((page - 1) * limit)
        .limit(limit);

      const totalCount = await Categories.countDocuments(query);
      const data = categoryList.map((category) => ({
        id: category._id,
        name: category.name,
        status: category.status,
        slug: category.slug,
        description: category.description,
      }));
      const response = {
        data,
        totalCount,
        pageCount: Math.ceil(totalCount / limit),
      };
      return response;
    } catch (error) {
      console.log(error);
      throw generateError("Cannot get category!", HttpStatusCodes.BAD_REQUEST);
    }
  }
  public async getAllcategorywithNopaging() {
    const allCategories = await Categories.find({});
    return allCategories;
  }
}

export default new CategoriesServices();
