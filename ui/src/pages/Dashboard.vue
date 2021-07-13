<template>
  <div class="dashboard">
    <NavBar />
    <modal v-if="modalMsg" :message="modalMsg" @destroy="modalMsg = null" />

    <div class="dashboard__items">
      <Habits />
      <Tasks />
      <Events />
    </div>
  </div>
</template>

<script lang="ts">
import axios, { AxiosError, AxiosResponse } from "axios";
import { defineComponent, onMounted, ref, provide, reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import NavBar from "../components/NavBar.vue";
import Habits from "../components/Habits.vue";
import Tasks from "../components/Tasks.vue";
import Events from "../components/Events.vue";

export default defineComponent({
  components: {
    NavBar,
    Habits,
    Tasks,
    Events,
  },

  setup(props, context) {
    const router = useRouter();
    const store = useStore();

    const dataFetched = computed(() => store.state.dataFetched);

    const setDataFetched = (state: boolean) => store.commit("setDataFetched", state);
    const setItems = (state: any) => store.commit("setItems", state);

    let modalMsg: any = ref(null);

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
      modalMsg,
      dataFetched,
      setItems,
      setDataFetched,
    };
  },
});
</script>
