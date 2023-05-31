<template>
  <el-form ref="ruleFormRef" :rules="rules" :model="formBanner" label-width="80px">
    <el-row>

      <el-col :span="12">
        <el-form-item label="标题" prop="title">
          <el-input v-model="formBanner.title" placeholder="请输入标题"/>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="链接地址" prop="url">
          <el-input v-model="formBanner.url" placeholder="请输入链接地址"/>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="排序">
          <el-input-number  v-model="formBanner.level" placeholder="请输入排序"/>
        </el-form-item>
      </el-col>

      <el-col :span="12">
        <el-form-item label="状态" prop="status">
          <el-select v-model="formBanner.status" placeholder="请选择状态">
            <el-option label="启用" :value="1"/>
            <el-option label="禁用" :value="0"/>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>

  <div class="dialog-button-wrap">
    <el-button @click="close">取消</el-button>
    <el-button @click="addBanner(ruleFormRef)" type="success" :loading="subLoading" color="#083a6d">保存</el-button>
  </div>
</template>

<script setup lang="ts">
import {ref,reactive} from 'vue'
import { ElMessage,FormInstance,FormRules } from 'element-plus'
import {addBannerApi} from "@/api/edu/banner/banner";
// 表单实例对象
const ruleFormRef = ref<FormInstance>()
// 表单约束规则
const rules = reactive<FormRules>({
  url: [{ required: true,message: '链接地址不能为空',trigger: 'blur' }],
  title: [{ required: true,message: '标题不能为空',trigger: 'blur' }],
  status:[{ required: true,message: '状态不能为空',trigger: 'blur' }]
})
// 按钮状态
const subLoading = ref(false)
// 表单数据对象
const formBanner = reactive({
  url:'',
  title: '',
  status:0,
  level: 0
})
// 定义事件
const emit = defineEmits(['closeAddBannerForm','success'])

/**
 * 保存轮播图
 * @param formEl
 */
const addBanner = async (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=> {
    subLoading.value = true
    if(valid){
      const { data } = await addBannerApi(formBanner)
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
</script>

<style scoped>
.dialog-button-wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
