<template>
  <div class="signUp">
    <div class="signUp__container">
      <h2 class="signUp__container__title">SIGN UP</h2>

      <form class="signUp__container__form" @submit.prevent="handleSubmit">
        <input type="text" class="signUp__container__form__username" placeholder="Username" maxlength="20" required />

        <input type="email" class="signUp__container__form__email" placeholder="Email" required />

        <input type="password" class="signUp__container__form__password" placeholder="Password" required />

        <input type="password" class="signUp__container__form__confirmPassword" placeholder="Confirm password" required />

        <button class="signUp__container__form__submit">SIGN UP</button>
      </form>

      <a class="signUp__container__link" @click="router.push('/signIn')">I have an account</a>
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
      const email: string = (<HTMLInputElement>document.querySelector(".signUp__container__form__email")).value.trim();
      const password: string = (<HTMLInputElement>document.querySelector(".signUp__container__form__password")).value.trim();
      const confirmPassword: string = (<HTMLInputElement>document.querySelector(".signUp__container__form__confirmPassword")).value.trim();
      const username: string = (<HTMLInputElement>document.querySelector(".signUp__container__form__username")).value.trim();

      if (password === confirmPassword)
        axios
          .post(
            `${process.env.VUE_APP_TASKOUT_API_URL}/signUp`,
            {
              username,
              email,
              password,
            },
            { withCredentials: true }
          )
          .then(() => alert("Your account has been created. Check your email for a confirmation link."))
          .catch(() => alert("Email already in use"));
      else alert("Passwords don't match");
    }

    return { router, handleSubmit };
  },
});
</script>
