<template>
  <!--顶部组件 start-->
  <TopHeader/>
  <!--顶部组件 end-->
  <!--搜索组件 start-->
    <Search/>
  <!--搜索组件 end-->

  <!--中间内容 start-->
  <!--banner start-->
  <div class="details-banner">
    <h3>{{courseInfo.title}}</h3>
    <div class="details-tag">
      <span>所属讲师：{{courseInfo.eduTeacher!=null?courseInfo.eduTeacher.name:'未知'}}</span>
      <span v-if="courseInfo.difficulty===0">课程难度：入门</span>
      <span v-if="courseInfo.difficulty===1">课程难度：初级</span>
      <span v-if="courseInfo.difficulty===2">课程难度：中级</span>
      <span v-if="courseInfo.difficulty===3">课程难度：高级</span>

      <span v-if="courseInfo.courseType===0">课程类型：新手入门</span>
      <span v-if="courseInfo.courseType===1">课程类型：新上好课</span>
      <span v-if="courseInfo.courseType===2">课程类型：技能提高</span>
      <span v-if="courseInfo.courseType===3">课程类型：实战课程</span>

    </div>
  </div>
  <!--banner end-->
  <div class="edu-container">
    <!--第一屏 start-->
    <div class="details-one">
      <div class="details-one-left">
        <h3>课程价格: <span>￥{{courseInfo.price}}</span></h3>
        <div class="details-left-tag">
          <span><img src="@/static/img/d_ico2.png"> {{formatDate2(courseInfo.createTime)}}</span>
          <span><img src="@/static/img/d_ico3.png"> {{courseInfo.buyCount}}人</span>
          <span><img src="@/static/img/d_ico4.png"> {{courseInfo.viewCount}}次</span>
        </div>
        <div class="details-left-tip">
          特别说明：<span>加入VIP会员可以免费下载全站源码笔记和观看全站视频</span>
        </div>
      </div>
      <div class="details-one-right">
        <button @click="studyCourse" type="button" class="el-button el-button--primary el-button--mini is-round">
          <span>加入学习</span>
        </button>
        <button type="button" @click="addVip" class="el-button el-button--warning el-button--mini is-round">
          <span>加入VIP</span>
        </button>
      </div>
    </div>
    <!--第一屏 end-->
    <!--第二屏 start-->
    <div class="details-tab ">
      <el-tabs class="details-tab"  v-model="activeName" @tab-click="handleClick">
        <el-tab-pane  label="课程介绍" name="first">

          <!--课程介绍内容 start-->
          <!--课程介绍 start-->
          <div class="details-tab-son"  >
              <div class="details-two">
                <div class="details-two-left">
                  <div class="details-video">
                    <img  :src="courseInfo.cover">
                  </div>
                </div>
                <div class="details-two-right">
                  <h3>{{courseInfo.title}}</h3>
                  <div class="details-two-text">
                    <p>{{courseInfo.courseDesc}}</p>
                  </div>
                </div>
              </div>
            <div class="details-three clearfix">
                <div class="outline-title">课程详情</div>
                <div class="details-three-list clearfix" v-html="courseInfo.remarks">
                </div>
            </div>
          </div>
          <!--课程介绍 end-->
          <!--课程介绍内容 end-->

        </el-tab-pane>
        <el-tab-pane label="章节目录" name="second">
          <!--课程大纲 start-->
          <div class="chapter-div">
            <!--左边 start-->
            <div class="class-tab-panel">
              <div class="chapter-box">
                <div class="outline-list">
                  <ul class="chapter-ul">
                    <!--章节 start-->
                    <li class="chapter" v-for="(item,index) in chapterList">
                      <div class="chapter-bd">
                          <h5 class="name">{{item.title}}
                            <span class="watch-free" v-if="item.children.length==0">录制中...</span>
                            <span class="watch-free" v-else>VIP会员免费观看</span>
                            <span class="chapter-num">时长：{{chapterDurationTotal(item.children)}} | 共{{item.children.length}} 节</span>
                          </h5>
                          <p class="desc">{{item.remarks}}</p>
                          <p class="addbox">
                            <a class="showbtn js-click-chapter" @click="foldAndUnfold(index,item.id)">

                              <template v-if="videoListStatus === (index+item.id)">
                                展开列表
                                <el-icon><ArrowDownBold /></el-icon>
                              </template>

                              <template v-else>
                                收起列表
                                <el-icon><ArrowUpBold /></el-icon>
                              </template>
                            </a>
                          </p>

                           <!--视频列表 start-->
                            <ul   :key="index" :id="index+item.id">
                              <li v-for="video in item.children">
                                <el-icon><VideoCamera /></el-icon>
                                <span class="type-text">视频：</span>
                                <span class="title_info js-watchTrigger">{{video.title}}  ({{formatDate(video.duration*1000)}})</span>
                                <span class="watch-free js-watchForFree" v-if="video.isFree==0 && !(courseInfo.viewVideo)" data-index="0" @click="videoPreview(video)">试看</span>
                                <span class="watch-free js-watchForFree"  style="color: #4522af;" v-else-if="courseInfo.viewVideo" @click="playVideo(courseInfo.id,video.id)">播放</span>
                              </li>

                            </ul>
                            <!--视频列表 end-->

                      </div>
                    </li>

                    <!--章节 end-->
                  </ul>
                </div>
              </div>
            </div>
            <!--左边 end-->
            <!--右边广告 start-->
            <div class="right-video-wrap">
              <h2 class="title">微信扫一扫联系官方指导老师</h2>
              <div class="right-video-box">

                <div class="mask"></div>
                <div class="content">
                  <img src="@/static/img/mywechat.jpg">
                </div>
              </div>
            </div>
            <!--右边右边广告 end-->
            <!--右边讲师 start-->
            <div class="recommendcourse">
              <!-- 讲师 -->
              <div class="recom-box clearfix">
                <h3 class="box-tit">讲师</h3>
                <div class="box-bd">
                  <div class="tea-inst">
                    <div class="medias">
                      <a href="#">
                        <img src="@/static/img/teacher.png" class="media">
                        <span class="name">{{courseInfo.eduTeacher!=null?courseInfo.eduTeacher.name:''}}</span>
                        <i class="ic sz-imooc"></i>
                      </a>
                      <span class="job"></span>
                    </div>
                    <p class="desc">{{courseInfo.eduTeacher!=null?courseInfo.eduTeacher.remarks:''}}</p>
                  </div>
                </div>
                <!-- 讲师 end -->
                <h3 class="box-tit">讲师其他课程</h3>
                <div class="box-bd" style="overflow: hidden">
                  <template v-for="item in courseInfo.teacherCourses">
                     <a href="" target="_blank" class="right-teacher-course">
                    <div class="flex-box">
                      <img class="course-img" :alt="item.title" :src="item.cover">
                      <div class="course-info">
                        <div class="name">{{item.title}}</div>
                        <p>

                          <span>{{item.viewCount}}</span>
                        </p>
                        <div class="priceDiscount ">
                          <div class="price l">￥{{item.price}}</div>
                        </div>
                      </div>
                    </div>
                  </a>
                  </template>
                </div>


              </div>
            </div>
            <!--右边讲师 end-->

          </div>
          <!--课程大纲 end-->
        </el-tab-pane>
        <el-tab-pane label="环境参数" name="third">

          <!--环境参数 start-->
          <div class="details-tab-son">
            <div class="details-four">
              <el-row :gutter="20">

                  <el-col :span="12" v-for="item in paramList">
                  <div class="four-list">
                    <span>{{ item.name }}</span>  {{ item.value }}
                  </div>
                  </el-col>

              </el-row>
            </div>
          </div>
          <!--环境参数 end-->

        </el-tab-pane>
        <el-tab-pane label="下载资料" name="four">

          <!--下载资料 start-->
          <div  class="course-attachment">
            <div class="down" v-for="item in courseDataList">
              <div class="source">
                <span class="downloadCourse"><el-icon size="18"><Download /></el-icon> {{item.name}}</span>
                <el-button v-if="studentToken!=null && studentToken!=''" color="#e6a23c" style="color: #fff;"  @click="downloadBtn(item.id)" :loading="downLoading==item.id">下载资料</el-button>
                <span v-else><el-tag>请先登录</el-tag></span>
              </div>
            </div>

          </div>
          <!--下载资料 end-->

        </el-tab-pane>
      </el-tabs>
    </div>
    <!--第二屏 end-->
  </div>
  <!--中间内容 end-->

  <!--预览视频 start-->
  <el-dialog
      v-model="visible"
      :title="videoInfo.titleVideo"
      width="700px"
      destroy-on-close
  >
    <VideoPreview :videoInfo="videoInfo"/>
    <template #footer>
      <el-button key="back" type="primary" @click="() => onCancel()">关闭</el-button>
    </template>

  </el-dialog>
  <!--预览视频 end-->
  <!--底部组件 start-->
  <Footer/>
  <!--底部组件 end-->
