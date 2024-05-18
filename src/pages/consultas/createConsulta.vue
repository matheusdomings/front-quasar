<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
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
        hint="HORÁRIO"
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
          label="Finalizar Marcação"
          style="background-color: #348ab3"
          text-color="white"
          @click="criarConsulta"
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
  name: "createConsulta",
  data() {
    return {
      medicos: null,
      pacientes: null,
      procedimentos: null,
      isLoading: false,
      isLoadingEnviar: false,
      partircularArray: partircularArray,
    };
  },
  mounted() {
    this.carregarProcedimentos();
    this.carregarMedicos();
    this.carregarPacientes();
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
    criarConsulta() {
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
        let token = {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        };
        this.$api
          .post(
            `consultas`,
            {
              data: this.data,
              hora: this.hora,
              cons_med: this.medico,
              cons_pac: this.paciente,
              particular: this.particular,
              ...(pacienteVinculo[0].vinculo_codigo
                ? { vinculo_id: pacienteVinculo[0].vinculo_codigo }
                : null),
              ...(this.procedimento
                ? { procedimento: this.procedimento }
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
