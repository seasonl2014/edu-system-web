<template>
<el-form ref="ruleFormRef" :rules="rules" :model="formStudentId" label-width="80px">
  <el-row>
    <el-col :span="12">
      <el-form-item label="起始编号" prop="startNo">
        <el-input-number style="width: 100%;" min="10000000" v-model="formStudentId.startNo" placeholder="请输入起始编号"/>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="生成数量" prop="number">
        <el-input-number style="width: 100%;" min="1" max="1000" v-model="formStudentId.number" placeholder="请输入生成数量"/>
      </el-form-item>
    </el-col>

  </el-row>
</el-form>

  <div class="dialog-button-wrap">
    <el-button @click="close">取消</el-button>
    <el-button @click="addStudentId(ruleFormRef)" :loading="subLoading" type="success" color="#083a6d">立即生成</el-button>
  </div>

</template>

<script setup lang="ts">
import { ref,reactive } from 'vue'
import { ElMessage,FormInstance,FormRules } from 'element-plus'
import {addStudentIdApi} from "@/api/edu/student/studentid";

// 表单实例对象
const ruleFormRef = ref<FormInstance>()
// 表单约束规则对象
const rules = reactive<FormRules>({
  startNo: [{ required: true,message: '起始编号不能为空',trigger: 'blur' }],
  number: [{ required: true,message: '生成数量不能为空',trigger: 'blur' }]
})
// 定义事件
const emit = defineEmits(['closeAddStudentIdForm','success'])
// 按钮状态
const subLoading = ref(false)

// 表单数据对象
const formStudentId = reactive({
  startNo: '',
  number: ''
})

// 新增学号信息
const addStudentId = async (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=> {
    subLoading.value = true
    if(valid){
      const { data } = await addStudentIdApi(formStudentId)
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
const close = ()=> {
  emit('closeAddStudentIdForm')
}

</script>

<style scoped>
.dialog-button-wrap{
  text-align: center;
  margin-top: 20px;
}
</style>
