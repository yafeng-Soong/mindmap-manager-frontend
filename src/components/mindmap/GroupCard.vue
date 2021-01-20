<template>
  <v-layout justify-center align-center>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-toolbar dark color="red lighten-2">
          <v-card-title>
            确定要退出脑图？
          </v-card-title>
        </v-toolbar>
        <v-card-text class="display-1 text--primary">
          退出后要创建者重新邀请，您才能再次参与编辑
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <progress-button
            :text="true"
            progressColor="error"
            color="error"
            title="退出"
            :disabled="loading"
            :loading="loading"
            @click="exit">
          </progress-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card class="ma-1" min-width="320" max-width="450">
      <v-card-text>
        <div>于 {{themeInfo.createTime}} 加入</div>
        <p class="display-1 text--primary single-text">
          {{themeInfo.name}}
        </p>
        <p>创建者 {{themeInfo.creator}}</p>
        <p>最后更新于 {{themeInfo.updateTime}}</p>
        <div class="text--primary single-text">
          {{themeInfo.description}}
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          text
          color="orange"
          @click="detail"
        >
          进入脑图
        </v-btn>
        <v-btn 
          text 
          color="error"
          @click="dialog = true">
          退出
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-layout>
</template>

<script>
import themeApi from '@/api/themeApi.js'
import ProgressButton from '../../components/common/ProgressButton.vue'
export default {
  name:'GroupCard',
  components: { ProgressButton },
  props: {
    themeInfo: {
      types: Object,
      default: null
    }
  },
  data() {
    return {
      dialog: false,
      loading: false,
    }
  },
  methods: {
    detail() {
      // this.$emit('detail-click', this.themeInfo)
      this.$store.commit('setThemeInfo', this.themeInfo)
      this.$router.push('/mindmapInfo')
    },
    async exit() {
      this.loading = true
      try {
        let themeId = this.themeInfo.id
        let res = await themeApi.exitTheme(themeId)
        if (res.code === 200) {
          this.$emit('exited')
          this.$toast.success(res.data)
        }
        else
          this.$toast.error(res.data)
      } catch (err) {
        console.log(err)
        this.$toast.error('网络异常~')
      }
      this.loading = false
      this.dialog = false
    },
    changeDialog(val) {
      this.dialog = val
      this.$emit('changed')
    }
  }
}
</script>

<style>
  .single-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>