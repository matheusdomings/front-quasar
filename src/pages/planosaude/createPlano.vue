<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-input v-model="nome" filled type="text" hint="Nome" />
      <q-input v-model="telefone" filled mask="(##)####-####" hint="Telefone" />
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
  name: "createPlanos",
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
  mounted() {},
  methods: {
    voltar() {
      this.$router.push("/planosSaude");
    },
    criarMedico() {
      this.isLoadingEnviar = true;
      this.botaoLabel = "Carregando ...";
      if (this.telefone != "" && this.nome != "") {
        let token = {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        };
        axios
          .post(
            `${url}api/planosaude`,
            {
              plano_descricao: this.nome,
              plano_telefone: this.telefone,
            },
            token
          )
          .then((response) => {
            this.isLoadingEnviar = false;
            this.$router.push("/planosSaude");
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.retornoTitulo = "Erro";
              this.retorno = "Telefone ou nome já existem.";
              this.icon = true;
            }
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
      nome: ref(""),
      telefone: ref(""),
      icon: ref(false),
    };
  },
});
</script>
