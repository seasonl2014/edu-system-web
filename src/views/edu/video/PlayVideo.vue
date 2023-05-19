<template>
  <!--中间内容 start-->
  <div class="player-all">

    <div class="top-title">
      <el-icon @click="toCourseDetails(route.query.courseId)" style="font-weight: bold;color: #545c63;cursor: pointer;"><CaretLeft/></el-icon>
      <span class="name">{{courseInfo.title}}</span>
    </div>
     <div class="play">
       <div class="play-left">
         <div class="video-title" :style="titleStatus?'display: none;':'display: block;'">{{detailsVideo.title}}</div>
         <!--视频播放器 start-->
         <div id="J_prismPlayer" class="prism-player" @mouseover="prismPlayerMouseOver" @mouseleave="prismPlayerMouseLeave"></div>
         <!--视频播放器 end-->
       </div>
       <div class="play-right">
         <ul class="right-box">
           <li class="right-li">
             <div class="li-title title-active">
               <el-icon style="line-height: 36px;"><Reading /></el-icon>
               <a href="javascript:;">课程</a>
             </div>
             <div class="li-content" style="display: none;">
               <div class="course-name">WEB前端 ‘进阶版’ 八股文</div>
               <div class="course-desc">
                 该课程暂无介绍
               </div>
               <div class="course-img">
                 <img src="https://oss.xuexiluxian.cn/xiaoluxian-vcr/607d93059604468db0be164de7a1840a.png" alt="WEB前端 ‘进阶版’ 八股文" title="WEB前端 ‘进阶版’ 八股文">
               </div>
               <div class="teacher-desc">
                 <div class="teacher-title">讲师介绍</div>
                 <div class="avatar-name">
                   <div class="teacher-avatar">
                     <img src="https://oss.xuexiluxian.cn/xiaoluxian-vcr/dd1e5fb53ce742ae8928b48f95bbcd59.jpg" alt="WEB前端 ‘进阶版’ 八股文" title="WEB前端 ‘进阶版’ 八股文">
                   </div>
                   <div class="teacher-name">
                     <p>得智老师</p>
                     <p>金牌讲师</p>
                   </div>
                 </div>
                 <div class="teacher-tages"></div>
               </div>
             </div>
           </li>
           <li class="right-li">
             <div class="li-title title-active">
               <el-icon><VideoCamera /></el-icon>
               <a class="title-active" href="javascript:;">章节</a>
             </div>

             <div class="li-content" style="display: block;">
               <div class="content-scroll">
                 <ul>
                   <!--章节视频 start-->
                   <li v-for="item in chapterList">
                     <div @click="handleCollapse(item.id)" class="list-title">
                       <el-icon style="margin-right: 10px;cursor: pointer;" v-if="isCollapse==item.id"><ArrowDown /></el-icon>
                       <el-icon style="margin-right: 10px;cursor: pointer;" v-else><ArrowRight /></el-icon>
                       {{item.title}}
                     </div>
                     <Transition>
                     <ul v-if="isCollapse==item.id">
                         <li v-for="child in item.children">
                         <a  :class="child.id==route.query.videoId?'active':''" @click="playVideo(route.query.courseId,child.id)">
                           <el-icon><VideoCamera /></el-icon>
                           <span class="title">{{ child.title }}</span>
                         </a>
                       </li>
                     </ul>
                     </Transition>
                   </li>
                   <!--章节视频 end-->
                 </ul>
               </div>
             </div>

           </li>
         </ul>
       </div>
     </div>
  </div>
  <!--中间内容 end-->


    <!--底部组件 start-->
    <Footer/>
    <!--底部组件 end-->
</template>

<script setup lang="ts">
import Footer from "@/views/edu/common/footer/Footer.vue"
import {useRoute} from 'vue-router'
import {ref,reactive,onMounted,watch} from 'vue'
import {getVideoApi, playVideoByVideoSourceIdApi} from "@/api/edu/video/video";
import {getChapterListByCourseIdApi} from "@/api/edu/detail/detail";
import router from "@/router";
const route = useRoute()
console.log("route:",route.query)
// 视频资源对象
const detailsVideo = reactive({
  title: 'Go学堂温馨提示，请先登录再来观看',
  videoId: route.query.videoId,
  videoSourceId: '',
  playAuth: ''
})
// 课程信息对象
const courseInfo = ref('')
// 章节ID
const chapterId = ref()
// 保存记忆播放时间
const saveTime =  (memoryVideo: string, currentTime: string)=> {
  localStorage.setItem(memoryVideo, currentTime);
}

// 获取记忆播放时间
const getTime =  (memoryVideo: string)=> {
  //return返回的是自定义起播时间
  return localStorage.getItem(memoryVideo)
}

// 阿里云视频点播播放器
const player = ref<any>()
// 创建阿里云视频点播播放器
const creatAliPlayer = () => {
  if(player.value!=null&&player.value!=''){
       player.value.dispose() //销毁
    }
  player.value = new window.Aliplayer({
    id: 'J_prismPlayer',
    autoplay: true,
    width: '100%',
    height:'100%',
    vid: detailsVideo.videoSourceId,
    playauth: detailsVideo.playAuth,
    cover: 'http://edu.xueden.cn/moyuplaylogo.jpg',
    components: [{
      name: 'MemoryPlayComponent',
      type: AliPlayerComponent.MemoryPlayComponent,
      args:[false,getTime,saveTime]
    }]
  }, function(player: any) {
    console.log('播放器创建好了。')
  })
}
// 获取视频信息
const getVideo = async (videoId:number)=> {
  const { data } = await getVideoApi(videoId)
  if(data.status === 200){
    detailsVideo.videoSourceId = data.result.video.videoSourceId
    detailsVideo.title = data.result.video.title
    courseInfo.value = data.result.course
    document.title = data.result.course.title
    isCollapse.value = data.result.video.chapterId
    await playVideoByVideoSourceId(data.result.video.videoSourceId)
  }else {
    // 跳转到课程详情页
    router.push({
      path: `/edu/details/${route.query.courseId}`
    })
  }

}

