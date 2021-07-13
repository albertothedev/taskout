<template>
  <div class="habits">
    <div class="habits__add" v-if="dataFetched && addHabitPopUp">
      <div class="habits__add__header">
        <h2 class="habits__add__header__title">Add new habit</h2>
        <font-awesome-icon class="habits__add__header__icon" :icon="['fas', 'times-circle']" @click="addHabitPopUp = false" />
      </div>

      <form class="habits__add__form" @submit.prevent="addHabit">
        <input class="habits__add__form__description" type="text" required />

        <ul class="habits__add__form__days">
          <li
            v-for="day in Object.keys(week)"
            :key="day"
            @click="week[day] = !week[day]"
            class="habits__add__form__days__day"
            :class="{ 'habits__add__form__days__day--active': week[day] }"
          >
            {{ day }}
          </li>
        </ul>

        <button class="habits__add__form__submit" type="submit">Add</button>
      </form>
    </div>

    <div class="habits__title">
      <h1>HABITS</h1>
    </div>

    <div class="habits__list" v-if="dataFetched">
      <div class="habits__list__habit" :id="'habits__list__habit' + habit.habit_id" v-for="(habit, index) in habits" :key="habit.habit_id">
        <form
          class="habits__list__habit__edit"
          v-if="editing === habits[index].habit_id"
          @submit.prevent="
            editHabit(habit);
            editing = null;
          "
        >
          <button class="habits__list__habit__edit__button">
            <font-awesome-icon
              :icon="['fas', 'times-circle']"
              class="habits__list__habit__edit__button__icon"
              @click="
                week = {
                  MON: false,
                  TUE: false,
                  WED: false,
                  THU: false,
                  FRI: false,
                  SAT: false,
                  SUN: false,
                };
                editing = null;
              "
            />
          </button>

          <div class="habits__list__habit__edit__details">
            <input type="text" class="habits__list__habit__edit__details__description" :placeholder="habit.description" required />

            <ul class="habits__list__habit__edit__details__days">
              <li
                v-for="day in Object.keys(week)"
                :key="day"
                class="habits__list__habit__edit__details__days__day"
                :class="{
                  'habits__list__habit__edit__details__days__day--active': week[day],
                }"
                @click="week[day] = !week[day]"
              >
                {{ day }}
              </li>
            </ul>
          </div>

          <button class="habits__list__habit__edit__button" type="submit">
            <font-awesome-icon :icon="['fas', 'check-circle']" class="habits__list__habit__edit__button__icon" />
          </button>
        </form>

        <div class="habits__list__habit__details" v-if="editing !== habits[index].habit_id">
          <p class="habits__list__habit__details__description">
            {{ habit.description }}
          </p>

          <div class="habits__list__habit__details__days">
            <span
              v-for="day in Object.keys(week)"
              :id="day"
              :key="day"
              :class="{
                habits__list__habit__details__days__day: true,
                'habits__list__habit__details__days__day--active': habit.schedule.split(',').find((elm) => day.toLowerCase() === elm.toLowerCase()),
                'habits__list__habit__details__days__day--daily':
                  day === currentWeekDay && habit.schedule.split(',').find((elm) => day.toLowerCase() === elm.toLowerCase()),
                'habits__list__habit__details__days__day--completed':
                  day === currentWeekDay &&
                  habit.schedule.split(',').find((elm) => day.toLowerCase() === elm.toLowerCase()) &&
                  habit.daily &&
                  getDate(habit.daily) === today,
              }"
              >{{ day }}
            </span>
          </div>

          <div class="habits__list__habit__details__completions">
            {{ habit.completions }}
          </div>

          <font-awesome-icon
            :icon="['fas', 'ellipsis-v']"
            class="habits__list__habit__details__icon"
            @click="
              options = true;
              options = habit.habit_id;
            "
          />
        </div>

        <font-awesome-icon
          :icon="['fas', 'plus-circle']"
          :class="{
            habits__list__habit__icon: true,
            'habits__list__habit__icon--active': habit.schedule.split(',').find((elm) => elm === currentWeekDay) && getDate(habit.daily) !== today,
          }"
          @click="habit.schedule.split(',').find((elm) => elm === currentWeekDay) && getDate(habit.daily) !== today ? incrementHabit(habit) : null"
          v-if="editing !== habits[index].habit_id"
        />

        <div class="habits__list__habit__options" v-if="options === habits[index].habit_id">
          <div
            class="habits__list__habit__options__option"
            @click="
              editing = habit.habit_id;
              options = null;
            "
          >
            <font-awesome-icon class="habits__list__habit__options__option__icon" :icon="['fas', 'edit']" />
            <span>Edit</span>
          </div>
          <div class="habits__list__habit__options__option" @click="deleteHabit(habit)">
            <font-awesome-icon class="habits__list__habit__options__option__icon" :icon="['fas', 'trash-alt']" />
            <span>Delete</span>
          </div>
          <div class="habits__list__habit__options__option" @click="options = null">
            <font-awesome-icon class="habits__list__habit__options__option__icon" :icon="['fas', 'times']" />
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>

    <button class="habits__addButton">
      <font-awesome-icon @click="addHabitPopUp = !addHabitPopUp" :icon="['fa', 'plus-circle']" class="icon--big icon" />
    </button>
  </div>
</template>

