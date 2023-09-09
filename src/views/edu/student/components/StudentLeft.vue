<template>
  <div class="nav-side">
    <div :class="['nav-item', {'on' : menuType === 'centerInfo'}]">
      <a href="" @click.prevent="toCenterInfo()">个人信息</a>
    </div>
    <div :class="['nav-item', {'on' : menuType === 'myCourse'}]">
      <a href="" @click.prevent="toMyCourse()">我的课程</a>
    </div>
    <div :class="['nav-item', {'on' : menuType === 'myVip'}]">
      <a href="" @click.prevent="toMyVip()">购买VIP记录</a>
    </div>
    <div  :class="['nav-item', {'on' : menuType === 'myDownload'}]">
      <a href="" @click.prevent="toMyDownload()">下载资料记录</a>
    </div>
    <div :class="['nav-item', {'on' : menuType === 'account'}]">
      <a href="" @click.prevent="toAccount()">账号绑定</a>
    </div>
    <div :class="['nav-item', {'on' : menuType === 'myCoupon'}]">
      <a href="" @click.prevent="toMyCoupon()">我的优惠券</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {useRouter} from 'vue-router'
const props = defineProps(['menuType'])
const menuType = props.menuType
const router = useRouter()
/**
 *
 * 跳转到个人中心
 */
const toCenterInfo = ()=>{
  let { href } =  router.resolve({
    name: 'MyInfo'
  })
  window.open(href, '_self')
}
/**
 *
 * 跳转到我的课程
 */
const toMyCourse = ()=>{
  let { href } =  router.resolve({
    name: 'MyCourse'
  })
  window.open(href, '_self')
}

/**
 *
 * 跳转到我的购买VIP记录
 */
const toMyVip = ()=>{
  let { href } =  router.resolve({
    name: 'MyVip'
  })
  window.open(href, '_self')
}
/**
 *
 * 跳转到下载课程资料记录
 */
const toMyDownload = ()=>{
  let { href } =  router.resolve({
    name: 'MyDownload'
  })
  window.open(href, '_self')
}
/**
 *
 * 跳转到账号绑定
 */
const toAccount = ()=>{
  let { href } =  router.resolve({
    name: 'Account'
  })
  window.open(href, '_self')
}

/**
 *
 * 跳转到我的优惠券
 */
const toMyCoupon = ()=>{
  let { href } =  router.resolve({
    name: 'MyCoupon'
  })
  window.open(href, '_self')
}

</script>

<style scoped>
.nav-side{
  width: 180px;
  margin-left: 20px;
  margin-top: 20px;
}
.nav-item{
  line-height: 48px;
  color: #384378;
  border-radius: 10px;
  font-size: 16px;
  background:#fff url("@/static/img/c_ico1.png") no-repeat 20px center;
  background-size: auto;
  padding-left: 65px;
  margin-top: 15px;
}
.nav-item a{
  display: block;
  color: #7d7d7d;
  width: 100%;
  height: 100%;
}
.nav-item:nth-child(2){
  background:#fff url("@/static/img/c_ico2.png") no-repeat 20px center;
}
.nav-item:nth-child(3){
  background:#fff url("@/static/img/c_ico3.png") no-repeat 20px center;
}
.nav-item:nth-child(4){
  background:#fff url("@/static/img/c_ico4.png") no-repeat 20px center;
}
.nav-item:nth-child(5){
  background:#fff url("@/static/img/c_ico5.png") no-repeat 20px center;
}
.nav-item.on{
  background:#384378 url("@/static/img/c_ico1_on.png") no-repeat 20px center;
}
.nav-item:nth-child(2).on{
  background:#384378 url("@/static/img/c_ico2_on.png") no-repeat 20px center;
}
.nav-item:nth-child(3).on{
  background:#384378 url("@/static/img/c_ico3_on.png") no-repeat 20px center;
}
.nav-item:nth-child(4).on{
  background:#384378 url("@/static/img/c_ico4_on.png") no-repeat 20px center;
}
.nav-item:nth-child(5).on{
  background:#384378 url("@/static/img/c_ico5_on.png") no-repeat 20px center;
}
.nav-item.on a{
  color: #ffffff;
}
</style>
