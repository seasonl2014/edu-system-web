<template>
<!--顶部组件 Start-->
<TopHeader/>
<!--顶部组件 Start-->
  <!--搜索组件 start-->
  <Search/>
  <!--搜索组件 end-->
  <!--中间内容 start-->
  <div class="edu-container">
    <div class="content">
      <div class="box">

        <!--通知公告 start-->
        <div style="display: flex;justify-content: center;">
          <span style="font-size: small;color: red;">公告1：由于服务器费用昂贵，运营成本增加，VIP会员价格即将上涨，还没购买的抓紧时间购买哦</span>
        </div>
        <!--通知公告 end-->

         <div class="title">
           <img src="@/static/img/vip.png">
           <span>加入会员免费观看全站课程和下载全站笔记及源码</span>
         </div>
        <div class="role-item-box">
          <div v-for="item in vipTypes" class="role-item">
            <div  class="name">{{item.vipName}}</div>
            <div  class="price">
              <span  class="small">￥</span>{{item.vipMoney}}
              <span  class="small">/永久</span>
            </div>
            <div  class="desc">
              <p> 所有课程免费看 </p>
              <p> 所有课程笔记免费下 </p>
              <p> 所有课程源码免费下</p>
              <p> 专属VIP微信群 </p>
              <p> 免费答疑 </p>
              <p> 免费远程协助部署项目 </p>
            </div>
            <div class="vip-btn">
              <el-button  class="button" :loading="subLoading" @click="buyVip(item.id)"> 点击购买 </el-button>
              <el-button  class="coupon-button" type="success" :loading="subLoading" @click="openSp"> 领取50元优惠券 </el-button>
            </div>
            <div style="display: flex;justify-content: center;margin-top: 10px;">
              <span style="font-size: small;color: darkblue;">优惠券领取和使用方式：点击优惠券按钮，弹出二维码，扫码关注公众号自动领取优惠券，在个人中心我的优惠券可以查看是否领取成功，付款时自动扣除优惠券的金额，无需其他操作！</span>
            </div>
          </div>
        </div>

        <div class="title">
          <img src="@/static/img/weixin.png">
          <span>付款后请加站长微信，站长会把你拉入专属VIP一对一答疑群</span>
        </div>
        <div class="role-item-box">
          <img src="@/static/img/mywechat.jpg">
        </div>
      </div>
    </div>
  </div>
  <!--中间内容 end-->

  <!--优惠券弹出框 start-->
  <el-dialog align-center v-model="qrcodeVisible" width="23%" destroy-on-close @close="closeCoupon">
    <template #header>
      <div><h3>扫码立即领取优惠券,购买VIP自动抵消相应金额</h3></div>
    </template>
    <div>
      <vue-qr :logoSrc="logoSrc"  :text="qrcode" :size="400"></vue-qr>
    </div>
  </el-dialog>
  <!--优惠券弹出框 end-->

  <!--底部组件 start-->
  <Footer/>
  <!--底部组件 end-->
</template>

<script setup lang="ts">
import TopHeader from "@/views/edu/common/header/TopHeader.vue"
import Search from "@/views/edu/common/search/Search.vue"
import Footer from "@/views/edu/common/footer/Footer.vue"
import {ref,onMounted} from 'vue'
import {getAllVipApi, buyVipApi} from "@/api/edu/viptype/vipType"
import {ElMessage} from 'element-plus'
import {useRouter } from 'vue-router'
import {getQrcodeApi} from "@/api/edu/student/student";
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
// 二维码中间图片
import logoSrc from '@/static/img/weixinpay.png'
// 获取路由对象
const router = useRouter()
// vip类型数据
const vipTypes = ref([])
// 获取所有VIP类型
const getAllVip = async ()=> {
  const { data } = await getAllVipApi()
  vipTypes.value = data.result
}
onMounted(()=> {
  getAllVip()
})
// 购买按钮状态
const subLoading = ref(false)
// 购买VIP会员
const buyVip = async (id:number)=> {
  subLoading.value = true
  const { data } = await buyVipApi(id)
  if(data.status === 200){
    ElMessage.success(data.message)
    // 跳转到订单付款页
    router.push({
      path: `/edu/viporderpay/${data.result.orderNo}`
    })
  }else {
    ElMessage.error(data.message)
  }
  subLoading.value = false
}

// 公众号二维码
const qrcode = ref()
// 公众号二维码弹出框状态
const qrcodeVisible =ref(false)
// 打开二维码弹出框并获取微信公众号二维码函数
const openSp = async () => {
  const {data} = await getQrcodeApi()
  if(data.status===200){
    qrcode.value = data.message
    qrcodeVisible.value = true
  }else {
    ElMessage.error(data.message)
  }

}
/**
 * 关闭优惠券弹出框
 */
const closeCoupon = () => {
  ElMessage.warning('优惠券使用方式：付款的时候，自动使用抵消相应金额')
}
</script>

<style scoped>
.edu-container {
  width: 1200px;
  margin: auto;
}
.content{
  width: 100%;
  height: 100%;
  background-color: #fff;
  border-radius: 10px;
  margin-top: 10px;
}
.content .box{
  width: 1200px;
  margin: 0 auto;
  min-height: 650px;
  box-sizing: border-box;
  background-color: #fff;
  padding-top: 55px;
  padding-bottom: 50px;
}
.content .box .title{
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
.content .box .title img {
  width: 50px;
  height: 50px;
  margin-right: 20px;
}
.content .box .title span {
  margin-top: 5px;
  height: 30px;
  font-size: 30px;
  font-weight: 500;
  color: #333;
  line-height: 30px;
}
.content .box .role-item-box {
  width: 100%;
  padding-top: 50px;
  padding-bottom: 50px;
  box-sizing: border-box;
  display: flex;
  gap: 50px;
  grid-template-columns: repeat(3,minmax(0,1fr));
  justify-content: center;
}

.content .box .role-item-box .role-item {
  position: relative;
  width: 366px;
  height: auto;
  background: linear-gradient(135deg,#fff4e4,#fff4e4 0,#fece86);
  border-radius: 16px;
  padding: 30px;
  box-sizing: border-box;
}

.content .box .role-item-box .role-item .name {
  width: 100%;
  height: 24px;
  font-size: 24px;
  font-weight: 700;
  color: #572f1d;
  line-height: 36px;
  letter-spacing: 1px;
  margin-bottom: 30px;
  text-align: center;
}

.content .box .role-item-box .role-item .price {
  width: 100%;
  height: 48px;
  font-size: 48px;
  font-weight: 600;
  color: #572f1d;
  line-height: 48px;
  margin-bottom: 30px;
  text-align: center;
}
.content .box .role-item-box .role-item .price .small {
  font-size: 20px;
}
.content .box .role-item-box .role-item .desc {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  min-height: 162px;
}
.content .box .role-item-box .role-item .desc p {
  display: block;
  width: 100%;
  float: left;
  height: auto;
  font-size: 16px;
  font-weight: 500;
  color: #572f1d;
  line-height: 24px;
  margin-bottom: 30px;
  text-align: center;
}
.content .box .role-item-box .role-item .button {
  width: 306px;
  height: 50px;
  background: #e1a500;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 500;
  color: #fff;
  line-height: 20px;
}


.coupon-button{
  width: 306px;
  height: 50px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 500;
  color: #fff;
  line-height: 20px;
}

.vip-btn {
  display: flex;
  justify-content: center;
}
</style>
