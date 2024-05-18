<template>
  <div class="q-pa-md q-gutter-sm" style="position: relative">
    <Tabela
      :dados="data"
      titulo="Consultas"
      :coluna="coluna"
      @enviar-funcao="deletar"
      @enviar-edit="redirectEditar"
    />
    <div style="display: flex; justify-content: flex-end" class="q-pa-md">
      <q-btn
        label="Marcar Consulta"
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
    name: "acoes",
    label: "",
    field: "acoes",
    sortable: false,
    align: "center",
  },
  {
    name: "paciente",
    align: "center",
    label: "Paciente",
    field: "paciente",
    align: "left",
    sortable: true,
  },
  {
    name: "procedimento",
    align: "center",
    label: "Procedimento",
    field: "procedimento",
    align: "left",
    sortable: true,
  },
  {
    name: "medico",
    align: "center",
    label: "Médico",
    field: "medico",
    align: "left",
    sortable: true,
  },
  {
    name: "data",
    align: "center",
    label: "Data",
    field: "data",
    align: "left",
    sortable: true,
  },
  {
    name: "hora",
    align: "center",
    label: "Horario",
    field: "hora",
    align: "left",
    sortable: true,
  },
  {
    name: "particular",
    align: "center",
    label: "Particular",
    field: "particular",
    align: "left",
    sortable: true,
  },
  {
    name: "plano",
    align: "center",
    label: "Plano de Saúde",
    field: "plano",
    align: "left",
    sortable: true,
  },
  {
    name: "nr_contrato",
    align: "center",
    label: "Nº do Contrato",
    field: "nr_contrato",
    align: "left",
    sortable: true,
  },
];

export default defineComponent({
  name: "consultaS",
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
      this.$api
        .delete(`consultas/${id}`, token)
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
        .get(`consultas`, token)
        .then((response) => {
          const newData = response.data.map((value) => {
            return {
              data: value.data,
              hora: value.hora,
              particular: value.particular == "1" ? "S" : "N",
              medico: value.medico.med_nome,
              nr_contrato: value.vinculo ? value.vinculo.nr_contrato : "",
              plano: value.vinculo
                ? value.vinculo.plano_saude.plano_descricao
                : "",
              paciente: value.paciente.pac_nome,
              procedimento: value.procedimento[0]
                ? value.procedimento[0].proc_nome
                : "#",
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
