<template>
  <div class="tasks">
    <div class="tasks__add" v-if="dataFetched && addTaskPopUp">
      <div class="tasks__add__header">
        <h2 class="tasks__add__header__title">Add new task</h2>
        <font-awesome-icon class="tasks__add__header__icon" :icon="['fas', 'times-circle']" @click="addTaskPopUp = false" />
      </div>
      <form class="tasks__add__form" @submit.prevent="addTask">
        <input class="tasks__add__form__description" type="text" required />

        <button class="tasks__add__form__submit" type="submit">Add</button>
      </form>
    </div>

    <div class="tasks__header">
      <h1 class="tasks__header__title">TASKS</h1>
      <ul class="tasks__header__sort">
        <li
          class="tasks__header__sort__mode"
          :class="{
            'tasks__header__sort__mode--active': sortMode === 'pending',
          }"
        >
          <button class="tasks__header__sort__mode__button" @click="sortMode = 'pending'">
            Pending
          </button>
        </li>
        <li
          class="tasks__header__sort__mode"
          :class="{
            'tasks__header__sort__mode--active': sortMode === 'completed',
          }"
        >
          <button class="tasks__header__sort__mode__button" @click="sortMode = 'completed'">
            Completed
          </button>
        </li>
        <li class="tasks__header__sort__mode" :class="{ 'tasks__header__sort__mode--active': sortMode === 'all' }">
          <button class="tasks__header__sort__mode__button" @click="sortMode = 'all'">
            All
          </button>
        </li>
      </ul>
    </div>

    <div class="tasks__list" v-if="dataFetched">
      <div
        :class="{
          tasks__list__task: true,
          'tasks__list__task--completed': task.completed,
        }"
        v-for="(task, index) in filteredTasks"
        :key="task.task_id"
      >
        <form
          class="tasks__list__task__edit"
          v-if="editing === tasks[index].task_id"
          @submit.prevent="
            editTask(task);
            editing = null;
          "
        >
          <button class="tasks__list__task__edit__button">
            <font-awesome-icon :icon="['fas', 'times-circle']" class="tasks__list__task__edit__button__icon" @click="editing = null" />
          </button>

          <div class="tasks__list__task__edit__details">
            <input type="text" class="tasks__list__task__edit__details__description" :placeholder="task.description" required />
          </div>

          <button class="tasks__list__task__edit__button" type="submit">
            <font-awesome-icon :icon="['fas', 'check-circle']" class="tasks__list__task__edit__button__icon" />
          </button>
        </form>

        <p class="tasks__list__task__description" @click="toggleTask(task)" v-if="editing !== tasks[index].task_id">
          {{ task.description }}
        </p>

        <font-awesome-icon
          :icon="['fas', 'ellipsis-v']"
          class="tasks__list__task__icon"
          v-if="!task.completed && editing !== tasks[index].task_id"
          @click="options = task.task_id"
        />

        <div class="tasks__list__task__options" v-if="options === tasks[index].task_id">
          <div
            class="tasks__list__task__options__option"
            @click="
              editing = task.task_id;
              options = null;
            "
          >
            <font-awesome-icon class="tasks__list__task__options__option__icon" :icon="['fas', 'edit']" />
            <span>Edit</span>
          </div>
          <div class="tasks__list__task__options__option" @click="deleteTask(task)">
            <font-awesome-icon class="tasks__list__task__options__option__icon" :icon="['fas', 'trash-alt']" />
            <span>Delete</span>
          </div>
          <div class="tasks__list__task__options__option" @click="options = null">
            <font-awesome-icon class="tasks__list__task__options__option__icon" :icon="['fas', 'times']" />
            <span>Close</span>
          </div>
        </div>
      </div>
    </div>

    <button class="tasks__addButton">
      <font-awesome-icon @click="addTaskPopUp = !addTaskPopUp" :icon="['fa', 'plus-circle']" class="icon--big icon" />
    </button>
  </div>
</template>

