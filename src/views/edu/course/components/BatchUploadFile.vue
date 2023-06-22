<template>
  <el-dialog width="50%"
             :model-value="batchCourseDataVisible"
             destroy-on-close
             :close-on-click-modal="false"
             @close="onCancel">

    <template #header="{close,titleId,titleClass}">
      <div class="my-header">
        <el-icon size="26px"><FolderOpened/></el-icon>
        <h1>{{courseTitle}}</h1>
      </div>
    </template>

    <div class="main">
      <!-- 文件上传按钮 -->
      <el-upload
          action="#"
          :http-request="upload"
          :before-upload="beforeUpload"
          :show-file-list="false"
      >
        <el-button type="primary">选择上传文件</el-button>
      </el-upload>
      <el-divider content-position="left">上传列表</el-divider>

      <!--正在上传的文件列表 start-->
       <div class="uploading" v-for="uploadFile in uploadFileList">
         <span class="fileName">{{ uploadFile.name }}</span>
         <span class="fileSize">{{ formatSize(uploadFile.size) }}</span>

         <!--解析进度条 Start-->
         <div class="parse">
           <span>解析进度： </span>
           <el-progress
               :text-inside="true"
               :stroke-width="16"
               :percentage="uploadFile.parsePercentage"
           >
           </el-progress>
         </div>
         <!--解析进度条 end-->

         <!--上传进度条 start-->

         <!--上传进度条 end-->

       </div>
      <!--正在上传的文件列表 end-->

    </div>
  </el-dialog>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import SparkMD5 from 'spark-md5'
import {checkMd5Api} from "@/api/edu/course/course";
const props = defineProps(['courseTitle','batchCourseDataVisible','courseId'])
const emit = defineEmits(['batchCourseDataCancel'])

// 正在上传的文件列表对象
const uploadFileList = ref([])
/**
 * 换算文件的大小单位
 */
const formatSize = (size: number)=> {
  //size的单位大小k
  let unit;
  const units = [" B", " K", " M", " G"];
  const pointLength = 2;
  while ((unit = units.shift()) && size > 1024) {
    size = size / 1024;
  }
  return (
      (unit === "B"
          ? size
          : size.toFixed(pointLength === undefined ? 2 : pointLength)) + unit
  )
}
/**
 * 计算文件的md5值
 */
const computeMd5 = (file, uploadFile)=> {
  return new Promise((resolve, reject) => {
    //分片读取并计算md5
    const chunkTotal = 100; //分片数
    const chunkSize = Math.ceil(file.size / chunkTotal);
    const fileReader = new FileReader();
    const md5 = new SparkMD5();
    let index = 0;

    const loadFile = (uploadFile) => {
      console.log('loadFile的函数111')
      uploadFile.parsePercentage.value = parseInt((index / file.size) * 100);
      const slice = file.slice(index, index + chunkSize);

      fileReader.readAsBinaryString(slice);
    }
    loadFile(uploadFile)
    fileReader.onload = (e) => {
      md5.appendBinary(e.target.result);
      if (index < file.size) {
        index += chunkSize;
        loadFile(uploadFile);
      } else {
        // md5.end() 就是文件md5码
        resolve(md5.end());
      }
    }

  })
}
/**
 * 检查文件是否存在
 */
const checkFile = async (md5: string)=> {
  const { data } = await checkMd5Api(md5)
  return data
}
/**
 * 文件上传之前,el-upload自动触发
 */
const beforeUpload= async(file: any)=> {
  console.log("2.上传文件之前");
  const uploadFile = {}
  uploadFile.name = file.name
  uploadFile.size = file.size
  uploadFile.parsePercentage = ref(0)
  uploadFile.uploadPercentage = ref(0)
  uploadFile.uploadSpeed = "0 M/s"
  uploadFile.chunkList = null
  uploadFile.file = file
  uploadFile.uploadingStop = false
  uploadFileList.value.push(uploadFile)

  const md5 = await computeMd5(file, uploadFile);//async 和 await配可以实现等待异步函数计算完成
  uploadFile.md5 = md5;
  const res = await checkFile(md5);  //上传服务器检查，以确认是否秒传
  console.log('checkFile返回值：',res)
  uploadFile.needUpload = true
}

/**
 * 点击关闭按钮
 */
const onCancel = ()=> {
  emit('batchCourseDataCancel')
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

.main {
  margin-top: 10px;
  margin-bottom: 40px;
}
.uploading {
  padding-top: 27px;
}
.progress {
  /* width: 700px; */
  display: flex;
}
.uploading .parse {
  display: flex;
}
.parse .el-progress {
  /* font-size: 18px; */
  width: 590px;
}
.progress .el-progress {
  /* font-size: 18px; */
  width: 590px;
}
.uploading .fileName {
  font-size: 17px;
  margin-right: 40px;
  margin-left: 80px;

  /* width: 80px; */
}
.uploading .fileSize {
  font-size: 17px;

  /* width: 80px; */
}

.progress .uploadSpeed {
  font-size: 17px;
  margin-left: 5px;
  padding-left: 5px;
  padding-right: 10px;
}
</style>
