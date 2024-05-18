<template>
  <div class="q-pa-md">
    <div class="q-gutter-md column items-start">
      <q-select
        filled
        v-model="paciente"
        :options="pacientes"
        option-value="id"
        option-label="desc"
        option-disable="inactive"
        emit-value
        map-options
        hint="PACIENTE"
        class="full-width q-pa-md"
        :loading="isLoading"
      />
      <q-select
        filled
        v-model="medico"
        :options="medicos"
        option-value="id"
        option-label="desc"
        option-disable="inactive"
        emit-value
        map-options
        hint="MÉDICO"
        class="full-width q-pa-md"
        :loading="isLoading"
      />
      <q-select
        filled
        v-model="procedimento"
        :options="procedimentos"
        option-value="id"
        option-label="desc"
        option-disable="inactive"
        emit-value
        map-options
        hint="PROCEDIMENTO"
        class="full-width q-pa-md"
        :loading="isLoading"
      />
      <q-input
        v-model="data"
        filled
        type="text"
        mask="##/##/####"
        hint="DATA"
        class="full-width q-pa-md"
      />
      <q-input
        v-model="hora"
        filled
        type="text"
        mask="##:##"
        hint="HORA"
        class="full-width q-pa-md"
      />
      <q-select
        filled
        v-model="particular"
        :options="partircularArray"
        option-value="id"
        option-label="desc"
        option-disable="inactive"
        emit-value
        map-options
        hint="CONSULTA PARTICULAR?"
        class="full-width q-pa-md"
        :loading="isLoading"
      />
    </div>
    <div class="q-pa-md q-gutter-sm">
      <div
        style="display: flex; justify-content: flex-end; gap: 15px"
        class="q-pt-md"
      >
        <q-btn
          label="Voltar"
          color="white"
          text-color="black"
          @click="voltar"
          :disabled="isLoadingEnviar"
        />
        <q-btn
          label="Salvar Alterações"
          style="background-color: #348ab3"
          text-color="white"
          @click="editarConsulta"
          :disabled="isLoadingEnviar"
        />
      </div>
    </div>
  </div>
  <q-dialog v-model="icon">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Informações pendentes</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        Preencha todos os campos para prosseguir
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { ref } from "vue";

const partircularArray = [
  {
    id: "0",
    desc: "Não",
  },
  {
    id: "1",
    desc: "Sim",
  },
];

export default defineComponent({
  name: "editarConsultas",
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      medicos: null,
      pacientes: null,
      procedimentos: null,
      isLoading: false,
      isLoadingEnviar: false,
      botaoLabel: "Editar",
      partircularArray: partircularArray,
    };
  },
  mounted() {
    this.carregarProcedimentos();
    this.carregarMedicos();
    this.carregarPacientes();
    this.carregarDados();
  },
  methods: {
    voltar() {
      this.$router.push("/consultas");
    },
    carregarMedicos() {
      this.isLoading = true;
      let token = {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      };
      this.$api
        .get(`medicos`, token)
        .then((response) => {
          const newData = response.data.map((value) => {
            return {
              id: value.id,
              desc: value.med_nome,
            };
          });

          this.medicos = newData;
          this.isLoading = false;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    carregarPacientes() {
      this.isLoading = true;
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
              id: value.id,
              desc: value.pac_nome,
              vinculo_codigo: value.vinculo_codigo,
            };
          });

          this.pacientes = newData;
          this.isLoading = false;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    carregarProcedimentos() {
      this.isLoading = true;
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
              id: value.id,
              desc: value.proc_nome,
            };
          });

          this.procedimentos = newData;
          this.isLoading = false;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    carregarDados() {
      let token = {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      };
      this.$api
        .get(`consultas/${this.id}`, token)
        .then((response) => {
          this.procedimento = response.data.procedimento[0]
            ? response.data.procedimento[0].id
            : null;
          this.data = response.data.data;
          this.hora = response.data.hora;
          this.particular = response.data.particular;
          this.medico = response.data.medico.id;
          this.paciente = response.data.paciente.id;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    editarConsulta() {
      this.isLoadingEnviar = true;
      this.botaoLabel = "Carregando ...";
      if (
        this.data != "" &&
        this.hora != "" &&
        this.medico != "" &&
        this.paciente != "" &&
        this.particular != ""
      ) {
        var pacienteVinculo = this.pacientes.filter(
          (val) => val.id == this.paciente
        );
        var medicoSelecionado = this.medicos.filter(
          (val) => val.id == this.medico
        );
        var procedimentoSelecionado = this.procedimentos.filter(
          (val) => val.id == this.procedimento
        );
        let token = {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        };
        this.$api
          .put(
            `consultas/${this.id}`,
            {
              data: this.data,
              hora: this.hora,
              cons_med: medicoSelecionado[0].id,
              cons_pac: pacienteVinculo[0].id,
              particular: this.particular,
              ...(pacienteVinculo[0].vinculo_codigo
                ? { vinculo_id: pacienteVinculo[0].vinculo_codigo }
                : null),
              ...(procedimentoSelecionado[0].id
                ? { procedimento: procedimentoSelecionado[0].id }
                : null),
            },
            token
          )
          .then(() => {
            this.isLoadingEnviar = false;
            this.$router.push("/consultas");
          })
          .catch((error) => {
            this.isLoadingEnviar = false;
            this.botaoLabel = "Criar";
            console.error(error);
          });
      } else {
        this.botaoLabel = "Criar";
        this.isLoadingEnviar = false;
        this.icon = true;
      }
    },
  },
  setup() {
    return {
      data: ref(""),
      hora: ref(""),
      icon: ref(false),
      medico: ref(""),
      paciente: ref(""),
      particular: ref(""),
      procedimento: ref(""),
    };
  },
});
</script>
