<template>
<el-form ref="ruleFormRef" :rules="rules" :model="formStudent" label-width="80px">
  <el-row>

    <el-col :span="12">
      <el-form-item label="登录账号" prop="loginName">
        <el-input v-model="formStudent.loginName" placeholder="请输入登录账号"/>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="登录密码" prop="password">
        <el-input v-model="formStudent.password" placeholder="请输入登录密码"/>
      </el-form-item>
    </el-col>

    <el-col :span="24">
      <el-form-item label="备注">
        <el-input v-model="formStudent.remarks" :rows="2" type="textarea" placeholder="请输入备注"/>
      </el-form-item>
    </el-col>
  </el-row>
</el-form>
  <div class="dialog-button-wrap">
    <el-button @click="close">取消</el-button>
    <el-button @click="addStudent(ruleFormRef)" color="#083a6d" type="success" :loading="subLoading">保存</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref,reactive } from 'vue'
import { ElMessage,FormInstance,FormRules } from 'element-plus'
import {addStudentApi, gradeClassListApi} from "@/api/edu/student/student"
//定义表单实例对象
const ruleFormRef = ref<FormInstance>()

// 定义事件
const emit = defineEmits(['closeAddStudentForm','success'])

// 按钮加载状态
const subLoading = ref(false)

// 表单数据对象
const formStudent = reactive({
  loginName: '',
  password: '',
  remarks: ''
})

// 定义表单约束规则对象
const rules = reactive<FormRules>({
  loginName: [{ required: true,message: '登录账号不能为空',trigger: 'blur' }],
  password: [{ required: true,message: '登录密码不能为空',trigger: 'blur' }]
})
// 新增学生信息
const addStudent = async (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=> {
    subLoading.value = true
    if(valid){
      const { data } = await addStudentApi(formStudent)
      if(data.status === 200){
        ElMessage.success(data.message)
        emit('success')
      }else {
        ElMessage.error(data.message)
      }
    }else {
      ElMessage.error('提交失败，你还有未填写的项！')
    }
  })
  subLoading.value = false
}

// 定义班级下拉选项
const gradeClassOptions = ref<object[]>([])
// 获取所有班级列表数据
const gradeClassList = async ()=> {
  const { data } = await gradeClassListApi()
  if(data.status === 200){
    gradeClassOptions.value = data.result
  }
}
gradeClassList()

// 取消表单
const close =()=> {
  emit('closeAddStudentForm')
}

</script>

<style scoped>
.dialog-button-wrap{
  text-align: center;
  margin-top: 20px;
}
</style>
