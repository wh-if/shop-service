import { SelectQueryBuilder } from 'typeorm';

export class BaseService {
  /**
   * 列表查询构造
   * @param sqlBuilder 构造器
   * @param tableName 表名
   * @param query 查询参数
   * @param keys 查询参数分类
   */
  genWhereSql<T, G>(
    sqlBuilder: SelectQueryBuilder<T>,
    tableName: string,
    query: G,
    keys: Record<
      'stringType' | 'timeType' | 'enumType' | 'numberType',
      (keyof G)[]
    >,
  ) {
    keys.stringType.forEach((key) => {
      const value = query[key];
      if (!value) {
        return;
      }
      sqlBuilder.andWhere(`${tableName}.${key as string} LIKE :param`, {
        param: `%${value}%`,
      });
    });

    [...keys.timeType, ...keys.numberType].forEach((key) => {
      const value = query[key] as [string, string];
      if (!value) {
        return;
      }
      const isTimeRangne = keys.timeType.includes(key);
      let start: Date | number | string;
      let end: Date | number | string;
      [start, end] = value;

      if (start) {
        start = parseInt(start);
        if (isTimeRangne) {
          start = new Date(start);
        }
        sqlBuilder.andWhere(`${tableName}.${key as string} >= :start`, {
          start,
        });
      }

      if (end) {
        end = parseInt(end);
        if (isTimeRangne) {
          end = new Date(end);
        }
        sqlBuilder.andWhere(`${tableName}.${key as string} <= :end`, {
          end,
        });
      }
    });

    keys.enumType.forEach((key) => {
      const value = query[key];
      if (!value) {
        return;
      }
      sqlBuilder.andWhere(`${tableName}.${key as string} IN (:...param)`, {
        param: value,
      });
    });
  }
}
