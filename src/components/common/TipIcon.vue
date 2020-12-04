<template>
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-btn
        :color="color"
        icon
        :small="small"
        v-on="on"
        @click="handClick"
      >
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
    </template>
    <span>{{tip}}</span>
  </v-tooltip>
</template>

<script>
export default {
  name: "TipIcon",
  props: {
    icon: {
      type: String,
      default: 'mdi-restore'
    },
    small: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'white'
    },
    tip: {
      type: String,
      default: '添加提示信息'
    }
  },
  methods: {
    handClick() {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>

</style>