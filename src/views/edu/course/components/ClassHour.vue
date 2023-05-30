<template>
  <el-dialog width="70%"
             :model-value="classHourVisible"
             destroy-on-close
             :close-on-click-modal="false"
             @close="onCancel">

    <template #header="{close,titleId,titleClass}">
      <div class="my-header">
        <el-icon size="26px"><FolderOpened/></el-icon>
        <h1>{{courseTitle}}</h1>
      </div>
    </template>

    <!--表格 start-->
    <el-table
        v-loading="tableLoading"
        row-key="id"
        header-row-class-name="custom-table-header"
        :data="tableData"
    >
      <el-table-column
          label="章节名称"
          prop="title"
      >
        <template #default="{row}">
          <el-input style="width: 92%;" v-if="row.edit" v-model="row.title" placeholder="章名称" />
          <span v-else>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="排序"
          prop="sort"
          width="140"
      >
        <template #default="{row}">
          <el-input-number
              v-if="row.edit"
              v-model="row.sort"
              :min="0"
              :max="1000"
              style="width: 100%;"
          />
          <span v-else>{{ row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column
          label="所属章节"
          prop="lev"
          width="80"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.lev===1">大章</el-tag>
          <el-tag v-else type="success">小节</el-tag>
        </template>
      </el-table-column>
      <el-table-column
          label="免费"
          prop="isFree"
          width="140"
      >
        <template #default="scope">
          <el-select v-if="scope.row.edit && scope.row.lev!==1" v-model="scope.row.isFree" placeholder="请选择">
            <el-option label="免费" :value="0" />
            <el-option label="收费" :value="1" />
          </el-select>
          <span v-else>
            <el-tag v-if="scope.row.isFree===0">免费</el-tag>
            <el-tag v-else-if="scope.row.isFree===1" type="success">收费</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column
          label="时长"
          prop="type"
          width="100"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.duration!=0" type="success">{{ durationFormatDate(scope.row.duration*1000) }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
          label="视频源"
          prop="videoSourceId"
          width="80"
      >
        <template #default="scope">
          <el-tag v-if="scope.row.lev!=1&&scope.row.videoSourceId!=null" effect="dark" type="success" style="cursor: pointer;" @click="playVideoByVideoId(scope.row.courseId,scope.row.id)">预览</el-tag>
          <el-tag v-if="scope.row.videoSourceId===null&&scope.row.lev!=1" effect="plain" type="warning">未上传</el-tag>
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
              <el-button link  @click="saveRow(row)">添加</el-button>
              <el-popconfirm title="是否要删除此行？" @confirm="remove(row)">
                <template #reference>
                  <el-button link >删除</el-button>
                </template>
              </el-popconfirm>
            </span>
            <span v-else>
              <el-button v-if="row.lev===1" link  @click="saveRow(row)">保存</el-button>
              <el-button v-else link  @click="updateVideo(row)">保存</el-button>
              <el-button link  @click="cancel(row)">取消</el-button>
            </span>
          </template>
          <span v-else>
            <el-button link @click="toggle(row.id)">编辑</el-button>
            <el-popconfirm title="是否要删除此行？" @confirm="remove(row)">
              <template #reference>
                <el-button link >删除</el-button>
              </template>
            </el-popconfirm>
            <el-button v-if="row.lev!=1&&row.videoSourceId!=null" link title="重新上传视频" @click="uploadVideoById(row.id)">重传</el-button>
            <el-button v-if="row.lev===1 && row.id>0" title="批量导入视频" type="primary" size="mini" icon="Upload" @click="batchUploadVideoById(row.id)" />
          </span>
        </template>
      </el-table-column>

    </el-table>
    <!--表格 end-->

    <el-button style="width: 100%;margin-top: 16px; border-style: dashed;" @click="newTableData">
      <i class="el-icon-plus" />
      新增章
    </el-button>

    <div class="dialog-button-wrap">
      <el-button @click="onCancel">取消</el-button>
    </div>
  </el-dialog>

  <!--批量上传课程小节视频 start-->
  <BatchUploadVideoForm
      v-if="batchUploadVideoFormVisible"
      :batchUploadVideoFormVisible="batchUploadVideoFormVisible"
      :values="chapterData"
      @on-cancel="() => batchUploadVideoFormCancel()"
      :get-percent="getBatchUploadPercent"
  />
  <!--批量上传课程小节视频 end-->


  <!--重传课程单个小节视频 start-->
  <UploadVideoForm
      v-if="uploadVideoFormVisible"
      :visible="uploadVideoFormVisible"
      :values="videoData"
      @on-cancel="() => uploadVideoFormCancel()"
      @get-percent="() => getUploadPercent()"
  />
  <!--重传课程单个小节视频 end-->
</template>

<script setup lang="ts">
import {ref,watch} from 'vue'
import {ElMessage} from 'element-plus'
import {useRouter} from 'vue-router'
import {
  delEduChapterApi,
  delEduVideoApi,
  getChapterApi,
  getChapterTreeListApi, getVideoApi,
  setEduChapterApi,
  updateVideoApi
} from "@/api/edu/course/course";
import BatchUploadVideoForm from "@/views/edu/course/components/BatchUploadVideoForm.vue"
import UploadVideoForm from "@/views/edu/course/components/UploadVideoForm.vue"
import {formatDuration} from "@/utils/date";
const props = defineProps(['courseTitle','classHourVisible','courseId'])
const emit = defineEmits(['onCancel'])
// 表格加载数据状态
const tableLoading = ref<boolean>(false)
// 保存按钮状态
const subLoading = ref(false)
// 表格数据对象
const tableData = ref<any[]>([])
// 新增内容的索引
const newIndex = ref<number>(0)
// 章节数据
const chapterData = ref<object>()
// 批量上传小节视频
const batchUploadVideoFormVisible = ref<boolean>(false)
watch(props, (newCourseId) => {
  getChapterTreeList()

})
/**
 * 格式化时长
 * @param time
 */
const durationFormatDate = (time: any) => {
  const data = new Date(time)
  return formatDuration(data, 'hh:mm:ss')
}
/**
 * 新增内容
 */
const newTableData = () => {
  const newData = tableData.value.map(item => ({ ...item }))
  newData.push({
    id: newIndex.value,
    title: '',
    sort: '',
    lev: 1,
    duration: 0,
    edit: true,
    isNew: true,
    courseId: props.courseId,
  })

  newIndex.value--
  tableData.value = newData
}

/**
 * 添加、保存
 * @param record
 */
const saveRow = (record: { id: any; title: any; sort: any;}) => {
  tableLoading.value = true
  const { id, title, sort } = record
  if (!title) {
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
  setEduChapter(id, title, sort)
}
/**
 * 新增或者编辑课程大章
 */
const setEduChapter = async (id: number, title:string, sort: number)=> {
  const params = {
    id: id,
    title: title,
    sort: sort,
    courseId: props.courseId,
  }
  const { data} = await setEduChapterApi(params)
  if(data.status === 200){
    ElMessage.success('保存成功')
    await getChapterTreeList()
  }else {
    ElMessage.error('保存失败！')
  }
}
/**
 * 获取课程大纲
 */
const getChapterTreeList = async ()=>{
  const  params ={
    courseId: props.courseId,
    pageIndex: 1,
    pageSize: 10
  }
  const {data} = await getChapterTreeListApi(params)
  tableData.value = data.result
}

/**
 * 点击关闭按钮
 */
const onCancel = ()=> {
  emit('onCancel')
}
/**
 * 批量上传视频弹框
 * @param id
 */
const batchUploadVideoById = async(id: number) => {
  const {data} = await getChapterApi(id)
  chapterData.value = data.result
  batchUploadVideoFormVisible.value = true
}
/**
 * 取消批量上传课程小节视频 弹框
 */
const batchUploadVideoFormCancel = () => {
  batchUploadVideoFormVisible.value = false
  getChapterTreeList()
}
/**
 * 批量获取上传进度条
 * @param values
 */
const getBatchUploadPercent = async(values: any) => {
  console.info('批量上传返回的参数值:', values)
}

/**
 * 编辑课程大纲
 * @param key
 */
const toggle = (key: number) => {
  const target: any = tableData.value.find(item => {
    return item.id === key
  })
  if (target === undefined) { // 编辑课时（小节）
    const childrenTarget: any = tableData.value.find(item => {
      const children:object[] = item.children
      if (children.length > 0) {
        const keyTarget: any = item.children.find((item: { id: number }) => {
          return item.id === key
        })
        if (keyTarget !== undefined) {
          keyTarget._originalData = { ...keyTarget }
          keyTarget.edit = !keyTarget.edit
        }
      } else {
        return null
      }
    })
  } else { // 表示编辑大章
    target._originalData = { ...target }
    target.edit = !target.edit
  }
}
/**
 * 取消编辑
 * @param key
 */
const cancel = (key: any) => {
  key._originalData = { ...key }
  key.edit = !key.edit
}

/**
 * 编辑课程小节
 */
const updateVideo = async (val:any) => {
  const { data } = await updateVideoApi(val)
  if(data.status===200){
    ElMessage.success('编辑成功！')
    await getChapterTreeList()
  }
}
/**
 * 删除小节
 */
const remove = async (val:any) => {
  if(val.lev>0){ // 删除课程大章的数据
    const {data} = await delEduChapterApi(val.id)
    if(data.status === 200){
      ElMessage.success(data.message)
    }
  }else {// 删除课程小节的数据
    const {data} = await delEduVideoApi(val.id)
    if(data.status === 200){
      ElMessage.success(data.message)
    }
  }
  await getChapterTreeList()
}

/**
 * 重新上传视频弹框
 */
// 重传视频弹出框状态
const uploadVideoFormVisible = ref(false)
// 课程小节数据对象
const videoData = ref<object>()
const uploadVideoById = async (id:number)=> {
  const {data} = await getVideoApi(id)
  if(data.status === 200){
    uploadVideoFormVisible.value = true
    videoData.value = data.result
  }
}
/**
 * 取消上传课程小节视频 弹框
 */
const uploadVideoFormCancel = () => {
  uploadVideoFormVisible.value = false
  getChapterTreeList()
}

/**
 * 获取上传进度条
 */
const getUploadPercent = async() => {
  const {data} = await getUploadPercentApi((videoData.value as any).id)
  if (data.status === 200) {
    return data.result.percent
  } else {
    return 0
  }
}

/**
 * 预览视频
 * @param courseId 课程ID
 * @param videoId  视频ID
 */
// 路由对象
const router = useRouter()
const playVideoByVideoId = (courseId:number,videoId:number)=> {
  let { href } =  router.resolve({
    path: '/edu/play',
    query: {
      courseId:courseId,
      videoId:videoId
    }
  })
  window.open(href, '_blank')

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
