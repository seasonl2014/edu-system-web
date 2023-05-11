<template>
<div class="set">
  <h4>修改密码</h4>
  <p style="display: inline-flex;justify-content: center;align-items: center;">
    <el-icon style="margin-right: 5px;">
      <CircleCheck/>
    </el-icon>密码6~18为字母、数字、特殊字符组成
  </p>
  <br>
  <p style="display: inline-flex;justify-content: center;align-items: center;">
    <el-icon style="margin-right: 5px;">
      <Warning/>
    </el-icon>安全提示：新密码请勿与旧密码过于相似
  </p>

  <el-form ref="modifyFormRef" :rules="modifyRules" :model="modifyPwd" class="demo-form-inline">
    <el-row :gutter="20">

      <el-col :span="10">
        <el-form-item prop="usedPass" label="旧密码" style="width: 100%">
          <el-input v-model="modifyPwd.usedPass" show-password placeholder="请输入旧密码"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="10">
        <el-form-item prop="newPass" label="新密码" style="width: 100%">
          <el-input v-model="modifyPwd.newPass" show-password placeholder="请输入新密码"></el-input>
        </el-form-item>
      </el-col>

      <el-col :span="4" style="text-align: center">
        <el-form-item style="margin-right: 0px;">
          <el-button plain color="#2fa7b9" @click="modifySubmit(modifyFormRef)" :loading="subLoading">提交</el-button>
        </el-form-item>
      </el-col>

    </el-row>
  </el-form>

</div>
</template>

<script setup lang="ts">
import {ref,reactive } from 'vue'
import { FormRules,FormInstance,ElMessage } from 'element-plus'
import {updatePwdApi} from "../../../../api/system/user/user";

// 表单实例对象
const modifyFormRef = ref<FormInstance>()
// 按钮状态
const subLoading=ref(false)

// 定义表单数据对象
const modifyPwd = ref({
  // 旧密码
  usedPass: '',
  // 新密码
  newPass: ''
})

// 定义表单约束规则对象
const modifyRules = reactive<FormRules>({
  usedPass: [{ required: true,message: '旧密码不能为空',trigger: 'blur' }],
  newPass: [{ required: true,message: '新密码不能为空',trigger: 'blur' }]
})

// 提交修改密码
const modifySubmit = async (formEl: FormInstance |undefined)=>{
 if (!formEl)return
  await formEl.validate(async (valid,fields)=>{
    subLoading.value = true
    if(valid){
      const { data } = await updatePwdApi(modifyPwd.value)
      if(data.status === 200){
        ElMessage.success(data.message)
      }else {
        ElMessage.error(data.message)
      }
    }
    subLoading.value = false
  })
}

</script>

<style scoped>

</style>
