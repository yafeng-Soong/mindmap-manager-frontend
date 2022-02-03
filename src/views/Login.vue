<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="fill-height">
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>论文脑图工具</v-toolbar-title>
    </v-app-bar>
    <register-dialog
      v-if="registerDialog"
      :dialog="registerDialog"
      @on-change-dialog="changRegisterDialog"
    ></register-dialog>
    <reset-dialog
      :dialog="resetDialog"
      @on-change-reset-dialog="changeResetDialog"
    ></reset-dialog>
    <v-content class="login-wrap">
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <!-- <v-flex xs2 sm6 md3> -->
            <v-card class="login-panel">
              <v-toolbar dark color="primary">
                <v-toolbar-title>登录论文脑图工具</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form
                  ref="form"
                  v-model="valid"
                  lazy-validation >
                  <v-text-field class="text-field"
                    v-model="loginInfo.email"
                    prepend-icon="mdi-email"
                    name="login"
                    label="邮箱"
                    hint="请输入注册时的邮箱"
                    type="text"
                    :rules="emailRules"
                    required></v-text-field>
                  <v-text-field class="text-field"
                    v-model="loginInfo.password"
                    id="password"
                    prepend-icon="mdi-lock"
                    :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                    :type="showPassword ? 'text' : 'password'"
                    name="password"
                    label="密码"
                    :rules="pwdRules"
                    @click:append="showPassword = !showPassword"
                    required
                    @keyup.enter="Login"></v-text-field>
                </v-form>
              </v-card-text >
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="resetDialog = true">忘记密码</v-btn>
                <v-btn color="primary" text @click="registerDialog = true">注册</v-btn>
                <!-- <v-btn color="primary" @click="Login" :disabled="loading">
                  <v-progress-circular
                    v-show="loading"
                    indeterminate
                    color="white"
                    size="20"
                    width="2"
                  ></v-progress-circular>
                  <span v-show="!loading">登录</span>
                </v-btn> -->
                <progress-button 
                  color="primary"
                  title="登录"
                  :disabled="loading"
                  :loading="loading"
                  @click="Login">
                </progress-button>
              </v-card-actions>
            </v-card>
          <!-- </v-flex> -->
        </v-layout>
      </v-container>
    </v-content>
    <v-footer color="primary" app>
      <span class="white--text">&copy; 2020</span>
    </v-footer>
  </div>
</template>

<script>
  import userApi from "@/api/userApi.js"
  import RegisterDialog from '@/components/login/RegisterDialog.vue'
  import ResetDialog from '@/components/login/ResetDialog.vue'
  import ProgressButton from '../components/common/ProgressButton.vue'
  export default {
    name: "Login",
    components:{
      RegisterDialog,
      ResetDialog,
      ProgressButton
    },
    data(){
      return{
        valid: true,//开启表单的检查
        showPassword: false,
        loading: false,
        registerDialog: false,
        resetDialog: false,
        loginInfo:{
          email:'',
          password:''
        },
        emailRules: [
          v => !!v || '必须输入邮箱字段',
          v => /^\w+([.-]?\w+)*@\w+([.-]\w+)*(\.\w{2,3})+$/.test(v) || '请输入正确格式的邮箱'
        ],
        pwdRules: [
          v => !!v || '必须输入密码字段',
          v => /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(v) || '密码由 6-16位字母数字组合组成'
        ],
      }
    },
    methods:{
      // Login(){
      //   let that = this
      //   if (this.$refs.form.validate()) {
      //     userApi.login(that.loginInfo)
      //       .then(res => {
      //         if (res.code !== 200){
      //           this.$toast.error(res.data)
      //       }else{
      //           that.loading = true
      //           this.$toast.success("登陆成功！请稍等~")
      //           this.$store.commit('SET_CURRENT_USER', res.data)
      //           setTimeout(() => {
      //             that.loading = false
      //             that.$router.replace('/home');
      //           }, 1500)
      //         }
      //       })
      //       .catch(err => {
      //         that.loading = false
      //         console.log(err)
      //       })
      //   }
      // },
      async Login() {
        if (!this.$refs.form.validate())
          return
        let param = {
          email: this.loginInfo.email,
          password: this.loginInfo.password,
        }
        this.loading = true
        try {
          let res = await userApi.login(param)
          if (res.code === 200) {
            this.$toast.success("登录成功！")
            this.$store.commit('SET_CURRENT_USER', res.data.userInfo)
            this.$store.commit('setToken', res.data.token)
            this.$router.replace('/home');
          } else this.$toast.error(res.data)
        } catch (err) {
          console.log(err)
        }
        this.loading = false
      },
      changRegisterDialog(val) {
        this.registerDialog = val
      },
      changeResetDialog(val) {
        this.resetDialog = val
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login-panel{
    height: 300px;
    min-width: 400px;
    max-width: 600px;
  }
</style>
