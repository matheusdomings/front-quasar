<template>
  <div class="q-pa-md q-gutter-sm" style="position: relative">
    <Tabela
      :dados="data"
      titulo="Pacientes"
      :coluna="coluna"
      @enviar-funcao="deletar"
      @enviar-edit="redirectEditar"
    />
    <div style="display: flex; justify-content: flex-end" class="q-pa-md">
      <q-btn
        label="Cadastrar Paciente"
        style="background-color: #348ab3"
        text-color="white"
        @click="redirectToCreate"
      />
    </div>
    <div
      v-if="isLoading"
      style="
        width: 95%;
        height: 50vh;
        position: absolute;
        top: 0;
        z-index: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #fff;
      "
    >
      <q-spinner-tail style="color: #348ab3" size="4em" />
    </div>
  </div>
</template>

<script>
import Tabela from "src/components/TabelaComponent.vue";
import { defineComponent } from "vue";

const columns = [
  {
    name: "name",
    required: true,
    label: "Nome",
    align: "left",
    field: "name",
    sortable: true,
  },
  {
    name: "data",
    label: "Data de Nascimento",
    align: "left",
    field: "data",
    sortable: true,
  },
  {
    name: "telefone",
    label: "Nº Telefone",
    field: "telefone",
    align: "left",
    sortable: true,
  },
  {
    name: "acoes",
    label: "",
    field: "acoes",
    align: "left",
    sortable: false,
    align: "center",
  },
];

export default defineComponent({
  name: "PaciEntes",
  components: {
    Tabela,
  },
  data() {
    return {
      data: null,
      coluna: columns,
      isLoading: false,
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    redirectToCreate() {
      this.$router.push("/pacientes/create");
    },
    redirectEditar(id) {
      this.$router.push({ path: "/pacientes/editar/" + id });
    },
    deletar(id) {
      this.isLoading = true;
      let token = {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      };
      this.$api
        .delete(`pacientes/${id}`, token)
        .then(() => {
          this.fetchData();
        })
        .catch((error) => {
          console.error(error);
        });
    },
    fetchData() {
      let token = {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      };
      this.$api
        .get(`pacientes`, token)
        .then((response) => {
          const newData = response.data.map((value) => {
            return {
              name: value.pac_nome,
              data: value.pac_dt_nascimento,
              telefone: value.pac_telefone,
              id: value.id,
            };
          });

          this.data = newData;
          this.isLoading = false;
        })
        .catch((error) => {
          if (error.response.status) {
            localStorage.clear("token");
            this.$router.push("/");
          }
          console.error(error);
        });
    },
  },
});
</script>
