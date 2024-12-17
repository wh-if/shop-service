import { ListOrderType, ListQueryParam } from 'src/common/type';
import { Category } from 'src/entity/category.entity';

export type CategoryUpdateDTO = Category;

export type CategoryInsertDTO = Pick<Category, 'avatar' | 'name' | 'parentId'>;

export type CategoryListQueryDTO = ListQueryParam<
  Category,
  'id' | 'name' | 'parentId'
>;

export type CategoryListOrderDTO = ListOrderType<Category, 'id'>;
