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
          @click="criarMedico"
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
  name: "editarPlanos",
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      data: null,
      isLoading: false,
      isLoadingEnviar: false,
      botaoLabel: "Editar",
    };
  },
  mounted() {
    this.carregarPlano();
  },
  methods: {
    voltar() {
      this.$router.push("/planosSaude");
    },
    async carregarPlano() {
      this.isLoading = true;
      let token = {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      };

      await this.$api
        .get(`plano-saude/${this.id}`, token)
        .then((response) => {
          this.nome = response.data.plano_descricao;
          this.telefone = response.data.plano_telefone;
        })
        .catch((error) => {
          console.error(error);
        });
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
        this.$api
          .put(
            `plano-saude/${this.id}`,
            {
              plano_descricao: this.nome,
              plano_telefone: this.telefone,
            },
            token
          )
          .then(() => {
            this.isLoadingEnviar = false;
            this.$router.push("/planosSaude");
          })
          .catch((error) => {
            if (error.response.status) {
              localStorage.clear("token");
              this.$router.push("/");
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
