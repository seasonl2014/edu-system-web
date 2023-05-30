<template>
  <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="modelRef.title"
      width="400px"
      :model-value="batchUploadVideoFormVisible"
      @close="onCancel"
  >
    <template #footer>
      <el-button key="back" type="primary" @click="() => onCancel()">关闭</el-button>
    </template>

    <el-form ref="formRef" :model="modelRef" :rules="rulesRef" label-width="80px">
      <el-upload
          ref="videoUpload"
          :action="uploadVideoUrl"
          :data="modelRef"
          :before-upload="beforeUpload"
          :on-change="onFileChange"
          :limit="20"
          class="upload-demo"
          drag
          :show-file-list="false"
          :on-success="fileOnSuccess"
          multiple
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip">只能上传mp4文件，且不超过500mb</div>
      </el-upload>
      <!--进度条-->
      <el-progress v-for="item in progressNums" v-show="item.showProgress" style="margin-top: 10px;margin-bottom: 10px;" :text-inside="true" :stroke-width="24" :percentage="item.uploadPercent" status="success" />

    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { defineComponent, PropType, reactive, ref } from 'vue'
import {Md5} from 'ts-md5/dist/md5'
import { ElForm, ElMessage } from 'element-plus'
// 服务器路径
const url = import.meta.env.VITE_APP_BASE_API
// 上传视频路径
const uploadVideoUrl = url+'aliVod/upload/video/batch'
// 是否显示进度条
const showProgress = ref<boolean>(false)
// 进度条百分比
const uploadPercent = ref<number>(5)
// 进度条数量
const progressNums = ref([])
const props = defineProps(['values','batchUploadVideoFormVisible'])
const emit = defineEmits(['onCancel'])
// 表单值
const modelRef = reactive<any>({
  id: props.values.id || 0,
  title: props.values.title || '',
  sort: props.values.sort || 0,
  courseId: props.values.courseId || 0,
  chapterId: props.values.chapterId || 0,
  isFree: props.values.isFree || 0,
  fileKey: props.values.fileKey || '',
  fileNum: props.values.fileNum || 0
})
/**
 * 上传视频前
 */
const beforeUpload = (file:any)=> {
  // 文件标志
  const fileDetails = file.name + file.size + file.type + file.lastModifiedDate
  // 使用当前文件的信息用md5加密生成一个key 这个加密是根据文件的信息来加密的  如果相同的文件 加的密还是一样的
  const key = Md5.hashStr(fileDetails)
  const data ={
    uploadPercent: 1,
    showProgress: true,
    fileKey: key
  }
  progressNums.value.push(data)
  console.info(progressNums.value)
  modelRef.fileKey = key.toString()
  showProgress.value = true
}
/**
 * 上传文件改变时
 * @param file
 * @param fileList
 */
const onFileChange = (file: any, fileList: any) => {
}

/**
 * 文件上传成功
 * @param response
 * @param file
 * @param fileList
 * @constructor
 */
const fileOnSuccess = (response: any, file: any, fileList: any) => {

}
/**
 * 关闭批量上传视频弹出框
 */
const onCancel = ()=> {
  emit('onCancel')
}
</script>

<style scoped>

</style>
