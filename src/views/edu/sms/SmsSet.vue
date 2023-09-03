<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px">
            <Iphone/>
          </el-icon>
          短信设置
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
      <el-tab-pane label="阿里云sms短信设置" name="first">
        <el-skeleton :loading="SmsLoading" :rows="5" animated >
          <template #default>
            <div class="pay-form">
              <el-form ref="formSmsRef"  :rules="formSmsRules" :model="formSms"  label-width="200px"  style="max-width: 960px">
                <el-form-item label="短信区域ID" prop="regionId">
                  <el-input v-model="formSms.regionId" placeholder="请输入短信区域ID" clearable />
                </el-form-item>

                <el-form-item label="短信签名" prop="signName">
                  <el-input v-model="formSms.signName" placeholder="请输入短信签名" clearable />
                </el-form-item>

                <el-form-item label="短信模板" prop="templateCode">
                  <el-input v-model="formSms.templateCode" placeholder="请输入短信模板" clearable />
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" :loading="wxSubLoading" @click="onSubmitSms(formSmsRef)">保存</el-button>
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
import {getSmsInfoApi, saveSmsApi} from "@/api/edu/sms/sms";


// 微信支付骨架屏状态
const SmsLoading= ref(false)
const activeName = ref('first')
// 微信支付表单实例对象
const formSmsRef = ref<FormInstance>()
// 微信支付表单数据对象
const formSms = reactive({
  id:'',
  regionId: '', // 区域ID
  signName: '', // 短信签名
  templateCode: '',//  短信模板
})
// 微信支付表单约束规则
const formSmsRules = reactive<FormRules>({
  regionId: [{required: true,message: '短信区域ID不能为空！',trigger:'blur'}],
  signName: [{required: true,message: '短信签名不能为空！',trigger:'blur'}],
  templateCode: [{required: true,message: '短信模板不能为空！',trigger:'blur'}]
})
// 微信支付设置提交按钮状态
const wxSubLoading = ref(false)
// 提交微信支付设置表单
const onSubmitSms = (formEl:FormInstance | undefined) => {
  if (!formEl)return
  formEl.validate(async (valid)=> {
    wxSubLoading.value = true
    if(valid){
      const { data } = await saveSmsApi(formSms)
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
const getSmsInfo = async () => {
  const {data} = await getSmsInfoApi()
  // 给表单填充数据
  if(data.status === 200 && data.result!=null){
    for (const key in formSms) {
      formSms[key] = data.result[key]
    }
  }

}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
onMounted(()=> {
  getSmsInfo()
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
