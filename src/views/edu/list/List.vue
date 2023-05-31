<template>
  <!--头部组件 start-->
   <TopHeader/>
  <!--头部组件 end-->
  <!--搜索组件 start-->
   <Search/>
  <!--搜索组件 end-->
  <!--中间内容 start-->
   <div class="edu-container">
    <!--大分类 start-->
     <div class="list-top">
       <div class="list-title">全部类别</div>
       <div class="list-tab">
         <div class="tab-left">方向：</div>
         <dl>
           <dd :class="{on: subjectParentId==0}"><a href="" @click.prevent="toSubjectList(0)">全部</a></dd>
           <dd :class="{ on: item.id== subjectParentId}"  v-for="item in subject"><a href="" @click.prevent="toSubjectList(item.id,0)">{{ item.name }}</a></dd>
         </dl>
       </div>

       <!--分类 start-->
       <div class="list-tab">
         <div class="tab-left">分类：</div>
         <dl>
           <dd :class="{on: sonSubjectId==0}"><a href="" @click.prevent="toSubjectList(0,null)">全部</a></dd>
           <dd :class="{ on: item.id== sonSubjectId}" v-for="item in sonSubject"><a href="" @click.prevent="toSubjectList(item.parentId,item.id)">{{ item.name }}</a></dd>
         </dl>
       </div>
       <!--分类 end-->

       <!--难度 start-->
       <div class="list-tab">
         <div class="tab-left">难度：</div>
         <dl>
           <dd :class="{on: difficulty=='all'}"><a href="" @click.prevent="toDiffList('all')">全部</a></dd>
           <dd :class="{on: difficulty==0}"><a href="" @click.prevent="toDiffList(0)">入门</a></dd>
           <dd :class="{on: difficulty==1}"><a href="" @click.prevent="toDiffList(1)">初级</a></dd>
           <dd :class="{on: difficulty==2}"><a href="" @click.prevent="toDiffList(2)">中级</a></dd>
           <dd :class="{on: difficulty==3}"><a href="" @click.prevent="toDiffList(3)">高级</a></dd>
         </dl>
       </div>
       <!--难度 end-->

       <!--类型 start-->
       <div class="list-tab">
         <div class="tab-left">类型：</div>
         <dl>
           <dd :class="{on: courseType=='all'}"><a href="" @click.prevent="toTypeList('all')">全部</a></dd>
           <dd :class="{on: courseType==0}"><a href="" @click.prevent="toTypeList(0)">新手入门</a></dd>
           <dd :class="{on: courseType==1}"><a href="" @click.prevent="toTypeList(1)">新上好课</a></dd>
           <dd :class="{on: courseType==2}"><a href="" @click.prevent="toTypeList(2)">技能提高</a></dd>
           <dd :class="{on: courseType==3}"><a href="" @click.prevent="toTypeList(3)">实战开发</a></dd>
         </dl>
       </div>
       <!--类型 end-->


     </div>
     <!--大分类 end-->

     <!--内容 start-->
     <div class="list-two-tab">
       <a href="" :class="{on: courseSort=='all'}" @click.prevent="toSortList('all')">综合</a>
       <a href="" :class="{on: courseSort==0}" @click.prevent="toSortList(0)">最新</a>
       <a href="" :class="{on: courseSort==1}" @click.prevent="toSortList(1)">销量</a>
     </div>

     <!--课程 start-->
     <ul class="j-list-box">
       <li v-for="item in courseList">
         <router-link :to="'/edu/details/'+item.id" target="_blank">
           <div class="j-list-img"><img :src="item.cover"> </div>
           <div class="j-list-son">
             <div class="j-list-title">
               {{item.shortTitle}}
             </div>
             <div class="j-list-tag">
               <span>课时：{{item.lessonNum}}</span>
               <span class="down-num">{{item.viewCount}}人在学</span>
             </div>
             <div class="j-list-tag">
               <span v-if="item.courseType==0">类型：新手入门</span>
               <span v-else-if="item.courseType==1">类型：新上好课</span>
               <span v-else-if="item.courseType==2">类型：技能提升</span>
               <span v-else>类型：实战开发</span>

               <span class="down-num" v-if="item.difficulty==0">难度：入门</span>
               <span class="down-num" v-else-if="item.difficulty==1">难度：初级</span>
               <span class="down-num" v-else-if="item.difficulty==2">难度：中级</span>
               <span class="down-num" v-else>难度：高级</span>
             </div>
             <div class="j-list-info">
               价格：<span>￥{{item.price}}</span>
               <router-link :to="'/edu/details/'+item.id" target="_blank">
               了解详情
               </router-link>
             </div>
             <span class="member-free">会员免费</span>
           </div>
         </router-link>
       </li>
     </ul>
     <!--课程 end-->
     <!--分页 start-->
     <el-pagination background layout="total,prev,pager,next,jumper" :total="total"
                    v-model:page-size="pageSize" @current-change="changePage"/>
     <!--分页 end-->
     <!--内容 end-->
   </div>
  <!--中间内容 end-->
  <!--底部组件 start-->
  <Footer/>
  <!--底部组件 end-->
</template>

