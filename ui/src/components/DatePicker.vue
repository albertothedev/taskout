<template>
  <div class="datePicker">
    <div class="datePicker__header">
      <font-awesome-icon
        @click="showMonth('previous')"
        :icon="['fa', 'angle-left']"
        class="datePicker__header__icon"
      />
      <h1 class="datePicker__header__title">
        {{
          currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })
        }}
      </h1>

      <font-awesome-icon
        @click="showMonth('next')"
        :icon="['fa', 'angle-right']"
        class="datePicker__header__icon"
      />
    </div>

    <div class="datePicker__calendar">
      <div
        v-for="weekDay in calendar.weekDays"
        :key="weekDay"
        class="datePicker__calendar__weekDay"
      >
        {{ weekDay }}
      </div>
      <div
        v-for="day in calendar.previousMonth"
        :key="day"
        class="datePicker__calendar__previousMonthDay"
      >
        {{ day }}
      </div>
      <div
        v-for="day in calendar.currentMonth"
        :key="day"
        class="datePicker__calendar__currentMonthDay"
        @click="
          $emit(
            'date',
            new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
          )
        "
      >
        {{ day }}
      </div>
      <div
        v-for="day in calendar.nextMonth"
        :key="day"
        class="datePicker__calendar__nextMonthDay"
      >
        {{ day }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from "vue";

export default defineComponent({
  setup(props, context) {
    let currentDate = ref<Date>(new Date());
    let currentMonthDays = computed<number>(() =>
      new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1,
        0
      ).getDate()
    );
    let currentMonthFirstWeekDay = computed<number>(() =>
      new Date(new Date(currentDate.value).setDate(1)).getDay() === 0
        ? 6
        : new Date(new Date(currentDate.value).setDate(1)).getDay() - 1
    );
    let pastMonth = computed<Date>(
      () =>
        new Date(
          new Date(currentDate.value).setMonth(currentDate.value.getMonth() - 1)
        )
    );
    let pastMonthDays = computed<number>(() =>
      new Date(
        new Date(
          pastMonth.value.setMonth(pastMonth.value.getMonth())
        ).getFullYear(),
        new Date(
          pastMonth.value.setMonth(pastMonth.value.getMonth())
        ).getMonth() + 1,
        0
      ).getDate()
    );

    let calendar: any = reactive({
      weekDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      previousMonth: [],
      currentMonth: [],
      nextMonth: [],
    });

    (function() {
      showMonth();
    })();

    function showMonth(condition?: "next" | "previous") {
      calendar.previousMonth = [];
      calendar.currentMonth = [];
      calendar.nextMonth = [];

      switch (condition) {
        case "next":
          currentDate.value = new Date(
            currentDate.value.setMonth(currentDate.value.getMonth() + 1)
          );
          break;

        case "previous":
          currentDate.value = new Date(
            currentDate.value.setMonth(currentDate.value.getMonth() - 1)
          );
          break;

        default:
          break;
      }

      for (
        let l = pastMonthDays.value;
        l > pastMonthDays.value - currentMonthFirstWeekDay.value;
        l--
      )
        calendar.previousMonth.unshift(l);

      for (let m = 1; m <= currentMonthDays.value; m++)
        calendar.currentMonth.push(m);

      for (
        let n = 1;
        n <=
        42 - (calendar.previousMonth.length + calendar.currentMonth.length);
        n++
      )
        calendar.nextMonth.push(n);
    }

    return {
      currentDate,
      currentMonthDays,
      calendar,
      pastMonth,
      pastMonthDays,
      currentMonthFirstWeekDay,
      showMonth,
    };
  },
});
</script>
