<template>
  <v-dialog v-model="dialog_" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">新建脑图</span>
      </v-card-title>
      <v-card-text>
        <v-text-field 
          v-model="addVo.name"
          label="脑图名称" 
          name="name"
          prepend-icon="mdi-format-title"
          required
          hint="请输入脑图名称"
          type="text"
          :rules="nameRules"></v-text-field>
        <v-text-field 
          v-model="addVo.description"
          label="脑图描述" 
          name="description"
          prepend-icon="mdi-fountain-pen"
          required
          hint="请添加一个简短的描述"
          type="text"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog_=false">关闭</v-btn>
        <v-btn color="blue darken-1" text :disabled="!addDisable" @click="add">新建</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import themeApi from '@/api/themeApi.js'
export default {
  name: 'MindmapAddDialog',
  props:{
    dialog: {
      types: Boolean,
      default: false
    }
  },
  data() {
    return {
      nameRules: [
        v => !!v || '必须输入邮箱字段',
        v => v.length <= 30 || '不能超过30个字符'
      ],
      addVo: {
        name: null,
        description: null
      }
    }
  },
  computed: {
    dialog_: {
      get() {
        return this.dialog;
      },
      set(val) {
        //drawer_改变由父组件控制
        this.$emit("on-change-dialog", val);
      }
    },
    addDisable() {
      let v = this.addVo.name
      return !!v && v.length <= 30
    }
  },
  methods: {
    add() {
      themeApi.addTag(this.addVo)
        .then(res => {
          if (res.code === 200) {
            this.$toast.success('新增成功')
            this.dialog_ = false
          } else this.$toast.error(res.msg)
        })
        .catch(err => {
          console.log(err)
          this.$toast.error('网络异常')
        })
    }
  }
}
</script>

<style>

</style>