<script setup lang="ts">
import TopHeader from "@/views/edu/common/header/TopHeader.vue";
import Search from "@/views/edu/common/search/Search.vue";
import Footer from "@/views/edu/common/footer/Footer.vue";
import { ref,onMounted,watch } from 'vue'
import {getListApi} from "@/api/edu/list/list";
import {useRoute} from 'vue-router'
// 路由参数对象
const route = useRoute()
// 类别
const subjectParentId = ref(0)
// 二级类别
const sonSubjectId = ref(0)
// 难度
const difficulty = ref('all')
// 类型
const courseType = ref('all')
// 课程排序
const courseSort = ref('all')

// 方向（一级分类）
const subject = ref([])
// 二级分类
const sonSubject = ref([])
// 课程列表数据
const courseList = ref([])
// 总共记录
const total = ref(0)
// 当前页
const pageIndex = ref(1)
// 每页显示记录
const pageSize = ref(16)
// 获取列表数据
const getList = async ()=> {
  const params = {
    'searchValue':searchValue.value,
    subjectParentId: subjectParentId.value,
    subjectId:sonSubjectId.value,
    difficulty:difficulty.value=='all'?-1:difficulty.value,
    courseType: courseType.value=='all'?-1:courseType.value,
    courseSort: courseSort.value,
    pageIndex: pageIndex.value,
    pageSize: pageSize.value
  }
  const { data } = await getListApi(params)
  subject.value = data.result.eduSubjectList
  sonSubject.value = data.result.sonSubjectList
  courseList.value  = data.result.courseList.content
  total.value = data.result.courseList.totalElements
}

// 按照课程类别获取数据
const toSubjectList = async (pId:number,subId:number)=> {
  subjectParentId.value = pId
  sonSubjectId.value = subId
  await getList()
}
// 切换页码执行事件
const changePage = (val: number)=> {
  pageIndex.value = val
  getList()
}

// 按照排序
const  toSortList =(sort:string)=>{
  courseSort.value = sort
  getList()
}
// 按照课程难度
const toDiffList = (val:string)=>{
  difficulty.value = val
  getList()
}
// 按照课程类型
const toTypeList = (type:string)=>{
  courseType.value = type
  getList()
}
// 监听搜索关键字
const searchValue = ref()
watch(()=>route.query.keywords,(newSearchValue)=>{
  searchValue.value = newSearchValue
  getList()
})
onMounted(()=> {
  searchValue.value = route.query.keywords
  getList()
})
</script>

<style scoped>
.edu-container {
  width: 1200px;
  margin: 0 auto;
}
.list-top{
  margin-top: 20px;
  background: #ffffff;
  padding-bottom: 20px;
  border-radius: 10px;
  padding-left: 10px;

}
.list-tab {
  display: flex;
  justify-content: flex-start;
  border-bottom: 2px dashed #e6e6e6;
}
.list-title{
  color: #343434;
  font-size: 16px;
  line-height: 65px;
  border-bottom: 2px dashed #e6e6e6;
}
.list-tab .tab-left{
  width: 60px;
  color: #343434;
  font-size: 14px;
  display: inline-block;
  margin-top: 15px;
}
.list-tab dl{
  width: 96%;
}
.list-tab dl dd{
  display: inline-block;
  margin: 15px 0px 15px 0px;
  width: 105px;
  text-align: center;
}

.list-tab dl dd a{
  color: #343434;
  font-size: 14px;
  padding: 2px 10px;
}
.list-tab dl dd a:hover{
  color: #388fff;
  background: rgba(44,128,255,.1);
  border-radius: 20px;
}
.list-tab dl dd.on a{
  background: rgba(44,128,255,.1);
  border-radius: 20px;
  color: #388fff;
}
.list-tab:last-child{
  border-bottom: none;
}

.list-two-tab{
  margin: 20px 0;
}
.list-two-tab a{
  display: inline-block;
  color: #717a80;
  font-size: 12px;
  padding: 5px 15px;
}
.list-two-tab a.on{
  color: #ffffff;
  border-radius: 20px;
  background: #717a80;
}

/*内容列表样式 start*/
.j-list-box{
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.j-list-box li{
  width: 245px;
  height: 290px;
  padding: 10px;
  margin-top: 20px;
  box-shadow: 1px 1px 10px rgb(27 39 94 / 40%);
  border-radius: 8px;
}
.j-list-img{
  width: 100%;
  height: 132px;
  border-radius: 10px;
}
.j-list-img img{
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
.j-list-title{
  color: #343434;
  font-size: 16px;
  -webkit-line-clamp:2;
  overflow: hidden;
  text-overflow: ellipsis;
  display: box;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin: 10px 0;
}
.j-list-tag{
  color: #8b8b8b;
  font-size: 12px;
  margin-top: 5px;
}
.down-num{
  float: right;
}
.j-list-info{
  color: #555555;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 10px;
}
.j-list-info span{
  color: #ef2a2a;
}
.j-list-info a{
  float: right;
  color: #05af10;
}
.j-list-box li:hover{
  background: #ffffff;
  box-shadow: 1px 1px 5px rgba(0,0,0,.2);
}

.member-free {
  margin-top: 20px;
  padding: 2px 10px;
  height: 20px;
  color: #fff;
  font-size: 12px;
  background: linear-gradient(90deg,#d5cb5a,#977e06 99%);
  border-radius: 24px 0 24px 0;
}


/*内容列表样式 end*/
ul, li {
  list-style: none;
}
/*分页样式*/
.el-pagination {
  margin-top: 20px;
  justify-content: center;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active){
  background-color: #083a6d;
  border-radius: 15px;
}
</style>
