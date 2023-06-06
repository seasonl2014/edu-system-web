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
          <span v-else>{{ row.downloadAddress }} <el-progress v-show="row.progress" :percentage="percentag" /></span>
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
            <!--上传资料 start-->
             <el-upload
                 ref="uploadRef"
                 class="upload-demo"
                 name="fileResource"
                 :on-change="onChange"
                 :action="uploadURL"
                 :before-upload="beforeUpload"
                 :limit="1"
                 :data="{courseDataId:row.id,fileKey:fileKey}"
                 :show-file-list="false"
                 :on-success="FileOnSuccess"
             >
                <el-button link v-show="selectBtn" @click="submitUpload(row.id)">上传</el-button>
                <el-button link v-show="uploadBtn">开始上传</el-button>
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
      <el-button @click="onCancel">取消</el-button>
      <el-button :loading="subLoading" type="primary" @click="saveCourseData">保存</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref,watch,h } from 'vue'
import {ElMessage,UploadProps,UploadInstance,UploadFile,UploadFiles } from 'element-plus'
import {getCourseDataListApi, getPercentApi, saveCourseDataApi} from "@/api/edu/course/course";
import {Md5} from 'ts-md5/dist/md5';
const props = defineProps(['courseTitle','courseDataVisible','courseId'])
// 文件MD5
const fileKey = ref('')
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
    courseId: props.courseId,
    fileKey: ''
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

// 上传组件实例
const uploadRef = ref<UploadInstance>()
// 选择按钮状态
const selectBtn = ref(true)
// 上传按钮状态
const uploadBtn = ref(false)
//课程资料ID
const courseDataId = ref(0)
/**
 * 定时查询上传进度 1秒查一次
 */
let intervalId: any = null
/**
 * 选择需要上传的资料
 */
const submitUpload = (key:number)=> {
  courseDataId.value = key
  console.log('选择需要上传的资料key：',key)
  // 禁用保存按钮
  subLoading.value = true
}
/**
 * 选中文件时
 */
const onChange = (uploadFile: UploadFile, uploadFiles: UploadFiles)=> {
  const target: any = tableData.value.find(item => item.id === courseDataId.value)
  percentag.value = 0
  // 显示进度条
  target.progress = true
  // 启动定时器
  intervalId =  window.setInterval(getUploadPercent, 1000)
}
// 进度条对象
const percentag = ref(0)
/**
 * 上传对应资料
 */
const upLoading = (key: number,urlFile:string) => {
  const target: any = tableData.value.find(item => item.id === courseDataId.value)
  target.downloadAddress = urlFile
  target.fileKey = fileKey.value
  // 隐藏进度条
  target.progress = false
  console.log('上传成功后返回的信息target.downloadAddress：',target.downloadAddress)
}


/**
 * 获取进度条
 */
const getUploadPercent= async ()=>{
  console.log('上传资料进度条！')
  const {data} = await getPercentApi(fileKey.value)
  if(data.result.percent >= 100){
    console.log('上传资料进度条！完成清除')
    window.clearInterval(intervalId)
    percentag.value = 100
  }else if (data.result.percent != -1) {
    percentag.value = data.result.percent
  }
}

/**
 * beforeUpload
 */
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {

  console.log("uploadRef----------------:",uploadRef.value)
  // 文件标志
  const fileDetails = rawFile.name+rawFile.size+rawFile.type+rawFile.lastModified;
  //使用当前文件的信息用md5加密生成一个key 这个加密是根据文件的信息来加密的  如果相同的文件 加的密还是一样的
  const key = Md5.hashStr(fileDetails);
  console.log('文件加密后key:',key)
  fileKey.value = key
  if (rawFile.type !== 'application/zip') {
    // 打开保存按钮
    subLoading.value = false
    ElMessage.error('上传文件失败，只能上传zip格式的文件')
    return false
  } else if (rawFile.size / 1024 / 1024 > 500) {
    // 打开保存按钮
    subLoading.value = false
    ElMessage.error('上传的文件大于 500MB!')
    return false
  }
  return true
}
/**
 * 文件上传成功
 */
const FileOnSuccess=(response: any, file: any, fileList: any)=>{
  console.log('FileOnSuccess方法上传资料进度条！完成清除')
  window.clearInterval(intervalId)
 upLoading(response.result.courseDataId,response.result.urlPath)
  // 打开保存按钮
  subLoading.value = false
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
  onCancel()
  window.clearInterval(intervalId)
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
