<template>
  <q-item clickable>
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" style="color: #348ab3" />
    </q-item-section>

    <q-item-section
      style="
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      "
    >
      <q-item-label
        style="
          font-size: 13px;
          text-transform: uppercase;
          margin-left: -15px;
          letter-spacing: 1px;
        "
        >{{ title }}</q-item-label
      >
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "MenuComponent",
  props: {
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
  },
});
</script>
