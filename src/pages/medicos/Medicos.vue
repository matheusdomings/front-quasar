<template>
  <div class="q-pa-md q-gutter-sm" style="position: relative">
    <TabelaLink
      :dados="data"
      titulo="Médicos"
      :coluna="coluna"
      @enviar-funcao="deletar"
      @enviar-edit="redirectEditar"
    />
    <div style="display: flex; justify-content: flex-end" class="q-pa-md">
      <q-btn
        style="margin: 0 5px"
        label="Voltar"
        color="primary"
        @click="redirectToNewPage"
      />
      <q-btn label="Novo médico" color="primary" @click="redirectToCreate" />
    </div>
    <div
      v-if="isLoading"
      style="
        width: 95%;
        height: 50vh;
        position: absolute;
        top: 0;
        z-index: 99999999;
        display: flex;
        justify-content: center;
        align-items: center;
      "
    >
      <q-spinner-hourglass color="purple" size="4em" />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import TabelaLink from "components/TabelaLink.vue";

const columns = [
  {
    name: "name",
    required: true,
    label: "Nome",
    align: "left",
    field: (row) => row.name,
    format: (val) => `${val}`,
    sortable: true,
  },
  { name: "crm", align: "center", label: "CRM", field: "crm", sortable: true },
  {
    name: "especialidade",
    label: "Especialidade",
    field: "especialidade",
    sortable: true,
  },
  {
    name: "acoes",
    label: "Ações",
    field: "acoes",
    sortable: false,
    align: "center",
  },
];

export default defineComponent({
  name: "MediCos",
  components: {
    TabelaLink,
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
    redirectToNewPage() {
      console.log("Clicou no link");
      this.$router.push("/");
    },
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
      this.$api.delete(`medicos/${id}`, token).then((response) => {
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
      this.$api.get('medicos/listar', token)
        .then((response) => {

          const newData = response.data.map((value) => {
            return {
              name: value.med_nome,
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
