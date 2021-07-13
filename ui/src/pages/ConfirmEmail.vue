<template>
  <div class="confirmEmail"></div>
</template>

<script lang="ts">
import axios, { AxiosError, AxiosResponse } from "axios";
import { defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  setup(props, context) {
    const router = useRouter();

    (async function() {
      alert(
        `${process.env.VUE_APP_TASKOUT_API_URL}${document.location.pathname}`
      );

      if (!document.cookie) {
        alert("Setting cookie");
        document.cookie = `jwt=${document.location.pathname.replace(
          "/confirmEmail/",
          ""
        )}`;
      }

      await axios
        .get(
          `${process.env.VUE_APP_TASKOUT_API_URL}${document.location.pathname}`,
          {
            withCredentials: true,
          }
        )
        .then((res: AxiosResponse) => router.push("/dashboard"))
        .catch((error: AxiosError) => {
          console.error(error);
          router.push("/");
        });
    })();
  },
});
</script>
