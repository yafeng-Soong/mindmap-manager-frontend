<template>
  <v-card class="ma-1">
    <v-card-text>
      <div>于 {{themeInfo.createTime}} 创建</div>
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
        查看详情
      </v-btn>
      <v-btn
        text
        color="primary"
        @click="edit"
      >
        修改信息
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name:'MindmapCard',
  props: {
    themeInfo: {
      types: Object,
      default: null
    }
  },
  methods: {
    detail() {
      this.$emit('detail-click', this.themeInfo)
    },
    edit() {
      this.$emit('edit-click', this.themeInfo)
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