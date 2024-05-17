<template>
  <div class="q-pa-md">
    <div class="q-gutter-md row items-start">
      <q-input v-model="nome" filled type="text" hint="Nome" />
      <q-input v-model="crm" filled type="text" hint="CRM" />
      <q-select
        filled
        v-model="especialidade"
        :options="data"
        option-value="id"
        option-label="desc"
        option-disable="inactive"
        emit-value
        map-options
        hint="Especialidades"
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
          @click="editarMedico"
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
      botaoLabel: "Editar",
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
      console.log(this.id);
      this.isLoading = true;
      let token = {
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        },
      };

      await this.$api.get('especialidades/listar', token).then((response) => {

        const newData = response.data.map((value) => {
          return {
            id: value.espec_codigo,
            desc: value.espec_nome,
          };
        });

        this.data = newData;
      })
      .catch((error) => {
        console.error(error);
      });

      await this.$api.get(`medicos/${this.id}`, token).then((response) => {
        this.nome = response.data.med_nome;
        this.crm = response.data.med_crm;
        this.especialidade = response.data.especialidade.espec_codigo;
        this.isLoading = false;
      })
      .catch((error) => {
        console.error(error);
      });
    },
    editarMedico() {
      this.isLoadingEnviar = true;
      this.botaoLabel = "Carregando ...";
      if (this.especialidade != "" && this.nome != "" && this.crm != "") {
        let token = {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        };
        this.$api.put(`medicos/${this.id}`, { med_nome: this.nome, med_crm: this.crm, med_espec: this.especialidade }, token).then((response) => {
          this.isLoadingEnviar = false;
          this.$router.push("/medicos");
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
      crm: ref(""),
      icon: ref(false),
      especialidade: ref(null),
    };
  },
});
</script>
