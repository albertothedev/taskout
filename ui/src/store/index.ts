import { createStore } from "vuex";

type TState = {
  dataFetched: boolean;
  habits: Array<any> | null;
  tasks: Array<any> | null;
  events: Array<any> | null;
  items: { habits: Array<any>; tasks: Array<any>; events: Array<any> } | null;
};

const store = createStore({
  state: <TState>{
    dataFetched: false,
    habits: null,
    tasks: null,
    events: null,
  },
  mutations: {
    setDataFetched(state, payload: boolean) {
      state.dataFetched = payload;
    },
    setItems(state, payload: any) {
      state.items = payload;
    },
    addItem(
      state,
      payload: { item: "habits" | "tasks" | "events"; value: any }
    ) {
      state.items![payload.item].push(payload.value);
    },
    deleteItem(
      state,
      payload: { item: "habits" | "tasks" | "events"; index: number }
    ) {
      state.items![payload.item].splice(payload.index, 1);
    },
    updateItem(
      state,
      payload: {
        item: "habits" | "tasks" | "events";
        index: number;
        value: any;
      }
    ) {
      state.items![payload.item][payload.index] = payload.value;
    },
  },
  actions: {
    setDataFetched({ commit }, state) {
      commit("setDataFetched", state);
    },
    setItems({ commit }, items) {
      commit("setItems", items);
    },
    addItem({ commit }, items) {
      commit("addItem", items);
    },
    deleteItem({ commit }, items) {
      commit("deleteItem", items);
    },
    updateItem({ commit }, items) {
      commit("updateItem", items);
    },
  },
});

export default store;
