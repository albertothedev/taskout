<template>
  <div class="events ">
    <div class="events__add" v-if="dataFetched && addEventPopUp">
      <div class="events__add__header">
        <h2 class="events__add__header__title">Add new event</h2>
        <font-awesome-icon
          class="events__add__header__icon"
          :icon="['fas', 'times-circle']"
          @click="
            addEventPopUp = false;
            datePicker = null;
            timePicker = null;
          "
        />
      </div>

      <form class="events__add__form" @submit.prevent="addEvent">
        <input class="events__add__form__description" type="text" required />

        <div class="events__add__form__datePicker">
          <font-awesome-icon class="events__add__form__datePicker__icon" :icon="['fas', 'calendar']" />
          <input
            type="text"
            :placeholder="
              new Date().toLocaleString('en-GB', {
                day: 'numeric',
                month: '2-digit',
                year: 'numeric',
              })
            "
            @click="datePicker = true"
            :value="
              date
                ? date.toLocaleString('en-GB', {
                    day: 'numeric',
                    month: '2-digit',
                    year: 'numeric',
                  })
                : null
            "
            class="events__add__form__datePicker__date"
            required
          />
          <date-picker v-if="datePicker" @date="selectDate" />
        </div>

        <div class="events__add__form__timePicker">
          <font-awesome-icon class="events__add__form__timePicker__icon" :icon="['fas', 'clock']" />
          <input
            type="text"
            :placeholder="
              new Date().toLocaleString('en-GB', {
                hour: 'numeric',
                minute: 'numeric',
              })
            "
            @click="timePicker = true"
            v-model="time"
            class="events__add__form__timePicker__time"
            required
          />
          <time-picker v-if="timePicker" @time="selectTime" />
        </div>

        <button class="events__add__form__submit">Add</button>
      </form>
    </div>

    <div class="events__title">
      <h1>EVENTS</h1>
    </div>

    <div class="events__list" v-if="dataFetched" @change="draggableExample">
      <div class="events__list__event" v-for="(event, index) in events" :key="event.event_id">
        <form
          class="events__list__event__edit"
          v-if="editing === events[index].event_id"
          @submit.prevent="
            editEvent(event);
            editing = null;
          "
        >
          <button class="events__list__event__edit__button">
            <font-awesome-icon
              :icon="['fas', 'times-circle']"
              class="events__list__event__edit__button__icon"
              @click="
                editing = null;
                datePicker = null;
                timePicker = null;
              "
            />
          </button>

          <div class="events__list__event__edit__details">
            <input type="text" class="events__list__event__edit__details__description" :placeholder="event.description" required />

            <div class="events__list__event__edit__details__datePicker">
              <font-awesome-icon class="events__list__event__edit__details__datePicker__icon" :icon="['fas', 'calendar']" />
              <input
                type="text"
                :placeholder="
                  new Date().toLocaleString('en-GB', {
                    day: 'numeric',
                    month: '2-digit',
                    year: 'numeric',
                  })
                "
                @click="datePicker = true"
                class="events__list__event__edit__details__datePicker__date"
                :value="
                  date
                    ? date.toLocaleString('en-GB', {
                        day: 'numeric',
                        month: '2-digit',
                        year: 'numeric',
                      })
                    : null
                "
                required
              />
              <date-picker v-if="datePicker" @date="selectDate" />
            </div>

            <div class="events__list__event__edit__details__timePicker">
              <font-awesome-icon class="events__list__event__edit__details__timePicker__icon" :icon="['fas', 'clock']" />
              <input
                type="text"
                :placeholder="
                  new Date().toLocaleString('en-GB', {
                    hour: 'numeric',
                    minute: 'numeric',
                  })
                "
                @click="timePicker = true"
                v-model="time"
                class="events__list__event__edit__details__timePicker__time"
                required
              />
              <time-picker v-if="timePicker" @time="selectTime" />
            </div>
          </div>

          <button class="events__list__event__edit__button" type="submit">
            <font-awesome-icon :icon="['fas', 'check-circle']" class="events__list__event__edit__button__icon" />
          </button>
        </form>

        <p class="events__list__event__description" v-if="editing !== events[index].event_id">
          {{ event.description }}
        </p>

        <p class="events__list__event__date" v-if="editing !== events[index].event_id">
          {{
            new Date(event.date).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
              hour: "numeric",
              minute: "numeric",
            })
          }}
        </p>

        <font-awesome-icon
          :icon="['fas', 'ellipsis-v']"
          class="events__list__event__icon"
          @click="options = event.event_id"
          v-if="editing !== events[index].event_id"
        />

        <div class="events__list__event__options" v-if="options === events[index].event_id">
          <div
            class="events__list__event__options__option"
            @click="
              editing = event.event_id;
              options = null;
            "
          >
            <font-awesome-icon class="events__list__event__options__option__icon" :icon="['fas', 'edit']" />
            <span>Edit</span>
          </div>
          <div class="events__list__event__options__option" @click="deleteEvent(event)">
            <font-awesome-icon class="events__list__event__options__option__icon" :icon="['fas', 'trash-alt']" />
            <span>Delete</span>
          </div>
          <div class="events__list__event__options__option" @click="options = null">
            <font-awesome-icon class="events__list__event__options__option__icon" :icon="['fas', 'times']" />
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>

    <button class="events__addButton">
      <font-awesome-icon @click="addEventPopUp = !addEventPopUp" :icon="['fa', 'plus-circle']" class="icon--big icon" />
    </button>
  </div>
