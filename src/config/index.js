const config = {
  USERS_SERVICE: 'http://localhost:3000',
  UI_URL_PREFIX: process.env.REACT_APP_UI_URL_PREFIX || '',
  AUTH_SERVICE: process.env.AUTH_SERVICE || `http://localhost:1000`,
  SONG_SERVICE: process.env.SONG_SERVICE || `http://localhost:1001`
};

export default config;
