export const AppConfig = {
  /**
   * MySQL 版本为 8
   */
  mysql: {
    host: '172.21.76.234',
    username: 'root',
    password: '123456',
    /**
     * 创建数据库语句
     * CREATE DATABASE shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
     *  */
    database: 'shop',
  },
  /**
   * 上传的文件的保存路径
   */
  upload: {
    directoryPath: 'upload',
  },
  /**
   * auth
   */
  auth: {
    jwt_secret: 'hello shop',
    access_token_expiresIn: '10h',
    refresh_token_expiresIn: '60m',
    authcode_expiresIn: 60, // 数字(秒)
  },
};
