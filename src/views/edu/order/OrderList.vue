<template>
  <el-card class="box-card">
    <!--头部 start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px">
            <Money/>
          </el-icon>
          订单明细
        </h3>
      </div>
    </template>
    <!--头部 end-->

    <!--多标签 start-->
    <el-tabs
        v-model="activeName"
        type="card"
        class="demo-tabs"
    >
      <!--课程订单明细 start-->
      <el-tab-pane label="课程订单明细" name="first">
        <!--课程订单 start-->
         <OrderCourseList/>
        <!--课程订单 end-->
      </el-tab-pane>
      <!--课程订单明细 end-->
      <!--VIP订单明细 start-->
      <el-tab-pane label="VIP订单明细" name="second">
        <!--VIP订单 start-->
        <OrderVipList/>
        <!--VIP订单 end-->
      </el-tab-pane>
      <!--VIP订单明细 end-->
    </el-tabs>
    <!--多标签 end-->

  </el-card>
</template>

<script setup lang="ts">
import { ref} from 'vue'
import OrderCourseList from "@/views/edu/order/OrderCourseList.vue";
import OrderVipList from "@/views/edu/order/OrderVipList.vue";
const activeName = ref('first')

</script>

<style scoped>
.card-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3{
  display: inline-flex;
  justify-content: center;
  align-items: center;
  color: #083a6d;
}


/*自定义按钮样式*/
.my-button {
  display: flex;
  justify-content: space-between;
}
/*分页插件样式*/
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active){
  background-color: #083a6d;
}

</style>
