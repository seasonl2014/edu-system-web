<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px">
            <Cellphone/>
          </el-icon>
          微信扫码登录设置
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
      <!--微信支付设置 start-->
      <el-tab-pane label="微信扫码登录设置" name="first">
        <el-skeleton :loading="wxCodeLoading" :rows="5" animated >
          <template #default>
            <div class="pay-form">
              <el-form ref="formWxCodeRef"  :rules="formWxCodeRules" :model="formWxCode"  label-width="200px"  style="max-width: 960px">
                <el-form-item label="微信开放平台APPID" prop="appId">
                  <el-input v-model="formWxCode.appId" placeholder="请输入微信开放平台APPID" clearable />
                </el-form-item>

                <el-form-item label="微信开放平台appSecret" prop="appSecret">
                  <el-input v-model="formWxCode.appSecret" placeholder="请输入微信开放平台appSecret" clearable />
                </el-form-item>

                <el-form-item label="重定向地址" prop="redirectUri">
                  <el-input v-model="formWxCode.redirectUri" placeholder="请输入重定向地址" clearable />
                </el-form-item>

                <el-form-item label="前台地址" prop="frontUrl">
                  <el-input v-model="formWxCode.frontUrl" placeholder="请输入前台地址" clearable />
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" :loading="wxSubLoading" @click="onSubmitWxCode(formWxCodeRef)">保存</el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-skeleton>
      </el-tab-pane>
      <!--微信支付设置 end-->
    </el-tabs>
    <!--多标签 end-->

  </el-card>
</template>

<script setup lang="ts">
import { ref,reactive,onMounted  } from 'vue'
import type { TabsPaneContext,FormInstance,FormRules} from 'element-plus'
import { ElMessage } from 'element-plus'
import {getWxCodeInfoApi, saveWxCodeApi} from "@/api/edu/wxcode/wxCode";

// 微信支付骨架屏状态
const wxCodeLoading= ref(false)
const activeName = ref('first')
// 微信支付表单实例对象
const formWxCodeRef = ref<FormInstance>()
// 微信支付表单数据对象
const formWxCode = reactive({
  id:'',
  appId: '', // 微信开放平台APPID
  appSecret: '', // 微信开放平台appSecret
  redirectUri: '',//  重定向地址
  frontUrl: '', // 前台地址
})
// 微信支付表单约束规则
const formWxCodeRules = reactive<FormRules>({
  appId: [{required: true,message: '微信开放平台APPID不能为空！',trigger:'blur'}],
  appSecret: [{required: true,message: '微信开放平台appSecret不能为空！',trigger:'blur'}],
  redirectUri: [{required: true,message: '重定向地址不能为空！',trigger:'blur'}],
  frontUrl:[{required: true,message: '前台地址不能为空！',trigger:'blur'}]
})
// 微信支付设置提交按钮状态
const wxSubLoading = ref(false)
// 提交微信支付设置表单
const onSubmitWxCode = (formEl:FormInstance | undefined) => {
  if (!formEl)return
  formEl.validate(async (valid)=> {
    wxSubLoading.value = true
    if(valid){
      const { data } = await saveWxCodeApi(formWxCode)
      if(data.status===200){
        ElMessage.success(data.message)
      }else {
        ElMessage.error(data.message)
      }
    }else {
      ElMessage.error('提交表单失败，你还有未填写的项！')
    }
    wxSubLoading.value = false
  })
}

// 获取微信支付信息
const getWxCodeInfo = async () => {
  const {data} = await getWxCodeInfoApi()

  // 给表单填充数据
  if(data.status === 200 && data.result!=null){
    for (const key in formWxCode) {
      formWxCode[key] = data.result[key]
    }
  }

}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
onMounted(()=> {
  getWxCodeInfo()
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
