<template>
  <div class="fill-height">
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>论文脑图工具</v-toolbar-title>
    </v-app-bar>
    <v-layout align-center justify-center>
      <v-card width="500" style="margin-top:10%">
        <v-card-title>
          <span class="headline">重置密码</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field 
                  v-model="password"
                  label="密码*"
                  name="password"
                  prepend-icon="mdi-lock"
                  :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  :type="showPassword ? 'text' : 'password'"
                  hint="密码由6-16位字母数字组合组成"
                  required
                  :rules="pwdRules"
                  @click:append="showPassword = !showPassword"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="confirmPassword"
                  :disabled="!confirmDisable"
                  label="重复密码*"
                  name="confirmPassword"
                  prepend-icon="mdi-lock"
                  :type="showPassword ? 'text' : 'password'"
                  hint="请重复密码"
                  required
                  :rules="confirmRules"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <!-- <v-btn color="primary" text :disabled="!resetDisable" @click="resetPassword">
            <v-progress-circular
              v-show="loading"
              indeterminate
              color="primary"
              size="20"
              width="2"
            ></v-progress-circular>
            <span v-show="!loading">重置</span>
          </v-btn> -->
          <progress-button 
            :text="true"
            progressColor="blue darken-1"
            color="blue darken-1"
            title="重置"
            :disabled="!resetDisable"
            :loading="loading"
            @click="resetPassword">
          </progress-button>
        </v-card-actions>
      </v-card>
    </v-layout>
  </div>
</template>

<script>
import userApi from "@/api/userApi.js"
import ProgressButton from '../../components/common/ProgressButton.vue'

export default {
  name: 'ResetPassword',
  components: { ProgressButton },
  data() {
    return {
      showPassword: false,
      password: null,
      loading: false,
      confirmPassword: null,
      token: null,
      registerInfo: {
        email: null,
        password: null
      },
      pwdRules: [
        v => !!v || '必须输入密码字段',
        v => /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(v) || '密码由6-16位字母数字组合组成'
      ],
      confirmRules: [
        v => !!v || '请重复密码',
        v => this.password === v || '前后两次输入密码不一致'
      ]
    }
  },
  created() {
    this.token = this.$route.query.token
    if (this.token == null)
      this.$router.replace('/login')
  },
  computed: {
    confirmDisable() {
      return /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.password)
    },
    resetDisable() {
      let password = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(this.password)
      let confirm = (this.password === this.confirmPassword)
      let sending = !this.loading
      return password && confirm && sending
    },
  },
  methods: {
    resetPassword() {
      let that = this
      let param = {
        token: this.token,
        password: this.password
      }
      this.loading = true
      userApi.resetPassword(param)
        .then(res => {
          if (res.code === 200) {
            this.$toast.success(res.data)
            this.$router.replace('/login')
          } else this.$toast.error(res.data)
          that.loading = false
        })
        .catch(err => {
          console.log(err)
          that.loading = false
        })
    }
  }
}
</script>

<style>

</style>