</template>

<script setup lang="ts">
import TopHeader from "@/views/edu/common/header/TopHeader.vue"
import Search from "@/views/edu/common/search/Search.vue"
import Footer from "@/views/edu/common/footer/Footer.vue"
import VideoPreview from "@/views/edu/details/components/VideoPreview.vue"
import {ref,onMounted,reactive} from 'vue'
import {useRouter,useRoute} from 'vue-router'
import {useStudentStore} from "@/store/modules/student"
import { ElMessageBox } from 'element-plus'
import {
  downloadCourseDataApi,
  getChapterListByCourseIdApi, getCourseDataByCourseIdApi,
  getCourseDetailApi,
  getParamListByCourseIdApi,
  getPlayAuthDataApi, studyCourseApi
} from "@/api/edu/detail/detail";
import {formatDuration, formatTime} from "@/utils/date";
// 路由对象
const router = useRouter()
const route = useRoute()
// 登录用户token
const {studentToken} = useStudentStore()
console.log('详情页studentToken:',studentToken)
// 下载资料按钮状态
const downLoading = ref()
// 点击下载资料
const downloadBtn = async (courseDataId:number)=> {
  downLoading.value = courseDataId
  const { data } = await downloadCourseDataApi(courseDataId)
  if(data.status === 200){
    window.location.href = import.meta.env.VITE_APP_BASE_API+"aliVod/upload/downFileFromOss?fileName="+data.result.downloadAddress+"&studentToken="+studentToken;
  }else {
    ElMessageBox.alert('温馨提示',data.message)
  }
}
// 课程ID
const courseId:any = route.params.id
// 课程信息
const courseInfo = ref('')
// 获取课程详情
const getCourseDetail = async ()=> {
  const { data } = await getCourseDetailApi(courseId)
  courseInfo.value = data.result
  document.title = courseInfo.value.title
}
onMounted(()=> {
  getCourseDetail()
})
// 格式化时间
const formatDate =(time:any)=>{
  return formatTime(time,'mm:ss');
}
// 格式化日期
const formatDate2 = (time:any)=> {
  return formatTime(time,'yyyy-MM-dd')
}
// 统计章节总时长
const chapterDurationTotal = (children:[])=> {
  let durationTotal=0
  children.forEach(function(item) {
    durationTotal+=item.duration
  })
  const data = new Date(durationTotal*1000)
  return formatDuration(data, 'hh时mm分ss秒')
}
// 选项卡
const activeName = ref('first')
// 点击选项卡事件
const handleClick = (tab:any,event:any)=> {
  let tabName = tab.props.name
  if(tabName=='third'){// 获取环境参数
    getParamListByCourseId()
  }else if (tabName=='second'){ // 获取课程大纲
     getChapterListByCourseId()
  }else if (tabName=='four'){// 获取课程资料
    getCourseDataByCourseId()
  }
}
// 环境参数数据
const paramList = ref([])
const getParamListByCourseId = async ()=> {
  const { data } = await getParamListByCourseIdApi(courseId)
  paramList.value = data.result
}
// 课程大纲数据
const chapterList = ref([])
const getChapterListByCourseId = async ()=> {
  const { data } = await getChapterListByCourseIdApi(courseId)
  chapterList.value = data.result
}

