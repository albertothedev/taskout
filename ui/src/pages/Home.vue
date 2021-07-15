<template>
  <div class="home">
    <div class="home__header">
      <router-link class="home__header__link" to="signIn">Sign in</router-link>
      <router-link class="home__header__link" to="signUp">
        Sign up
      </router-link>
    </div>

    <div class="home__presentation">
      <div class="home__presentation__container">
        <h1 class="home__presentation__container__title">
          Easy managing of your day
        </h1>
        <p class="home__presentation__container__description">
          Use Taskout to keep track of daily tasks, habits that you want to build, or events that you need to remember. Sign up for free or try the
          app out.
        </p>

        <button className="home__presentation__container__button" @click="trial">
          Try out
        </button>
      </div>
      <div class="home__presentation__image">
        <div class="home__presentation__image__dashboard">
          <img class="home__presentation__image__dashboard__1" src="../assets/habits.png" />
          <img class="home__presentation__image__dashboard__2" src="../assets/tasks.png" />
          <img class="home__presentation__image__dashboard__3" src="../assets/events.png" />
        </div>
        <img class="home__presentation__image__4" src="../assets/calendar.png" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios, { AxiosResponse, AxiosError } from "axios";
import { defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup(props, context) {
    const router = useRouter();

    function trial() {
      axios
        .post(
          `${process.env.VUE_APP_TASKOUT_API_URL}/trial`,
          {
            username: "guest",
            password: "1234",
            email: "guest@taskout.com",
          },
          {
            withCredentials: true,
          }
        )
        .then((res: AxiosResponse) => router.push("/dashboard"))
        .catch(() => alert("Email already in use"));
    }

    onMounted(() =>
      axios
        .get(`${process.env.VUE_APP_TASKOUT_API_URL}/isUser`, {
          withCredentials: true,
        })
        .then(() => router.push("/dashboard"))
        .catch((error: AxiosError) => console.error(error))
    );

    return { router, trial };
  },
});
</script>
