<template>
<el-form ref="ruleFormRef" :rules="rules" :model="formCourse" label-width="80px">
  <el-row>
    <el-col :span="8">
      <el-form-item prop="subjectId" label="所属栏目">
        <el-cascader
            @change="selectParentChange"
            :options="subjectTreeData"
            clearable
            :props="{ expandTrigger: 'hover', value: 'id',label: 'name',children: 'children' }"
            v-model="pKeys"
        />
      </el-form-item>
    </el-col>

    <el-col :span="8">
      <el-form-item prop="courseType" label="课程类型">
        <el-select v-model="formCourse.courseType" placeholder="请选择课程类型">
          <el-option label="新手入门" :value="0" />
          <el-option label="新上好课" :value="1" />
          <el-option label="技能提高" :value="2" />
          <el-option label="实战开发" :value="3" />
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="8">
      <el-form-item prop="difficulty" label="课程难度">
        <el-select v-model="formCourse.difficulty" placeholder="课程难度">
          <el-option label="入门" :value="0" />
          <el-option label="初级" :value="1" />
          <el-option label="中级" :value="2" />
          <el-option label="高级" :value="3" />
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="24">
      <el-form-item label="长标题" prop="title">
        <el-input v-model="formCourse.title" placeholder="请输入长标题"/>
      </el-form-item>
    </el-col>

    <el-col :span="24">
      <el-form-item prop="shortTitle" label="短标题">
        <el-input v-model="formCourse.shortTitle" placeholder="短标题" />
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item prop="price" label="现价">
        <el-input-number
            v-model="formCourse.price"
            :min="1"
            :max="1000"
            style="width: 100%;"
        />
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item prop="originalPrice" label="原价">
        <el-input-number
            v-model="formCourse.originalPrice"
            :min="1"
            :max="1000"
            style="width: 100%;"
        />
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item label="选择讲师" prop="teacherId">
        <el-select v-model="formCourse.teacherId" placeholder="请选择讲师"  style="width: 100%;">
          <el-option
              v-for="teacher in teachers"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"

          ></el-option>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="12">
      <el-form-item prop="lessonNum" label="课时">
        <el-input-number
            v-model="formCourse.lessonNum"
            :min="1"
            :max="1000"
            style="width: 100%;"
        />
      </el-form-item>
    </el-col>

      <el-col :span="24">
        <el-form-item prop="courseDesc" label="课程描述">
          <el-input
              v-model="formCourse.courseDesc"
              type="textarea"
              :rows="4"
              placeholder="请输入描述"
          />
        </el-form-item>
      </el-col>

  </el-row>
</el-form>
  <div class="dialog-button-wrap">
    <el-button @click="close">取消</el-button>
    <el-button @click="addCourse(ruleFormRef)" type="success" :loading="subLoading" color="#083a6d">保存</el-button>
  </div>
</template>

<script setup lang="ts">
import {ref,reactive,onMounted,shallowRef} from 'vue'

import { ElMessage,FormInstance,FormRules } from 'element-plus'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IEditorConfig } from '@wangeditor/editor'
import {addCourseApi, getAllCourseTypeListApi} from "@/api/edu/course/course";
import {getParentCategoryListApi} from "@/api/edu/subject/subject";
import {getAllTeacherListApi} from "@/api/edu/teacher/teacher";
// 所属栏目树形结构数据
const subjectTreeData = ref<object[]>([])
// 父节点数组
const pKeys = ref<number[]>([])
// 讲师数据
const teachers = ref([])
// 表单实例对象
const ruleFormRef = ref<FormInstance>()
// 表单约束规则对象
const rules = reactive<FormRules>({
  teacherId: [{ required: true,message: '请选择讲师',trigger: 'blur' }],
  subjectId: [{ required: true,message: '课程栏目不能为空',trigger: 'blur' }],
  courseType: [{ required: true,message: '课程类型不能为空',trigger: 'blur' }],
  difficulty: [{required: true,message: '课程难度不能为空',trigger: 'blur'}],
  title: [{ required: true,message: '长标题不能为空',trigger: 'blur'}],
  shortTitle: [{ required: true,message: '短标题不能为空',trigger: 'blur' }],
  price: [{ required: true,message: '课程现价不能为空',trigger: 'blur' }],
  courseDesc: [{ required: true,message: '课程描述不能为空',trigger: 'blur' }],
  lessonNum: [{required: true,message: '课时不能为空',trigger: 'blur'}],
  originalPrice: [{required: true,message: '课程原价不能为空',trigger: 'blur'}]
})
// 定义事件
const emit = defineEmits(['closeAddCourseForm','success'])
// 按钮状态
const subLoading = ref(false)
// 表单数据对象
const formCourse = reactive({
  subjectId: 0,// 所属栏目
  subjectParentId: 0,// 一级栏目
  teacherId: 0,// 讲师ID
  title: '',// 长标题
  shortTitle: '',// 短标题
  price: 0,// 现价
  originalPrice: 0,// 原价
  lessonNum: 0,// 课时
  courseDesc: '',// 课程描述
  courseType: 0,// 课程类型
  difficulty: 0 // 课程难度
})
/**
 * 新增课程信息
 * @param formEl
 */
const addCourse = async (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=> {
    subLoading.value = true
    if (valid){
      const { data } = await addCourseApi(formCourse)
      if(data.status === 200){
        ElMessage.success(data.message)
        emit('success')
      }else {
        ElMessage.error(data.message)
      }
    }else {
      ElMessage.error('提交失败，你还有未填写的项！')
    }
  })
  subLoading.value = false
}

/**
 * 取消表单
 */
const close = ()=>{
  emit('closeAddCourseForm')
}

/**
 * 获取树形课程栏目
 */
const getParentCategoryList = async() => {
  const { data } = await getParentCategoryListApi()
  if (data.result.length > 0) {
    subjectTreeData.value = data.result
  } else {
    subjectTreeData.value = []
  }
}
/**
 * 父级分类中改变
 */
const selectParentChange = () => {
  const len = pKeys.value.length
  if (len > 0) {
    formCourse.subjectParentId = pKeys.value[0]
    formCourse.subjectId = pKeys.value[len - 1]
  } else {
    formCourse.subjectId = 0
    formCourse.subjectParentId = 0
  }
}

/**
 * 获取所有讲师列表
 */
const getAllTeacherList = async ()=> {
  const { data } = await getAllTeacherListApi()
  teachers.value = data.result
}

onMounted(()=> {
  getParentCategoryList()
  getAllTeacherList()
})
</script>

<style scoped>
.dialog-button-wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
