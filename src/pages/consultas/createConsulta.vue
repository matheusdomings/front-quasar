<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-select
        filled
        v-model="procedimento"
        :options="procedimentos"
        option-value="id"
        option-label="desc"
        option-disable="inactive"
        emit-value
        map-options
        hint="Procedimento"
        style="min-width: 250px; max-width: 300px"
        :loading="isLoading"
      />
      <q-input
        v-model="data"
        filled
        type="text"
        mask="##/##/####"
        hint="Data"
      />
      <q-input v-model="hora" filled type="text" mask="##:##:##" hint="Hora" />
      <q-select
        filled
        v-model="particular"
        :options="partircularArray"
        option-value="id"
        option-label="desc"
        option-disable="inactive"
        emit-value
        map-options
        hint="Particular"
        style="min-width: 250px; max-width: 300px"
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
        hint="Médico"
        style="min-width: 250px; max-width: 300px"
        :loading="isLoading"
      />
      <q-select
        filled
        v-model="paciente"
        :options="pacientes"
        option-value="id"
        option-label="desc"
        option-disable="inactive"
        emit-value
        map-options
        hint="Paciente"
        style="min-width: 250px; max-width: 300px"
        :loading="isLoading"
      />
    </div>
    <div class="q-pa-md q-gutter-sm">
      <div style="display: flex; justify-content: flex-end" class="q-pa-md">
        <q-btn
          style="margin: 0 5px"
          label="Voltar"
          color="primary"
          @click="voltar"
          :disabled="isLoadingEnviar"
        />
        <q-btn
          :label="botaoLabel"
          color="primary"
          @click="criarMedico"
          :disabled="isLoadingEnviar"
        />
      </div>
    </div>
  </div>
  <q-dialog v-model="icon">
    <q-card>
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Dados faltando.</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        Todo os campos precisam ser preenchidos.
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { ref } from "vue";
import axios from "axios";
import { url } from "src/urlApi";

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
      botaoLabel: "Criar",
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
      axios
        .post(
          `${url}api/medicos/listar`,
          {
            registro_por_pagina: 10,
          },
          token
        )
        .then((response) => {
          // Atualize o estado de `data` com os dados da resposta

          const newData = response.data.data.map((value) => {
            return {
              id: value.med_codigo,
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
      axios
        .post(
          `${url}api/pacientes/listar`,
          {
            registro_por_pagina: 10,
          },
          token
        )
        .then((response) => {
          // Atualize o estado de `data` com os dados da resposta

          const newData = response.data.data.map((value) => {
            return {
              id: value.pac_codigo,
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
      axios
        .post(
          `${url}api/procedimentos/listar`,
          {
            registro_por_pagina: 10,
          },
          token
        )
        .then((response) => {
          // Atualize o estado de `data` com os dados da resposta

          const newData = response.data.data.map((value) => {
            return {
              id: value.proc_codigo,
              desc: value.proc_nome + `, Valor: ${value.proc_valor}`,
            };
          });

          this.procedimentos = newData;
          this.isLoading = false;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    criarMedico() {
      this.isLoadingEnviar = true;
      this.botaoLabel = "Carregando ...";
      if (
        this.data != "" &&
        this.hora != "" &&
        this.medico != "" &&
        this.paciente != "" &&
        this.particular != ""
      ) {
        console.log(this.paciente);
        console.log(this.pacientes);
        var pacienteVinculo = this.pacientes.filter(
          (val) => val.id == this.paciente
        );
        console.log(pacienteVinculo);
        console.log(pacienteVinculo[0].vinculo_codigo);
        let token = {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        };
        axios
          .post(
            `${url}api/consultas`,
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
          .then((response) => {
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
