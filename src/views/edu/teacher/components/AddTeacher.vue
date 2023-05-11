<template>
<el-form ref="ruleFormRef" :rules="rules" :model="formTeacher" label-width="80px">
  <el-row>
    <el-col :span="12">
      <el-form-item label="绑定账号" prop="createBy">
        <el-select filterable  v-model="formTeacher.createBy" placeholder="请选账号" style="width: 100%">
          <el-option v-for="item in userOptions" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="教师邮箱" prop="email">
        <el-input v-model="formTeacher.email" placeholder="请输入教师邮箱"/>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="教师名称" prop="name">
        <el-input v-model="formTeacher.name" placeholder="请输入教师名称"/>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="教师性别" prop="sex">
        <el-input v-model="formTeacher.sex" placeholder="请输入教师性别"/>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formTeacher.phone" placeholder="请输入手机号"/>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="QQ" prop="qq">
        <el-input v-model="formTeacher.qq" placeholder="请输入QQ"/>
      </el-form-item>
    </el-col>

    <el-col :span="24">
      <el-form-item label="专业技能">
        <el-input v-model="formTeacher.remarks" :rows="2" type="textarea" placeholder="请输入备注"/>
      </el-form-item>
    </el-col>
  </el-row>
</el-form>

  <div class="dialog-button-wrap">
    <el-button @click="close">取消</el-button>
    <el-button @click="addTeacher(ruleFormRef)" type="success" :loading="subLoading" color="#083a6d">保存</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref,reactive } from 'vue'
import { ElMessage,FormInstance,FormRules } from 'element-plus'
import {addTeacherApi, getAllUserListApi} from "@/api/edu/teacher/teacher";
// 表单实例对象
const ruleFormRef = ref<FormInstance>()
// 表单约束规则对象
const rules = reactive<FormRules>({
  name: [{ required: true,message: '教师姓名不能为空',trigger: 'blur' }],
  sex: [{ required: true,message: '性别不能为空',trigger: 'blur' }],
  phone:[{ required: true,message: '手机号不能为空',trigger: 'blur' }],
  qq: [{ required: true,message: 'qq号不能为空',trigger: 'blur' }],
  email: [{ required: true,message: '邮箱不能为空',trigger: 'blur' }],
  createBy: [{ required: true,message: '请先绑定账号',trigger: 'blur' }]
})
// 定义事件
const emit = defineEmits(['closeAddTeacherForm','success'])

// 按钮状态
const subLoading = ref(false)
// 表单数据对象
const formTeacher = reactive({
  name: '',
  email: '',
  sex: '',
  phone: '',
  createBy:'',
  qq: '',
  remarks: ''
})

// 新增教师信息
const addTeacher = async (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=> {
    subLoading.value = true
    if(valid){
      const { data } = await addTeacherApi(formTeacher)
      if(data.status === 200){
        ElMessage.success(data.message)
        emit('success')
      }else {
        ElMessage.error(data.message)
      }
    }else{
      ElMessage.error('提交失败，你还有未填写的项')
    }
  })
  subLoading.value = false
}

//定义用户下拉框选择项
const userOptions = ref<Object[]>([])
// 获取所有用户信息
const getAllCourseList = async ()=> {
  const { data } = await getAllUserListApi()
  if(data.status === 200){
    userOptions.value = data.result
  }
}
getAllCourseList()

// 取消表单
const close = ()=>{
  emit('closeAddTeacherForm')
}

</script>

<style scoped>
.dialog-button-wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
