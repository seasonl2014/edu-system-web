<template>
  <!--顶部 start-->
  <TopHeader/>
  <!--顶部 end-->
  <!--搜索 组件 start-->
  <Search/>
  <!--搜索 组件 end-->

  <!--中间内容 start-->
  <!--课程分类和走马灯 start-->
  <div class="edu-container edu-banner">

    <!--骨架屏 start-->
    <el-skeleton class="horizontal-skeleton" :loading="columnCoursesLoading" animated>
      <template #template>
        <div style="padding: 20px;width: 265px">
          <el-skeleton-item variant="h3" style="width: 50%" />
          <div style="margin-top: 15px;">
            <el-skeleton-item variant="text" style="padding: 10px 10px 10px 0;margin-right: 16px" />
            <el-skeleton-item variant="text" style="padding: 10px 10px 10px 0;width: 30%" />
            <el-skeleton-item variant="text" style="padding: 10px 10px 10px 0;margin-right: 16px" />
            <el-skeleton-item variant="text" style="padding: 10px 10px 10px 0;width: 30%" />
            <el-skeleton-item variant="text" style="padding: 10px 10px 10px 0;margin-right: 16px" />
            <el-skeleton-item variant="text" style="padding: 10px 10px 10px 0;width: 30%" />
            <el-skeleton-item variant="text" style="padding: 10px 10px 10px 0;margin-right: 16px" />
            <el-skeleton-item variant="text" style="padding: 10px 10px 10px 0;width: 30%" />
          </div>
        </div>
        <el-skeleton-item variant="image" style="width: 940px; height: 380px" />
      </template>
      <template #default>
        <!--左边课程分类 start-->
        <div class="edu-banner-left">
          <div class="edu-banner-item" v-for="item in columnCourses" :key="item.id">
            <span>{{item.name}}&nbsp;/&nbsp;{{item.childrens.length>0?item.childrens[0].name:''}}&nbsp;/&nbsp;{{item.childrens.length>0?item.childrens[1].name:''}} <img src="@/static/img/right.png"> </span>
            <div class="edu-banner-nav">
              <h3>{{item.name}}</h3>
              <div class="banner-list">

                <a href=""  class="banner-list-item" v-for="course in item.eduCourseList" :key="course.id">
                  <router-link :to="'/edu/details/'+course.id" :title="course.title" target="_blank">
                    <div class="banner-list-img"><img :src="course.cover"> </div>
                    <div class="banner-list-text">
                      {{ course.shortTitle}}
                    </div>
                  </router-link>
                </a>

              </div>
            </div>
          </div>
        </div>
        <!--左边课程分类 end-->

        <!--右边走马灯 start-->
        <div class="edu-banner-right">
          <div class="slider single-item">

            <!--幻灯片 start-->
            <div class="block">
              <el-carousel height="380px">
                <el-carousel-item v-for="item in banners" :key="item.id">
                  <a href="" @click.prevent="toBanner(item.url)" target="_blank">
                    <img  :src="item.img">
                  </a>
                </el-carousel-item>
              </el-carousel>
            </div>
            <!--幻灯片 end-->
          </div>
        </div>
        <!--右边走马灯 end-->
      </template>
    </el-skeleton>
    <!--骨架屏 end-->

  </div>
  <!--课程分类和走马灯 end-->

  <!--课程类型 start-->
  <div class="row-bottom-type edu-container">
    <div class="bottom-type">
      <div class="type-left">
        <img src="@/static/img/chuji.png" alt="初级课程" title="初级课程">
      </div>
      <div class="type-right">
        <div class="right-title">初级课程</div>
        <div class="right-desc">入门课、岗位多</div>
      </div>
    </div>
    <div class="bottom-type">
      <div class="type-left">
        <img src="@/static/img/zhongji.png" alt="中级课程" title="中级课程">
      </div>
      <div class="type-right">
        <div class="right-title">中级课程</div>
        <div class="right-desc">进阶与实战</div>
      </div>
    </div>
    <div class="bottom-type">
      <div class="type-left">
        <img src="@/static/img/gaoji.png" alt="高级课程" title="高级课程">
      </div>
      <div class="type-right">
        <div class="right-title">高级课程</div>
        <div class="right-desc">轻松掌握核心技能</div>
      </div>
    </div>
    <div class="bottom-type">
      <div class="type-left">
        <img src="@/static/img/xiangmu.png" alt="项目实战" title="项目实战">
      </div>
      <div class="type-right">
        <div class="right-title">项目实战</div>
        <div class="right-desc">手把手实践</div>
      </div>
    </div>
    <div class="bottom-type">
      <div class="type-left">
        <img src="@/static/img/suanfa.png" alt="面试课程" title="面试课程">
      </div>
      <div class="type-right">
        <div class="right-title">面试课程</div>
        <div class="right-desc">吊打面试官</div>
      </div>
    </div>
  </div>
  <!--课程类型 end-->

  <!--新上好课 start-->
  <div class="bgfff">
    <div class="edu-container edu-new-good-course">
    <!--新上好课标题 start-->
    <div class="edu-course-title">
      <div class="edu-course-title-left">
        <div class="hot">
          <div class="hot-left">HOT</div>
          <div class="hot-right"></div>
        </div>

        <div class="text">
          <div class="text-top">新上好课</div>
          <div class="text-bottom"></div>
        </div>

      </div>
    </div>
    <!--新上好课标题 end-->
    <!--新上好课内容 start-->
    <div class="edu-course-list">
      <ul class="edu-course-list-item">

        <!--骨架屏 start-->
        <el-skeleton class="horizontal-skeleton" :loading="courseListLoading" animated :count="4">
          <template #template>
            <!--骨架屏预览内容 start-->
            <div style="display: flex;flex-direction: column;margin-right: 40px;">
            <el-skeleton-item variant="image" style="width: 275px; height: 165px;" />
            <div style="padding: 14px">
              <el-skeleton-item variant="h3" style="width: 50%" />
              <div style="display: flex;align-items: center;justify-items: space-between;margin-top: 16px;height: 16px;">
                <el-skeleton-item variant="text" style="margin-right: 16px" />
                <el-skeleton-item variant="text" style="width: 30%" />
              </div>
            </div>
            </div>
            <!--骨架屏预览内容 end-->

          </template>
          <template #default>
            <!--课程内容 start-->
            <li v-for="item in newCourses" class="edu-course-list-item-li">
              <div class="list-img">
                <router-link :to="'/edu/details/'+item.id" target="_blank">
                  <img :src="item.cover">
                </router-link>
              </div>
              <div class="list-vip-img">
                <img src="@/static/img/vipLogo.png">
              </div>
              <div class="list-text"><router-link :to="'/edu/details/'+item.id" target="_blank"> {{item.shortTitle}} </router-link></div>
              <div class="list-tag">
                {{item.lessonNum}}课时
                <span v-if="item.difficulty==0">入门</span>
                <span v-else-if="item.difficulty==1">初级</span>
                <span v-else-if="item.difficulty==2">中级</span>
                <span v-else>高级</span>
                <i>{{item.viewCount}}人在学</i>
              </div>
              <div class="list-sale-price">
                <div>
                  <span class="member-free">会员免费</span>
                  <span class="member-price">￥{{item.price}}</span>
                  <span class="origin-price l delete-line">￥{{item.originalPrice}}</span>
                </div>
              </div>
            </li>
            <!--课程内容 end-->
          </template>
        </el-skeleton>
        <!--骨架屏 end-->

      </ul>
    </div>
    <!--新上好课内容 end-->
  </div>
  </div>
  <!--新上好课 end-->

  <!--实战课程 start-->
  <div class="bg000">
     <div class="edu-container edu-new-good-course">
    <!--实战课程标题 start-->
    <div class="edu-course-title">
      <div class="edu-course-title-left">
        <div class="hot">
          <div class="good-left">GOOD</div>
          <div class="good-right"></div>
        </div>

        <div class="text">
          <div class="text-top">实战课程</div>
          <div class="text-bottom"></div>
        </div>

      </div>
    </div>
    <!--实战课程标题 end-->
    <!--实战课程内容 start-->
    <div class="edu-course-list">
      <ul class="edu-course-list-item">

        <!--骨架屏 start-->
        <el-skeleton class="horizontal-skeleton" :loading="courseListLoading" animated :count="4">
          <template #template>
            <!--骨架屏预览内容 start-->
            <div style="display: flex;flex-direction: column;margin-right: 40px;">
              <el-skeleton-item variant="image" style="width: 275px; height: 165px;" />
              <div style="padding: 14px">
                <el-skeleton-item variant="h3" style="width: 50%" />
                <div style="display: flex;align-items: center;justify-items: space-between;margin-top: 16px;height: 16px;">
                  <el-skeleton-item variant="text" style="margin-right: 16px" />
                  <el-skeleton-item variant="text" style="width: 30%" />
                </div>
              </div>
            </div>
            <!--骨架屏预览内容 end-->

          </template>
          <template #default>
            <!--课程内容 start-->
            <li class="edu-course-list-item-li" v-for="item in actualCourses">
              <div class="list-img">
                <router-link :to="'/edu/details/'+item.id" target="_blank">
                  <img :src="item.cover">
                </router-link>
              </div>
              <div class="list-vip-img">
                <img src="@/static/img/vipLogo.png">
              </div>
              <div class="list-text"><router-link :to="'/edu/details/'+item.id" target="_blank"> {{item.shortTitle}} </router-link></div>
              <div class="list-tag">
                {{ item.lessonNum }}课时
                <span v-if="item.difficulty==0">入门</span>
                <span v-else-if="item.difficulty==1">初级</span>
                <span v-else-if="item.difficulty==2">中级</span>
                <span v-else>高级</span>
                <i>{{item.viewCount}}人在学</i>
              </div>
              <div class="list-sale-price">
                <div>
                  <span class="member-free">会员免费</span>
                  <span class="member-price">￥{{item.price}}</span>
                  <span class="origin-price l delete-line">￥{{item.originalPrice}}</span>
                </div>
              </div>
            </li>
            <!--课程内容 end-->
          </template>
        </el-skeleton>
        <!--骨架屏 end-->


      </ul>
    </div>
    <!--实战课程内容 end-->
  </div>
  </div>
  <!--实战课程 end-->

  <!--新手入门 start-->
  <div class="bgfff">
     <div class="edu-container edu-new-good-course">
    <!--新手入门标题 start-->
    <div class="edu-course-title">
      <div class="edu-course-title-left">
        <div class="hot">
          <div class="easy-left">EASY</div>
          <div class="easy-right"></div>
        </div>

        <div class="text">
          <div class="text-top">新手入门</div>
          <div class="text-bottom"></div>
        </div>

      </div>
    </div>
    <!--新手入门标题 end-->
    <!--新手入门内容 start-->
    <div class="edu-course-list">
      <ul class="edu-course-list-item">

        <!--骨架屏 start-->
        <el-skeleton class="horizontal-skeleton" :loading="courseListLoading" animated :count="4">
          <template #template>
            <!--骨架屏预览内容 start-->
            <div style="display: flex;flex-direction: column;margin-right: 40px;">
              <el-skeleton-item variant="image" style="width: 275px; height: 165px;" />
              <div style="padding: 14px">
                <el-skeleton-item variant="h3" style="width: 50%" />
                <div style="display: flex;align-items: center;justify-items: space-between;margin-top: 16px;height: 16px;">
                  <el-skeleton-item variant="text" style="margin-right: 16px" />
                  <el-skeleton-item variant="text" style="width: 30%" />
                </div>
              </div>
            </div>
            <!--骨架屏预览内容 end-->

          </template>
          <template #default>
            <!--课程内容 start-->
            <li class="edu-course-list-item-li" v-for="item in startedCourses">
              <div class="list-img">
                <router-link :to="'/edu/details/'+item.id" target="_blank">
                  <img :src="item.cover">
                </router-link>
              </div>
              <div class="list-vip-img">
                <img src="@/static/img/vipLogo.png">
              </div>
              <div class="list-text"><router-link :to="'/edu/details/'+item.id" target="_blank"> {{item.shortTitle}} </router-link></div>
              <div class="list-tag">
                {{item.lessonNum}}课时
                <span v-if="item.difficulty==0">入门</span>
                <span v-else-if="item.difficulty==1">初级</span>
                <span v-else-if="item.difficulty==2">中级</span>
                <span v-else>高级</span>
                <i>{{item.viewCount}}人在学</i>
              </div>
              <div class="list-sale-price">
                <div>
                  <span class="member-free">会员免费</span>
                  <span class="member-price">￥{{item.price}}</span>
                  <span class="origin-price l delete-line">￥{{item.originalPrice}}</span>
                </div>
              </div>
            </li>
            <!--课程内容 end-->
          </template>
        </el-skeleton>
        <!--骨架屏 end-->


      </ul>
    </div>
    <!--新手入门内容 end-->
  </div>
  </div>
  <!--新手入门 end-->

  <!--技能提升 start-->
  <div class="bg000">
    <div class="edu-container edu-new-good-course">
      <!--技能提升标题 start-->
      <div class="edu-course-title">
        <div class="edu-course-title-left">
          <div class="hot">
            <div class="rise-left">RISE</div>
            <div class="rise-right"></div>
          </div>

          <div class="text">
            <div class="text-top">技能提升</div>
            <div class="text-bottom"></div>
          </div>

        </div>
      </div>
      <!--技能提升标题 end-->
      <!--技能提升内容 start-->
      <div class="edu-course-list">
        <ul class="edu-course-list-item">

          <!--骨架屏 start-->
          <el-skeleton class="horizontal-skeleton" :loading="courseListLoading" animated :count="4">
            <template #template>
              <!--骨架屏预览内容 start-->
              <div style="display: flex;flex-direction: column;margin-right: 40px;">
                <el-skeleton-item variant="image" style="width: 275px; height: 165px;" />
                <div style="padding: 14px">
                  <el-skeleton-item variant="h3" style="width: 50%" />
                  <div style="display: flex;align-items: center;justify-items: space-between;margin-top: 16px;height: 16px;">
                    <el-skeleton-item variant="text" style="margin-right: 16px" />
                    <el-skeleton-item variant="text" style="width: 30%" />
                  </div>
                </div>
              </div>
              <!--骨架屏预览内容 end-->

            </template>
            <template #default>
              <!--课程内容 start-->
              <li class="edu-course-list-item-li" v-for="item in skillCourses">
                <div class="list-img">
                  <router-link :to="'/edu/details/'+item.id" target="_blank">
                    <img :src="item.cover">
                  </router-link>
                </div>
                <div class="list-vip-img">
                  <img src="@/static/img/vipLogo.png">
                </div>
                <div class="list-text"><router-link :to="'/edu/details/'+item.id" target="_blank"> {{item.shortTitle}} </router-link></div>
                <div class="list-tag">
                  {{item.lessonNum}}课时
                  <span v-if="item.difficulty==0">入门</span>
                  <span v-else-if="item.difficulty==1">初级</span>
                  <span v-else-if="item.difficulty==2">中级</span>
                  <span v-else>高级</span>
                  <i>{{item.viewCount}}人在学</i>
                </div>
                <div class="list-sale-price">
                  <div>
                    <span class="member-free">会员免费</span>
                    <span class="member-price">￥{{item.price}}</span>
                    <span class="origin-price l delete-line">￥{{item.originalPrice}}</span>
                  </div>
                </div>
              </li>
              <!--课程内容 end-->
            </template>
          </el-skeleton>
          <!--骨架屏 end-->


        </ul>
      </div>
      <!--技能提升内容 end-->
    </div>
  </div>
  <!--技能提升 end-->

  <!--中间内容 end-->

  <!--底部 start-->
  <Footer/>
  <!--底部 end-->
