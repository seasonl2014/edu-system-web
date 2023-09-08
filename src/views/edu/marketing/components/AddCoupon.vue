<template>
<el-form ref="ruleFormRef" :rules="rules" :model="formCoupon" label-width="100px">
  <el-row>
    <el-col :span="12">
      <el-form-item label="批次名称" prop="stockName">
        <el-input  v-model="formCoupon.stockName" placeholder="请输入批次名称"/>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="最大发券数" prop="maxCoupons">
        <el-input-number style="width: 100%;" min="1" max="1000" v-model="formCoupon.maxCoupons" placeholder="请输入最大发券数"/>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="开始时间" prop="availableBeginTime">
        <el-date-picker
            v-model="formCoupon.availableBeginTime"
            type="date"
            placeholder="请输入开始时间"
        />
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="结束时间" prop="availableEndTime">
        <el-date-picker
            v-model="formCoupon.availableEndTime"
            type="date"
            placeholder="请输入结束时间"
        />
      </el-form-item>
    </el-col>

    <el-col :span="8">
      <el-form-item label="领取个数" prop="maxCouponsPerUser">
        <el-input-number style="width: 100%;" min="1" max="1000" v-model="formCoupon.maxCouponsPerUser" placeholder="请输入单用户领取个数"/>
      </el-form-item>
    </el-col>

    <el-col :span="8">
      <el-form-item label="代金券面额" prop="couponAmount">
        <el-input-number style="width: 100%;" min="1" max="1000" v-model="formCoupon.couponAmount" placeholder="请输入代金券面额"/>
      </el-form-item>
    </el-col>

    <el-col :span="8">
      <el-form-item label="使用门槛" prop="transactionMinimum">
        <el-input-number style="width: 100%;" min="1" max="1000" v-model="formCoupon.transactionMinimum" placeholder="请输入使用券金额门槛"/>
      </el-form-item>
    </el-col>

  </el-row>
</el-form>

  <div class="dialog-button-wrap">
    <el-button @click="close">取消</el-button>
    <el-button @click="createCouponStock(ruleFormRef)" :loading="subLoading" type="success" color="#083a6d">保存</el-button>
  </div>

</template>

<script setup lang="ts">
import { ref,reactive } from 'vue'
import { ElMessage,FormInstance,FormRules } from 'element-plus'
import {createCouponStockApi} from "@/api/edu/marketing/coupon";

// 表单实例对象
const ruleFormRef = ref<FormInstance>()
// 表单约束规则对象
const rules = reactive<FormRules>({
  stockName: [{ required: true,message: '起始编号不能为空',trigger: 'blur' }],
  maxCoupons: [{ required: true,message: '最大发券数不能为空',trigger: 'blur' }],
  availableBeginTime: [{ required: true,message: '开始时间不能为空',trigger: 'blur' }],
  availableEndTime: [{ required: true,message: '结束时间不能为空',trigger: 'blur' }],
  maxCouponsPerUser: [{ required: true,message: '单个用户领取个数不能为空',trigger: 'blur' }],
  couponAmount: [{ required: true,message: '代金券面额不能为空',trigger: 'blur' }],
  transactionMinimum: [{ required: true,message: '代金券使用门槛不能为空',trigger: 'blur' }]
})
// 定义事件
const emit = defineEmits(['closeAddCourseForm','success'])
// 按钮状态
const subLoading = ref(false)

// 表单数据对象
const formCoupon = reactive({
  stockName: '', // 批次名称
  availableBeginTime: '', // 批次开始时间
  availableEndTime: '',// 批次结束时间
  maxCoupons: '',// 最大发券数
  maxCouponsPerUser: '',//单个用户可领个数
  couponAmount: '',// 面额 说明：面额，单位分
  transactionMinimum: '',//门槛 说明：使用券金额门槛，单位分

})

// 新增学号信息
const createCouponStock = async (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=> {
    subLoading.value = true
    if(valid){
      const { data } = await createCouponStockApi(formCoupon)
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
