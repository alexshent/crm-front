let accessTokenExpirationTimer;
let refreshTokenExpirationTimer;

function clearTimers() {
  if (accessTokenExpirationTimer) {
    clearTimeout(accessTokenExpirationTimer);
  }

  if (refreshTokenExpirationTimer) {
    clearTimeout(refreshTokenExpirationTimer);
  }
}

function handleTokens(context, accessToken, refreshToken) {
  const accessTokenParts = accessToken.split('.');
  const accessTokenPayload = accessTokenParts[1];
  // {"sub":"user1","roles":["user"],"iss":"http://localhost:8081/login","exp":1666699956}
  const accessTokenPayloadJson = atob(accessTokenPayload);
  const accessTokenPayloadObject = JSON.parse(accessTokenPayloadJson);

  const refreshTokenParts = refreshToken.split('.');
  const refreshTokenPayload = refreshTokenParts[1];
  // {"sub":"user1","iss":"http://localhost:8081/login","exp":1666706877}
  const refreshTokenPayloadJson = atob(refreshTokenPayload);
  const refreshTokenPayloadObject = JSON.parse(refreshTokenPayloadJson);

  const username = accessTokenPayloadObject.sub;
  const accessTokenExpirationDateInSeconds = accessTokenPayloadObject.exp;
  const refreshTokenExpirationDateInSeconds = refreshTokenPayloadObject.exp;
  
  const accessTokenexpiresInMillis = accessTokenExpirationDateInSeconds * 1000 - Date.now();
  const refreshTokenexpiresInMillis = refreshTokenExpirationDateInSeconds * 1000 - Date.now();

  clearTimers();

  accessTokenExpirationTimer = setTimeout(function() {
    context.dispatch('refreshTokens');
  }, accessTokenexpiresInMillis);

  refreshTokenExpirationTimer = setTimeout(function() {
    context.dispatch('autoLogout');
  }, refreshTokenexpiresInMillis);

  context.commit('setUser', {
    username: username,
    accessToken: accessToken,
    refreshToken: refreshToken
  });

  context.dispatch('enum/getAll', null, {root: true});
}

export default {

  async login(context, payload) {
    const server = process.env.VUE_APP_BACKEND_SERVER;
    const url = `${server}/login`;

   let response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: new URLSearchParams({
        username: payload.username,
        password: payload.password,
      })
    });

    let data = null;
    if (response.ok) {
      data = await response.json();
    } else {
      if (response.status === 403) {
        throw new Error('invalid credentials');
      }
    }

    if (data) {
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      handleTokens(context, accessToken, refreshToken);
    }
  },

  // ------------------------------------

  refreshTokens(context) {
    const server = process.env.VUE_APP_BACKEND_SERVER;
    const url = `${server}/api/token/refresh`;
    const refreshToken = context.getters.refreshToken;

    fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
          'Authorization': `Bearer ${refreshToken}`
      },
    })
    .then((response) => response.json())
    .then((data) => {
      const accessToken = data.access_token;
      const refreshToken = data.refresh_token;
      handleTokens(context, accessToken, refreshToken);
    });
  },

// ------------------------------------

  logout(context) {
    clearTimers();

    context.commit('setUser', {
      username: null,
      accessToken: null,
      refreshToken: null
    });
  },

// ------------------------------------

  autoLogout(context) {
    context.dispatch('logout');
    context.commit('setAutoLogout');
  }
};
