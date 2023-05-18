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

            <el-button  class="button" :loading="subLoading" @click="buyVip(item.id)"> 购买 </el-button>
          </div>
        </div>


      </div>
    </div>
  </div>
  <!--中间内容 end-->
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
</style>