</template>

<script setup lang="ts">
import TopHeader from "@/views/edu/common/header/TopHeader.vue"
import Footer from "@/views/edu/common/footer/Footer.vue"
import Search from "@/views/edu/common/search/Search.vue"
import {ref,onMounted} from 'vue'
import {findIndexCourseListApi, getBannerListApi, getIndexColumnCoursesApi} from "@/api/edu/index";
// 课程栏目
const columnCourses = ref([])
// 获取栏目和课程
const columnCoursesLoading= ref(true)
const getIndexColumnCourses = async ()=> {
  const { data } = await getIndexColumnCoursesApi()
  columnCourses.value = data.result
  columnCoursesLoading.value = false
}
// 幻灯片
const banners = ref([])
// 获取幻灯片
const getBannerList = async ()=> {
  const params = {
    pageIndex: 1,
    pageSize: 6
  }
  const { data } = await getBannerListApi(params)
  banners.value = data.result
}

// 获取课程列表
const courseListLoading = ref(true)
// 新上好课
const newCourses = ref([])
// 实战课程
const actualCourses = ref([])
// 新手入门
const startedCourses = ref([])
// 技能提升
const skillCourses = ref([])
const findIndexCourseList = async ()=> {
  const params = {
    pageIndex: 1,
    pageSize: 8
  }
  const { data } = await findIndexCourseListApi(params)
  newCourses.value = data.result.newCourses
  actualCourses.value = data.result.actualCourses
  startedCourses.value = data.result.startedCourses
  skillCourses.value = data.result.skillCourses
  courseListLoading.value = false
}
/**
 * 跳转到详情页
 */
