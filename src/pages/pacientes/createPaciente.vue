<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-input v-model="nome" filled type="text" hint="Nome" />
      <q-input v-model="telefone" filled mask="(##)####-####" hint="Telefone" />
      <q-input
        v-model="dataNascimento"
        filled
        mask="##/##/####"
        hint="Data de nascimento"
      />
      <q-select
        filled
        v-model="plano"
        :options="data"
        option-value="id"
        option-label="desc"
        option-disable="inactive"
        emit-value
        map-options
        hint="Planos de saúde"
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
        <div class="text-h6">{{ retornoTitulo }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        {{ retorno }}
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";
import { ref } from "vue";
import axios from "axios";
import { url } from "src/urlApi";

export default defineComponent({
  name: "createPaciente",
  data() {
    return {
      data: null,
      isLoading: false,
      isLoadingEnviar: false,
      retorno: "Todo os campos precisam ser preenchidos.",
      retornoTitulo: "Dados faltando.",
      botaoLabel: "Criar",
    };
  },
  mounted() {
    this.carregarEspecialidades();
  },
  methods: {
    voltar() {
      this.$router.push("/pacientes");
    },
    carregarEspecialidades() {
      this.isLoading = true;
      let token = {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      };
      axios
        .post(
          `${url}api/planosaude/listar`,
          {
            registro_por_pagina: 10,
          },
          token
        )
        .then((response) => {
          // Atualize o estado de `data` com os dados da resposta

          const newData = response.data.data.map((value) => {
            return {
              id: value.plano_codigo,
              desc: value.plano_descricao,
            };
          });

          this.data = newData;
          this.isLoading = false;
        })
        .catch((error) => {
          if (error.response.status) {
          }
          console.error(error);
        });
    },
    criarMedico() {
      this.isLoadingEnviar = true;
      this.botaoLabel = "Carregando ...";
      if (this.telefone != "" && this.nome != "" && this.dataNascimento != "") {
        let token = {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        };
        axios
          .post(
            `${url}api/pacientes`,
            {
              pac_nome: this.nome,
              pac_telefone: this.telefone,
              pac_dataNascimento: this.dataNascimento,
              ...(this.plano ? { plano_saude: this.plano } : null),
            },
            token
          )
          .then((response) => {
            this.isLoadingEnviar = false;
            this.$router.push("/pacientes");
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.retornoTitulo = "Erro";
              this.retorno = "Esse telefone já existe.";
              this.icon = true;
            }
            this.isLoadingEnviar = false;
            this.botaoLabel = "Criar";
            console.error(error);
          });
      } else {
        this.isLoadingEnviar = false;
        this.botaoLabel = "Criar";
        this.icon = true;
      }
    },
  },
  setup() {
    return {
      nome: ref(""),
      telefone: ref(""),
      dataNascimento: ref(""),
      icon: ref(false),
      plano: ref(null),
    };
  },
});
</script>
