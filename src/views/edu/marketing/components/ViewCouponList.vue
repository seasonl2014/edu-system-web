<template>
  <!--表格区域 start-->
  <div class="table-box">
    <el-table element-loading-text="数据加载中..." v-loading="loading" :data="tableData"
              style="width: 100%;text-align: center" :cell-style="{ textAlign: 'center' }"
              :header-cell-style="{ fontSize: '15px',background: '#083a6d',color: 'white',textAlign: 'center' }">

      <el-table-column label="序号" width="100" type="index" :index="Nindex"/>

      <el-table-column label="可用时间" show-overflow-tooltip>
        <template #default="scope">
          <span>从{{formatTime(scope.row.availableBeginTime,'yyyy-MM-dd')}}到{{formatTime(scope.row.availableEndTime,'yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="代金券编号">
        <template #default="scope">
          <span>{{scope.row.stuCouponId}}</span>
        </template>
      </el-table-column>


      <el-table-column label="批次号">
        <template #default="scope">
          <span>{{scope.row.stockId}}</span>
        </template>
      </el-table-column>

      <el-table-column label="代金券名称">
        <template #default="scope">
          <span>{{scope.row.couponName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="代金券状态">
        <template #default="scope">
          <span>
            <el-tag type="success" v-if="scope.row.status==='SENDED'">可用</el-tag>
             <el-tag type="warning" v-else-if="scope.row.status==='USED'">已实扣</el-tag>
            <el-tag type="danger" v-else>已过期</el-tag>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="领取时间">
        <template #default="scope">
          <span>{{formatTime(scope.row.createTime,'yyyy-MM-dd HH:mm:ss')}}</span>
        </template>
      </el-table-column>

    </el-table>
  </div>
  <!--表格区域 end-->

  <!--分页 start-->
  <el-pagination background layout="total,sizes,prev,pager,next,jumper" :total="total"
                 v-model:page-size="pageSize" :page-sizes="[10,20,30,40]" @current-change="changePage"/>
  <!--分页 end-->
</template>

<script setup lang="ts">
import {reactive,toRefs,onMounted} from 'vue'
import {getOrderVipListApi} from "@/api/edu/order/order";
import {formatTime} from "@/utils/date";
import {viewCouponByStockIdApi} from "@/api/edu/marketing/coupon";
const props = defineProps(['stockNo'])
const stockNo = props.stockNo
const state = reactive({
  // 搜索关键字
  searchValue: '',
  // 代金券状态
  status: '',
  // 表格数据
  tableData: [],
  // 总条数
  total: 0,
  // 每页显示行数
  pageSize: 10,
  pageIndex: 1,
  // 数据加载
  loading: false
})

// 获取学生列表数据
const loadData = async (state: any)=> {
  state.loading = true
  // 先清空列表数据
  state.tableData = []
  const params = {
    'pageIndex': state.pageIndex,
    'pageSize':state.pageSize,
    'searchValue': state.searchValue,
    'status':state.status
  }

  const { data } = await viewCouponByStockIdApi(stockNo,params)
  state.tableData = data.content
  state.total = data.totalElements
  state.loading = false
}
// 改变页码执行事件
const changePage = (val: number)=> {
  state.pageIndex = val
  loadData(state)
}
// 挂载后加载数据
onMounted(()=> {
  loadData(state)
})
const { total,tableData,pageSize,pageIndex,loading,searchValue}=toRefs(state)
</script>

<style scoped>
/*分页插件样式*/
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active){
  background-color: #083a6d;
}

.el-pagination{
  margin-top: 20px;
  justify-content: center;
}
</style>
