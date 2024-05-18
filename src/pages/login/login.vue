<template>
  <q-page
    class="window-height window-width row justify-center items-center"
    style="background-color: #348ab3"
  >
    <div class="column">
      <div class="row">
        <q-card square bordered class="q-pa-lg">
          <q-card-section>
            <p
              class="q-pb-lg text-uppercase text-weight-medium"
              style="font-size: 20px; letter-spacing: 1px; color: #348ab3"
            >
              Gerenciamento Hospitalar
            </p>
            <q-form class="q-gutter-md">
              <q-input
                filled
                clearable
                v-model="email"
                type="email"
                label="Email"
                clear-icon="clear"
              />
              <q-input
                filled
                clearable
                v-model="password"
                type="password"
                label="Senha"
                clear-icon="clear"
                :disabled="isLoadingEnviar"
              />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
              style="background-color: #348ab3"
              text-color="white"
              size="md"
              class="full-width"
              :label="botaoAcessar"
              icon-right="login"
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
export default {
  name: "LogiN",
  data() {
    return {
      email: "",
      password: "",
      botaoAcessar: "Acessar",
      isLoadingEnviar: false,
    };
  },
  methods: {
    login() {
      const { email, password } = this;

      if (email != "" && password != "") {
        this.isLoadingEnviar = true;
        this.botaoAcessar = "Realizando login";
        this.$api
          .post("/login", { email, password })
          .then((response) => {
            const token = response.data.token;
            localStorage.setItem("token", token);
            this.$router.push("/consultas");
          })
          .catch((error) => {
            this.isLoadingEnviar = false;
            this.botaoAcessar = "Acessar";
            console.error("Erro ao fazer login:", error);
            alert("Erro ao fazer login. Credenciais inválidas.");
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
