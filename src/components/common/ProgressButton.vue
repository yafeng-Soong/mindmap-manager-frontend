<template>
  <v-btn :color="color" :text="text" :disabled="disabled" @click="clicked">
    <v-progress-circular
      v-show="loading"
      indeterminate
      :color="progressColor"
      size="20"
      width="2"
    ></v-progress-circular>
    <span v-show="!loading">{{title}}</span>
  </v-btn>
</template>

<script>
export default {
  name: 'ProgressButton',
  props: {
    text: {
      types: Boolean,
      default: false
    },
    color: {
      types: String,
      default: 'primary'
    },
    progressColor: {
      types: String,
      default: 'primary'
    },
    loading: {
      types: Boolean,
      default: false
    },
    disabled: {
      types: Boolean,
      default: false
    },
    title: {
      types: String,
      default: '按键'
    }
  },
  methods: {
    clicked() {
        this.$emit('click')
    }
  }
}
</script>

<style>

</style>