// 获取课程资料
const courseDataList = ref([])
const getCourseDataByCourseId = async ()=> {
  const { data } = await getCourseDataByCourseIdApi(courseId)
  courseDataList.value = data.result
}


// 弹出预览视频状态
const visible = ref(false)

// 视频对象
const videoInfo = reactive({
  videoSourceId: '',
  isFree: 0,
  sort: 1,
  fileKey: '',
  titleVideo: '添加课时',
  playAuth: ''
})
const videoPreview = async (video:object)=> {
  const { data } = await getPlayAuthDataApi(video.videoSourceId)
  videoInfo.videoSourceId = video.videoSourceId
  videoInfo.titleVideo = video.title
  videoInfo.playAuth = data.result.playAuth
  visible.value = true
}
// 关闭预览视频窗口
const onCancel = ()=> {
  visible.value = false
}

// 跳转到Vip页面
const addVip = ()=> {
  window.open('/edu/vip', '_blank');
}

// 加入学习
const studyCourse = async ()=> {
  if(studentToken!=null && studentToken!=''){
    const {data} = await studyCourseApi(courseId)
    if(data.status=== 200){
      router.push({
        path: `/edu/studyCourse/${data.result.orderNo}`
      })
    }else {
      ElMessageBox.alert(data.message)
    }
  }else {
    ElMessageBox.alert('请先登录！','温馨提示')
  }
}

