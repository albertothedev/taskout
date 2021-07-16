import { createWebHistory, createRouter, Router, RouteRecordRaw } from "vue-router";

import Home from "../pages/Home.vue";
import SignIn from "../pages/SignIn.vue";
import SignUp from "../pages/SignUp.vue";
import Dashboard from "../pages/Dashboard.vue";
import Calendar from "../pages/Calendar.vue";
import ConfirmEmail from "../pages/ConfirmEmail.vue";
import RecoverPassword from "../pages/RecoverPassword.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/", component: Home },
  { path: "/signIn", component: SignIn },
  { path: "/signUp", component: SignUp },
  { path: "/dashboard", component: Dashboard },
  { path: "/calendar", component: Calendar },
  { path: "/confirmEmail", component: ConfirmEmail },
  { path: "/recoverPassword", component: RecoverPassword },
];

const router: Router = createRouter({ history: createWebHistory(), routes });

export default router;
