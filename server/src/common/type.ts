export interface RequestWithUserInfo extends Express.Request {
  userInfo: {
    userId: string;
    telNumber: string;
  };
}
