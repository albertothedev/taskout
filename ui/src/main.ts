import { createApp } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faEllipsisV,
  faCheck,
  faTimes,
  faEdit,
  faTrashAlt,
  faPlusCircle,
  faMinusCircle,
  faCalendar,
  faClock,
  faCog,
  faAngleLeft,
  faAngleRight,
  faAngleUp,
  faAngleDown,
  faTimesCircle,
  faCheckCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import store from "./store/index";
import router from "./router/index";

import DatePicker from "./components/DatePicker.vue";
import TimePicker from "./components/TimePicker.vue";
import Modal from "./components/Modal.vue";
import App from "./App.vue";

library.add(
  faEllipsisV,
  faCheck,
  faTimes,
  faTimesCircle,
  faCheckCircle,
  faEdit,
  faTrashAlt,
  faPlusCircle,
  faMinusCircle,
  faCalendar,
  faClock,
  faCog,
  faAngleRight,
  faAngleLeft,
  faAngleUp,
  faAngleDown,
  faSignOutAlt
);

createApp(App)
  .use(router)
  .use(store)
  .component("date-picker", DatePicker)
  .component("time-picker", TimePicker)
  .component("modal", Modal)
  .component("font-awesome-icon", FontAwesomeIcon)
  .mount("#app");
