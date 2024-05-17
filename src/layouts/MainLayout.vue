<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated style="background-color: #9b3490 !important">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> Ti saúde </q-toolbar-title>
        <div style="position: relative">
          <q-btn
            flat
            dense
            round
            icon="logout"
            @click="sair"
            style="cursor: pointer"
            @mouseover="mostrarLegenda = 'Sair'"
            @mouseleave="mostrarLegenda = ''"
          />

          <span
            style="
              position: absolute;
              left: -25px;
              bottom: 7px;
              font-size: 12px;
              font-weight: bold;
            "
          >
            {{ mostrarLegenda }}
          </span>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          @click="teste(link)"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Medicos",
    caption: "Sessão médicos",
    icon: "school",
    link: "/medicos",
  },
  {
    title: "Pacientes",
    caption: "Sessão pacientes",
    icon: "settings_accessibility",
    link: "/pacientes",
  },
  {
    title: "Planos de saúde",
    caption: "Sessão planos",
    icon: "elderly_woman",
    link: "/planosSaude",
  },
  {
    title: "Especialidades",
    caption: "Sessão especialidades",
    icon: "star_rate",
    link: "/especialidades",
  },
  {
    title: "Consultas",
    caption: "Sessão consultas",
    icon: "monitor_heart",
    link: "/consultas",
  },
  {
    title: "Procedimentos",
    caption: "Sessão procedimentos",
    icon: "medication",
    link: "/procedimentos",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  methods: {
    teste(link) {
      console.log(link.link);
      this.$router.push(link.link);
    },
    sair() {
      localStorage.clear("token");
      this.$router.push("/");
    },
  },

  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      mostrarLegenda: ref(""),
    };
  },
});
</script>
