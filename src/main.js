import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store/store.js';
import FormInput from '@/components/FormInput.vue';
import BaseCard from '@/components/BaseCard.vue';
import BaseSpinner from '@/components/BaseSpinner.vue';
import BaseDialog from '@/components/BaseDialog.vue';
import BaseButton from '@/components/BaseButton.vue';

const app = createApp(App);
app.use(router);
app.use(store);

app.component('form-input', FormInput);
app.component('base-card', BaseCard);
app.component('base-spinner', BaseSpinner);
app.component('base-dialog', BaseDialog);
app.component('base-button', BaseButton);

app.mount('#app');

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/js/bootstrap.min.js"