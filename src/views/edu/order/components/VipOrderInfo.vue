<template>
<div>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card shadow="hover">
        <template #header>
          <div class="clearfix">
            <span>VIP和学员信息</span>
          </div>
        </template>
        <div class="info">
          <el-form label-width="100px">
            <el-form-item label="VIP名称："> {{vipOrderInfo.vipName}}</el-form-item>
            <el-form-item label="VIP价格："> {{vipOrderInfo.vipPrice}}</el-form-item>
            <el-form-item label="购买者学号："> {{vipOrderInfo.studentNo}}</el-form-item>
            <el-form-item label="购买者来源："> {{vipOrderInfo.province}}-{{vipOrderInfo.city}}</el-form-item>
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
        <el-form label-width="90px">
          <el-form-item label="订单编号："> {{vipOrderInfo.orderNo}}</el-form-item>
          <el-form-item label="订单金额：">{{vipOrderInfo.price}}</el-form-item>
          <el-form-item label="下单时间：">{{formatTime(vipOrderInfo.createTime,'yyyy-MM-dd HH:mm:ss')}}</el-form-item>
          <el-form-item label="订单备注：">
            {{vipOrderInfo.remarks}}
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</div>
</template>

<script setup lang="ts">
import {formatTime} from "@/utils/date";
const props = defineProps(['vipOrderInfo'])
const vipOrderInfo = props.vipOrderInfo
</script>

<style scoped>

</style>
