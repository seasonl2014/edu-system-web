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
         <div class="progress">
           <span>上传进度：</span>
           <el-progress
               :text-inside="true"
               :stroke-width="16"
               :percentage="uploadFile.uploadPercentage"
           >
           </el-progress>
           <span
               v-if="
            (uploadFile.uploadPercentage > 0) &
            (uploadFile.uploadPercentage < 100)
          "
           >
          <span class="uploadSpeed">{{ uploadFile.uploadSpeed }}</span>

          <el-button circle link @click="changeUploadingStop(uploadFile)">
            <el-icon size="20" v-if="uploadFile.uploadingStop == false"
            ><VideoPause
            /></el-icon>
            <el-icon size="20" v-else><VideoPlay /></el-icon>
          </el-button>
        </span>
         </div>
         <!--上传进度条 end-->
       </div>
      <!--正在上传的文件列表 end-->

    </div>
  </el-dialog>

</template>

<script setup lang="ts">
import { ref } from 'vue'
import {ElMessage} from 'element-plus'
import SparkMD5 from 'spark-md5'
import {checkMd5Api, chunkApi} from "@/api/edu/course/course";
import emitter from "@/utils/eventBus";
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
  const res = await checkFile(md5)  //上传服务器检查，以确认是否秒传
  console.log('checkFile返回值：',res)
  if(!res.result.isUploaded){
    uploadFile.chunkList = res.result.chunkList
    uploadFile.needUpload = true
  }else {
    uploadFile.needUpload = false
    uploadFile.uploadPercentage.value = 100;
    console.log("文件已秒传");
    ElMessage({
      showClose: true,
      message: "文件已秒传",
      type: "warning",
    })
  }

}
/**
 * 上传文件,替换el-upload的action
 */
const upload = (xhrData: { file: { name: any; size: any; }; }) =>{
  let uploadFile = null;
  for (let i = 0; i < uploadFileList.value.length; i++) {
    if (
        (xhrData.file.name == uploadFileList.value[i].name) &
        (xhrData.file.size == uploadFileList.value[i].size)
    ) {
      uploadFile = uploadFileList.value[i];
      break;
    }
  }

  if (uploadFile.needUpload) {
    console.log("3.上传文件");

    // 分片上传文件
    // 确定分片的大小
    uploadChunk(xhrData.file, 1, uploadFile);
  }
}

/**
 * 上传文件分片
 */
const uploadChunk = async (file, index, uploadFile)=> {
  const chunkSize = 1024 * 1024 * 10 //10mb
  const chunkTotal = Math.ceil(file.size / chunkSize)
  if (index <= chunkTotal) {
    const startTime = new Date().valueOf()
    const exit = uploadFile.chunkList.includes(index)

    if (!exit) {
      if (!uploadFile.uploadingStop) {
        // 分片上传，同时计算进度条和上传速度
        // 已经上传的不在上传、
        // 上传完成后提示，上传成功
        const form = new FormData()
        const start = (index - 1) * chunkSize
        let end =
            index * chunkSize >= file.size ? file.size : index * chunkSize
        let chunk = file.slice(start, end)
        form.append("chunk", chunk)
        form.append("index", index)
        form.append("chunkTotal", chunkTotal)
        form.append("chunkSize", chunkSize)
        form.append("md5", uploadFile.md5)
        form.append("fileSize", file.size)
        form.append("fileName", file.name)
        form.append("courseId",props.courseId)

        const { data } = await chunkApi(form)
        if(data.status === 200){
          const endTime = new Date().valueOf()
          const timeDif = (endTime - startTime) / 1000
          uploadFile.uploadSpeed = (10 / timeDif).toFixed(1) + " M/s"
          uploadFile.chunkList.push(index)
          uploadFile.uploadPercentage = parseInt(
              (uploadFile.chunkList.length / chunkTotal) * 100
          )
          if (index == chunkTotal) {
            emitter.emit("reloadFileList");
          }

          await uploadChunk(file, index + 1, uploadFile);

        }


      }
    }else {
      uploadFile.uploadPercentage = parseInt(
          (uploadFile.chunkList.length / chunkTotal) * 100
      )
      await uploadChunk(file, index + 1, uploadFile)
    }

  }
}

/**
 * 点击暂停或开始上传
 */
const changeUploadingStop = (uploadFile)=> {
  uploadFile.uploadingStop = !uploadFile.uploadingStop;
  if (!uploadFile.uploadingStop) {
    uploadChunk(uploadFile.file, 1, uploadFile);
  }
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
