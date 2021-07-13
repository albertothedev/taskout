<template>
  <div class="modal">
    <p class="modal__message">{{ message }}</p>

    <span class="modal__timer" :style="{ width: `${width}%` }"></span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  props: ["message"],

  setup(props, context) {
    let width: any = ref(100);

    (function() {
      setInterval(() => width.value--, 50);
      setTimeout(() => context.emit("destroy"), 5000);
    })();

    return {
      width,
    };
  },
});
</script>