// 根据视频源id获取视频信息
const playVideoByVideoSourceId = async (videoSourceId:string)=> {
   const { data } = await playVideoByVideoSourceIdApi(videoSourceId)
  detailsVideo.playAuth = data.result.playAuth
  creatAliPlayer(player.value)
}

// 监听路由视频ID变化（用于切换视频）
watch(
    () => route.query.videoId,
    async newId => {
      await getVideo(newId)
    }
)

// 课程大纲数据
const chapterList = ref([])
const getChapterListByCourseId = async ()=> {
  const { data } = await getChapterListByCourseIdApi(route.query.courseId)
  chapterList.value = data.result
}
// 跳转到课程详情页
const toCourseDetails = (courseId:number)=> {
  router.push({
    path: `/edu/details/${courseId}`
  })
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
// 标题状态
const titleStatus = ref(true)
// 鼠标移入事件
const prismPlayerMouseOver = ()=> {
  titleStatus.value =false
}
// 视频移出
const prismPlayerMouseLeave = ()=> {
  titleStatus.value =true
}
// 章节展开和收缩状态

const isCollapse = ref()
const handleCollapse = (id:number)=>{
  if(isCollapse.value != id){
    isCollapse.value = id
  }else{
    isCollapse.value=0
  }

}
onMounted(()=> {
  getVideo(route.query.videoId)
  getChapterListByCourseId()
})
</script>

<style scoped>
ul, li {
  list-style: none;
}
.player-all {
  width: 100%;
  background: -webkit-gradient(linear, 0 0, 0 50%, from(#fff), to(rgba(0,0,0,.9)));
  padding: 0 0 6px 0;
  margin-right: auto;
  margin-left: auto;
}
.top-title {
  padding: 0 20px;
  height: 80px;
  line-height: 80px;
  font-size: 20px;
  font-weight: bold;
  color: #25282A;
  opacity: 1;
  background: #fff;
}
.play {
  min-width: 1300px;
  background: #25282A;
  padding: 20px;
  height: 840px;
  overflow: hidden;
}
.play-left {
  float: left;
  min-width: 800px;
  width: calc(100% - 435px - 20px);
  height: 100%;
  background: #000;
  position: relative;
  overflow: hidden;
}
.play-right {
  float: right;
  color: #ffffff;
  width: 435px;
  height: 100%;
  position: relative;
}
.play-right .right-box {
  width: 80px;
  height: 300px;
  background: #1c1f21;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  position: absolute;
  top: 0;
  right: 0px;
}
.play-right .right-box li .li-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 18px;
  color: #999;
  padding: 20px 0;
  font-weight: bold;
}
.title-active {
  color: #ffffff !important;
  background: #333;
}
.play-right .right-box li .li-title a {
  color: #999;
}
.play-right .right-box .li-content {
  width: 354px;
  height: 840px;
  position: absolute;
  top: 0;
  left: -354px;
  overflow: hidden;
}
.play-right .right-box .li-content .course-name {
  width: 100%;
  height: 24px;
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  margin: 10px 0px;
  color: #a8a9ab;
}
.play-right .right-box .li-content .course-desc {
  font-size: 14px;
  color: #a8a9ab;
}
.play-right .right-box .li-content .course-img {
  width: 330px;
  height: 170px;
  margin: 10px 0px;
  border-radius: 8px;
  overflow: hidden;
}
.play-right .right-box .li-content .course-img img {
  width: 100%;
  height: 100%;
}
.teacher-desc {
  height: 200px;
  margin-right: 20px;
}
.teacher-desc .teacher-title {
  font-size: 18px;
  font-weight: bold;
  color: #A8A9AB;
}
.teacher-desc .avatar-name {
  display: flex;
  align-items: center;
  padding: 10px 0;
}
.teacher-desc .avatar-name .teacher-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
}
.teacher-desc .avatar-name .teacher-avatar img {
  width: 100%;
  height: 100%;
}

.teacher-desc .avatar-name .teacher-name {
  margin-left: 10px;
  color: #A8A9AB;
}
.teacher-tages {
  color: #A8A9AB;
}

.li-content .content-scroll {
  overflow-y: auto;
  height: 100%;
  padding-right: 20px;
}
.content-scroll::-webkit-scrollbar {display:none}
.list-active{
  background-color: #007bff;

}
.content-scroll ul li div {
  padding: 10px 0;
  font-size: 18px;
}
.content-scroll ul li ul li {
  font-size: 16px;
  color: #888;
  cursor: pointer;
}
.play-right .active {
  background: rgba(255, 255, 255, .3);
  color: #ffffff;
}
.content-scroll ul li ul li a {
  display: flex;
  color: #999;
  padding: 0 5px;
  line-height: 35px;
  border-radius: 5px;
}
.content-scroll ul li ul li a i {
  width: 25px;
  height: 35px;
  line-height: 35px;
}

.content-scroll ul li ul li a:hover{
  background: rgba(255, 255, 255, .3);
  color: #ffffff;
}

.content-scroll ul li ul li a span {
  display: inline-block;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
  white-space:nowrap;
}
.video-title {
  color: #fff;
  font-size: 18px;
  padding: 10px;
  background: rgba(30, 29, 29, 0.7);
  position: relative;
  float: left;
  z-index: 9999;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
