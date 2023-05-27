<template>
<el-dialog width="40%"
           :title="courseTitle"
           :model-value="uploadCoverVisible"
           destroy-on-close
           @close="onCancel">
  <el-upload
      class="upload-demo"
      drag
      :action="uploadURL"
      name="fileResource"
      multiple
      :data="{courseId:props.courseId}"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      Drop file here or <em>click to upload</em>
    </div>
    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </el-upload>
  <template #footer>
    <el-button key="back" type="primary" @click="() => onCancel()">关闭</el-button>
  </template>
</el-dialog>
</template>

<script setup lang="ts">
// 服务器路径
const url = import.meta.env.VITE_APP_BASE_API
// 图片上传到服务器的路径
const uploadURL = url+"aliVod/upload/uploadCover"
const props = defineProps(['courseTitle','uploadCoverVisible','courseId'])
const emit = defineEmits(['onCancel'])
console.log('props:',props)
// 点击关闭按钮
const onCancel = ()=> {
   emit('onCancel')
   console.log("点击关闭")
}
</script>

<style scoped>

</style>
