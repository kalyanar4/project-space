import { toolCategories } from "./toolCategories";

export const tools = toolCategories.map((category) => ({
  name: category.name,
  description: category.description,
  path: `/tools/${category.slug}`,
  status: category.status,
  commercialPurpose: category.commercialPurpose,
}));
