<template>
  <div class="signIn">
    <div class="signIn__container">
      <h2 class="signIn__container__title">SIGN IN</h2>
      <form class="signIn__container__form" @submit.prevent="handleSubmit">
        <input class="signIn__container__form__email" type="email" placeholder="Email" required />
        <input class="signIn__container__form__password" type="password" placeholder="Password" required />
        <button class="signIn__container__form__submit">
          SIGN IN
        </button>
      </form>
      <a class="signIn__container__link" @click="router.push('/recoverPassword')">I forgot my password</a>

      <a class="signIn__container__link" @click="router.push('/signUp')">I don't have an account</a>
    </div>
  </div>
</template>

<script lang="ts">
import axios, { AxiosError } from "axios";
import { defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup(props, context) {
    const router = useRouter();

    onMounted(() => {
      axios
        .get(`${process.env.VUE_APP_TASKOUT_API_URL}/isUser`, {
          withCredentials: true,
        })
        .then(() => router.push("/dashboard"))
        .catch((error: AxiosError) => console.error(error));
    });

    function handleSubmit() {
      const email: string = (<HTMLInputElement>document.querySelector(".signIn__container__form__email")).value.trim();
      const password: string = (<HTMLInputElement>document.querySelector(".signIn__container__form__password")).value.trim();

      axios
        .post(
          `${process.env.VUE_APP_TASKOUT_API_URL}/signIn`,
          {
            email,
            password,
          },
          { withCredentials: true }
        )
        .then(() => router.push("dashboard"))
        .catch((error: AxiosError) => {
          console.error(error);
          alert(error!.response!.data);
        });
    }

    return { router, handleSubmit };
  },
});
</script>
