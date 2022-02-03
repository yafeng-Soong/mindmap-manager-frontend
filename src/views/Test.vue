<template>
  <v-btn color="primary" @click="sayHello">测试登录</v-btn>
</template>

<script>
import userApi from "@/api/userApi.js"
export default {
  name: "Test",
  methods: {
    async sayHello() {
      try {
        let res = await userApi.sayHello()
        this.$toast.info(res)
      } catch (err) {
        console.log(err)
      }

    }
  }
}
</script>

<style scoped>

</style>