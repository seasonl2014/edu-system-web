<template>
<el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
  <el-form-item label="" prop="username">
    <el-input placeholder="请输入用户名" autocomplete="on" style="position: relative" v-model="ruleForm.username">
      <template #prefix>
        <el-icon class="el-input__icon"><UserFilled/></el-icon>
      </template>
    </el-input>
  </el-form-item>

  <el-form-item label="" prop="password">
    <el-input placeholder="请输入密码" autocomplete="on" v-model="ruleForm.password" :type="passwordType">
      <template #prefix>
        <el-icon class="el-input__icon"><GoodsFilled/></el-icon>
      </template>
      <template #suffix>
        <div class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"/>
        </div>
      </template>
    </el-input>
  </el-form-item>

  <el-form-item style="width: 100%">
    <el-button :loading="loading" color="#083a6d" class="login-btn" type="primary" @click="submitForm(ruleFormRef)">
      登录
    </el-button>
  </el-form-item>

</el-form>
</template>

<script setup lang="ts">
import SvgIcon from "../../../../components/SvgIcon/index.vue";
import { ref,reactive } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'
import {useUserStore} from "../../../../store/modules/user"
import {loginApi} from "../../../../api/system/login/login";

const router = useRouter()
const ruleFormRef = ref<FormInstance>()
const passwordType = ref('password')
const loading = ref(false)
const userStore = useUserStore()
// 表单规则
const rules = reactive({
  password: [{required: true,message: '请输入密码',trigger: 'blur'}],
  username: [{required: true,message: '请输入用户密码',trigger: 'blur'}]
})
// 表单数据
const ruleForm = reactive({
  username: 'admin',
  password: '123456'
})

// 显示密码图标
const showPwd = ()=> {
  passwordType.value = passwordType.value === 'password'?'':'password'
}
// 提交表单函数
const submitForm = (formEl: FormInstance | undefined)=> {
  if(!formEl) return
  formEl.validate(async (valid)=> {
    if(valid){
      loading.value = true
      // 登录
      const { data } = await loginApi({...ruleForm})
      if(data.status === 200){
        // 设置token
        userStore.setToken(data.result.token)
        // 设置登录用户信息
        userStore.setUserInfo({
          username: data.result.username,
          realname: data.result.realname,
          email: data.result.email,
          sex: data.result.sex,
          userIcon: data.result.userIcon,
          createTime: data.result.createTime,
          role: data.result.role
        })
        router.push({
          path: '/home',
        })
        ElNotification({
          title: '登录成功',
          message: '欢迎登录 后台管理系统',
          type: 'success',
          duration: 3000
        })

      }else{
        ElNotification({
          title: '温馨提示',
          message: data.message,
          type: 'error',
          duration: 3000
        })
      }
      loading.value = false
    }else {
      console.log('登录失败')
      return false
    }
    loading.value = false
  })
}

</script>

<style scoped>
.login-btn {
  margin-top: 20px;
  width: 100%;
  height: 47px;
}
.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
}

::v-deep(.svg-icon) {
  vertical-align: 0;
}

</style>
