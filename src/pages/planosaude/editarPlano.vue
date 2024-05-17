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

      await axios
        .get(`${url}api/planosaude/${this.id}`, token)
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
        axios
          .put(
            `${url}api/planosaude/${this.id}`,
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
