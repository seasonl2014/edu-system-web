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
        <div class="design-title">
          <h3>程序代做服务介绍</h3>
        </div>
       <!--毕业设计文案 start-->
        <ul>
        <li class="design-li">
        1. <b>需求方面:</b> 请提供你的需求文档，如果没有文档的话，请提供选题和具体功能要求，我来帮你规划程序的详细内容。
        </li>
        <li class="design-li">
          2. <b>价格方面:</b> 我们会先确定好你的需求和功能列表，根据需求来定价。开工后如果有问题需要修改，需要根据实际改动幅度额外收费。
        </li>
          <li class="design-li">
          3. <b>交付时间:</b> 一般是1-2周的时间，可加急，保证我的交付程序的质量，交付的时候我会提供源码，帮你在电脑上完整的安装运行好（但是你自己需要先安装好相关的软件，软件安装包我们可以提供）
          </li>
          <li class="design-li">
            4. <b>交付内容:</b> 包括 源码 + SQL + 软件安装包链接 + 系统所用技术简介 + SQL的Excel介绍表格
          </li>
          <li class="design-li">
            5. <b>交易流程:</b> 确认好之后先付定金，订金是系统价格的一半，系统做完之后会联系你演示给你看（截图或者腾讯会议演示），确认没问题之后支付尾款，支付完之后，我们会把源代码发给你，并且在你的电脑上安装。后续项目运行遇到任何问题都有专业售后一对一帮助你解决问题。
          </li>
          <li class="design-li">
            6. <b>售后方面:</b> 在答辩之前我们保证提供给你的原始程序可以正常运行（排除你自己修改的情况），保证注释规范到位，可以对系统运行的小问题进行答疑。
          </li>
          <li class="design-li">
            7. <b>文档方面:</b> 开题报告、任务书、文档初稿均可，可以全包，一条龙服务到底。单独收费，文档详情请看 效果参考
          </li>
          <li class="design-li">
            8. <b>系统讲解:</b> 单独收费，讲解全程录制视频，腾讯会议一对一讲解。包括系统整体设计+功能模块讲解+数据库讲解+答辩技巧+问题解答。你可以事先了解下系统，在讲解过程中向我们提问你的问题，我们会针对问题详细分析和解答，讲完之后答辩基本没有问题。
          </li>
        </ul>
        <div class="design-title" style="margin: 20px">
          <h3>郑重声明</h3>
        </div>
        <span style="margin:20px; ">
        我们是专业的团队，开题、中期、代码、文档、答辩辅导都可以做！有需求尽管甩过来！一条龙帮你安心毕业！
        </span>
        <div class="design-title" style="margin: 20px">
          <h3>我们承诺</h3>
        </div>
        <span style="margin-left:20px; margin-top: 20px;">
        所有的代码都是完全手撸完成，不会使用任何开源的代码二次修改，不会拿成品代码直接修改发给你，代码质量有保障。
        </span>
        <div class="design-title" style="margin: 20px">
          <h3>联系方式</h3>
        </div>
        <span style="margin:20px; ">
        微信：w11184629 备注：毕设定制
        微信加不上可以加QQ:11184629 备注：毕设定制
        </span>
        <!--毕业设计文案 end-->

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


// 二维码中间图片
import logoSrc from '@/static/img/weixinpay.png'


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

.design-title {
  display: flex;
  justify-content: center;
}

ul,li{list-style:none;}

.design-li {
  margin: 20px;
}
</style>
