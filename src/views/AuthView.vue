<template>
  <div>
    <base-dialog :show="!!error" title="An error occurred" @close="handleError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog :show="isLoading" title="Authenticating..." fixed>
      <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
      <form @submit.prevent="submitForm">
        <div class="form-control">
          <label for="login">Login</label>
          <input type="text" id="login" v-model.lazy.trim="login" />
        </div>
        <div class="form-control">
          <label for="password">Password</label>
          <input type="password" id="password" v-model.lazy.trim="password" />
        </div>
        <p v-if="!formIsValid">Please enter a valid username and password.</p>
        <base-button>Login</base-button>
      </form>
    </base-card>
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import { ref } from 'vue';

export default {
  setup() {
    let login = ref('');
    let password = ref('');
    let formIsValid = true;
    let isLoading = false;
    let error = ref('');
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    async function submitForm() {
      formIsValid = true;
      isLoading = true;

      const actionPayload = {
        username: login.value,
        password: password.value,
      };

      try {
        await store.dispatch('auth/login', actionPayload);
      } catch(e) {
        error.value = e.message;
      }

      isLoading = false;
      if (route.redirectedFrom) {
        router.replace(route.redirectedFrom.path);
      } else {
        router.replace('/');
      }
    }

    function handleError() {
      error.value = null;
    }

    return {
      login,
      password,
      formIsValid,
      isLoading,
      error,
      submitForm,
      handleError
    }
  }
}
</script>

<style scoped>
form {
  margin: 1rem;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>