</template>

<script lang="ts">
import axios, { AxiosError, AxiosResponse } from "axios";
import { defineComponent, ref, inject, computed } from "vue";
import { useStore } from "vuex";

import { TEvent } from "../types/index";

export default defineComponent({
  setup(props, context) {
    const store = useStore();

    const dataFetched = computed<boolean>(() => store.state.dataFetched);
    const events = computed<Array<TEvent>>(() => store.state.items.events);

    const addItem = (state: any) => store.commit("addItem", state);
    const deleteItem = (state: any) => store.commit("deleteItem", state);
    const updateItem = (state: any) => store.commit("updateItem", state);

    let datePicker = ref<boolean>(false);
    let timePicker = ref<boolean>(false);
    let date = ref<Date | null>(null);
    let time = ref<string | null>(null);

    const addEventPopUp = ref<boolean>(false);
    const options = ref<number | null>(null);
    const editing = ref<number | null>(null);

    function selectDate(e: Date) {
      date.value = e;
      datePicker.value = false;
    }

    function selectTime(e: Array<number>) {
      let date2 = new Date();
      date2.setHours(e[0], e[1], 0, 0);

      time.value = date2.toLocaleString("en-GB", {
        hour: "numeric",
        minute: "numeric",
      });

      timePicker.value = false;
    }

    function addEvent(): void {
      let data: TEvent = {
        event_id: events.value[events.value.length - 1] ? events.value[events.value.length - 1].event_id! + 1 : undefined,
        description: (<HTMLInputElement>document.querySelector(".events__add__form__description")).value.trim(),
        date: new Date(date.value!.setHours(Number(time.value!.split(":")[0]), Number(time.value!.split(":")[1]), 0, 0)),
        user_id: undefined,
      };

      addEventPopUp.value = false;

      addItem({
        item: "events",
        value: data,
      });

      axios
        .post(
          `${process.env.VUE_APP_TASKOUT_API_URL}/addItem`,
          {
            data: {
              item: "events",
              value: data,
            },
          },
          { withCredentials: true }
        )
        .then((res: AxiosResponse) =>
          updateItem({
            item: "events",
            index: events.value.length - 1,
            value: res.data,
          })
        )
        .catch((error: AxiosError) => console.error(error));
    }

    function editEvent(event: TEvent): void {
      let data: TEvent = {
        ...event,
        description: (<HTMLInputElement>document.querySelector(".events__list__event__edit__details__description")).value.trim(),
        date: new Date(date.value!.setHours(Number(time.value!.split(":")[0]), Number(time.value!.split(":")[1]), 0, 0)),
      };

      updateItem({
        item: "events",
        index: events.value.findIndex((event2: TEvent) => event2.event_id === event.event_id),
        value: data,
      });

      axios
        .post(
          `${process.env.VUE_APP_TASKOUT_API_URL}/updateItem`,
          {
            data: {
              item: "events",
              value: data,
            },
          },
          { withCredentials: true }
        )
        .then((res: AxiosResponse) => {})
        .catch((error: AxiosError) => console.error(error));
    }

    function deleteEvent(event: TEvent): void {
      let data: TEvent = {
        ...event,
      };

      deleteItem({
        item: "events",
        index: events.value.findIndex((event2: TEvent) => event2.event_id === event.event_id),
      });

      axios
        .post(
          `${process.env.VUE_APP_TASKOUT_API_URL}/deleteItem`,
          {
            data: {
              item: "events",
              value: data,
            },
          },
          { withCredentials: true }
        )
        .then((res: AxiosResponse) => {})
        .catch((error: AxiosError) => console.error(error));
    }

    return {
      addEventPopUp,
      addEvent,
      deleteEvent,
      editEvent,
      dataFetched,
      events,
      addItem,
      deleteItem,
      updateItem,
      datePicker,
      timePicker,
      selectDate,
      selectTime,
      date,
      time,
      options,
      editing,
    };
  },
});
</script>
