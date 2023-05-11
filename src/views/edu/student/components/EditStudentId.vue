<template>
<el-form ref="ruleFormRef" :rules="rules" :model="formCourse" label-width="80px">
  <el-row>
    <el-col :span="12">
      <el-form-item label="课程编号" prop="courseno">
        <el-input v-model="formCourse.courseno" placeholder="请输入课程编号"/>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="课程名称" prop="coursename">
        <el-input v-model="formCourse.coursename" placeholder="请输入课程名称"/>
      </el-form-item>
    </el-col>

    <el-col :span="24">
      <el-form-item label="备注">
        <el-input v-model="formCourse.remarks" :rows="2" type="textarea" placeholder="请输入备注"/>
      </el-form-item>
    </el-col>
  </el-row>
</el-form>
  <div class="dialog-button-wrap">
    <el-button @click="close">取消</el-button>
    <el-button @click="editCourse(ruleFormRef)" type="success" :loading="subLoading" color="#178557">保存</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref,reactive } from 'vue'

import { ElMessage,FormInstance,FormRules } from 'element-plus'
import {editStudentIdApi} from "@/api/edu/student/studentid";

// 定义表单实例对象
const ruleFormRef = ref<FormInstance>()
// 定义表单约束规则对象
const rules = reactive<FormRules>({
  courseno: [{ required: true,message: '课程编号不能为空',trigger: 'blur' }],
  coursename: [{ required: true,message: '课程名称不能为空',trigger: 'blur' }]
})

// 获取父组件传过来的courseInfo对象
const props = defineProps(['courseInfo'])
const courseInfo = ref(props.courseInfo)

// 定义事件
const emit = defineEmits(['closeEditCourseForm','success'])

// 定义按钮状态
const subLoading = ref(false)
// 定义表单数据对象
const formCourse = reactive({
  id: 0,
  courseno: '',
  coursename: '',
  remarks: ''
})

// 给表单填充数据
for (const key in formCourse) {
  formCourse[key] = courseInfo.value[key]
}

// 编辑课程信息
const editCourse = async (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=> {
    subLoading.value = true
    if(valid){
      const { data } = await editStudentIdApi(formCourse)
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

// 取消表单
const close = ()=>{
  emit('closeEditCourseForm')
}

</script>

<style scoped>
.dialog-button-wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
