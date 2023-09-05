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
        <el-form label-width="90px">
          <el-form-item label="订单编号："> {{courseOrderInfo.orderNo}}</el-form-item>
          <el-form-item label="订单金额：">{{courseOrderInfo.price}}</el-form-item>
          <el-form-item label="下单时间：">{{formatTime(courseOrderInfo.createTime,'yyyy-MM-dd HH:mm:ss')}}</el-form-item>
          <el-form-item label="订单备注：">
            {{courseOrderInfo.remarks}}
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</div>
</template>

<script setup lang="ts">
import {formatTime} from "@/utils/date";
const props = defineProps(['courseOrderInfo'])
const courseOrderInfo = props.courseOrderInfo
</script>

<style scoped>

</style>