<script lang="ts">
import axios, { AxiosResponse, AxiosError } from "axios";
import { defineComponent, ref, computed, onMounted } from "vue";
import { useStore } from "vuex";

import { THabit } from "../types/index";

export default defineComponent({
  setup(props, context) {
    const store = useStore();

    const dataFetched = computed<boolean>(() => store.state.dataFetched);
    const habits = computed<Array<THabit>>(() => store.state.items.habits);

    const addItem = (state: any) => store.commit("addItem", state);
    const deleteItem = (state: any) => store.commit("deleteItem", state);
    const updateItem = (state: any) => store.commit("updateItem", state);

    let week = ref<{
      MON: boolean;
      TUE: boolean;
      WED: boolean;
      THU: boolean;
      FRI: boolean;
      SAT: boolean;
      SUN: boolean;
    }>({
      MON: false,
      TUE: false,
      WED: false,
      THU: false,
      FRI: false,
      SAT: false,
      SUN: false,
    });
    const addHabitPopUp = ref<boolean>(false);
    const options = ref<number | null>(null);
    const editing = ref<number | null>(null);

    const currentWeekDay: string = new Date()
      .toLocaleString("en-GB", { weekday: "long" })
      .toUpperCase()
      .slice(0, 3);
    const today: string = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

    function getDate(date: string): string {
      return new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
    }

    function addHabit(): void {
      let data: THabit = {
        habit_id: habits.value[habits.value.length - 1] ? habits.value[habits.value.length - 1].habit_id! + 1 : undefined,
        description: (<HTMLInputElement>document.querySelector(".habits__add__form__description")).value.trim(),
        schedule: "",
        completions: 0,
        daily: null,
        user_id: undefined,
      };

      Object.entries(week.value).forEach((day: any) => (day[1] ? (data.schedule += `${day[0]},`) : null));
      data.schedule = data.schedule.slice(0, -1);

      week.value = {
        MON: false,
        TUE: false,
        WED: false,
        THU: false,
        FRI: false,
        SAT: false,
        SUN: false,
      };
      addHabitPopUp.value = false;

      addItem({
        item: "habits",
        value: data,
      });

      axios
        .post(
          `${process.env.VUE_APP_TASKOUT_API_URL}/addItem`,
          {
            data: {
              item: "habits",
              value: data,
            },
          },
          { withCredentials: true }
        )
        .then((res: AxiosResponse) =>
          updateItem({
            item: "habits",
            index: habits.value.length - 1,
            value: res.data,
          })
        )
        .catch((error: AxiosError) => console.error(error));
    }

    function deleteHabit(habit: THabit): void {
      let data: THabit = {
        ...habit,
      };

      deleteItem({
        item: "habits",
        index: habits.value.findIndex((habit2: THabit) => habit2.habit_id === habit.habit_id),
      });

      axios
        .post(
          `${process.env.VUE_APP_TASKOUT_API_URL}/deleteItem`,
          {
            data: {
              item: "habits",
              value: data,
            },
          },
          { withCredentials: true }
        )
        .then((res: AxiosResponse) => {})
        .catch((error: AxiosError) => console.error(error));
    }

    function incrementHabit(habit: THabit): void {
      let data: THabit = {
        ...habit,
        completions: habit.completions + 1,
        daily: new Date(),
      };

      updateItem({
        item: "habits",
        index: habits.value.findIndex((habit2: THabit) => habit2.habit_id === habit.habit_id),
        value: {
          ...habit,
          completions: habit.completions + 1,
          daily: new Date(),
        },
      });

      axios
        .post(
          `${process.env.VUE_APP_TASKOUT_API_URL}/updateItem`,
          {
            data: {
              item: "habits",
              value: data,
            },
          },
          { withCredentials: true }
        )
        .then((res: AxiosResponse) => {})
        .catch((error: AxiosError) => console.error(error));
    }

    function editHabit(habit: THabit): void {
      let data: THabit = {
        ...habit,
        description: (<HTMLInputElement>document.querySelector(".habits__list__habit__edit__details__description")).value,
        schedule: "",
      };

      Object.entries(week.value).forEach((day: Array<string | boolean>) => (day[1] ? (data.schedule += `${day[0]},`) : null));
      data.schedule = data.schedule.slice(0, -1);

      updateItem({
        item: "habits",
        index: habits.value.findIndex((habit2: any) => habit2.habit_id === habit.habit_id),
        value: {
          ...habit,
          description: (<HTMLInputElement>document.querySelector(".habits__list__habit__edit__details__description")).value,
          schedule: data.schedule,
        },
      });

      week.value = {
        MON: false,
        TUE: false,
        WED: false,
        THU: false,
        FRI: false,
        SAT: false,
        SUN: false,
      };

      axios
        .post(
          `${process.env.VUE_APP_TASKOUT_API_URL}/updateItem`,
          {
            data: {
              item: "habits",
              value: data,
            },
          },
          { withCredentials: true }
        )
        .then((res: AxiosResponse) => {})
        .catch((error: AxiosError) => console.error(error));
    }

    return {
      week,
      editHabit,
      addHabitPopUp,
      addHabit,
      deleteHabit,
      incrementHabit,
      dataFetched,
      habits,
      addItem,
      deleteItem,
      updateItem,
      options,
      editing,
      currentWeekDay,
      today,
      getDate,
    };
  },
});
</script>
