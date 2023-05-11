<template>
<el-form ref="ruleFormRef" :rules="rules" :model="formRole" label-width="80px">

  <el-row>
    <el-col :span="12">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="formRole.name" placeholder="请输入角色名称"/>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="角色编号" prop="code">
        <el-input v-model="formRole.code" placeholder="请输入角色编号"/>
      </el-form-item>
    </el-col>

    <el-col :span="24">
      <el-form-item label="备注">
        <el-input v-model="formRole.remarks" :rows="2" type="textarea" placeholder="请输入备注"/>
      </el-form-item>
    </el-col>
  </el-row>
</el-form>

  <div class="dialog__button--wrap">
    <el-button @click="close">取消</el-button>
    <el-button @click="editRole(ruleFormRef)" color="#083a6d" :loading="subLoading" type="success">保存</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage,FormInstance,FormRules  } from 'element-plus'
import {editRoleApi} from "../../../../api/system/role/role";
const props = defineProps(['roleInfo'])
const  roleInfo = ref(props.roleInfo)
const subLoading = ref(false)
const emit = defineEmits(['closeEditRoleForm','success'])
// 表单ref对象
const ruleFormRef = ref<FormInstance>()
// 定义表单约束规则对象
const rules = reactive<FormRules>({
  name: [{ required: true,message: '角色名称不能为空',trigger: 'blur' }],
  code: [{ required: true,message: '角色编号不能为空',trigger: 'blur' }]
})
// 表单对象
const formRole = reactive({
  id: 0,
  code: '',
  name: '',
  remarks: ''
})

// 给表单填充数据
for (const key in formRole) {
  formRole[key] = roleInfo.value[key]
}

// 保存编辑角色信息
const editRole = async (formEl: FormInstance | undefined)=> {

  if(!formEl)return
  await formEl.validate(async (valid,fields)=> {
    subLoading.value = true
    if(valid){
      const { data } = await editRoleApi(formRole)
      if(data.status===200){
        ElMessage.success(data.message)
        emit('success')
      }else{
        ElMessage.error(data.message)
      }
    }else{
      ElMessage.error('提交失败，你还有未填写的项！')
      console.log('提交失败',fields)
    }
    subLoading.value =false
  })

}

// 取消表单
const close = ()=> {
  emit('closeEditRoleForm')
}

</script>

<style scoped>
.dialog__button--wrap{
  text-align: center;
  margin-top: 20px;
}
</style>
