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
      <q-input v-model="valor" filled hint="VALOR" class="full-width q-pa-md" />
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
          label="Finalizar Cadastro"
          style="background-color: #348ab3"
          text-color="white"
          @click="criarProcedimento"
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

export default defineComponent({
  name: "createProcedimentos",
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
      this.$router.push("/procedimentos");
    },
    criarProcedimento() {
      this.isLoadingEnviar = true;
      this.botaoLabel = "Carregando ...";
      if (this.valor != "" && this.nome != "") {
        let token = {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        };
        this.$api
          .post(
            `procedimentos`,
            {
              proc_nome: this.nome,
              proc_valor: this.valor,
            },
            token
          )
          .then(() => {
            this.isLoadingEnviar = false;
            this.$router.push("/procedimentos");
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.retornoTitulo = "Erro";
              this.retorno = "Esse nome de procedimento já existe";
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
