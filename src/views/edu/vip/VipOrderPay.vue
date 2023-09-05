<template>
  <!--顶部组件 start-->
   <TopHeader/>
  <!--顶部组件 end-->
  <!--搜索组件 start-->
  <Search/>
  <!--搜索组件 end-->
  <!--中间内容 start-->
  <div class="edu-container pay-wrap">
   <el-card>
     <template #header>
       <div class="pay-title">订单编号：{{orderNo}}</div>
     </template>
     <!--支付方式 start-->
     <div class="pay-way">
       <div  class="title">支付方式</div>
       <div class="payment-choose el-row el-row--flex" value="wxpay">
         <label  role="radio" aria-checked="true" tabindex="0" class="el-radio item is-bordered is-checked">
           <span class="el-radio__input is-checked">
             <span class="el-radio__inner">
             </span>
             <input type="radio" aria-hidden="true" tabindex="-1" autocomplete="off" class="el-radio__original" value="wxpay">
           </span>
           <span class="el-radio__label">
             <div  class="tag">
               <div class="Angle"></div>
               <el-icon class="el-icon-check"><Check /></el-icon>
             </div>
             <div  class="wxpay">
               <svg-icon style="font-size: 38px; margin-right: 8px"   icon-class="wxpay"></svg-icon>
               微信支付
             </div>
             </span>
         </label>

       </div>
     </div>
     <!--支付方式 end-->
     <div class="pay-buy">
       <div class="left">合计:<span style="color: #f01414;font-size: 14px;margin-left: 20px;">￥{{orderInfo!=null?orderInfo.price:0}}</span></div>
       <div><el-button color="#083a6d" @click="payBuy">去支付</el-button></div>
     </div>
   </el-card>
  </div>
  <!--中间内容 start-->
  <!--底部组件 start-->
  <Footer/>
  <!--底部组件 end-->
  <!--支付二维码弹出框 start-->
  <el-dialog
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      title="正在购买VIP会员（打开微信扫一扫）" center v-model="payVisible" width="24%">
    <vue-qr :logoSrc="logoSrc"  :text="payCode" :size="400"></vue-qr>
  </el-dialog>
</template>

<script setup lang="ts">
import TopHeader from "@/views/edu/common/header/TopHeader.vue"
import Search from "@/views/edu/common/search/Search.vue"
import Footer from "@/views/edu/common/footer/Footer.vue"
import {useRoute,useRouter} from 'vue-router'
import {ref,onMounted} from 'vue'
import {getOrderInfoApi, payBuyApi} from "@/api/edu/viptype/vipType"
import { ElMessageBox,ElMessage } from 'element-plus'
import vueQr from 'vue-qr/src/packages/vue-qr.vue'
// 二维码中间图片
import logoSrc from '@/static/img/weixinpay.png'
// 服务器路径
const url = import.meta.env.VITE_APP_WS_API
const route = useRoute()
const router = useRouter()
const orderNo = ref(route.params.orderno)
// 根据订单号获取订单信息
const orderInfo = ref()
const getOrderInfo = async ()=> {
  const { data } = await getOrderInfoApi(orderNo.value)
  orderInfo.value = data.result
}
onMounted(()=> {
  getOrderInfo()
})
// 支付弹出框状态
const payVisible = ref(false)
// 去支付
const payCode = ref('支付失败，请加客服微信：w11184629')
const payBuy = async ()=> {
  const { data } = await payBuyApi(orderNo.value)
  payCode.value = data.message
  payVisible.value = true
  webSocketPay(orderNo.value)
}
// 学员点击付款后
const webSocketPay = (orderNo:string)=> {
  if ("WebSocket" in window){
    console.info("您的浏览器支持 WebSocket!")
    // 打开一个 web socket
    let ws = new WebSocket(url+"/edu/websocket/"+orderNo+"");
    ws.onopen = function()
    {
      // Web Socket 已连接上，使用 send() 方法发送数据
      ws.send("发送数据");
      console.info("websocket已连接上使用 send() 方法发送数据")
      //alert("数据发送中...");
    };

    ws.onmessage = function (evt)
    {
      console.info("websocket使用 onmessage() 方法接收数据")
      let received_msg = JSON.parse(evt.data);
      console.log('received_msg:',received_msg)
      if(received_msg.status==1){
        payVisible.value = false
        successMsg(received_msg)
      }

    };

    ws.onclose = function()
    {
      // 关闭 websocket
      ws.close();

    };

    //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
    window.onbeforeunload = function(){
      ws.onclose();
    }
  }else {
    console.info("您的浏览器不支持 WebSocket!")
    return null
  }
}

// 付款成功提示消息
const successMsg = (msg:string)=> {
  ElMessageBox.confirm(
      '恭喜你购买VIP成功',
      '支付成功',
      {
        confirmButtonText: '去下载课程资料',
        cancelButtonText: '去观看视频',
        type: 'success',
        draggable: true,
      }
  )
      .then(() => {
        // 去下载课程资源
        router.push({
          path: `/edu/details/${orderInfo.value.courseId}`
        })
      })
      .catch(() => {
        ElMessage({
          type: 'info',
          message: '跳转到观看视频',
        })
      })
}
</script>

<style scoped>
.edu-container {
  width: 1200px;
  margin: auto;
}
.pay-wrap {
  margin-top: 10px;
  margin-bottom: 20px;
  padding-bottom: 40px;
  background-color: #ffffff;
}
.pay-wrap .pay-title {
  padding-left: 30px;
  height: 44px;
  font-size: 21px;
  font-weight: 500;
  color: #606266;
  line-height: 44px;
}

/*支付方式样式 start*/
.pay-wrap .pay-way {
  margin-top: 70px;
  padding: 0 30px;
}
.pay-wrap .pay-way .title {
  font-size: 15px;
  font-weight: 500;
  color: #303133;
}
.payment-choose {
  flex-wrap: wrap;
}
.payment-choose .item.el-radio.is-bordered {
  width: 160px;
  height: 60px;
  padding: 0;
  position: relative;
  border-radius: 0;
}
.payment-choose .item.el-radio {
  margin-right: 20px;
}
.payment-choose .item {
  margin-top: 10px;
}
.el-radio.is-bordered.is-checked {
  border-color: #00AD82;
}
.payment-choose .item.el-radio.is-bordered .el-radio__input {
  position: absolute;
  opacity: 0;
  top: 0;
}
.payment-choose .item.el-radio.is-bordered .el-radio__label {
  height: 60px;
  padding-left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.payment-choose .item .el-radio__input.is-checked + .el-radio__label .tag {
  opacity: 1;
}
.payment-choose .item .tag .Angle {
  border-top-color: #00AD82!important;
}
.payment-choose .item .tag .Angle {
  position: absolute;
  right: -13px;
  top: -13px;
  width: 0;
  height: 0;
  border: 13px solid transparent;
  transform: rotate(-135deg);
}
.payment-choose .item .tag .el-icon-check{
  position: absolute;
  right: 0;
  top: -1px;
  color: #fff;
  font-size: 12px;
}
.payment-choose .item .wxpay{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 23px;
  color: #07111b;
}
/*支付方式样式 end*/
.pay-buy {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}
</style>
