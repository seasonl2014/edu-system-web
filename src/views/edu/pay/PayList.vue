<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px">
            <Money/>
          </el-icon>
          支付设置
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
      <el-tab-pane label="微信支付设置" name="first">
        <el-skeleton :loading="wxPayLoading" :rows="5" animated >
          <template #default>
            <div class="pay-form">
              <el-form ref="formWxPayRef"  :rules="formWxPayRules" :model="formWxPay"  label-width="250px"  style="max-width: 960px">
                <el-form-item label="微信公众平台appId" prop="appId">
                  <el-input v-model="formWxPay.appId" placeholder="请输入微信公众平台appId" clearable />
                </el-form-item>

                <el-form-item label="微信公众平台appSecret" prop="appSecret">
                  <el-input v-model="formWxPay.appSecret" placeholder="请输入微信公众平台appSecret" clearable />
                </el-form-item>

                <el-form-item label="微信支付商户号" prop="merchantId">
                  <el-input v-model="formWxPay.merchantId" placeholder="请输入微信支付商户号" clearable />
                </el-form-item>

                <el-form-item label="微信支付商户序列号" prop="merchantSerialnumber">
                  <el-input v-model="formWxPay.merchantSerialnumber" placeholder="请输入微信支付商户序列号" clearable />
                </el-form-item>

                <el-form-item label="微信支付商户私钥" prop="merchantPrivatekey">
                  <el-input :rows="4" type="textarea" v-model="formWxPay.merchantPrivatekey" placeholder="请输入微信支付商户私钥" clearable />
                </el-form-item>

                <el-form-item label="微信支付apiv3密钥" prop="apiV3">
                  <el-input v-model="formWxPay.apiV3" placeholder="请输入微信支付apiv3密钥" clearable />
                </el-form-item>

                <el-form-item label="微信支付通知地址" prop="notifyWxPayUrl">
                  <el-input v-model="formWxPay.notifyWxPayUrl" placeholder="请输入微信支付通知地址" clearable />
                </el-form-item>

                <el-form-item label="代金券核销和公众平台通知地址" prop="notifySpUrl">
                  <el-input v-model="formWxPay.notifySpUrl" placeholder="请输入代金券核销和公众平台通知地址" clearable />
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" :loading="wxSubLoading" @click="onSubmitWxPay(formWxPayRef)">保存</el-button>
                </el-form-item>
              </el-form>
            </div>
          </template>
        </el-skeleton>
      </el-tab-pane>
      <!--微信支付设置 end-->
      <!--支付宝支付设置 start-->
      <el-tab-pane label="支付宝支付设置" name="second">功能待开发...</el-tab-pane>
      <!--支付宝支付设置 end-->
    </el-tabs>
    <!--多标签 end-->

  </el-card>
</template>

<script setup lang="ts">
import { ref,reactive,onMounted  } from 'vue'
import type { TabsPaneContext,FormInstance,FormRules} from 'element-plus'
import { ElMessage } from 'element-plus'
import {getWxPayInfoApi, saveWxPayApi} from "@/api/edu/wxpay/wxPay";
// 微信支付骨架屏状态
const wxPayLoading= ref(false)
const activeName = ref('first')
// 微信支付表单实例对象
const formWxPayRef = ref<FormInstance>()
// 微信支付表单数据对象
const formWxPay = reactive({
  id:'',
  appId: '', // 微信公众平台服务号appId
  merchantId: '', // 商户号
  merchantSerialnumber: '',//  商户序列号
  merchantPrivatekey: '', // 商户私钥
  apiV3:'',// apiv3密钥
  notifyWxPayUrl:'',//微信支付异步回调通知
  appSecret: '',//微信公众号平台appSecret
  notifySpUrl: '',// 代金券核销和微信公众平台通知地址
})
// 微信支付表单约束规则
const formWxPayRules = reactive<FormRules>({
  appId: [{required: true,message: '微信公众平台服务号appId不能为空！',trigger:'blur'}],
  merchantId: [{required: true,message: '微信支付商户号不能为空！',trigger:'blur'}],
  merchantSerialnumber: [{required: true,message: '微信支付商户序列号不能为空！',trigger:'blur'}],
  merchantPrivatekey:[{required: true,message: '微信支付商户私钥不能为空！',trigger:'blur'}],
  apiV3:[{required: true,message: '微信支付商户apiv3密钥不能为空！',trigger:'blur'}],
  notifyWxPayUrl:[{required: true,message: '微信支付异步回调通知不能为空！',trigger:'blur'}],
  appSecret: [{required: true,message: '微信公众平台appSecret不能为空！',trigger:'blur'}],
  notifySpUrl: [{required: true,message: '代金券核销和微信公众平台通知地址不能为空！',trigger:'blur'}],
})
// 微信支付设置提交按钮状态
const wxSubLoading = ref(false)
// 提交微信支付设置表单
const onSubmitWxPay = (formEl:FormInstance | undefined) => {
  if (!formEl)return
  formEl.validate(async (valid)=> {
    wxSubLoading.value = true
    if(valid){
      const { data } = await saveWxPayApi(formWxPay)
      if(data.status===200){
        ElMessage.success(data.message)
        await getWxPayInfo()
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
const getWxPayInfo = async () => {
  const {data} = await getWxPayInfoApi()
  for (const key in formWxPay) {
    formWxPay[key] = data.result[key]
  }
}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
onMounted(()=> {
  getWxPayInfo()
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
