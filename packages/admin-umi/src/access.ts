import { USER_ROLE } from './common/constant';
import { User } from './types';

/**
 * @see https://umijs.org/docs/max/access#access
 * */
export default function access(initialState: { currentUser?: User.DetailResult } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    canAdmin: currentUser && currentUser.roles?.includes(USER_ROLE.ADMIN),
  };
}
