<template>
  <div class="timePicker">
    <div class="timePicker__hours">
      <font-awesome-icon
        class="timePicker__hours__icon"
        :icon="['fa', 'angle-up']"
        @click="hour < 23 ? hour++ : null"
      />
      <div class="timePicker__hours__hour">
        {{ hour < 10 ? `0${hour}` : hour }}
      </div>
      <font-awesome-icon
        class="timePicker__hours__icon"
        :icon="['fa', 'angle-down']"
        @click="hour > 0 ? hour-- : null"
      />
    </div>

    <div class="timePicker__colon">:</div>

    <div class="timePicker__minutes">
      <font-awesome-icon
        class="timePicker__minutes__icon"
        :icon="['fa', 'angle-up']"
        @click="minute < 55 ? (minute = minute + 5) : null"
      />
      <div class="timePicker__minutes__minute">
        {{ minute < 10 ? `0${minute}` : minute }}
      </div>
      <font-awesome-icon
        class="timePicker__minutes__icon"
        :icon="['fa', 'angle-down']"
        @click="minute > 0 ? (minute = minute - 5) : null"
      />
    </div>

    <button class="timePicker__submit" @click="$emit('time', [hour, minute])">
      OK
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup(props, context) {
    let hour = ref<number>(0);
    let minute = ref<number>(0);

    return {
      hour,
      minute,
    };
  },
});
</script>
