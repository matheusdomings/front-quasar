<template>
  <q-layout view="lHh Lpr lFf">
    <q-header style="background-color: #348ab3" elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>Gerenciamento Hospitalar</q-toolbar-title>
        <div style="position: relative">
          <q-btn
            flat
            dense
            round
            icon="logout"
            @click="sair"
            style="cursor: pointer"
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
      <q-list class="q-pa-md">
        <q-item-label header>MENU</q-item-label>

        <MenuComponent
          v-for="menu in listaMenu"
          :key="menu.title"
          v-bind="menu"
          @click="acessarMenu(menu)"
        />

        <div style="position: absolute; bottom: 20px">
          <a
            href="https://www.linkedin.com/in/matheus-domingos-821340189/"
            target="_blank"
            style="
              text-decoration: none;
              color: #348ab3;
              font-weight: bold;
              text-transform: uppercase;
              font-size: 20px;
            "
            ><q-icon name="fa-brands fa-linkedin"></q-icon
          ></a>
        </div>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import MenuComponent from "src/components/MenuComponent.vue";

const linksList = [
  {
    title: "Consultas",
    icon: "monitor_heart",
    link: "/consultas",
  },
  {
    title: "Pacientes",
    icon: "personal_injury",
    link: "/pacientes",
  },
  {
    title: "Medicos",
    icon: "person",
    link: "/medicos",
  },
  {
    title: "Procedimentos",
    icon: "local_hospital",
    link: "/procedimentos",
  },
  {
    title: "Especialidades",
    icon: "hotel_class",
    link: "/especialidades",
  },
  {
    title: "Planos de Saúde",
    icon: "health_and_safety",
    link: "/planosSaude",
  },
];

export default defineComponent({
  name: "MainLayout",
  components: {
    MenuComponent,
  },
  methods: {
    acessarMenu(menu) {
      this.$router.push(menu.link);
    },
    sair() {
      localStorage.clear("token");
      this.$router.push("/");
    },
  },
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      listaMenu: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
