<template>
  <el-skeleton :loading="orderCourseLoading" :rows="5" animated >
    <template #default>
  <!--搜索区域 start-->
  <div class="card-search">
    <el-row :gutter="10">
      <el-col :span="13">
        <el-input :prefix-icon="Search" v-model="orderNo"
                  @keyup.enter.native="search" placeholder="订单编号搜索（回车）"/>
      </el-col>

      <el-col :span="8">
        <el-select v-model="isPayment" class="m-2" placeholder="请选择">
          <el-option label="未支付" value="0"/>
          <el-option label="已支付" value="1"/>
          <el-option label="已退款" value="2"/>
        </el-select>
      </el-col>

      <el-col :span="3" style="display: inline-flex;justify-content: center;align-items: center;cursor: pointer;">
        <el-icon style="font-size: 20px;color: #b3b6bc;" @click="refresh"><Refresh/></el-icon>
      </el-col>

    </el-row>
  </div>
  <!--搜索区域 end-->

  <!--课程订单明细表格区域 start-->
  <div class="table-box">
    <el-table element-loading-text="数据加载中..." v-loading="loading" :data="tableData"
              style="width: 100%;text-align: center" :cell-style="{ textAlign: 'center' }"
              :header-cell-style="{ fontSize: '15px',background: '#083a6d',color: 'white',textAlign: 'center' }">

      <el-table-column label="序号" width="100" type="index" :index="Nindex"/>

      <el-table-column label="来源">
        <template #default="scope">
          <el-tag v-if="scope.row.province!=null || scope.row.city!=null">{{scope.row.province}}-{{scope.row.city}}</el-tag>
          <span v-else>未知</span>
        </template>
      </el-table-column>

      <el-table-column label="订单编号" show-overflow-tooltip>
        <template #default="scope">
          <span>{{scope.row.orderNo}}</span>
        </template>
      </el-table-column>

      <el-table-column label="支付状态" width="100">
        <template #default="scope">
          <el-tag type="success" v-if="scope.row.isPayment===1">已支付</el-tag>
          <el-tag type="warning" v-else-if="scope.row.isPayment===2">已退款</el-tag>
          <el-tag v-else>未支付</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="VIP" width="80">
        <template #default="scope">
          <span>{{scope.row.vipId}}</span>
        </template>
      </el-table-column>


      <el-table-column label="学员ID" width="80">
        <template #default="scope">
          <span>{{scope.row.studentId}}</span>
        </template>
      </el-table-column>

      <el-table-column label="金额" width="80">
        <template #default="scope">
          <el-tag type="success">￥{{scope.row.price}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template #default="scope">
          <span>{{formatTime(scope.row.createTime,'yyyy-MM-dd HH:mm:ss')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180">
        <template #default="scope">
          <el-button @click="getVipOrderInfo(scope.row.orderNo,scope.row.id)"  size="small" plain icon="Pear" type="warning">详情</el-button>
          <el-button @click="refundVipOrder(scope.row.orderNo,scope.row.id)" size="small" plain icon="Delete" type="danger" v-if="scope.row.isPayment ===1">退款</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!--课程订单明细表格区域 end-->
  <!--分页 start-->
  <el-pagination background layout="total,sizes,prev,pager,next,jumper" :total="total"
                 v-model:page-size="pageSize" :page-sizes="[10,20,30,40]" @current-change="changePage"/>
  <!--分页 end-->
    </template>
  </el-skeleton>

  <!--课程订单退款弹出框 start-->
   <el-dialog align-center destroy-on-close v-model="refundVipOrderVisible" width="50%">
     <template #header>
       <div class="my-header">
         <el-icon size="26px"><EditPen/></el-icon>
         <h1>{{titleRefund}}</h1>
       </div>
     </template>
     <!--退款组件 start-->
     <RefundVipOrder :vipOrderInfo="vipOrderInfo" @success="success"/>
     <!--退款组件 end-->
   </el-dialog>
  <!--课程订单退款弹出框 end-->

  <!--课程订单详情弹出框 start-->
  <el-dialog align-center destroy-on-close v-model="vipOrderInfoVisible" width="50%">
    <template #header>
      <div class="my-header">
        <el-icon size="26px"><EditPen/></el-icon>
        <h1>{{titleInfo}}</h1>
      </div>
    </template>
    <!--课程详情组件 start-->
    <VipOrderInfo :vipOrderInfo="vipOrderInfo"/>
    <!--课程详情组件 end-->
  </el-dialog>
  <!--课程订单详情弹出框 end-->

</template>

<script setup lang="ts">
import { ref,reactive,onMounted,toRefs  } from 'vue'
import { ElMessage } from 'element-plus'
import {formatTime} from "@/utils/date";
import {getVipOrderInfoApi, getOrderVipListApi} from "@/api/edu/order/order";
import RefundVipOrder from "@/views/edu/order/components/RefundVipOrder.vue";
import VipOrderInfo from "@/views/edu/order/components/VipOrderInfo.vue";
// 课程订单骨架屏状态
const orderCourseLoading= ref(true)
// 表格相关变量
const state = reactive({
  // 支付状态
  isPayment: '',
  // 搜索订单编号
  orderNo: '',
  // 课程订单明细表格数据
  tableData: [],
  // 总条数
  total: 0,
  // 每页显示行数
  pageSize: 10,
  pageIndex: 1,
  // 数据加载
  loading: false
})
// 获取课程订单明细列表数据
const loadData = async (state: any)=> {
  state.loading = true
  // 先清空列表数据
  state.tableData = []
  const params = {
    'pageIndex': state.pageIndex,
    'pageSize':state.pageSize,
    'orderNo': state.orderNo,
    'isPayment':state.isPayment
  }
  const { data } = await getOrderVipListApi(params)
  state.tableData = data.content
  state.total = data.totalElements
  state.loading = false
  orderCourseLoading.value = false
}
// 刷新学生列表数据
const refresh = ()=> {
  // 搜索关键字清空
  state.orderNo = ""
  // 更新列表数据
  loadData(state)
}
// 搜索
const search = ()=> {
  if(state.orderNo!==null){
    ElMessage({
      type: 'success',
      message: `订单编号“${state.orderNo}”搜索内容如下`
    })
    loadData(state)
  }
}
// 处理分页序号
const Nindex = (index)=> {
  // 当前页码
  const page = state.pageIndex
  // 每页显示函数
  const pageSize = state.pageSize
  return index+1+(page-1)*pageSize
}

/**
 * 改变页码执行事件
 * @param val 页码
 */
const changePage = (val: number)=> {
  state.pageIndex = val
  loadData(state)
}
onMounted(()=> {
  loadData(state)
})
// 课程订单详情
const vipOrderInfo = ref()
// 退款弹出框标题
const titleRefund = ref()
// 退款弹出框状态
const refundVipOrderVisible = ref(false)

/**
 * 退款弹出框事件
 * @param orderNo 订单编号
 * @param id 订单ID
 */
const refundVipOrder = async (orderNo:string,id:number) => {
  // 获取订单详情
  const { data } = await getVipOrderInfoApi(id)
  vipOrderInfo.value = data.result
  titleRefund.value = `你正在给VIP订单号：“${orderNo}”进行退款`
  refundVipOrderVisible.value = true
}

/**
 * 退款回调函数
 */
const success = ()=> {
  refundVipOrderVisible.value = false
  loadData(state)
}

// VIP订单详情弹出框状态
const vipOrderInfoVisible = ref(false)
// VIP订单详情弹出框标题
const titleInfo = ref()
/**
 * 课程详情弹出框函数
 */
const getVipOrderInfo = async (orderNo:string,id:number) => {
  // 获取订单详情
  const { data } = await getVipOrderInfoApi(id)
  vipOrderInfo.value = data.result
  titleInfo.value = `你正在查看订单号：“${orderNo}”的详情信息`
  vipOrderInfoVisible.value = true
}

const { total,tableData,pageSize,pageIndex,loading,orderNo,isPayment}=toRefs(state)
</script>

<style scoped>
.card-search {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 10px;
}
.el-pagination{
  margin-top: 20px;
  justify-content: center;
}

/*学生弹出框自定义头部样式*/
.my-header{
  display: flex;
  justify-items: flex-start;
  color: #083a6d;
}
</style>
