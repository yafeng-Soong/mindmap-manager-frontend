<template>
  <v-pagination
    v-model="currentPage_"
    :length="total"
    :total-visible="5"
    :color="theme">

  </v-pagination>
</template>

<script>
  export default {
    name: "Pagination",
    props: {
      currentPage: {
        types: Number,
        default: 1
      },
      total: {
        types: Number,
        default: 0
      },
      theme: {
        types: String,
        default: 'primary'
      }
    },
    computed: {
      currentPage_: {
        get() {
          return this.currentPage;
        },
        set(val) {
          this.$emit("on-change-page", val);
        }
      },
    }
  }
</script>

<style scoped>

</style>
