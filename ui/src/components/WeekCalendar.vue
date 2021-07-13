<template>
  <div class="weekCalendar">
    <div class="weekCalendar__selector">
      <font-awesome-icon
        class="weekCalendar__selector__icon"
        :icon="['fa', 'angle-left']"
        @click="previousWeek"
      />
      <font-awesome-icon
        class="weekCalendar__selector__icon"
        :icon="['fa', 'angle-right']"
        @click="nextWeek"
      />
    </div>
    <div class="weekCalendar__weekDays">
      <div
        v-for="day in week"
        :key="day"
        class="weekCalendar__weekDays__weekDay"
        :class="{
          'weekCalendar__weekDays__weekDay--active':
            new Date().toLocaleDateString() === day.toLocaleDateString(),
        }"
      >
        <div class="weekCalendar__weekDays__weekDay__name">
          {{
            new Date(new Date(day).setDate(new Date(day).getDate()))
              .toLocaleString("default", { weekday: "short" })
              .toUpperCase()
          }}
        </div>
        <div class="weekCalendar__weekDays__weekDay__number">
          {{ new Date(day).getDate() }}
        </div>
        <div class="weekCalendar__weekDays__weekDay__month">
          {{
            new Date(day).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })
          }}
        </div>
      </div>
    </div>

    <div class="weekCalendar__timeLine">
      <div class="weekCalendar__timeLine__schedule">
        <div
          v-for="index in 24"
          :key="index"
          class="weekCalendar__timeLine__schedule__hour"
        >
          {{ convertTime(index - 1) }}
        </div>
      </div>

      <div class="weekCalendar__timeLine__days">
        <div
          v-for="weekDay in Object.keys(calendar)"
          :key="weekDay"
          class="weekCalendar__timeLine__days__day"
        >
          <div
            class="weekCalendar__timeLine__days__day__hour"
            v-for="hour in calendar[weekDay]"
            :key="hour"
          >
            <div
              v-if="hour.length"
              v-for="event in hour"
              :key="event"
              :class="{
                weekCalendar__timeLine__days__day__hour__entry: true,
                'weekCalendar__timeLine__days__day__hour__entry--single':
                  hour.length === 1,
                'weekCalendar__timeLine__days__day__hour__entry--double':
                  hour.length === 2,
                'weekCalendar__timeLine__days__day__hour__entry--triple':
                  hour.length === 3,
                'weekCalendar__timeLine__days__day__hour__entry--quadruple':
                  hour.length === 4,
              }"
            >
              {{ event }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, inject, onMounted } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  setup(props, context) {
    const store = useStore();

    const dataFetched = computed(() => store.state.dataFetched);
    const events = computed(() => store.state.items.events);

    const setDataFetched = (state: boolean) =>
      store.commit("setDataFetched", state);
    const setItems = (state: any) => store.commit("setItems", state);

    let today = ref<Date>(new Date());
    const week = ref<Array<Date>>([]);
    const weekDays: Array<string> = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    let calendar = ref<{
      monday: Array<string | null>;
      tuesday: Array<string | null>;
      wednesday: Array<string | null>;
      thursday: Array<string | null>;
      friday: Array<string | null>;
      saturday: Array<string | null>;
      sunday: Array<string | null>;
    } | null>(null);

    (function(): void {
      calendar.value = generateCalendar(getWeek(today.value));
    })();

    function getWeek(date: Date): Array<Date> {
      const weekTemp: Array<Date> = [];

      for (let i = 0; i <= 6; i++) {
        const day = date.getDay();
        const diff = (day < 1 ? 7 : 0) + day - 1;

        weekTemp.push(
          new Date(
            new Date(
              new Date(date).setDate(date.getDate() - diff + i)
            ).setHours(0, 0, 0, 0)
          )
        );
      }

      week.value = weekTemp;

      return weekTemp;
    }

    function generateCalendar(week: any) {
      let calendarObject: any = {};

      weekDays.forEach((weekDay: string) => {
        calendarObject[weekDay] = [];
        for (let i = 0; i <= 23; i++) {
          calendarObject[weekDay].push([]);
        }
      });

      events.value.forEach((event: any) => {
        if (
          new Date(event.date) >= week[0] &&
          new Date(event.date) <=
            new Date(
              new Date(week[6]).setHours(
                week[6].getHours() + 23,
                week[6].getMinutes() + 55,
                0
              )
            )
        )
          calendarObject[
            new Date(event.date)
              .toLocaleDateString("default", { weekday: "long" })
              .toLowerCase()
          ][new Date(event.date).getHours()].push(
            `${event.description} ${
              new Date(event.date).getHours() <= 9
                ? `0${String(new Date(event.date).getHours())}`
                : new Date(event.date).getHours()
            }:${
              new Date(event.date).getMinutes() <= 9
                ? `0${String(new Date(event.date).getMinutes())}`
                : new Date(event.date).getMinutes()
            }`
          );
      });

      return calendarObject;
    }

    function convertTime(number: number): string {
      let string: string = "";

      if (number > 9) string += `${number}:00`;
      else string += `0${number}:00`;

      return string;
    }

    function previousWeek() {
      calendar.value = generateCalendar(
        getWeek(new Date(today.value.setDate(today.value.getDate() - 7)))
      );
    }

    function nextWeek() {
      calendar.value = generateCalendar(
        getWeek(new Date(today.value.setDate(today.value.getDate() + 7)))
      );
    }

    return {
      convertTime,
      generateCalendar,
      calendar,
      getWeek,
      events,
      dataFetched,
      setDataFetched,
      setItems,
      previousWeek,
      nextWeek,
      today,
      week,
    };
  },
});
</script>
