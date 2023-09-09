<template>
<el-form ref="ruleFormRef" :rules="rules" :model="formCoupon" label-width="100px">
  <el-row>
    <el-col :span="24">
      <el-form-item label="学员编号" prop="studentNo">
        <el-input  v-model="formCoupon.studentNo" placeholder="请输入学员编号"/>
      </el-form-item>
    </el-col>

  </el-row>
</el-form>

  <div class="dialog-button-wrap">
    <el-button @click="close">取消</el-button>
    <el-button @click="sendCoupon(ruleFormRef)" :loading="subLoading" type="success" color="#083a6d">发放</el-button>
  </div>

</template>

<script setup lang="ts">
import { ref,reactive } from 'vue'
import { ElMessage,FormInstance,FormRules } from 'element-plus'
import {sendCouponApi} from "@/api/edu/marketing/coupon";

// 表单实例对象
const ruleFormRef = ref<FormInstance>()
// 表单约束规则对象
const rules = reactive<FormRules>({
  studentNo: [{ required: true,message: '学员编号不能为空',trigger: 'blur' }]
})
// 定义事件
const emit = defineEmits(['closeAddCourseForm','success'])
// 按钮状态
const subLoading = ref(false)
const props = defineProps(['couponId'])
// 表单数据对象
const formCoupon = reactive({
  couponId: props.couponId,// 代金券批次ID
  studentNo: '', // 学员编号
})

// 发送代金券
const sendCoupon = async (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=> {
    subLoading.value = true
    if(valid){
      const { data } = await sendCouponApi(formCoupon)
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
  emit('closeAddCourseForm')
}

</script>

<style scoped>
.dialog-button-wrap{
  text-align: center;
  margin-top: 20px;
}
</style>
