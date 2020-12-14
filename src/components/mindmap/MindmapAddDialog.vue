<template>
  <v-dialog v-model="dialog_" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">{{title}}</span>
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
        <v-file-input 
          v-if="isAdd"
          v-model="file"
          outlined
          required
          show-size
          :rules="rules"
          label="点击上传xmind附件">
        </v-file-input>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog_=false">关闭</v-btn>
        <v-btn v-if="isAdd" color="blue darken-1" text :disabled="!addDisable" @click="add">新建</v-btn>
        <v-btn v-if="!isAdd" color="blue darken-1" text :disabled="!updateAble" @click="update">更新</v-btn>
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
    },
    isAdd: {
      types: Boolean,
      default: true
    },
    themeInfo: {
      types: Object,
      default: null
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
      },
      file: null,
      rules: [
        v => v.size / 1024 / 1024 < 15 || '文件不能超过15MB'
      ]
    }
  },
  created() {
    if (!this.isAdd) {
      this.addVo.name = this.themeInfo.name
      this.addVo.description = this.themeInfo.description
      this.addVo.id = this.themeInfo.id
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
    title() {
      return this.isAdd? '新建脑图': '修改信息'
    },
    addDisable() {
      let v = this.addVo.name
      let f = this.file
      return !!v && v.length <= 30 && (!!f && f.size/1024/1024<15 || f == null)
    },
    updateAble() {
      let name = this.addVo.name
      let des = this.addVo.description
      return !!name && name.length <= 30 && !!des && des.length <= 50
    }
  },
  methods: {
    add() {
      if (this.file == null)
        themeApi.addTheme(this.addVo)
          .then(res => {
            if (res.code === 200) {
              this.$toast.success('新增成功')
              this.dialog_ = false
            } else this.$toast.error(res.data)
          })
          .catch(err => {
            console.log(err)
            this.$toast.error('网络异常')
          })
      else {
        const formData = new FormData()
        formData.append('file', this.file)
        formData.append('name', this.addVo.name)
        formData.append('description', this.addVo.description)
        themeApi.addByXmind(formData)
          .then(res => {
            if (res.code === 200) {
              this.$toast.success('导入xmind成功')
              this.dialog_ = false
            } else this.$toast.error(res.data)
          })
          .catch(err => {
            console.log(err)
            this.$toast.error('网络异常')
          })
      }
    },
    update() {
      themeApi.updateTheme(this.addVo)
        .then(res => {
          if (res.code === 200) {
            this.$toast.success('修改成功')
            this.dialog_ = false
          } else this.$toast.error(res.data)
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