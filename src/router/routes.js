import authGuard from "src/authGuard";

const routes = [
  {
    path: "/",
    component: () => import("layouts/LoginLayout.vue"),
    children: [{ path: "", component: () => import("pages/login/login.vue") }],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    beforeEnter: authGuard,
    children: [
      {
        path: "/bemvindo",
        component: () => import("pages/IndexPage.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/medicos",
        component: () => import("src/pages/medicos/Medicos.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/medicos/create",
        component: () => import("src/pages/medicos/createMedicos.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/medicos/editar/:id",
        component: () => import("src/pages/medicos/editarMedicos.vue"),
        props: true,
        beforeEnter: authGuard,
      },
      {
        path: "/pacientes",
        component: () => import("src/pages/pacientes/Pacientes.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/pacientes/create",
        component: () => import("src/pages/pacientes/createPaciente.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/pacientes/editar/:id",
        component: () => import("src/pages/pacientes/editarPaciente.vue"),
        props: true,
        beforeEnter: authGuard,
      },
      {
        path: "/planosSaude",
        component: () => import("src/pages/planosaude/Planos.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/planosSaude/create",
        component: () => import("src/pages/planosaude/createPlano.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/planosSaude/editar/:id",
        component: () => import("src/pages/planosaude/editarPlano.vue"),
        props: true,
        beforeEnter: authGuard,
      },
      {
        path: "/especialidades",
        component: () => import("src/pages/especialidades/Especialidades.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/especialidades/create",
        component: () =>
          import("src/pages/especialidades/createEspecialidade.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/especialidades/editar/:id",
        component: () =>
          import("src/pages/especialidades/editarEspecialidade.vue"),
        props: true,
        beforeEnter: authGuard,
      },
      {
        path: "/consultas",
        component: () => import("src/pages/consultas/consultas.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/consultas/create",
        component: () => import("src/pages/consultas/createConsulta.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/consultas/editar/:id",
        component: () => import("src/pages/consultas/editarConsultas.vue"),
        props: true,
        beforeEnter: authGuard,
      },
      {
        path: "/procedimentos",
        component: () => import("src/pages/procedimentos/procedimentos.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/procedimentos/create",
        component: () =>
          import("src/pages/procedimentos/createProcedimentos.vue"),
        beforeEnter: authGuard,
      },
      {
        path: "/procedimentos/editar/:id",
        component: () =>
          import("src/pages/procedimentos/editarProcedimentos.vue"),
        props: true,
        beforeEnter: authGuard,
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
