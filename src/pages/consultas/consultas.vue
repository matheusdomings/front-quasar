<template>
  <div class="q-pa-md q-gutter-sm" style="position: relative">
    <TabelaLink
      :dados="data"
      titulo="Consultas"
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
      <q-btn label="Nova consulta" color="primary" @click="redirectToCreate" />
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
    name: "procedimento",
    align: "center",
    label: "Procedimento",
    field: "procedimento",
    sortable: true,
  },
  {
    name: "data",
    align: "center",
    label: "Data",
    field: "data",
    sortable: true,
  },
  {
    name: "hora",
    align: "center",
    label: "Hora",
    field: "hora",
    sortable: true,
  },
  {
    name: "particular",
    align: "center",
    label: "Particular",
    field: "particular",
    sortable: true,
  },
  {
    name: "medico",
    align: "center",
    label: "Medico",
    field: "medico",
    sortable: true,
  },
  {
    name: "nr_contrato",
    align: "center",
    label: "Nr_contrato",
    field: "nr_contrato",
    sortable: true,
  },
  {
    name: "plano",
    align: "center",
    label: "Plano",
    field: "plano",
    sortable: true,
  },
  {
    name: "paciente",
    align: "center",
    label: "Paciente",
    field: "paciente",
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
  name: "consultaS",
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
      this.$router.push("/consultas/create");
    },
    redirectEditar(id) {
      this.$router.push({ path: "/consultas/editar/" + id });
    },
    deletar(id) {
      this.isLoading = true;
      let token = {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      };
      axios
        .delete(`${url}api/consultas/${id}`, token)
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
          `${url}api/consultas/listar`,
          {
            registro_por_pagina: 10,
          },
          token
        )
        .then((response) => {
          // Atualize o estado de `data` com os dados da resposta

          const newData = response.data.data.map((value) => {
            return {
              data: value.data,
              hora: value.hora,
              particular: value.particular == "1" ? "sim" : "não",
              medico: value.medico.med_nome,
              nr_contrato: value.vinculo ? value.vinculo.nr_contrato : "",
              plano: value.vinculo
                ? value.vinculo.plano_saude.plano_descricao
                : "",
              paciente: value.paciente.pac_nome,
              procedimento: value.procedimento[0].proc_nome,
              id: value.cons_codigo,
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
