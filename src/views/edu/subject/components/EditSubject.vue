<template>
<el-form ref="ruleFormRef" :rules="rules" :model="formSubject" label-width="80px">
  <el-row>
    <el-col :span="12">
      <el-form-item label="类型名称" prop="name">
        <el-input v-model="formSubject.name" placeholder="请输入课程类型名称"/>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="阿里云ID" >
        <el-input v-model="formSubject.cateId" placeholder="请输入课程类型名称"/>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="类型排序" prop="sort">
        <el-input-number v-model="formSubject.sort" placeholder="请输入类型排序"/>
      </el-form-item>
    </el-col>

    <el-col :span="24">
      <el-form-item label="备注">
        <el-input :rows="2" type="textarea" v-model="formSubject.remarks" placeholder="请输入备注"/>
      </el-form-item>
    </el-col>

  </el-row>
</el-form>

  <div class="dialog-button-wrap">
    <el-button @click="close">取消</el-button>
    <el-button @click="editRoomType(ruleFormRef)" :loading="subLoading" type="success" color="#083a6d">保存</el-button>
  </div>

</template>

<script setup lang="ts">
import {ref, reactive} from 'vue'
import {ElMessage,FormInstance,FormRules} from 'element-plus'
import {editSubjectApi} from "@/api/edu/subject/subject";

// 表单实例对象
const ruleFormRef = ref<FormInstance>()
// 表单约束规则
const rules = reactive<FormRules>({
  name: [{ required: true,message: '课程类型名称不能为空',trigger: 'blur' }],
  sort: [{ required: true,message: '课程类型排序不能为空',trigger: 'blur' }]
})
// 定义事件
const emit = defineEmits(['closeEditRoomTypeForm','success'])
// 按钮状态
const subLoading = ref(false)
// 表单数据对象
const formSubject = reactive({
  id: 0,
  name: '',
  sort: 0,
  cateId: '',
  remarks: ''
})

// 获取父组件传过来的roomTypeInfo对象
const props = defineProps(['subjectInfo'])
const subjectInfo = ref(props.subjectInfo)
// 给表单填充数据
for (const key in formSubject) {
  formSubject[key] = subjectInfo.value[key]
}

// 更新课程类型信息
const editRoomType = async (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=>{
    subLoading.value = true
    if(valid){
      const { data } = await editSubjectApi(formSubject)
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
  emit('closeEditRoomTypeForm')
}

</script>

<style scoped>
.dialog-button-wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
