export default {
  token: state => state.user.access_token,
  user: state => state.user,
  sidebar: state => state.app.sidebar
};
