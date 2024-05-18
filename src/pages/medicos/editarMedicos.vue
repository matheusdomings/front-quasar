<template>
  <div class="q-pa-md">
    <div class="q-gutter-md column items-start">
      <q-input
        v-model="nome"
        filled
        type="text"
        hint="NOME"
        class="q-pa-md full-width"
      />
      <q-input
        v-model="crm"
        filled
        type="text"
        hint="CRM"
        class="q-pa-md full-width"
      />
      <q-select
        filled
        v-model="especialidade"
        :options="data"
        option-value="id"
        option-label="desc"
        option-disable="inactive"
        emit-value
        map-options
        hint="ESPECIALIDADE"
        class="q-pa-md full-width"
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
          @click="editarMedico"
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
  name: "editarMedicos",
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
    };
  },
  mounted() {
    this.carregarMedico();
  },
  methods: {
    voltar() {
      this.$router.push("/medicos");
    },
    async carregarMedico() {
      this.isLoading = true;
      let token = {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      };

      await this.$api
        .get("especialidades", token)
        .then((response) => {
          const newData = response.data.map((value) => {
            return {
              id: value.id,
              desc: value.espec_nome,
            };
          });

          this.data = newData;
        })
        .catch((error) => {
          console.error(error);
        });

      await this.$api
        .get(`medicos/${this.id}`, token)
        .then((response) => {
          this.nome = response.data.med_nome;
          this.crm = response.data.med_crm;
          this.especialidade = response.data.especialidade.espec_nome;
          this.isLoading = false;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    editarMedico() {
      this.isLoadingEnviar = true;
      this.botaoLabel = "Carregando ...";
      if (this.nome != "" && this.crm != "") {
        let token = {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        };
        this.$api
          .put(
            `medicos/${this.id}`,
            {
              med_nome: this.nome,
              med_crm: this.crm,
            },
            token
          )
          .then(() => {
            this.isLoadingEnviar = false;
            this.$router.push("/medicos");
          })
          .catch((error) => {
            if (error.response.status) {
              localStorage.clear("token");
              this.$router.push("/");
            }
            this.isLoadingEnviar = false;
            console.error(error);
          });
      } else {
        this.isLoadingEnviar = false;
        this.icon = true;
      }
    },
  },
  setup() {
    return {
      nome: ref(""),
      crm: ref(""),
      icon: ref(false),
      especialidade: ref(null),
    };
  },
});
</script>
