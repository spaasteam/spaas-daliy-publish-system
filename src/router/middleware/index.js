import auth from "./auth";
import title from "./title";

export const beforeEachMiddlewareList = [auth, title];

export default router => {
  beforeEachMiddlewareList.forEach(middleware => router.beforeEach(middleware));
};
