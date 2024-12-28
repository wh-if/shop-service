# shop service

## 备注

1. apipost 接口文档
2. genTemplate 脚本创建模板文件（`npm run gen hello`）
3. 流程图形：https://boardmix.cn/app/home

## 记录

1. Object 和 object 类型的区别
2. global.d.ts 文件的作用
3. 数据库查询时注意列名和 sql 关键字的冲突，在列名前加上表名或给列加引号

## todo

- [x] 更新获取列表，需按字段搜索
- [x] 角色权限，限制用户操作的数据范围
- [] 全局错误处理
- [] 参数校验
- [] 处理token 有效但账号已经无效的情况

## git

1. git checkout -b feat-coupon
2. code , format , lint , add , commit
3. git push origin feat-coupon

4. (github.com) create pr and merge

5. git checkout master
6. git pull origin master
7. git branch -d feat-coupon
8. git push origin --delete feat-coupon

## 列表查询

- `order[key] = value`
- `range` `query[key][0]` , `query[key][1]`
- `enum` 传数组 `query[key][0]` , `query[key][1]` ...
- 精确 `key` 查找用 `enum`