<script lang="ts">
import axios, { AxiosError, AxiosResponse } from "axios";
import { defineComponent, ref, inject, provide, computed } from "vue";
import { useStore } from "vuex";

import { TTask } from "../types/index";

export default defineComponent({
  setup(props, context) {
    const store = useStore();

    const dataFetched = computed<boolean>(() => store.state.dataFetched);
    const tasks = computed<Array<TTask>>(() => store.state.items.tasks);

    const addItem = (state: any) => store.commit("addItem", state);
    const deleteItem = (state: any) => store.commit("deleteItem", state);
    const updateItem = (state: any) => store.commit("updateItem", state);

    const sortMode = ref<"pending" | "completed" | "all">("pending");
    const addTaskPopUp = ref<boolean>(false);
    const options = ref<number | null>(null);
    const editing = ref<number | null>(null);

    const filteredTasks = computed<Array<TTask>>(() => {
      switch (sortMode.value) {
        case "pending":
          return tasks.value.filter((task: TTask) => !task.completed);

        case "completed":
          return tasks.value.filter((task: TTask) => task.completed);

        case "all":
          return tasks.value;
      }
    });

    function addTask(): void {
      let data: TTask = {
        task_id: tasks.value[tasks.value.length - 1] ? tasks.value[tasks.value.length - 1].task_id! + 1 : undefined,
        description: (<HTMLInputElement>document.querySelector(".tasks__add__form__description")).value.trim(),
        completed: false,
        user_id: undefined,
      };
      addTaskPopUp.value = false;

      addItem({
        item: "tasks",
        value: data,
      });

      axios
        .post(`${process.env.VUE_APP_TASKOUT_API_URL}/addItem`, { data: { item: "tasks", value: data } }, { withCredentials: true })
        .then((res: AxiosResponse) =>
          updateItem({
            item: "tasks",
            index: tasks.value.length - 1,
            value: res.data,
          })
        )
        .catch((error: AxiosError) => console.error(error));
    }

    function deleteTask(task: TTask): void {
      let data: TTask = {
        ...task,
      };

      deleteItem({
        item: "tasks",
        index: tasks.value.findIndex((task2: TTask) => task2.task_id === task.task_id),
      });

      axios
        .post(
          `${process.env.VUE_APP_TASKOUT_API_URL}/deleteItem`,
          {
            data: {
              item: "tasks",
              value: data,
            },
          },
          { withCredentials: true }
        )
        .then((res: AxiosResponse) => {})
        .catch((error: AxiosError) => console.error(error));
    }

    function toggleTask(task: TTask): void {
      let data: TTask = { ...task, completed: !task.completed };

      updateItem({
        item: "tasks",
        index: tasks.value.findIndex((task2: TTask) => task2.task_id === task.task_id),
        value: data,
      });

      axios
        .post(
          `${process.env.VUE_APP_TASKOUT_API_URL}/updateItem`,
          {
            data: {
              item: "tasks",
              value: data,
            },
          },
          { withCredentials: true }
        )
        .then(() => {})
        .catch((error: AxiosError) => console.error(error));
    }

    function editTask(task: TTask): void {
      let data: TTask = {
        ...task,
        description: (<HTMLInputElement>document.querySelector(".tasks__list__task__edit__details__description")).value.trim(),
      };

      updateItem({
        item: "tasks",
        index: tasks.value.findIndex((task2: TTask) => task2.task_id === task.task_id),
        value: data,
      });

      axios
        .post(
          `${process.env.VUE_APP_TASKOUT_API_URL}/updateItem`,
          {
            data: {
              item: "tasks",
              value: data,
            },
          },
          { withCredentials: true }
        )
        .then((res: AxiosResponse) => {})
        .catch((error: AxiosError) => console.error(error));
    }

    return {
      sortMode,
      toggleTask,
      addTask,
      addTaskPopUp,
      deleteTask,
      filteredTasks,
      editTask,
      dataFetched,
      tasks,
      addItem,
      deleteItem,
      updateItem,
      options,
      editing,
    };
  },
});
</script>
