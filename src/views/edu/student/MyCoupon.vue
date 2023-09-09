<template>
  <!--头部组件 start-->
  <TopHeader/>
  <!--头部组件 start-->
  <!--搜索组件 start-->
  <Search/>
  <!--搜索组件 start-->
  <!--中间内容 start-->
  <!--banner start-->
  <div class="details-banner">
    <h3>学员编号：{{studentInfo.stuNo}}</h3>
    <div class="details-tag">
      <span>手机号：{{studentInfo.phone==null?'未绑定':studentInfo.phone}}</span>
      | <span>昵称：{{studentInfo.name}}</span>
      | <span>性别：{{studentInfo.sex==0?'保密':studentInfo.sex==2?'男':'女'}}</span>
      | <span>会员类型：{{studentInfo.vipType==null?'注册会员':'齐天大会员'}}</span>
      | <span>区域：{{studentInfo.province}}-{{studentInfo.city}}</span>
    </div>
  </div>
  <!--banner end-->
  <div class="edu-container center-main">
    <!--左边菜单 start-->
    <StudentLeft :menuType="menuType"/>
    <!--左边菜单 end-->
    <!--右边我的优惠券 Start-->
    <div class="center-right">
      <div class="right-title">
        我的优惠券明细
      </div>
      <table width="100%" cellspacing="0" cellpadding="0" class="recharge-tab">
        <tr>
          <th>优惠券编号</th>
          <th>优惠券状态</th>
          <th>优惠券名称</th>
          <th>所属批次</th>
          <th>有效时间</th>
        </tr>
        <template v-if="couponList.length===0">
          <div style="margin-top: 10px;">暂无优惠券</div>
        </template>
        <template v-else>
        <tr v-for="item in couponList">
          <td>{{ item.stuCouponId }}</td>
          <td v-if="item.status==='SENDED'">可用</td>
          <td v-else-if="item.status==='USED'">已实扣</td>
          <td style="color:red;" v-else>已过期</td>
          <td>{{ item.couponName }}</td>
          <td >{{ item.stockId }}</td>
          <td>从{{formatTime(item.availableBeginTime,'yyyy-MM-dd')}}到{{formatTime(item.availableEndTime,'yyyy-MM-dd')}}</td>
        </tr>
        </template>
      </table>
      <!--分页 start-->
      <!--分页 end-->
      <!--关注公众号领取优惠券 start-->
       <div style="display: flex;justify-content: center;">
         <el-button @click="openSp" type="success">点击领取优惠券</el-button>
       </div>
      <el-dialog align-center v-model="qrcodeVisible" width="23%" destroy-on-close @close="closeCoupon">
        <template #header>
          <div><h3>扫码立即领取优惠券</h3></div>
        </template>
        <div>
          <vue-qr :logoSrc="logoSrc"  :text="qrcode" :size="400"></vue-qr>
        </div>
      </el-dialog>
      <!--关注公众号领取优惠券 end-->
    </div>
    <!--右边我的优惠券 end-->

  </div>
  <!--中间内容 end-->
  <!--底部组件 start-->
  <Footer/>
  <!--底部组件 end-->
</template>

<script setup lang="ts">
import TopHeader from "@/views/edu/common/header/TopHeader.vue";
import Search from "@/views/edu/common/search/Search.vue"
import Footer from "@/views/edu/common/footer/Footer.vue"
import StudentLeft from "@/views/edu/student/components/StudentLeft.vue"
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
import { ref,reactive,onMounted} from 'vue'
import {getBuyVipListApi, getMyCouponListApi, getQrcodeApi, getStudentInfoApi} from "@/api/edu/student/student";
import {formatTime} from "@/utils/date";
const  menuType = ref('myCoupon')
// 二维码中间图片
import logoSrc from '@/static/img/weixinpay.png'
// 学生信息对象
const studentInfo = reactive({
  id: 0,
  name: '',
  sex: 0,
  vipType: '',
  stuNo: '',
  province: '',
  city: ''
})
/**
 * 获取登录学员信息
 */
const getStudentInfo = async ()=> {
  const { data } = await getStudentInfoApi()
  // 填充数据
  for (const key in studentInfo) {
    studentInfo[key] = data.result[key]
  }
}
// 当前页
const pageIndex = ref(1)
// 每页显示行数
const pageSize = ref(3)
// 总记录数
const total = ref(0)
// 代金券列表数据
const couponList = ref([])
const getList= async ()=> {
  const params = {
    pageIndex: pageIndex.value,
    pageSize: pageSize.value
  }
  const { data } = await getMyCouponListApi(params)
  couponList.value = data.result.content
  total.value = data.result.totalElements
}

