<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px">
            <SetUp/>
          </el-icon>
          文件存储设置
        </h3>
      </div>
    </template>
    <!--头部 end-->

    <!--多标签 start-->
    <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
        @tab-click="handleClick"
    >
      <!--阿里云OSS设置 start-->
      <el-tab-pane label="阿里云OSS设置" name="first">
        <el-skeleton :loading="EmailLoading" :rows="5" animated >
          <template #default>
            <div class="pay-form">
              <el-form ref="formFileOssRef"  :rules="formFileOssRules" :model="formFileOss"  label-width="200px"  style="max-width: 960px">

                <el-form-item label="AccessKey ID" prop="accessKeyID">
                  <el-input v-model="formFileOss.accessKeyID" placeholder="请输入AccessKey ID" clearable />
                </el-form-item>

                <el-form-item label="AccessKey Secret" prop="accessKeySecret">
                  <el-input v-model="formFileOss.accessKeySecret" placeholder="请输入AccessKey Secret" clearable />
                </el-form-item>

                <el-form-item label="文件存放区域endpoint" prop="endpoint">
                  <el-input v-model="formFileOss.endpoint" placeholder="请输入文件存放区域" clearable />
                </el-form-item>

                <el-form-item label="bucketName" prop="bucketName">
                  <el-input v-model="formFileOss.bucketName" placeholder="请输入OSS存放头像的bucketName" clearable />
                </el-form-item>

                <el-form-item label="bucketCourseName" prop="bucketCourseName">
                  <el-input v-model="formFileOss.bucketCourseName" placeholder="请输入OSS存放课程封面的bucketCourseName" clearable />
                </el-form-item>

                <el-form-item label="存放图片文件夹" prop="fileHost">
                  <el-input v-model="formFileOss.fileHost" placeholder="请输入存放图片文件夹" clearable />
                </el-form-item>

                <el-form-item label="存放课程资料文件夹" prop="fileHostCourse">
                  <el-input v-model="formFileOss.fileHostCourse" placeholder="请输入存放课程资料文件夹" clearable />
                </el-form-item>

                <el-form-item label="OSS绑定域名" prop="hostPath">
                  <el-input v-model="formFileOss.hostPath" placeholder="请输入OSS绑定域名" clearable />
                </el-form-item>

                <el-form-item label="VOD视频转码组" prop="templateGroupId">
                  <el-input v-model="formFileOss.templateGroupId" placeholder="请输入VOD视频转码组" clearable />
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" :loading="ossSubLoading" @click="onSubmitOss(formFileOssRef)">保存</el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-skeleton>
      </el-tab-pane>
      <!--阿里云OSS设置 end-->
    </el-tabs>
    <!--多标签 end-->

  </el-card>
</template>

<script setup lang="ts">
import { ref,reactive,onMounted  } from 'vue'
import type { TabsPaneContext,FormInstance,FormRules} from 'element-plus'
import { ElMessage } from 'element-plus'
import {getOssInfoApi, saveOssApi} from "@/api/edu/file/file";

// 阿里云OSS骨架屏状态
const EmailLoading= ref(false)
const activeName = ref('first')
// 阿里云OSS表单实例对象
const formFileOssRef = ref<FormInstance>()
// 阿里云OSS表单数据对象
const formFileOss = reactive({
  id:'',
  accessKeyID: '',
  accessKeySecret: '',
  endpoint: '', // 文件存放区域
  fileHost: '', // 存放图片文件夹
  fileHostCourse: '',//  存放课程资料文件夹
  bucketName: '',//  OSS Bucket存放图片名称
  bucketCourseName: '',// OSS Bucket存放课程资料名称
  hostPath: '',// OSS绑定域名
  templateGroupId: '',// 视频转码组
})
// 阿里云OSS表单约束规则
const formFileOssRules = reactive<FormRules>({
  accessKeyID: [{required: true,message: 'accessKeyID不能为空！',trigger:'blur'}],
  accessKeySecret: [{required: true,message: 'accessKeySecret不能为空！',trigger:'blur'}],
  endpoint: [{required: true,message: '文件存放区域不能为空！',trigger:'blur'}],
  fileHost: [{required: true,message: '存放头像文件夹不能为空！',trigger:'blur'}],
  fileHostCourse: [{required: true,message: '存放课程封面文件夹不能为空！',trigger:'blur'}],
  bucketName: [{required: true,message: 'OSS Bucket存放头像的名称不能为空！',trigger:'blur'}],
  bucketCourseName: [{required: true,message: 'OSS Bucket存放课程封面名称不能为空！',trigger:'blur'}],
  hostPath: [{required: true,message: 'OSS绑定域名不能为空！',trigger:'blur'}],
  templateGroupId: [{required: true,message: '视频转码组不能为空！',trigger:'blur'}]
})
// 阿里云OSS设置提交按钮状态
const ossSubLoading = ref(false)
// 提交阿里云OSS设置表单
const onSubmitOss = (formEl:FormInstance | undefined) => {
  ossSubLoading.value = true
  if (!formEl)return
  formEl.validate(async (valid)=> {
    if(valid){
      const { data } = await saveOssApi(formFileOss)
      if(data.status===200){
        await getOssInfo()
        ElMessage.success(data.message)
      }else {
        ElMessage.error(data.message)
      }
    }else {
      ElMessage.error('提交表单失败，你还有未填写的项！')
    }
    ossSubLoading.value = false
  })
  ossSubLoading.value = false
}

// 获取阿里云OSS信息
const getOssInfo = async () => {
  const {data} = await getOssInfoApi()
  // 给表单填充数据
  if(data.status === 200 && data.result!=null){
    for (const key in formFileOss) {
      formFileOss[key] = data.result[key]
    }
  }

}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
onMounted(()=> {
  getOssInfo()
})
</script>

<style scoped>
.card-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3{
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #083a6d;
}
</style>
