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
          @click="criarEspecialidade"
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
  name: "createEspecialidade",
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
      this.$router.push("/especialidades");
    },
    criarEspecialidade() {
      this.isLoadingEnviar = true;
      this.botaoLabel = "Carregando ...";
      if (this.nome != "") {
        let token = {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        };
        this.$api
          .post("especialidades", { espec_nome: this.nome }, token)
          .then((response) => {
            this.isLoadingEnviar = false;
            this.$router.push("/especialidades");
          })
          .catch((error) => {
            if (error.response.status == 422) {
              this.retornoTitulo = "Erro";
              this.retorno = "Esse nome de especialidade já existe";
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
      icon: ref(false),
    };
  },
});
</script>
