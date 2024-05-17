<template>
  <div class="q-pa-md">
    <q-table
      :title="titulo"
      :rows="linhas"
      :columns="coluna"
      row-key="id"
      :loading="isLoading"
    >
      <template v-slot:body-cell-acoes="props">
        <td class="text-center">
          <q-icon name="edit" @click="redirecionarRota(props.row.id)" style="cursor: pointer; font-size: larger; margin: 0 2px;" />
          <q-icon name="delete" @click="fazerRequisicao(props.row.id)" style="cursor: pointer; font-size: larger; margin: 0 2px;" :label="labelDinamic" />
        </td>
      </template>
    </q-table>
  </div>
</template>


<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TabelaLink",
  props: {
    dados: Object,
    coluna: Object,
    linha: Object,
    titulo: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      labelDinamic: "Deletar",
    };
  },
  methods: {
    redirecionarRota(id) {
      this.$emit("enviar-edit", id);
    },
    fazerRequisicao(id) {
      this.$emit("enviar-funcao", id);
    },
  },
  computed: {
    linhas() {
      if (this.dados) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.isLoading = false;
        return this.dados;
      } else {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.isLoading = true;
        return [];
      }
    },
  },
  setup() {
    return {};
  },
});
</script>
