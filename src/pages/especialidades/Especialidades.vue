<template>
  <div class="q-pa-md q-gutter-sm" style="position: relative">
    <Tabela
      :dados="data"
      titulo="Especialidades"
      :coluna="coluna"
      @enviar-funcao="deletar"
      @enviar-edit="redirectEditar"
    />
    <div style="display: flex; justify-content: flex-end" class="q-pa-md">
      <q-btn
        label="Cadastrar Especialidade"
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
import { defineComponent } from "vue";
import Tabela from "src/components/TabelaComponent.vue";

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
    name: "acoes",
    label: "",
    field: "acoes",
    sortable: false,
    align: "center",
  },
];

export default defineComponent({
  name: "especialidadeS",
  components: {
    Tabela,
  },
  props: {},
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
      this.$router.push("/especialidades/create");
    },
    redirectEditar(id) {
      this.$router.push({ path: "/especialidades/editar/" + id });
    },
    deletar(id) {
      this.isLoading = true;
      let token = {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      };
      this.$api
        .delete(`especialidades/${id}`, token)
        .then((response) => {
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
        .get("especialidades", token)
        .then((response) => {
          const newData = response.data.map((value) => {
            return {
              name: value.espec_nome,
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
