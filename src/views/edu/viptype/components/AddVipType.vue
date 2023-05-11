<template>
<el-form ref="ruleFormRef" :rules="rules" :model="formVipType" label-width="80px">
  <el-row>
    <el-col :span="12">
      <el-form-item label="金额" prop="vipMoney">
        <el-input-number v-model="formVipType.vipMoney" placeholder="请输入金额"/>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="VIP名称" prop="vipName">
        <el-input v-model="formVipType.vipName" placeholder="请输入VIP名称"/>
      </el-form-item>
    </el-col>

    <el-col :span="24">
      <el-form-item label="备注">
        <el-input :rows="2" type="textarea" v-model="formVipType.remarks" placeholder="请输入备注"/>
      </el-form-item>
    </el-col>
  </el-row>
</el-form>

  <div class="dialog-button-wrap">
    <el-button @click="close">取消</el-button>
    <el-button @click="addVipType(ruleFormRef)" type="success" :loading="subLoading" color="#083a6d">保存</el-button>
  </div>

</template>

<script setup lang="ts">
import {ref,reactive} from 'vue'
import {ElMessage,FormInstance,FormRules} from 'element-plus'
import {addVipTypeApi} from "@/api/edu/viptype/vipType";

// 表单实例对象
const ruleFormRef = ref<FormInstance>()
// 表单约束规则对象
const rules = reactive<FormRules>({
  vipMoney: [{ required: true,message: '金额不能为空',trigger: 'blur' }],
  vipName: [{ required: true,message: 'VIP名称不能为空',trigger: 'blur' }]
})
// 定义事件
const emit = defineEmits(['closeAddVipTypeForm','success'])
// 按钮状态
const subLoading = ref(false)
// 表单数据对象
const formVipType = reactive({
  vipMoney: 1,
  vipName: '',
  remarks: ''
})

// 新增楼层信息
const addVipType = async (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=> {
    subLoading.value = true
    if(valid){
      const { data } = await addVipTypeApi(formVipType)
      if (data.status === 200){
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
// 关闭表单
const close = ()=> {
  emit('closeAddVipTypeForm')
}
</script>

<style scoped>
.dialog-button-wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