const toBanner = (url:string)=>{
  window.open(url, '_blank')
}
onMounted(()=> {
  getIndexColumnCourses()
  getBannerList()
  findIndexCourseList()
})
</script>

<style scoped>
*, :after, :before {
  box-sizing: inherit;
}
.edu-container {
  width: 1200px;
}
/*栏目和走马灯样式 start*/
.edu-banner {
  height: 380px;
  display: flex;
  justify-content: flex-start;
  margin: 35px auto;
  box-shadow: 2px 2px 10px rgb(0 0 0 / 40%);
  border-radius: 20px 20px 0 0;
}
.edu-banner-left {
  width: 263px;
  background: #2b333b;
  height: 100%;
  border-radius: 20px 0 0 0;
  position: relative;
  padding-left: 20px;
  box-sizing: border-box;
}
.edu-banner-item{
  width: 100%;
  padding: 10px 10px 10px 0;
  margin-top: 20px;
}
.edu-banner-item span {
  color: #ede4e4;
  font-size: 14px;
  display: block;
  text-align: left;
  cursor: pointer;
}
.edu-banner-item span img {
  cursor: pointer;
  float: right;
  margin-top: 5px;
}
.edu-banner-nav {
  width: 688px;
  height: 380px;
  background: #fff;
  position: absolute;
  right: -688px;
  top: 0;
  z-index: 9;
  display: none;
  padding: 20px 0;
}
.edu-banner-nav:after {
  content: "";
  width: 5px;
  height: 20px;
  background: #083a6d;
  border-radius: 10px;
  position: absolute;
  left: 20px;
  top: 27px;
  z-index: 3;
}
.edu-banner-nav h3 {
  color: #343434;
  font-size: 23px;
  position: relative;
  padding-left: 40px;
  border-bottom: 1px solid #e2e2e2;
}

