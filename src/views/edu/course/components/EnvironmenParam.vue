<template>
  <el-dialog width="50%"
             :model-value="environmenVisible"
             destroy-on-close
             :close-on-click-modal="false"
             @close="onCancel">

    <template #header="{close,titleId,titleClass}">
      <div class="my-header">
        <el-icon size="26px"><Setting/></el-icon>
        <h1>{{courseTitle}}</h1>
      </div>
    </template>

    <el-table
        v-loading="tableLoading"
        row-key="id"
        header-row-class-name="custom-table-header"
        :data="tableData"
    >
      <el-table-column
          label="参数名称"
          prop="name"
      >
        <template #default="{row}">
          <el-input v-if="row.edit" v-model="row.name" placeholder="参数名称如：数据库" />
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="参数值"
          prop="value"
      >
        <template #default="{row}">
          <el-input v-if="row.edit" v-model="row.value" placeholder="参数值如：mysql5.7" />
          <span v-else>{{ row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="操作"
          prop="action"
          width="200"
      >
        <template #default="{row}">
          <template v-if="row.edit">
            <span v-if="row.isNew">
              <el-button type="text" @click="saveRow(row)">添加</el-button>
              <el-popconfirm title="是否要删除此行？" @confirm="remove(row.id)">
                <template #reference>
                  <el-button type="text">删除</el-button>
                </template>
              </el-popconfirm>
            </span>
            <span v-else>
              <el-button type="text" @click="saveRow(row)">保存</el-button>
              <el-button type="text" @click="cancel(row)">取消</el-button>
            </span>
          </template>
          <span v-else>
            <el-button type="text" @click="toggle(row.id)">编辑</el-button>
            <el-popconfirm title="是否要删除此行？" @confirm="remove(row.id)">
              <template #reference>
                <el-button type="text">删除</el-button>
              </template>
            </el-popconfirm>
          </span>
        </template>
      </el-table-column>

    </el-table>

    <el-button style="width: 100%;margin-top: 16px; border-style: dashed;" @click="newTableData">
      <i class="el-icon-plus" />
      新增环境参数
    </el-button>
    <div class="dialog-button-wrap">
      <el-button @click="close">取消</el-button>
      <el-button :loading="subLoading" type="primary" @click="setEnvironmen">保存</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref,watch } from 'vue'
import {ElMessage} from 'element-plus'
import {getEnvironmenListApi, setEnvironmenApi} from "@/api/edu/course/course";
const props = defineProps(['courseTitle','environmenVisible','courseId'])

const courseId = ref(props.courseId)

const emit = defineEmits(['onCancel'])
const tableData = ref<any[]>([])
const tableLoading = ref<boolean>(false)

/**
 * 根据课程ID获取环境参数列表
 */
const getEnvironmenList = async () => {
  if(props.courseId){
    const { data } = await getEnvironmenListApi(props.courseId)
    tableData.value = data.result
  }
}
watch(props, (newCourseId) => {
  console.log('newCourseId:',newCourseId)
  getEnvironmenList()

})

/**
 * 点击关闭按钮
 */
const onCancel = ()=> {
  emit('onCancel')
}

/**
 * 新增内容
 */
const newIndex = ref<number>(0)
const newTableData = () => {
  const newData = tableData.value.map(item => ({ ...item }))
  newData.push({
    id: newIndex.value,
    value: '',
    name: '',
    edit: true,
    isNew: true,
    courseId: props.courseId
  })

  newIndex.value--
  tableData.value = newData
}
/**
 * 添加、保存
 */
const saveRow = (record: { id: any; name: any; value: any }) => {
  tableLoading.value = true
  const { id, name, value } = record
  if (!name || !value) {
    tableLoading.value = false
    ElMessage.error('请填写完整环境信息。')
    return
  }

  const target: any = tableData.value.find(item => item.id === id)
  if (target) {
    target.edit = false
    target.isNew = false
    target._originalData = undefined
  }
  tableLoading.value = false
  const newData = tableData.value.map(item => ({ ...item }))
  console.info('添加或保存', newData)
}
/**
 * 编辑显示
 */
const toggle = (key: number) => {
  const target: any = tableData.value.find(item => item.id === key)
  target._originalData = { ...target }
  target.edit = !target.edit
}
/**
 * 删除
 */
const remove = async(key: number) => {
  const newData = tableData.value.filter(item => item.id !== key)
  tableData.value = newData
}
/**
 * 取消编辑
 */
const cancel = (key: any) => {
  const target: any = tableData.value.find(item => item.id === key.id)
  if (target) {
    target._originalData = { ...target }
    target.edit = !target.edit
  }
}
/**
 * 保存数据到数据库
 */
const setEnvironmen = async () => {
  const { data } = await setEnvironmenApi(tableData.value)
  ElMessage.success(data.message)
}
</script>

<style scoped>
/*自定义弹出框头部样式*/
.my-header {
  display: flex;
  justify-content: flex-start;
  color: #083a6d;
}
.dialog-button-wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
