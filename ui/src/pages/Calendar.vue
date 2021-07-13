<template>
  <div class="calendar">
    <NavBar />
    <WeekCalendar v-if="dataFetched" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, provide, computed } from "vue";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import NavBar from "../components/NavBar.vue";
import WeekCalendar from "../components/WeekCalendar.vue";

export default defineComponent({
  components: { NavBar, WeekCalendar },

  setup(props, context) {
    const router = useRouter();
    const store = useStore();

    const dataFetched = computed(() => store.state.dataFetched);

    const setDataFetched = (state: boolean) => store.commit("setDataFetched", state);
    const setItems = (state: any) => store.commit("setItems", state);

    (function() {
      axios
        .get(`${process.env.VUE_APP_TASKOUT_API_URL}/isUser`, {
          withCredentials: true,
        })
        .then(() => {
          if (!dataFetched.value)
            axios
              .get(`${process.env.VUE_APP_TASKOUT_API_URL}/dashboard`, {
                withCredentials: true,
              })
              .then((res: AxiosResponse) => {
                setItems(res.data);
                setDataFetched(true);
              })
              .catch((error: AxiosError) => console.error(error));
        })
        .catch((error: AxiosError) => router.push("/"));
    })();

    return {
      router,
      store,
      dataFetched,
      setDataFetched,
      setItems,
    };
  },
});
</script>
