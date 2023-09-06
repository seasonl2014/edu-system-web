<template>
  <!--表格区域 start-->
  <div class="table-box">
    <el-table element-loading-text="数据加载中..." v-loading="loading" :data="tableData"
              style="width: 100%;text-align: center" :cell-style="{ textAlign: 'center' }"
              :header-cell-style="{ fontSize: '15px',background: '#083a6d',color: 'white',textAlign: 'center' }">

      <el-table-column label="序号" width="100" type="index" :index="Nindex"/>

      <el-table-column label="来源">
        <template #default="scope">
          <span>{{scope.row.province}}-{{scope.row.city}}</span>
        </template>
      </el-table-column>

      <el-table-column label="订单编号" show-overflow-tooltip>
        <template #default="scope">
          <span>{{scope.row.orderNo}}</span>
        </template>
      </el-table-column>


      <el-table-column label="学生ID">
        <template #default="scope">
          <span>{{scope.row.studentId}}</span>
        </template>
      </el-table-column>

      <el-table-column label="金额">
        <template #default="scope">
          <span>{{scope.row.price}}</span>
        </template>
      </el-table-column>

      <el-table-column label="加入时间">
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
const props = defineProps(['vipId'])
const state = reactive({
  // 搜索关键字
  searchValue: '',
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
    'vipId':props.vipId,
    'isPayment':1
  }

  const { data } = await getOrderVipListApi(params)
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