// 跳转到视频播放页
const playVideo = (courseId:number,videoId:number)=> {
  console.log('courseId:',courseId,'videoId:',videoId)
  router.push({
    path: '/edu/play',
    query: {
      courseId:courseId,
      videoId:videoId
    }
  })
}

// 展开和收缩视频列表
const videoListStatus = ref() // 默认全部展开
const foldAndUnfold = (index:number,id:number)=> {
  if(videoListStatus.value===index+id){//两次点击的对象相同，打开
    window.document.getElementById(index+id).style.display = "block";
    videoListStatus.value = ''
  }else {//点击的对象不同，先关闭前一对象，再打开当前对象
    videoListStatus.value = index+id
    window.document.getElementById(index+id).style.display = "none";
  }
  }
</script>

<style scoped>
.edu-container {
  width: 1200px;
  margin: auto;
}
/*banner样式 start*/
.details-banner {
  width: 100%;
  height: 288px;
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
/*第一屏样式 start*/
.details-one {
  background: #fff;
  border-radius: 10px;
  padding: 40px;
  margin: -40px auto 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 1px 1px 5px rgb(0 0 0 / 20%);
}
.details-one-left {
  width: 415px;
}
.details-one-left h3 {
  color: #555;
  font-size: 20px;
}
.details-one-left h3 span {
  color: #f01414;
  font-size: 30px;
}
.details-left-tag {
  color: #555;
  font-size: 14px;
  margin: 20px 0;
}
.details-left-tag span {
  margin-right: 20px;
}
.details-left-tip {
  color: #5fb41b;
  font-size: 14px;
}
.details-left-tip span {
  color: #555;
}

.details-one-right {
  text-align: right;
}

.details-one-right span {
  display: inline-block;
  border-radius: 20px;
  padding: 5px 20px;
  color: #fff;
  font-size: 15px;
  margin: 0 20px;
  cursor: pointer;
}
/*第一屏样式 end*/
/*第二屏样式 start*/
.details-tab {
  margin: 30px auto 0;
}
:deep(.el-tabs__item){
  font-size: 16px;
}

.details-two {
  height: 240px;
  border-radius: 20px;
  background: url(@/static/img/details_banner.jpg) no-repeat top;
  background-size: 100% 100%;
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
}
.details-two-left {
  width: 200px;
  margin-right: 40px;
}
.details-video {
  width: 100%;
  height: 130px;
}

.details-video img{
  width: 194px;
  height: 130px;
}
.details-two-right {
  width: 920px;
  height: 160px;
  border-left: 1px solid #fff;
  padding: 0 0 0 40px;
}
.details-two-right h3 {
  color: #fff;
  font-size: 24px;
}
.details-two-text {
  display: flex;
  color: #fff;
  font-size: 16px;
  margin-top: 30px;
  line-height: 28px;
  margin-right: 73px;
  align-items: center;
  text-align: justify;
}
.details-three {
  width: 100%;
  background-size: 100% 100%;
  margin-top: 20px;
  padding-top: 30px;
  margin-bottom: 29px;
}
.details-three h3 {
  color: #fff;
  font-size: 32px;
  text-align: center;
  margin-top: 10px;
}
.outline-title{
  width: 377px;
  height:48px;
  font-size:20px;
  font-family:PingFangSC-Semibold;
  line-height:48px;
  font-weight:600;
  background: url(@/static/img/section-icon.png);
  background-size:cover;
  transform: translateX(398px);
  top: -24px;
  color: #fff;
  letter-spacing: 1.14px;
  text-align: center;
}

.details-three-list {
  background: #fff;
  border-radius: 15px;
  box-shadow: 1px 1px 5px rgb(0 0 0 / 30%);
  padding: 40px 80px;
  position: relative;
  line-height: 30px;
  text-align: justify;
}

/*环境参数样式 start*/
.details-four {
  width: 100%;
  background: #ffffff;
  padding: 50px 0;
  border-radius: 10px;
  box-shadow: 1px 1px 5px rgb(0 0 0 / 20%);
}
.four-list {
  height: auto;
  padding: 0 6%;
  font-size: 14px;
}

.four-list  span {
  display: inline-block;
  background: #2a5178;
  border-radius: 20px;
  width: 106px;
  height: 34px;
  text-align: center;
  line-height: 34px;
  margin-right: 10px;
  color: #fff;
  margin-bottom: 30px;
}
/*环境参数样式 end*/
/*下载资料样式 start*/
.course-attachment {
  display: block;
  min-width: 1140px;
  min-height: 500px;
}
.down {
  margin: 10px auto !important;
  padding: 5px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 3px 6px rgb(0 0 0 / 9%);
}
.source {
  margin: 2px 0;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
}

.downloadCourse i {
  color: #388fff;
  margin: 0 5px;
}

/*下载资料样式 end*/
/*课程大纲样式 start*/
.hide {
  display: none;
}

.chapter-div{
  border-top: 1px solid rgb(27 111 167 / 10%);
}
.class-tab-panel{
  min-width: 280px;
  width: 824px;
  float: left;
  min-height: 342px;
}
.chapter-box {
  text-align: left;
}
.outline-list {
  position: relative;
}
.outline-list .chapter-ul {
  width: 100%;
}
.outline-list .chapter {
  position: relative;
  overflow: hidden;
  padding: 24px;
  z-index: 2;
  vertical-align: middle;
  border-bottom: 1px solid rgba(28,31,33,.1);
  background: #fff;
  border-radius: 10px;
  box-shadow: 1px 1px 5px rgb(0 0 0 / 20%);
  margin-bottom: 10px;
}
.outline-list .chapter .chapter-bd {
  position: relative;
  float: none;
  overflow: hidden;
}
.outline-list .chapter .chapter-bd .name {
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
  color: #1c1f21;
  margin-bottom: 8px;
}
.outline-list .chapter .chapter-bd .name .watch-free {
  margin-left: 20px;
  padding: 4px 12px;
  font-size: 12px;
  background: rgba(242,13,13,.1);
  border-radius: 12px;
  color: #f20d0d;
  font-weight: 700;
}
.outline-list .chapter .chapter-bd .name .chapter-num {
  font-size: 12px;
  color: #93999f;
  line-height: 24px;
  font-weight: 400;
  float: right;
}
.outline-list .chapter .chapter-bd .desc {
  margin-bottom: 8px;
  line-height: 24px;
  font-size: 14px;
  color: #1c1f21;
}
.outline-list .chapter .chapter-bd .addbox {
  margin-bottom: 8px;
  display: inline-block;
}
.outline-list .chapter .chapter-bd .addbox .showbtn {
  cursor: pointer;
  font-size: 14px;
  color: #37f;
  line-height: 24px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
}
.outline-list .chapter .chapter-bd ul li:not(:last-child) {
  margin-bottom: 16px;
}
.outline-list .chapter .chapter-bd ul li {
  line-height: 24px;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  position: relative;
  padding-right: 76px;
  box-sizing: border-box;
}
.outline-list .chapter .chapter-bd ul li i {
  display: inline-block;
  vertical-align: middle;
  font-size: 20px;
  color: #1c1f21;
  line-height: 24px;
  font-weight: 400;
  margin-right: 8px;
}
.outline-list .chapter .chapter-bd ul li .type-text {
  display: inline-block;
  font-size: 14px;
  color: #1c1f21;
  line-height: 24px;
  font-weight: 700;
}
.outline-list .chapter .chapter-bd ul li .title_info {
  display: inline-block;
  max-width: 600px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  color: #1c1f21;
}
.outline-list .chapter .chapter-bd ul li .watch-free {
  float: right;
  padding: 0 16px;
  font-size: 12px;
  background: rgba(242,13,13,.1);
  border-radius: 12px;
  color: #f20d0d;
  font-weight: 700;
  position: absolute;
  right: 20px;
  top: 0;
  cursor: pointer;
}

/*右边试看样式 start*/
.right-video-wrap {
  float: right;
  position: relative;
  border-bottom: 1px solid #d9dde1;
  width: 328px;
  padding: 36px 24px;
  box-sizing: border-box;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 1px 1px 5px rgb(0 0 0 / 20%);
}
.right-video-wrap .title {
  font-size: 16px;
  color: #07111b;
  font-weight: 700;
  padding-bottom: 20px;
}
.right-video-box {
  float: right;
  position: relative;
  width: 100%;
  height: 226px;
  border-radius: 10px;
  overflow: hidden;
  background-size: cover;
  background-position: top center;
  background-repeat: no-repeat;
  background-image:url(@/static/img/video_pre.jpg)
}
.right-video-box .mask {
  background: #000;
  opacity: .4;
  width: 100%;
  height: 100%;
  float: left;
}
.right-video-box .content {
  position: absolute;
  width: 100%;
  height: 100%;
  text-align: center;
  box-sizing: border-box;
}
.right-video-box .content img {
  width: 100%;
  height: 100%;
}
.right-video-box .content p {
  font-size: 14px;
  color: #fff;
  text-align: center;
  font-weight: 700;
}
/*右边试看样式 end*/

/*右边讲师详情信息 start*/
.recommendcourse {
  float: right;
  width: 328px;
  padding-top: 36px;
}
.recom-box {
  padding-top: 36px;
  background-color: #fff;
  border-radius: 10px;
}
.recommendcourse .box-class-tit, .recommendcourse .box-tit {
  font-size: 16px;
  color: #07111b;
  font-weight: 700;
  padding-bottom: 20px;
  margin-left: 24px;
}

.tea-inst {
  padding-bottom: 30px;
  margin-bottom: 30px;
  border-bottom: 1px solid #d9dde1;
}
.tea-inst .medias {
  margin-bottom: 12px;
  overflow: hidden;
  padding: 0 24px;
}
.tea-inst .medias .media {
  float: left;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 2px 12px 0 0;
}
.tea-inst .medias .name {
  font-weight: 700;
  color: #4d555d;
  font-size: 18px;
  line-height: 24px;
}
.tea-inst .medias .job {
  display: block;
  font-size: 12px;
  color: #4d555d;
}
.tea-inst .desc {
  padding: 0 24px;
  line-height: 24px;
  font-size: 12px;
  word-break: break-all;
  word-wrap: break-word;
}

.right-teacher-course {
  padding: 0 24px;
  box-sizing: border-box;
  margin-top: 24px;
  display: inline-block;
  width: 100%;
}
.right-teacher-course .flex-box {
  display: flex;
}
.right-teacher-course .course-img {
  width: 114px;
  height: 64px;
  margin-right: 8px;
  border-radius: 8px;
}

.right-teacher-course .course-info {
  width: 0;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  position: relative;
}

.right-teacher-course .course-info .name {
  font-size: 14px;
  color: #4d555d;
  line-height: 20px;
  font-weight: 400;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.right-teacher-course .course-info p span:not(:last-child) {
  margin-right: 12px;
}
.right-teacher-course .course-info p span {
  font-size: 12px;
  color: #93999f;
  line-height: 20px;
  font-weight: 200;
}
.right-teacher-course .course-info p span {
  font-size: 12px;
  color: #93999f;
  line-height: 20px;
  font-weight: 200;
}
.right-teacher-course .course-info .priceDiscount .price {
  font-weight: 700;
  font-size: 12px;
  color: #4d555d;
  line-height: 20px;
  margin-right: 8px;
}
/*右边讲师详情信息 end*/


/*课程大纲样式 end*/

/*第二屏样式  end*/
</style>
