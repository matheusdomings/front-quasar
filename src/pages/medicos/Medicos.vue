<template>
  <div class="q-pa-md" style="position: relative">
    <Tabela
      :dados="data"
      titulo="Médicos"
      :coluna="coluna"
      @enviar-funcao="deletar"
      @enviar-edit="redirectEditar"
    />
    <div style="display: flex; justify-content: flex-end" class="q-pa-md">
      <q-btn
        label="Cadastrar Médico"
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
    name: "nome",
    required: true,
    label: "Nome",
    field: "nome",
    align: "left",
    sortable: true,
  },
  {
    name: "crm",
    label: "CRM",
    field: "crm",
    align: "left",
    sortable: true,
  },
  {
    name: "especialidade",
    label: "Especialidade",
    field: "especialidade",
    align: "left",
    sortable: true,
  },
  {
    name: "acoes",
    label: "",
    field: "acoes",
    align: "center",
    sortable: false,
  },
];

export default defineComponent({
  name: "MediCos",
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
      this.$router.push("/medicos/create");
    },
    redirectEditar(id) {
      this.$router.push({ path: "/medicos/editar/" + id });
    },
    deletar(id) {
      this.isLoading = true;
      let token = {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      };
      this.$api
        .delete(`medicos/${id}`, token)
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
        .get("medicos", token)
        .then((response) => {
          const newData = response.data.map((value) => {
            return {
              nome: value.med_nome,
              crm: value.med_crm,
              especialidade: value.especialidade.espec_nome,
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
