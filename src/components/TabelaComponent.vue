<template>
  <div class="q-pa-md">
    <q-table
      flat
      bordered
      :title="titulo"
      :rows="linhas"
      :columns="coluna"
      row-key="id"
      :loading="isLoading"
    >
      <template v-slot:body-cell-acoes="props">
        <td
          class="text-center"
          style="
            display: flex;
            gap: 15px;
            align-items: center;
            justify-content: center;
          "
        >
          <q-icon
            name="edit"
            @click="redirecionarRota(props.row.id)"
            style="cursor: pointer; font-size: larger"
            color="dark"
          />
          <q-icon
            name="delete"
            @click="fazerRequisicao(props.row.id)"
            style="cursor: pointer; font-size: larger"
            color="red"
          />
        </td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TabelaComponent",
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

<style>
.q-table__title {
  color: #348ab3;
  border-radius: 5px;
}
.q-table__top,
.q-table__bottom,
thead tr:first-child th {
  background-color: #f9f9f9;
}
thead tr th {
  position: sticky;
  z-index: 1;
}
thead tr:first-child th {
  top: 0;
}
tbody {
  scroll-margin-top: 48px;
}
</style>
