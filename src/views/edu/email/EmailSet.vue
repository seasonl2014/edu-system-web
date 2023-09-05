<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px">
            <BellFilled/>
          </el-icon>
          邮箱设置
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
      <el-tab-pane label="QQ邮箱设置" name="first">
        <el-skeleton :loading="EmailLoading" :rows="5" animated >
          <template #default>
            <div class="pay-form">
              <el-form ref="formEmailRef"  :rules="formEmailRules" :model="formEmail"  label-width="200px"  style="max-width: 960px">
                <el-form-item label="邮箱host地址" prop="host">
                  <el-input v-model="formEmail.host" placeholder="请输入邮箱host地址" clearable />
                </el-form-item>

                <el-form-item label="邮箱port端口号" prop="port">
                  <el-input v-model="formEmail.port" placeholder="请输入邮箱port端口号" clearable />
                </el-form-item>

                <el-form-item label="邮箱账号" prop="userName">
                  <el-input v-model="formEmail.userName" placeholder="请输入邮箱账号" clearable />
                </el-form-item>

                <el-form-item label="邮箱授权密码" prop="password">
                  <el-input v-model="formEmail.password" placeholder="请输入邮箱授权密码" clearable />
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" :loading="wxSubLoading" @click="onSubmitEmail(formEmailRef)">保存</el-button>
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
import {getEmailInfoApi, saveEmailApi} from "@/api/edu/email/email";



// 微信支付骨架屏状态
const EmailLoading= ref(false)
const activeName = ref('first')
// 微信支付表单实例对象
const formEmailRef = ref<FormInstance>()
// 微信支付表单数据对象
const formEmail = reactive({
  id:'',
  host: '', // 邮箱主机
  port: '', // 邮箱端口号
  userName: '',//  邮箱账号
  password: '',//  邮箱授权密码
})
// 微信支付表单约束规则
const formEmailRules = reactive<FormRules>({
  host: [{required: true,message: '邮箱主机地址不能为空！',trigger:'blur'}],
  port: [{required: true,message: '邮箱端口号不能为空！',trigger:'blur'}],
  userName: [{required: true,message: '邮箱账号不能为空！',trigger:'blur'}],
  password: [{required: true,message: '邮箱授权密码不能为空！',trigger:'blur'}]
})
// 微信支付设置提交按钮状态
const wxSubLoading = ref(false)
// 提交微信支付设置表单
const onSubmitEmail = (formEl:FormInstance | undefined) => {
  if (!formEl)return
  formEl.validate(async (valid)=> {
    wxSubLoading.value = true
    if(valid){
      const { data } = await saveEmailApi(formEmail)
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
const getEmailInfo = async () => {
  const {data} = await getEmailInfoApi()
  // 给表单填充数据
  if(data.status === 200 && data.result!=null){
    for (const key in formEmail) {
      formEmail[key] = data.result[key]
    }
  }

}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
onMounted(()=> {
  getEmailInfo()
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
