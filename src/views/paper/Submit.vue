<template>
  <div class="fill-height ma-4">
    <v-card>
      <v-toolbar  dark color="primary">
        <v-toolbar-title style="font-size: x-large">上传论文</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" lazy-validation ref="form">
          <v-container fluid>
            <v-col cols="3">
              <v-text-field
                v-model="paperInfo.publishYear"
                outlined
                required
                dense
                :rules="rules.publishYear"
                prepend-icon="mdi-calendar-month"
                label="发表年份">
              </v-text-field>
            </v-col>
            <v-container fluid>
              <v-row>
                <v-col cols="4">
                  <v-autocomplete
                    v-model="themeName"
                    :rules="rules.notEmpty"
                    :disabled="themeDisable"
                    :items="themeList"
                    item-text="name"
                    outlined
                    required
                    dense
                    small-chips
                    deletable-chips
                    prepend-icon="mdi-brain"
                    label="所属脑图"
                    @change="themeChange">
                  </v-autocomplete>
                </v-col>
                <v-col cols="8">
                  <v-autocomplete
                    v-model="tagNameList"
                    :rules="rules.listRule"
                    :disabled="themeDisable"
                    :items="tagList"
                    item-text="name"
                    outlined
                    required
                    dense
                    small-chips
                    deletable-chips
                    multiple
                    prepend-icon="mdi-tag-multiple-outline"
                    label="所属节点">
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
            <v-col cols="12">
              <v-text-field
                v-model="paperInfo.name"
                outlined
                required
                :rules="rules.notEmpty"
                prepend-icon="mdi-format-title"
                label="论文题目">
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="paperInfo.author"
                outlined
                required
                :rules="rules.notEmpty"
                prepend-icon="mdi-account-edit"
                label="作者">
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="paperInfo.keyword"
                outlined
                required
                :rules="rules.notEmpty"
                prepend-icon="mdi-file-word-box-outline"
                label="关键字">
              </v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="paperInfo.abstracts"
                outlined
                required
                :rules="rules.notEmpty"
                prepend-icon="mdi-file-document"
                label="文章摘要">
              </v-textarea>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="paperInfo.summary"
                outlined
                required
                :rules="rules.notEmpty"
                prepend-icon="mdi-fountain-pen"
                label="你对文章的概括">
              </v-textarea>
            </v-col>
            <v-col cols="12">
              <v-file-input
                v-model="file"
                outlined
                required
                show-size
                accept="application/msword, application/pdf, text/plain, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                :rules="rules.fileRule"
                label="点击上传论文附件">
              </v-file-input>
            </v-col>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-layout justify-center>
          <v-btn class="ma-4" color="success" @click="submit">上传</v-btn>
        </v-layout>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import paperApi from "@/api/paperApi.js"
import tagApi from '@/api/tagApi.js'
import themeApi from '@/api/themeApi.js'
export default {
  name: 'Submit',
  data(){
    return {
      file: null,
      valid: true,
      themeDisable: false,
      fromNavigation: true, // 是否是从侧边栏跳转过来的
      themeName: '',
      tagNameList: [],
      themeList: [],
      tagList: [],
      paperInfo: {
        filePath: '',
        keyword: '',
        name: '',
        abstracts:'',
        summary: '',
        author: '',
        publishYear: '',
        tags: []
      },
      rules: {
        notEmpty: [
          v => !!v || '不能为空'
        ],
        listRule: [
          v => v.length > 0 || '不能为空'
        ],
        publishYear: [
          v => !!v || '不能为空',
          v => /^[1-9]\d{3}$/.test(v) || '发表年份格式不正确'
        ],
        fileRule: [
          v => !!v || '文件必选',
          v => v.size / 1024 / 1024 < 15 || '文件不能超过15MB'
        ]
      }
    }
  },
  mounted() {
    let themeInfo = this.$store.getters.getThemeInfo
    let tagInfo = this.$store.getters.getTagInfo
    // this.themeList.push(themeInfo)
    if (tagInfo && themeInfo) {
      this.fromNavigation = false
      this.themeList.push(themeInfo)
      this.tagList.push(tagInfo)
      this.tagNameList.push(tagInfo.name)
      this.themeName = themeInfo.name
      this.themeDisable = true
    } else {
      let that = this
      themeApi.getList()
        .then(res => {
          if (res.code === 200)
            that.themeList = res.data
          else
            console.log('获取theme列表出错')
        })
        .catch(err => {
          console.log('获取theme列表出错')
          console.log(err)
        })
    }
  },
  destroyed() {
    this.$store.commit('deleteTagInfo')
  },
  methods: {
    async submit() {
      // 设置论文的tag，可能有很多
      for (let i = 0; i < this.tagNameList.length; i++) {
        for (let j = 0; j < this.tagList.length; j++) {
          if (this.tagNameList[i] == this.tagList[j].name) {
            this.paperInfo.tags.push(this.tagList[j].id)
            break;
          }
        }
      }
      if (this.$refs.form.validate()) {
        try {
          let res = await paperApi.submit(this.paperInfo)
          console.log("上传论文成功返回值")
          console.log(res)
          if (res.code === 200)
            this.uploadFile(res.data)
          else {
            this.$toast.error(res.msg)
            console.log(res)
          }  
        } catch (err) {
          this.$toast.error('上传论文失败！')
          console.log(err)
        } 
      }
    },
    uploadFile(paperId) {
      const formData = new FormData()
      formData.append('file', this.file)
      formData.append('paperId', paperId)
      paperApi.uploadFile(formData)
        .then(res => {
          if (res.code === 200) {
            this.$toast.success('上传论文成功！')
          } else {
            this.$toast.error(res.msg)
            console.log(res)
          }
          this.$router.replace('/myPaper')
        })
        .catch(err => {
          this.$toast.error('文件上传失败')
          console.log(err)
          this.$router.replace('/myPaper')
        })
    },
    async themeChange() {
      for (let i = 0; i < this.themeList.length; i++) 
        if (this.themeName == this.themeList[i].name) {
          try {
            let res = await tagApi.getSimpleList(this.themeList[i].id)
            if (res.code === 200)
              this.tagList = res.data
            else{
              console.log('获取tag列表出错')
              console.log(res)
            }
          } catch (err) {
            console.log('获取tag列表出错')
            console.log(err)
          }
        }
    }
  }
}
</script>

<style>

</style>