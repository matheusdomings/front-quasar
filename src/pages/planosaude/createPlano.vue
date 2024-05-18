<template>
  <div class="q-pa-md">
    <div class="q-gutter-md column items-start">
      <q-input
        v-model="nome"
        filled
        type="text"
        hint="NOME"
        class="full-width q-pa-md"
      />
      <q-input
        v-model="telefone"
        filled
        mask="(##) # ####-####"
        hint="TELEFONE"
        class="full-width q-pa-md"
      />
    </div>
    <div class="q-pt-md">
      <div
        style="display: flex; justify-content: flex-end; gap: 15px"
        class="q-pa-md"
      >
        <q-btn
          label="Voltar"
          color="white"
          text-color="black"
          @click="voltar"
          :disabled="isLoadingEnviar"
        />
        <q-btn
          label="Finalizar Cadastro"
          style="background-color: #348ab3"
          text-color="white"
          @click="criarPlano"
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

export default defineComponent({
  name: "createPlanos",
  data() {
    return {
      data: null,
      isLoading: false,
      isLoadingEnviar: false,
    };
  },
  mounted() {},
  methods: {
    voltar() {
      this.$router.push("/planosSaude");
    },
    criarPlano() {
      this.isLoadingEnviar = true;
      this.botaoLabel = "Carregando ...";
      if (this.telefone != "" && this.nome != "") {
        let token = {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        };
        this.$api
          .post(
            `plano-saude`,
            { plano_descricao: this.nome, plano_telefone: this.telefone },
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
