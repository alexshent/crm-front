import { createStore } from 'vuex';

import authModule from './modules/auth/index.js';
import enumModule from './modules/enum/index.js';

const store = createStore({
  modules: {
    auth: authModule,
    enum: enumModule
  }
});

export default store;
