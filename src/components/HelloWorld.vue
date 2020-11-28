<template>
  <v-container class="fill-height" fluid>
    <mindmap v-model="data" class="fill-height" 
    @click="click(arguments)" 
    @nodeMove="nodeMove(arguments)"
    @nodeAdd="nodeAdd(arguments)"
    @nodeUpdateName="nodeUpdateName(arguments)"></mindmap>
  </v-container>
</template>

<script>
  import mindmap from '@hellowuxin/mindmap'
  export default {
    name: 'HelloWorld',
    components: { mindmap },
    data: () => ({
      data: [{name:"节点1"}]
    }),
    methods: {
      click(arg) {
        // console.log(arg[0])
        console.log(arg[0])
        console.log('d.data.id = ' + arg[1])

      },
      nodeChange(val) {
        console.log('节点改变后传回的数据~~')
        console.log(val)
      },
      nodeMove(arg) {
        console.log('del.id' + arg[0])
        console.log('insert?.id = ' + arg[1])
        console.log('id' + arg[2])
      },
      nodeAdd(arg) {
        console.log('parent.id = ' + arg[0])
        console.log('增加的节点')
        console.log(arg[1])
        console.log('父组件中的数据')
        console.log(this.data)
      },
      nodeUpdateName(arg) {
        console.log('d.id = ' + arg[0])
        console.log('修改后的名字' + arg[1])
      }
    }
  }
</script>