.banner-list {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
}
.banner-list-item {
  display: block;
  width: 115px;
  height: 120px;
  margin: 10px 20px;
}
.banner-list-img {
  width: 115px;
  height: 72px;
  border-radius: 6px;
}

.banner-list-img img {
  width: 100%;
  height: 100%;
  border-radius: 6px;
}

.banner-list-text{
  font-size: 12px;
  color: #545c63;
  margin-top: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.edu-banner-item:hover{
  background: #999999;
  border-radius: 6px 0 0 6px;
}

.edu-banner-item:hover .edu-banner-nav{
  display: block;
}

.edu-banner-right {
  width: 937px;
  height: 100%;
}
/*栏目和走马灯样式 end*/

/*课程类型样式 start*/
.row-bottom-type {
  margin: -35px auto 10px auto;
  display: flex;
  height: 100px;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 55px 25px -25px #d7dae1;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-left: 1px solid #eee;
  border-bottom: 1px solid #eee;
  border-right: 1px solid #eee;
  background: #ffffff;
}
.bottom-type {
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bottom-type .type-left {
  width: 50px;
  height: 50px;
}
.bottom-type .type-left img {
  width: 100%;
  height: 100%;
}

.type-right {
  margin-left: 10px;
}

.right-title {
  font-size: 18px;
  font-weight: bold;
}
.right-desc {
  font-size: 14px;
  color: #999;
}
/*课程类型样式 end*/

/*新上好课 start*/
.edu-new-good-course {
  margin: 30px  auto -30px auto;
}
.edu-course-title {
  display: flex;
  padding-top: 10px;
}
.edu-course-title-left {
  display: flex;
}

.edu-course-title  .hot {
  display: flex;
  height: 38px;
}
.edu-course-title .hot .hot-left {
  height: 38px;
  font-size: 20px;
  padding: 0 10px;
  text-align: center;
  line-height: 37px;
  color: #ffffff;
  border-radius: 8px 0 8px 8px;
  background: linear-gradient(90deg, #ff727f 0%, #fc685c 100%);
}

.edu-course-title .hot .good-left {
  height: 38px;
  font-size: 20px;
  padding: 0 10px;
  text-align: center;
  line-height: 37px;
  color: #ffffff;
  border-radius: 8px 0 8px 8px;
  background: linear-gradient(90deg, #f8a56e 0%, #fb8d43 100%);
}

.edu-course-title .hot .easy-left {
  height: 38px;
  font-size: 20px;
  padding: 0 10px;
  text-align: center;
  line-height: 37px;
  color: #ffffff;
  border-radius: 8px 0 8px 8px;
  background: linear-gradient(90deg, #7fddfc 0%, #43cdfb 100%);
}

.edu-course-title .hot .rise-left {
  height: 38px;
  font-size: 20px;
  padding: 0 10px;
  text-align: center;
  line-height: 37px;
  color: #ffffff;
  border-radius: 8px 0 8px 8px;
  background: linear-gradient(90deg, #c9949a 0%, #c76f78 100%);
}

.edu-course-title .hot .hot-right {
  width: 0;
  height: 0;
  border: 6px solid #fc685c;
  border-right-color: transparent;
  border-bottom-color: transparent;
}
.edu-course-title .hot .good-right {
  width: 0;
  height: 0;
  border: 6px solid #fb8d43;
  border-right-color: transparent;
  border-bottom-color: transparent;
}

.edu-course-title .hot .easy-right {
  width: 0;
  height: 0;
  border: 6px solid #43cdfb;
  border-right-color: transparent;
  border-bottom-color: transparent;
}

.edu-course-title .hot .rise-right {
  width: 0;
  height: 0;
  border: 6px solid #c76f78;
  border-right-color: transparent;
  border-bottom-color: transparent;
}

.edu-course-title  .text {
  position: relative;
  height: 38px;
  z-index: 50;
}

.edu-course-title  .text .text-top {
  font-size: 24px;
  padding: 0 5px;
  color: #333333;
  line-height: 31px;
  font-weight: 700;
}
.edu-course-title  .text .text-bottom {
  position: absolute;
  top: 25px;
  left: 0px;
  width: 100%;
  height: 13px;
  background: linear-gradient(90deg, #fbf84f 0%, #fea935 100%);
  border-radius: 7px;
  z-index: -1;
}
.edu-course-list {
  display: flex;
  width: 100%;
  height: 100%;
  margin-top: 28px;
  margin-bottom: 30px;
}

.edu-course-list .edu-course-list-item{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}

.edu-course-list .edu-course-list-item .edu-course-list-item-li{
  position: relative;
  width: 270px;
  height: 290px;
  margin-bottom: 20px;
  box-shadow: 1px 1px 10px rgb(27 39 94 / 40%);
  border-radius: 8px;
  -webkit-transition: margin-top 0.2s;
  overflow: hidden;
}
.edu-course-list-item-li .list-img{
  width: 100%;
  height: 165px;
  cursor: pointer;
}

.edu-course-list-item-li .list-img img {
  width: 100%;
  height: 100%;
}
.edu-course-list-item-li:hover {
  margin-top: -5px;
}
.list-vip-img {
  position: absolute;
  top: 5px;
  left: 10px;
}

.list-text {
  color: #343434;
  font-size: 15px;
  margin: 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: box;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  padding: 0 8px;
  cursor: pointer;
}

.list-tag {
  color: #999;
  font-size: 14px;
  margin-top: 9px;
  padding: 0 8px;
}

.list-tag span {
  color: #999;
  margin-left: 10px;
}
.list-tag i {
  float: right;
  font-style: normal;
}

.list-sale-price {
  position: relative;
  font-size: 14px;
  margin: 10px 0 0 10px;
  display: flex;
}
.member-free {
  padding: 2px 10px;
  height: 20px;
  color: #fff;
  font-size: 12px;
  background: linear-gradient(90deg,#d5cb5a,#977e06 99%);
  border-radius: 24px 0 24px 0;
}

.member-price {
  color: #fe7062;
  font-weight: bold;
  font-size: 16px;
}
.origin-price {
  color: #6d7278;
  line-height: 20px;
  margin-left: 4px;
}
.delete-line {
  text-decoration: line-through;
}

.bg000 {
  box-shadow: 0 2px 4px 0 rgb(7 17 27 / 6%);
}
.bgfff {
  box-shadow: 0 2px 8px 0 rgb(7 17 27 / 6%);
  background-color: #fff!important;
}
/*新上好课 end*/

/*自定义骨架屏排列方式*/
.horizontal-skeleton {
  width: 100%;
  display: flex;
  flex-direction: row;
}

/* 添加一些样式来控制水平排列的 el-skeleton */


</style>
