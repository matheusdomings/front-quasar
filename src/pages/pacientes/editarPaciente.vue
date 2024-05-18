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
      <q-input
        v-model="dt_nascimento"
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
          label="Salvar Alterações"
          style="background-color: #348ab3"
          text-color="white"
          @click="editarPaciente"
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
  name: "editarPaciente",
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
      this.$router.push("/pacientes");
    },
    async carregarPlano() {
      this.isLoading = true;
      let token = {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      };
      await this.$api
        .get("plano-saude", token)
        .then((response) => {
          const newData = response.data.map((value) => {
            return {
              id: value.id,
              desc: value.plano_descricao,
            };
          });

          this.data = newData;
        })
        .catch((error) => {
          console.error(error);
        });

      await this.$api
        .get(`pacientes/${this.id}`, token)
        .then((response) => {
          this.nome = response.data.pac_nome;
          this.telefone = response.data.pac_telefone;
          this.dt_nascimento = response.data.pac_dt_nascimento;
          this.plano = response.data.plano_codigo;
          this.isLoading = false;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    editarPaciente() {
      this.isLoadingEnviar = true;
      this.botaoLabel = "Carregando ...";
      if (this.telefone != "" && this.nome != "" && this.dt_nascimento != "") {
        let token = {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        };
        this.$api
          .put(
            `pacientes/${this.id}`,
            {
              pac_nome: this.nome,
              pac_telefone: this.telefone,
              pac_dt_nascimento: this.dt_nascimento,
              ...(this.plano ? { plano_saude: this.plano } : null),
            },
            token
          )
          .then(() => {
            this.isLoadingEnviar = false;
            this.$router.push("/pacientes");
          })
          .catch((error) => {
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
      dt_nascimento: ref(""),
      icon: ref(false),
      plano: ref(null),
    };
  },
});
</script>
