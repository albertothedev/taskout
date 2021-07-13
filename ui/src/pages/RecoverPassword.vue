<template>
  <div class="recoverPassword">
    <div class="recoverPassword__container">
      <h2 class="recoverPassword__container__title">RECOVER YOUR PASSWORD</h2>

      <form class="recoverPassword__container__form" @submit.prevent="submit">
        <p class="recoverPassword__container__form__description">
          Enter the email associated with your account and we will send you a
          recovery link
        </p>

        <input
          class="recoverPassword__container__form__email"
          type="text"
          placeholder="Email"
          required
        />

        <button class="recoverPassword__container__form__submit">SEND</button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import axios, { AxiosError, AxiosResponse } from "axios";
import { defineComponent } from "vue";

export default defineComponent({
  setup(props, context) {
    function submit() {
      let data = {
        email: (<HTMLInputElement>(
          document.querySelector(".recoverPassword__container__form__email")
        )).value.trim(),
      };

      axios
        .post(
          `${process.env.VUE_APP_TASKOUT_API_URL}/recoverPassword`,
          { data },
          { withCredentials: true }
        )
        .then((res: AxiosResponse) => alert("Email has been sent!"))
        .catch((error: AxiosError) => console.error(error));
    }

    return { submit };
  },
});
</script>
