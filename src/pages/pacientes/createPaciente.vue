<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
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
      <q-input
        v-model="dataNascimento"
        filled
        mask="##/##/####"
        hint="DATA DE NASCIMENTO"
        class="full-width q-pa-md"
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
        hint="PLANO DE SAÚDE"
        class="full-width q-pa-md"
        :loading="isLoading"
      />
    </div>
    <div class="q-pT-md">
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
          @click="createPaciente"
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
  name: "createPaciente",
  data() {
    return {
      data: null,
      isLoading: false,
      isLoadingEnviar: false,
    };
  },
  mounted() {
    this.getPlanos();
  },
  methods: {
    voltar() {
      this.$router.push("/pacientes");
    },
    getPlanos() {
      this.isLoading = true;
      let token = {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      };
      this.$api
        .get(`plano-saude`, token)
        .then((response) => {
          const newData = response.data.map((value) => {
            return {
              id: value.id,
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
    createPaciente() {
      this.isLoadingEnviar = true;
      this.botaoLabel = "Carregando ...";
      if (this.telefone != "" && this.nome != "" && this.dataNascimento != "") {
        let token = {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        };
        this.$api
          .post(
            `pacientes`,
            {
              pac_nome: this.nome,
              pac_telefone: this.telefone,
              pac_dt_nascimento: this.dataNascimento,
              ...(this.plano ? { plano_saude: this.plano } : null),
            },
            token
          )
          .then(() => {
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
