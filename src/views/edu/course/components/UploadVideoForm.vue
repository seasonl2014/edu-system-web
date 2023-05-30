<template>
  <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :title="modelRef.title"
      width="400px"
      :model-value="visible"
      @close="onCancel"
  >

    <el-form ref="formRef" :model="modelRef"  label-width="80px">
      <el-upload
          ref="videoUpload"
          :action="uploadVideoUrl"
          :data="modelRef"
          :before-upload="beforeUpload"
          :limit="1"
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
      <el-progress v-show="showProgress" style="margin-top: 10px;margin-bottom: 10px;" :text-inside="true" :stroke-width="24" :percentage="uploadPercent" status="success" />

    </el-form>

    <template #footer>
      <el-button key="back" type="primary" @click="() => onCancel()">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {reactive,ref} from 'vue'
import {Md5} from 'ts-md5/dist/md5'
import { ElForm, ElMessage } from 'element-plus'
const props = defineProps(['values','visible'])
const emit = defineEmits(['onCancel','getPercent'])
// 服务器路径
const url = import.meta.env.VITE_APP_BASE_API
// 上传视频路径
const uploadVideoUrl = url+'aliVod/upload/video/single'
// 表单值
const modelRef = reactive<any>({
  id: props.values.id || 0,
  title: props.values.title || '',
  sort: props.values.sort || 0,
  courseId: props.values.courseId || 0,
  chapterId: props.values.chapterId || 0,
  isFree: props.values.isFree || 0,
  fileKey: props.values.fileKey || ''
})
// 进度条状态
const showProgress = ref(false)
// 进度条数值
const uploadPercent = ref(1)
/**
 * 关闭弹出框
 */
const onCancel = ()=> {
  emit('onCancel')
}
/**
 * 上传视频前
 */
const beforeUpload = (file: any)=> {
  // 文件标志
  const fileDetails = file.name + file.size + file.type + file.lastModifiedDate
  // 使用当前文件的信息用md5加密生成一个key 这个加密是根据文件的信息来加密的  如果相同的文件 加的密还是一样的
  const key = Md5.hashStr(fileDetails)
  modelRef.fileKey = key.toString()
  showProgress.value = true
}

/**
 * 上传视频完成
 */
const fileOnSuccess = (res: any, file: any, fileList: any) => {
  console.info('文件上传成功后：', res)
  ElMessage.success(res.message)
  showProgress.value = false
}
</script>

<style scoped>

</style>
