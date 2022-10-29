export default {

  setUser(state, payload) {
    state.accessToken = payload.accessToken;
    state.refreshToken = payload.refreshToken;
    state.username = payload.username;
    state.didAutoLogout = false;
  },

  setAutoLogout(state) {
    state.didAutoLogout = true;
  }
  
};