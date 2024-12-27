import { ListQueryParam } from 'src/common/type';
import { Validator } from 'src/common/validator';
import { Category } from 'src/entity/category.entity';

export type CategoryUpdateDTO = Category;

export type CategoryInsertDTO = Pick<Category, 'avatar' | 'name' | 'parentId'>;

export type CategoryListQueryDTO = ListQueryParam<
  Category,
  'id' | 'name' | 'parentId'
>;

export const CategoryValidator: Partial<Record<keyof Category, Validator>> = {
  avatar: Validator.validate('avatar').string().max(255),
  parentId: Validator.validate('parentId').number(),
  name: Validator.validate('name').string().max(16),
  id: Validator.validate('id').number(),
};
