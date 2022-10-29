<template>

<div class="container">

  <div v-if="isLoggedIn" class="float-start me-3 mt-3">
    <div class="dropdown">
  <button class="btn btn-success dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{{ loggedInUser }}</button>
  <ul class="dropdown-menu">
    <li><button class="dropdown-item" @click="logout">Logout</button></li>
  </ul>
</div>
  </div>

  <div class="d-flex justify-content-center">
    <NavigationDropdown class="mt-3" title="Navigation" :map="mmm" />
  </div>

  <router-view />

</div>

</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import NavigationDropdown from './components/NavigationDropdown.vue';

export default {
    setup() {

        const mmm = new Map();
        mmm.set('Home', '/');
        mmm.set('Employees', '/employees');
        mmm.set('About', '/about');

        const store = useStore();
        const router = useRouter();
        const isLoggedIn = computed(() => {
            return store.getters["auth/isAuthenticated"];
        });
        const loggedInUser = computed(() => {
          return store.getters["auth/username"];
        }
        );
        const logout = () => {
            store.dispatch("auth/logout");
            router.replace("/");
        };
        return {
          isLoggedIn,
          loggedInUser,
          logout,
          mmm
        };
    },
    components: { NavigationDropdown }
}
</script>

<style>
  th {
    cursor: pointer;
  }
</style>