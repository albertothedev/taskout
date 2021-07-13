<template>
  <nav class="navBar">
    <div class="navBar__links">
      <a class="navBar__links__link" @click="router.push('/dashboard')">DASHBOARD</a>
      <a class="navBar__links__link" @click="router.push('/calendar')">CALENDAR</a>
    </div>

    <button class="navBar__settings">
      <span class="navBar__settings__span">LOG OUT</span> <font-awesome-icon :icon="['fa', 'sign-out-alt']" size="1x" @click="logout" />
    </button>

    <div class="navBar__settings2" v-if="settings">
      <button class="navBar__settings2__button" @click="nothingYet">
        Settings
      </button>
      <button class="navBar__settings2__button" @click="logout">Log out</button>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import axios, { AxiosError, AxiosResponse } from "axios";

export default defineComponent({
  setup(props, context) {
    const router = useRouter();

    const settings: any = ref(false);

    function logout() {
      axios
        .get(`${process.env.VUE_APP_TASKOUT_API_URL}/logout`, {
          withCredentials: true,
        })
        .then((res: AxiosResponse) => router.push("/"))
        .catch((err: AxiosError) => console.error(err));
    }

    function nothingYet() {
      console.log("nothingYet() called");
    }

    return { settings, router, logout, nothingYet };
  },
});
</script>
