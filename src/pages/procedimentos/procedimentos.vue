<template>
  <div class="q-pa-md q-gutter-sm" style="position: relative">
    <TabelaLink
      :dados="data"
      titulo="Procedimentos"
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
      <q-btn
        label="Novo procedimento"
        color="primary"
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
import ModalLink from "components/ModalLink.vue";
import TabelaLink from "components/TabelaLink.vue";
import axios from "axios";
import { url } from "src/urlApi";

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
  {
    name: "valor",
    align: "center",
    label: "Valor",
    field: "valor",
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
  name: "procedimentoS",
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
      axios
        .delete(`${url}api/procedimentos/${id}`, token)
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
      axios
        .post(
          `${url}api/procedimentos/listar`,
          {
            registro_por_pagina: 10,
          },
          token
        )
        .then((response) => {
          const newData = response.data.data.map((value) => {
            return {
              name: value.proc_nome,
              valor: value.proc_valor + " R$",
              id: value.proc_codigo,
            };
          });

          this.data = newData;
          this.isLoading = false
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
