<template>
  <el-dialog width="50%"
             :model-value="courseDataVisible"
             destroy-on-close
             :close-on-click-modal="false"
             @close="onCancel">

    <template #header="{close,titleId,titleClass}">
      <div class="my-header">
        <el-icon size="26px"><FolderOpened/></el-icon>
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
          label="资料名称"
          prop="name"
      >
        <template #default="{row}">
          <el-input v-if="row.edit" v-model="row.name" placeholder="资料名称如：第1章 随堂源码和课程笔记" />
          <span v-else>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="下载地址"
          prop="value"
      >
        <template #default="{row}">
          <el-input v-if="row.edit" v-model="row.downloadAddress" placeholder="下载地址如：course.zip" />
          <span v-else>{{ row.downloadAddress }} <el-progress v-show="row.progress" :percentage="row.percentag" /></span>
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
                  <el-button link>删除</el-button>
                </template>
              </el-popconfirm>
            </span>
            <span v-else>
              <el-button link @click="saveRow(row)">保存</el-button>
              <el-button link @click="cancel(row)">取消</el-button>
            </span>
          </template>
          <span v-else style="display: flex;justify-content:space-around;">
            <el-button link @click="toggle(row.id)">编辑</el-button>
<!--            <el-button type="text" @click="upLoad(row.id)">上传</el-button>-->
            <!--上传资料 start-->
             <el-upload
                 class="upload-demo"
                 name="fileResource"
                 :action="uploadURL"
                 :before-upload="beforeUpload"
                 :limit="1"
                 :data="{courseDataId:row.id}"
                 :show-file-list="false"
                 :on-success="FileOnSuccess"
             >
                <el-button link>上传</el-button>
              </el-upload>
            <!--上传资料 end-->
            <el-popconfirm title="是否要删除此行？" @confirm="remove(row.id)">
              <template #reference>
                <el-button link>删除</el-button>
              </template>
            </el-popconfirm>
          </span>
        </template>
      </el-table-column>

    </el-table>

    <el-button style="width: 100%;margin-top: 16px; border-style: dashed;" @click="newTableData">
      <i class="el-icon-plus" />
      新增课程资料
    </el-button>
    <div class="dialog-button-wrap">
      <el-button @click="close">取消</el-button>
      <el-button :loading="subLoading" type="primary" @click="saveCourseData">保存</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref,watch,h } from 'vue'
import {ElMessage,UploadProps } from 'element-plus'
import {getCourseDataListApi, saveCourseDataApi} from "@/api/edu/course/course";
const props = defineProps(['courseTitle','courseDataVisible','courseId'])
// 服务器路径
const url = import.meta.env.VITE_APP_BASE_API
// 课程资料上传到服务器的路径
const uploadURL = url+"aliVod/upload/uploadFile"
// 课程ID
const courseId = ref(props.courseId)

const emit = defineEmits(['onCancel'])
const tableData = ref<any[]>([])
const tableLoading = ref<boolean>(false)

/**
 * 根据课程ID获取课程资料列表
 */
const getCourseDataList = async () => {
  if(props.courseId){
    const { data } = await getCourseDataListApi(props.courseId)
    tableData.value = data.result
  }
}
watch(props, (newCourseId) => {
  getCourseDataList()

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
    downloadAddress: '',
    name: '',
    edit: true,
    isNew: true,
    progress: false,
    percentag: 0,// 进度条
    courseId: props.courseId
  })

  newIndex.value--
  tableData.value = newData
}
/**
 * 添加、保存
 */
const saveRow = (record: { id: any; name: any; downloadAddress: any }) => {
  tableLoading.value = true
  const { id, name, downloadAddress } = record
  if (!name) {
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
}
/**
 * 编辑显示
 */
const toggle = (key: number) => {
  const target: any = tableData.value.find(item => item.id === key)
  target._originalData = { ...target }
  target.edit = !target.edit
}

// 进度条对象
const percentag = ref(0)
/**
 * 上传对应资料
 */
const upLoading = (key: number,urlFile:string) => {
  const target: any = tableData.value.find(item => item.id === key)
  target._originalData = { ...target }
  target.progress = true
  target.percentag = percentag.value
  target.downloadAddress = urlFile
}

/**
 * beforeUpload
 */
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  console.log("rawFile",rawFile)
  if (rawFile.type !== 'application/zip') {
    ElMessage.error('上传文件失败，只能上传zip格式的文件')
    return false
  } else if (rawFile.size / 1024 / 1024 > 50) {
    ElMessage.error('上传的文件大于 50MB!')
    return false
  }
  return true
}
/**
 * 文件上传成功
 */
const FileOnSuccess=(response: any, file: any, fileList: any)=>{
  upLoading(response.result.courseDataId,response.result.urlPath)
  console.info("文件上传成功后：",response)
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
// 保存按钮状态
const subLoading= ref(false)
/**
 * 保存数据到数据库
 */
const saveCourseData = async () => {
  subLoading.value = true
  const { data } = await saveCourseDataApi(tableData.value)
  ElMessage.success(data.message)
  subLoading.value = false
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
