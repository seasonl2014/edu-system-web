<template>
<el-form ref="ruleFormRef" :rules="rules" :model="formTeacher" label-width="80px">
  <el-row>
    <el-col :span="12">
      <el-form-item label="教授科目" prop="course">
        <el-select v-model="formTeacher.course.id" placeholder="请选择科目" style="width: 100%;">
          <el-option v-for="item in courseOptions" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="教师工号" prop="teacherno">
        <el-input v-model="formTeacher.teacherno" placeholder="请输入教师工号" />
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="教师姓名" prop="name">
        <el-input v-model="formTeacher.name" placeholder="请输入教师姓名" />
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="教师性别" prop="sex">
        <el-input v-model="formTeacher.sex" placeholder="请输入教师性别" />
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formTeacher.phone" placeholder="请输入手机号" />
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="QQ号" prop="qq">
        <el-input v-model="formTeacher.qq" placeholder="请输入QQ号" />
      </el-form-item>
    </el-col>

    <el-col :span="24">
      <el-form-item label="备注">
        <el-input v-model="formTeacher.remarks" :rows="2" type="textarea" placeholder="请输入备注" />
      </el-form-item>
    </el-col>

  </el-row>
</el-form>

  <div class="dialog-button-wrap">
    <el-button @click="close">取消</el-button>
    <el-button @click="editTeacher(ruleFormRef)" type="success" :loading="subLoading" color="#178557">保存</el-button>
  </div>

</template>

<script setup lang="ts">
import { ref,reactive } from 'vue'
import { ElMessage,FormInstance,FormRules } from 'element-plus'
import {editTeacherApi, getAllUserListApi} from "@/api/edu/teacher/teacher"
// 表单实例对象
const ruleFormRef = ref<FormInstance>()
// 表单约束规则对象
const rules = reactive<FormRules>({
  name: [{required: true,message: '教师姓名不能为空',trigger: 'blur'}],
  sex: [{ required: true,message: '教师性别不能为空',trigger: 'blur' }],
  phone: [{ required: true,message: '手机号不能空',trigger: 'blur' }],
  qq: [{ required: true,message: 'QQ号不能为空',trigger: 'blur' }],
  teacherno: [{ required: true,message: '教师工号不能为空',trigger: 'blur' }],
  course: [{ required: true,message: '教授科目不能为空',trigger: 'blur' }]
})
// 定义事件
const emit = defineEmits(['closeEditTeacherForm','success'])
// 获取父组件传过来的teacherInfo对象
const props = defineProps(['teacherInfo'])
const teacherInfo = ref(props.teacherInfo)
// 按钮状态
const subLoading = ref(false)
// 表单数据对象
const formTeacher = reactive({
  id: 0,
  name: '',
  teacherno: '',
  sex: '',
  phone: '',
  qq: '',
  remarks: '',
  course: {
    id: ''
  }
})

// 给表单填充数据
for (const key in formTeacher) {
  formTeacher[key] = teacherInfo.value[key]
}
// 更新教师信息
const editTeacher = async (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=>{
    subLoading.value = true
    if(valid){
      const { data } = await editTeacherApi(formTeacher)
      if(data.status === 200){
        ElMessage.success(data.message)
        emit('success')
      }else {
        ElMessage.error(data.message)
      }
    }else {
      ElMessage.error('提交失败，你还有未填写的项')
    }
  })
  subLoading.value = false
}

// 课程下来选择项
const courseOptions = ref<object[]>([])
// 获取所有课程
const getAllCourseList = async ()=> {
  const { data } = await getAllUserListApi()
  courseOptions.value = data.result
}
getAllCourseList()

// 取消表单
const close = ()=>{
  emit('closeEditTeacherForm')
}
</script>

<style scoped>
.dialog-button-wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
