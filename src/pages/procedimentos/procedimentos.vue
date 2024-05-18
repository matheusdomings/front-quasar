<template>
  <div class="q-pa-md q-gutter-sm" style="position: relative">
    <Tabela
      :dados="data"
      titulo="Procedimentos"
      :coluna="coluna"
      @enviar-funcao="deletar"
      @enviar-edit="redirectEditar"
    />
    <div
      style="display: flex; justify-content: flex-end; gap: 15px"
      class="q-pa-md"
    >
      <q-btn
        label="Cadastrar Procedimento"
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
    name: "valor",
    align: "left",
    label: "Valor",
    field: "valor",
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
  name: "procedimentoS",
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
      this.$router.push("/procedimentos/create");
    },
    redirectEditar(id) {
      this.$router.push({ path: "/procedimentos/editar/" + id });
    },
    deletar(id) {
      this.isLoading = true;
      let token = {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      };
      this.$api
        .delete(`procedimentos/${id}`, token)
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
        .get(`procedimentos`, token)
        .then((response) => {
          const newData = response.data.map((value) => {
            return {
              name: value.proc_nome,
              valor: "R$ " + value.proc_valor,
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
