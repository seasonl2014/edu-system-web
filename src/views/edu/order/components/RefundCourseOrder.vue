<template>
<div>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card shadow="hover">
        <template #header>
          <div class="clearfix">
            <span>课程和学员信息</span>
          </div>
        </template>
        <div class="info">
          <el-form label-width="100px">
            <el-form-item label="课程名称："> {{courseOrderInfo.courseName}}</el-form-item>
            <el-form-item label="课程原价："> {{courseOrderInfo.originalPrice}}</el-form-item>
            <el-form-item label="购买者学号："> {{courseOrderInfo.studentNo}}</el-form-item>
            <el-form-item label="购买者来源："> {{courseOrderInfo.province}}-{{courseOrderInfo.city}}</el-form-item>
          </el-form>

        </div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card shadow="hover">
        <template #header>
          <div class="clearfix">
            <span>订单信息</span>
          </div>
        </template>
        <el-form label-width="90px" :model="refundForm">
          <el-form-item label="订单编号："> {{courseOrderInfo.orderNo}}</el-form-item>
          <el-form-item label="订单金额：">{{courseOrderInfo.price}}</el-form-item>
          <el-form-item label="下单时间：">{{formatTime(courseOrderInfo.createTime,'yyyy-MM-dd HH:mm:ss')}}</el-form-item>
          <el-form-item label="退款原因：">
            <el-input v-model="refundForm.remarks"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
  <div class="dialog-button-wrap">
    <el-button @click="refund(0)" color="#083a6d" type="success" :loading="subRefundLoading">确认退款</el-button>
    <el-button @click="refund(1)"  type="danger" :loading="subLoading">退款并封禁学员</el-button>
  </div>
</div>
</template>

<script setup lang="ts">
import {ref,reactive} from 'vue'
import {ElMessage} from 'element-plus'
import {formatTime} from "@/utils/date";
import {refundCourserOrderApi} from "@/api/edu/order/order";
const props = defineProps(['courseOrderInfo'])
const emit = defineEmits(['success'])
const courseOrderInfo = props.courseOrderInfo
// 退款按钮状态
const subRefundLoading = ref(false)
// 退款变量参数
const refundForm = reactive({
  // 订单ID
  orderId: courseOrderInfo.orderId,
  // 退款原因
  remarks: '',
  // 操作方式,0表示退款，1表示退款并封禁学员账号
  type: 0
})
/**
 * 退款
 * @param type 方式
 */
const refund = async (type:number) => {
  subRefundLoading.value = true
  refundForm.type = type
  const { data } = await refundCourserOrderApi(refundForm)
  if(data.status === 200){
    emit('success')
    ElMessage.success(data.message)
  }else {
    ElMessage.error(data.message)
  }
  subRefundLoading.value = false
}
</script>

<style scoped>
.dialog-button-wrap{
  text-align: center;
  margin-top: 20px;
}
</style>
