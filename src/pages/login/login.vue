<template>
  <q-page
    class="bg-light-green window-height window-width row justify-center items-center"
    style="background-color: #9b3490 !important"
  >
    <div class="column">
      <div
        class="row"
        style="display: flex; justify-content: center; margin-bottom: 20px"
      >
        <img src="https://www.tisaude.com/images/logo.png" width="300" alt="" />
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                square
                filled
                clearable
                v-model="email"
                type="email"
                label="email"
              />
              <q-input
                square
                filled
                clearable
                v-model="password"
                type="password"
                label="password"
                :disabled="isLoadingEnviar"
              />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
              unelevated
              color="light-green-7"
              size="lg"
              class="full-width"
              :label="botaoLabel"
              @click="login"
            />
          </q-card-actions>
          <q-card-section class="text-center q-pa-none"> </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
// import axios from "axios";
// import { url } from "src/urlApi";
export default {
  name: "LogiN",
  data() {
    return {
      email: "kkuphal@example.org",
      password: "password",
      botaoLabel: "Login",
      isLoadingEnviar: false,
    };
  },
  methods: {
    login() {
      const { email, password } = this;

      if (email != "" && password != "") {
        this.isLoadingEnviar = true;
        this.botaoLabel = "Carregando ...";
        this.$api.post('/login', { email, password })
          .then((response) => {
            const token = response.data.token;
            console.log(token);
            localStorage.setItem("token", token);
            this.$router.push("/bemvindo");
          })
          .catch((error) => {
            this.isLoadingEnviar = false;
            this.botaoLabel = "Login";
            console.error("Erro ao fazer login:", error);
            alert("Erro ao fazer login. Verifique suas credenciais.");
          });
      } else {
        alert("Erro ao fazer login. Os campos precisam estar preenchidos.");
      }
    },
  },
};
</script>

<style>
.q-card {
  width: 360px;
}
</style>
