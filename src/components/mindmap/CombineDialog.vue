<template>
  <v-dialog v-model="dialog_" persistent max-width="500px">
    <v-card>
      <v-card-title>
        <span class="headline">合并到其他脑图</span>
      </v-card-title>
      <v-card-text>
        <v-autocomplete
          v-model="themeId"
          :rules="rules.notEmpty"
          :items="themeList"
          item-text="name"
          item-value="id"
          outlined
          required
          dense
          small-chips
          deletable-chips
          prepend-icon="mdi-brain"
          label="合并到脑图"
          @change="themeChange">
        </v-autocomplete>
        <v-autocomplete
          v-model="tagId"
          :rules="rules.notEmpty"
          :items="tagList"
          item-text="name"
          item-value="tagId"
          outlined
          required
          dense
          small-chips
          deletable-chips
          prepend-icon="mdi-tag-multiple-outline"
          label="合并到节点">
        </v-autocomplete>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog_=false">关闭</v-btn>
        <v-btn color="blue darken-1" text :disabled="combineDisable" @click="combineTo">合并</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import tagApi from '@/api/tagApi.js'
import themeApi from '@/api/themeApi.js'
export default {
  name: 'CombineDialog',
  props:{
    dialog: {
      types: Boolean,
      default: false
    },
    themeInfo: {
      types: Object,
      default: null
    }
  },
  data() {
    return {
      rules: {
        notEmpty: [
          v => !!v || '不能为空'
        ],
      },
      themeList: [],
      tagList: [],
      themeId: null,
      tagId: null,
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
    combineDisable() {
      return this.tagId == null
    }
  },
  mounted() {
    let selfId = this.themeInfo.id
    let that = this
    themeApi.getOtherList(selfId)
      .then(res => {
        if (res.code === 200)
          that.themeList = res.data
        else
          console.log('获取脑图列表出错')
      })
      .catch(err => {
        console.log(err)
      })
  },
  methods: {
    async themeChange() {
      if (this.themeId == null) {
        this.tagList = []
        return
      }
      try {
        let res = await tagApi.getSimpleList(this.themeId)
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
    },
    combineTo() {
      let that = this
      let param ={
        toTagId: this.tagId,
        fromThemeId: this.themeInfo.id
      }
      themeApi.combineToTheme(param)
        .then(res => {
          if (res.code === 200) {
            this.$toast.success(res.data)
            that.dialog_ = false
          }
          else this.$toast.error(res.msg)
        })
        .catch(err => {
          console.log(err)
          this.$toast.error(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
  .autocomplete{
    max-width: 500px;
  }
</style>