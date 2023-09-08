<template>
<el-card class="box-card">
  <!--头部 start-->
  <template #header>
    <div class="card-header">
      <h3>
        <el-icon>
          <Handbag/>
        </el-icon>代金券批次管理
      </h3>

      <!--搜索区域 start-->
      <div class="card-search">
        <el-row :gutter="10">
          <el-col :span="10">
            <el-input :prefix-icon="SearCh" v-model="searchValue" @keyup.enter.native="search"
            placeholder="关键字搜索（回车）"/>
          </el-col>

          <el-col :span="11">
            <div class="my-button">
            <el-button plain style="width: 100%" color="#2fa7b9" @click="addCourse">新增批次</el-button>
              <el-button  style="width: 100%" type="primary"  @click="exportExcelAction">
                <el-icon>
                <Download/>
              </el-icon>导出 Excel</el-button>
            </div>
          </el-col>

          <el-col :span="3" style="display: inline-flex;justify-content: center;align-items: center;cursor: pointer;">
            <el-icon style="font-size: 20px;color: #b3b6bc;" @click="refresh">
              <Refresh/>
            </el-icon>
          </el-col>

        </el-row>
      </div>
      <!--搜索区域 end-->

    </div>
  </template>
  <!--头部 end-->
  <!--表格区域 start-->
  <div class="table-box">
    <el-table element-loading-text="数据加载中..." v-loading="loading" :data="tableData"
    style="width: 100%;text-align: center;" :cell-style="{ textAlign: 'center' }"
    :header-cell-style="{ fontSize: '15px',background: '#083a6d',color: 'white',
     textAlign: 'center'}">

      <el-table-column label="序号" width="100" type="index" :index="Nindex"/>

      <el-table-column label="批次号">
        <template #default="scope">
          <span>{{scope.row.stockId}}</span>
        </template>
      </el-table-column>

      <el-table-column label="批准名称">
        <template #default="scope">
          <span>{{scope.row.stockName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="代金券数量">
        <template #default="scope">
          <span>{{scope.row.maxCoupons}}</span>
        </template>
      </el-table-column>

      <el-table-column label="已发数量">
        <template #default="scope">
          <span v-if="scope.row.distributedCoupons>0" style="cursor: pointer;text-decoration:underline;'" @click="view(scope.row.stockId,scope.row.stockName)"><el-tag>{{scope.row.distributedCoupons}}</el-tag></span>
          <span v-else><el-tag>{{scope.row.distributedCoupons}}</el-tag></span>
        </template>
      </el-table-column>

      <el-table-column label="开始时间">
        <template #default="scope">
          <span>{{formatTime(scope.row.availableBeginTime,'yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="结束时间">
        <template #default="scope">
          <span>{{formatTime(scope.row.availableEndTime,'yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="单人领取个数">
        <template #default="scope">
          <span>{{scope.row.maxCouponsPerUser}}</span>
        </template>
      </el-table-column>

      <el-table-column label="代金券面额">
        <template #default="scope">
          <span>{{scope.row.couponAmount}}</span>
        </template>
      </el-table-column>

      <el-table-column label="使用门槛">
        <template #default="scope">
          <span>{{scope.row.transactionMinimum}}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template #default="scope">
          <el-tag effect="plain" type="success" v-if="scope.row.status===0">未生成</el-tag>
          <el-tag effect="plain" type="warning"  v-else-if="scope.row.status===1">未激活</el-tag>
          <el-tag effect="plain" type="info"  v-else-if="scope.row.status===2">审核中</el-tag>
          <el-tag effect="plain"   v-else-if="scope.row.status===3">运行中</el-tag>
          <el-tag effect="plain" type="danger"  v-else-if="scope.row.status===4">已停止</el-tag>
          <el-tag effect="plain" type="info"  v-else-if="scope.row.status===5">已暂停</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180">
        <template #default="scope">
         <el-button size="small" v-if="scope.row.status===0" plain @click="generateCouponStock(scope.row.id)">生成</el-button>
          <el-button size="small" v-if="scope.row.status!=0" plain @click="queryStock(scope.row.id)">同步</el-button>
          <el-button type="warning" v-if="scope.row.status===1" size="small" plain @click="startStock(scope.row.id)">启动</el-button>
          <el-button size="small" v-if="scope.row.status===3" plain type="success" @click="sendCouponStock(scope.row.id)">发放</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
  <!--表格区域 end-->
  <!--分页插件 start-->
   <el-pagination background layout="total,sizes,prev,pager,next,jumper" :total="total"
   v-model:page-size="pageSize" :page-sizes="[10,20,30,40]" @current-change="changePage"/>
  <!--分页插件 end-->
</el-card>

  <!--创建代金券弹出框 start-->
   <el-dialog align-center v-model="addCouponVisible" width="50%" destroy-on-close>

     <template #header="{close,titleId,titleClass}">
       <div class="my-header">
         <el-icon size="26px"><EditPen/></el-icon>
         <h1 id="titleId">创建代金券</h1>
       </div>
     </template>

     <!--创建代金券组件 start-->
     <AddCoupon @closeAddCourseForm="closeAddCourseForm" @success="success"/>
     <!--创建代金券组件 end-->
   </el-dialog>
  <!--创建代金券弹出框 end-->

  <!--发放代金券弹出框 start-->
  <el-dialog align-center v-model="sendCouponVisible" width="30%" destroy-on-close>

    <template #header="{close,titleId,titleClass}">
      <div class="my-header">
        <el-icon size="26px"><EditPen/></el-icon>
        <h1 id="titleId">发放代金券</h1>
      </div>
    </template>

    <!--发放代金券组件 start-->
    <SendCoupon :couponId="couponId" @closeAddCourseForm="closeAddCourseForm" @success="success"/>
    <!--发放代金券组件 end-->
  </el-dialog>
  <!--发放代金券弹出框 end-->

  <!--查看已发券弹出框 start-->
  <el-dialog align-center v-model="distributedCouponVisible" destroy-on-close width="60%">
    <template #header>
      <div class="my-header">
        <el-icon size="26px"><EditPen/></el-icon>
        <h1>{{distributedTitle}}</h1>
      </div>
    </template>
    <!--已发发券组件 start-->
    <ViewCouponList :stockNo="stockNo"/>
    <!--已发发券组件 end-->
  </el-dialog>
  <!--查看已发券弹出 end-->

</template>

<script setup lang="ts">
import {ref,reactive,toRefs,onMounted } from 'vue'


import { ElMessage } from 'element-plus'
import AddCoupon from "./components/AddCoupon.vue"
import SendCoupon from "@/views/edu/marketing/components/SendCoupon.vue";
import {exportExcel} from "@/utils/exportExcel";
import {generateCouponStockApi, getListApi, queryStockApi, startStockApi} from "@/api/edu/marketing/coupon";
import {formatTime} from "@/utils/date";
import ViewCouponList from "@/views/edu/marketing/components/ViewCouponList.vue";
const state = reactive({
  // 搜索关键字
  searchValue: '',
  // 表格数据
  tableData: [],
  // 总条数
  total: 0,
  // 每页显示条数
  pageSize: 10,
  // 当前页面
  pageIndex: 1,
  // 数据加载状态
  loading: false
})

// 获取学号列表数据
const loadData = async (state: any)=> {
  state.loading = true
  // 先清空表格数据
  state.tableData = []
  const params = {
    'pageIndex': state.pageIndex,
    'pageSize': state.pageSize,
    'searchValue': state.searchValue
  }
  const { data } = await getListApi(params)
  state.tableData = data.content
  state.total = data.totalElements
  state.loading = false
}

// 刷新学号列表数据
const refresh = ()=> {
  // 搜索关键字
  state.searchValue = ''
  // 更新数据
  loadData(state)
}

//搜索
const search = ()=> {
  if(state.searchValue!==null){
    loadData(state)
    ElMessage({
      type: 'success',
      message: `关键字“${state.searchValue}”搜索内容如下`
    })
  }
}
// 切换页码执行的事件函数
const changePage = (val:number)=> {
  state.pageIndex = val
  loadData(state)
}

// 处理列表数据序号
const Nindex = (index:number)=> {
  // 当前页面
  const page = state.pageIndex
  // 每页条数
  const pageSize = state.pageSize
  return index+1+(page-1)*pageSize
}

// 新增学号对话框弹出状态
const addCouponVisible = ref(false)
// 添加学号
const addCourse = ()=> {
  addCouponVisible.value=true
}
// 关闭新增学号弹出框
const closeAddCourseForm = ()=> {
  addCouponVisible.value=false
}

// 提交表单回调函数
const success = ()=> {
  loadData(state)
  closeAddCourseForm()
}


// 生成批次
const generateCouponStock = async (id:number)=>{
  const { data } = await generateCouponStockApi(id)
  if(data.status === 200){
    ElMessage.success('生成成功')
    await loadData(state)
  }else {
    ElMessage.error('生成失败')
  }
}

// 发放指定批次代金券弹出框事件
const couponId = ref()
const sendCouponVisible = ref(false)
const sendCouponStock = (id:number) => {
  couponId.value = id
  sendCouponVisible.value = true
}

// 启动激活指定代金券批次事件
const startStock = async (id:number) => {
  const { data } = await startStockApi(id)
  if(data.status===200){
    ElMessage.success(data.message)
  }else {
    ElMessage.error(data.message)
  }
}

// 查看指定批次详情
const queryStock = async (id:number) => {
  const { data } = await queryStockApi(id)
  if(data.status === 200){
    ElMessage.success('同步完成')
  }else {
    ElMessage.error('同步失败')
  }

}

// 已发券弹出框标题
const distributedTitle = ref()
// 已发券弹出框状态
const distributedCouponVisible = ref(false)
// 批次编号
const stockNo = ref()
/**
 * 查看已发券弹出框事件
 * @param stockId  批次编号
 * @param stockName 批次名称
 */
const view = (stockId:number,stockName:string) => {
  stockNo.value = stockId
  distributedTitle.value = `你正在查看批次号为“${stockId}”，批次名称为“${stockName}”已发送的代金券明细`
  distributedCouponVisible.value = true
}

// 导出类别
const column = [
  { name: 'id',label: '学号id' },
  { name: 'courseno',label: '学号编号' },
  { name: 'coursename',label: '学号名称'},
  { name: 'remarks',label: '备注' }
]
const exportExcelAction=()=> {
  exportExcel({
    column,
    data: state.tableData,
    filename: '学号信息数据',
    format: 'xlsx',
    autowidth: true
  })
}

// 挂载后加载数据
onMounted(()=> {
  loadData(state)
})

const { tableData,pageSize,pageIndex,loading,total,searchValue } = toRefs(state)

</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-card__header){
  border-bottom: 1px solid rgb(238 238 238);
  color: #083a6d;
}

/*分页样式*/
.el-pagination {
  margin-top: 20px;
  justify-content: center;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active){
  background-color: #083a6d;
}

/*学号弹出框自定义头部样式*/
.my-header {
  display: flex;
  justify-content: flex-start;
  color: #083a6d;
}

/*自定义按钮样式*/
.my-button {
  display: flex;
  justify-content: space-between;
}

</style>