// 公众号二维码
const qrcode = ref()
// 公众号二维码弹出框状态
const qrcodeVisible =ref(false)
// 打开二维码弹出框并获取微信公众号二维码函数
const openSp = async () => {
  const {data} = await getQrcodeApi()
  qrcode.value = data.message
  qrcodeVisible.value = true
}

/**
 * 关闭领取代金券弹出框
 */
const closeCoupon = () => {
  getList()
}

onMounted(()=> {
  getStudentInfo()
  getList()
})
</script>

<style scoped>
/*banner样式 start*/
.details-banner {
  width: 100%;
  height: 150px;
  background: url(@/static/img/details_banner.jpg) no-repeat top;
  background-size: 100% 100%;
  text-align: center;
  padding-top: 50px;
}
.details-banner h3 {
  color: #fff;
  font-size: 39px;
  text-shadow: 1px 1px 5px rgb(0 0 0 / 30%);
  margin-bottom: 20px;
}
.details-tag {
  color: #fff;
}
.details-tag span {
  display: inline-block;
  color: #fff;
  font-size: 14px;
  margin: 0 20px;
}
.details-banner-btn {
  cursor: pointer;
  width: 82px;
  height: 29px;
  padding-left: 20px;
  line-height: 28px;
  margin: 40px auto 0;
  border: 1px solid #fff;
  color: #fff;
  font-size: 14px;
  text-align: center;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2NTY5Q0RGMzk5MTMxMUVBODdCNEU3Rjk0NTM2RjZCNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2NTY5Q0RGNDk5MTMxMUVBODdCNEU3Rjk0NTM2RjZCNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjY1NjlDREYxOTkxMzExRUE4N0I0RTdGOTQ1MzZGNkI0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjY1NjlDREYyOTkxMzExRUE4N0I0RTdGOTQ1MzZGNkI0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+VcJUXgAAAQlJREFUeNqM0rFLgkEYx3FfwSlEECHhpaE2ndQhcJBybPKPaBF6odnBVVFxiyYJB9dydhAECTcxEbFCwt3hHaQhorfvxR0ccScefOTex/u973vPe04QBCHLeEQCF8Z/RdCgAh8b3JnW2IJinGnz2CHBLhba9QhjhPV1Dj8nvHEVKSQRwyWWcjcunvGNLT7QFEHRnT6GmGJiaVYOWelGPPYLbcteTW7xIybHsgG9A0INuTatClHs8LAnVJMh939XPaz3BFdoqeuwtvk8BiH7EA3MmE7OHEU5L+AF77iStVO8IqK+o7qHjyd5Ps/RwSc8vGGGMuJ/de2JJcxwjyOtLk5MHUtcq/qvAAMAvVG1qNmxtlwAAAAASUVORK5CYII=) no-repeat 18px;
  background-size: auto;
  border-radius: 20px;
}
/*banner样式 end*/
.edu-container {
  width: 1200px;
  margin: auto;
}
.center-main{
  background: #ffffff;
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
  min-height: 600px;
  border-radius: 10px;
  box-shadow: 1px 1px 10px rgb(27 39 94 / 40%);
}

.center-right{
  width: 888px;
  margin-left: 60px;
  margin-top: 30px;
}
.right-title{
  color: #555555;
  font-size: 16px;
  padding-right: 20px;
  border-bottom: 1px solid #bebebe;
  line-height: 40px;
}
.right-title span{
  color: #065786;
  font-size: 14px;
  cursor: pointer;
  float: right;
}
.info-list{
  margin-top: 40px;
}
.info-item{
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
}
.info-label{
  width: 120px;
  height: 60px;
  background: #f4f4f4;
  text-align: center;
  line-height: 60px;
  color: #555555;
  font-size: 14px;
}
.info-text{
  width: 605px;
  color: #7d7d7d;
  font-size: 14px;
  line-height: 60px;
  margin-left: 15px;
  border-bottom: 1px solid #f4f4f4;
}
.recharge-tab{
  margin: 20px 0;
}
.recharge-tab tr th{
  line-height: 45px;
  background: #efefef;
  color: #555555;
  font-size: 14px;
  text-align: center;
}
.recharge-tab tr td{
  color: #555555;
  font-size: 14px;
  line-height: 45px;
  border-bottom: 1px solid #bdbdbd;
  text-align: center;
}
.recharge-tab tr:last-child td{
  border-bottom: none;
}
</style>
