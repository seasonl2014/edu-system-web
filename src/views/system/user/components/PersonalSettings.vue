<template>
<el-row :gutter="20">
  <el-col :span="18">
  <!--左侧信息 start-->
   <div class="left-box">
     <h3 class="title">
       <el-icon style="margin-right: 10px;"><User/></el-icon>
       个人信息设置
     </h3>

     <!--基本设置 start-->
      <div class="set">
        <h4>基础设置</h4>
        <el-form ref="basicFormRef" :rules="basicRules" status-icon :model="basic">
          <el-row :gutter="20">
            <!--用户真实姓名-->
            <el-col :span="8">
              <el-form-item prop="realname" label="真实姓名" style="width: 100%">
                <el-input v-model="basic.realname" placeholder="请输入真实姓名" />
              </el-form-item>
            </el-col>
            <!--用户性别-->
            <el-col :span="8">
              <el-form-item prop="sex" label="性别" style="width: 100%;">
               <el-radio v-model="basic.sex" label="男"></el-radio>
                <el-radio v-model="basic.sex" label="女"></el-radio>
              </el-form-item>
            </el-col>
            <!--头像-->
            <el-col :span="5">
              <el-form-item label="头像" style="margin: auto;">
                <el-upload class="avatar-uploader" :action="uploadURL" name="fileResource" :show-file-list="false" :on-success="handleAvatarSuccess">
                  <img v-if="basic.userIcon" :src="url+'uploadFile/'+basic.userIcon" style="width: 50px;border-radius: 50px;"/>
                  <img v-else src="../../../../assets/default_avatar.png" style="width: 50px;border-radius: 50px;"/>
                  <span style="margin-left: 10px;font-size: 10px;text-decoration: underline;line-height: 20px">点击更换</span>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-button plain color="#2fa7b9" :loading="loading" @click="onBasicSubmit(basicFormRef)" style="margin-left: 50px;">提交</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
     <!--基本设置 end-->
     <el-divider border-style="dashed"/>
     <!--绑定邮箱 start-->
     <BindEmail/>
     <!--绑定邮箱 end-->
     <el-divider border-style="dashed"/>
     <!--修改密码 start-->
     <UpdatePwd/>
     <!--修改密码 end-->

   </div>
  <!--左侧信息 end-->
  </el-col>
  <!--右侧个人信息 start-->
   <UserInfo/>
  <!--右侧个人信息 end-->
</el-row>
</template>

<script setup lang="ts">
import {reactive,toRefs,onMounted,ref} from 'vue'
import {useUserStore} from "../../../../store/modules/user";
import { FormInstance,FormRules,ElMessage } from 'element-plus'
import {updateInfoApi} from "../../../../api/system/user/user";
import BindEmail from "./BindEmail.vue"
import UpdatePwd from "./UpdatePwd.vue"
import UserInfo from "./UserInfo.vue"
// 校验基础信息规则
const basicRules = reactive<FormRules>({
  realname: [{required: true,message: '请输入真实姓名' ,trigger: 'blur'}],
  sex: [{ required: true,message: '请输入性别',trigger: 'blur' }],
  userIcon: [{ required: true,message: '请上传头像',trigger: 'blur' }]
})

const basicFormRef = ref<FormInstance>()
const loading = ref(false)

const state = reactive({
  // 基础信息
  basic: {
    realname: '',
    sex: '',
    userIcon: ''
  }
})

// 服务器路径
const url = import.meta.env.VITE_APP_BASE_API
// 图片上传到服务器的路径
const uploadURL = url+"user/userIcon"

// 图片上传成功执行的函数
const handleAvatarSuccess = (res: {status:number;result: {userIcon:string}})=> {
  if(res.status === 200){
    state.basic.userIcon = res.result.userIcon
  }
}

// 提交基础信息
const userStore = useUserStore()
const onBasicSubmit = (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  formEl.validate(async (valid)=> {
    if(valid){
      loading.value = true
      const { data } = await updateInfoApi({...state.basic})
      if(data.status === 200){
        // 设置登录用户信息
        userStore.setUserPartInfo({
          realname: state.basic.realname,
          sex: state.basic.sex,
          userIcon: state.basic.userIcon
        })

        ElMessage({
          type: 'success',
          message: '基础信息修改成功'
        })
        loading.value = false

      }else {
        ElMessage({
          type: 'error',
          message: '基础信息修改失败~'
        })
        loading.value = false
      }
    }else {
      ElMessage({
        type: 'error',
        message: '提交失败，你还有未填写的项~'
      })
      loading.value = false
    }
  })
}

onMounted(()=>{
  const { userInfo } = useUserStore()
  state.basic.realname = userInfo.realname
  state.basic.sex = userInfo.sex
  state.basic.userIcon = userInfo.userIcon
})

const { basic } = toRefs(state)
</script>

<style scoped>
.left-box {
  width: 100%;
  height: auto;
  background:white;
  padding: 20px;
  box-sizing: border-box;
}

.left-box .title {
  color: #083a6d;
  margin-bottom: 10px;
  padding: 20px 20px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.left-box .set {
  text-align: left;
  padding: 0px 20px;
  margin-bottom: 10px;
  color: #8f8f8f;
  line-height: 35px;
}

.left-box .set h4 {
  line-height: 45px;
  color: #8f8f8f;
}

</style>
