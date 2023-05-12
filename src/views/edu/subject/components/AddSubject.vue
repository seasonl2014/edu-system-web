<template>
<el-form ref="ruleFormRef" :rules="rules" :model="formSubject" label-width="80px">
  <el-row>
    <el-col :span="12">
      <el-form-item label="类型名称" prop="name">
        <el-input v-model="formSubject.name" placeholder="请输入课程类型名称"/>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="类型排序" prop="sort">
        <el-input-number style="width: 100%;" v-model="formSubject.sort" placeholder="请输入课程类型排序"/>
      </el-form-item>
    </el-col>

    <el-col :span="24">
      <el-form-item label="父分类">
        <el-cascader
            @change="selectParentChange"
            :change-on-select="true"
            :options="subjectTreeData"
            clearable
            filterable
            style="width:100%"
            :props="{ expandTrigger: 'hover', value: 'id',label: 'name',children: 'children',checkStrictly: true }"
            v-model="pKeys"
        ></el-cascader>
      </el-form-item>
    </el-col>

    <el-col :span="24">
      <el-form-item label="备注">
        <el-input :rows="2" type="textarea" v-model="formSubject.remarks" placeholder="请输入备注"/>
      </el-form-item>
    </el-col>
  </el-row>
</el-form>

  <div class="dialog-button-wrap">
    <el-button @click="close">取消</el-button>
    <el-button @click="addRoomType(ruleFormRef)" type="success" :loading="subLoading" color="#083a6d">保存</el-button>
  </div>

</template>

<script setup lang="ts">
import {ref,reactive,toRefs } from 'vue'
import { ElMessage,FormInstance,FormRules } from 'element-plus'
import {addSubjectApi} from "@/api/edu/subject/subject";
// 获取父组件传过来的roomTypeInfo对象
const props = defineProps(['subjectTreeData'])
/*const subjectTreeData = ref(props.subjectTreeData)*/
const { subjectTreeData } = toRefs(props)
console.log('props=:',props)
console.log('subjectTreeData=:',subjectTreeData)
// 表单实例对象
const ruleFormRef = ref<FormInstance>()
// 表单约束规则对象
const rules = reactive<FormRules>({
  name: [{ required: true,message: '课程类型名称不能为空',trigger: 'blur' }],
  sort: [{ required: true,message: '课程类型排序不能为空',trigger: 'blur' }]
})
// 定义事件
const emit = defineEmits(['closeAddRoomTypeForm','success'])
// 按钮状态
const subLoading = ref(false)
// 表单数据对象
const formSubject = reactive({
  name: '',
  sort: 0,
  parentId: 0,
  remarks: ''
})
// 父节点数组
const pKeys = ref<number[]>([]);
//父级分类中改变
const selectParentChange = ()=> {
  const len = pKeys.value.length;
  if (len > 0) {
    formSubject.parentId = pKeys.value[len - 1];
  }else{
    formSubject.parentId=0;
  }
}
// 新增课程类型信息
const addRoomType = async (formEl:FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=> {
    subLoading.value = true
    if(valid){
      const { data } = await addSubjectApi(formSubject)
      if (data.status === 200){
        ElMessage.success(data.message)
        emit('success')
      }else {
        ElMessage.error(data.message)
      }
    }else {
      ElMessage.error('提交失败，你还有未填写的项')
    }
  })
  subLoading.value = false
}
// 取消表单
const close = ()=> {
  emit('closeAddRoomTypeForm')
}
</script>

<style scoped>
.dialog-button-wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
