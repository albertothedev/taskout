<template>
  <router-view></router-view>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import axios, { AxiosError } from "axios";
import { useRouter } from "vue-router";

import "normalize.css";
import "./styles/main.scss";

export default defineComponent({});
</script>
