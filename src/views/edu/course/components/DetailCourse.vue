<template>
  <el-dialog width="60%"
             :model-value="detailVisible"
             destroy-on-close
             :close-on-click-modal="false"
             @close="onCancel">
    <template #header="{close,titleId,titleClass}">
      <div class="my-header">
        <el-icon size="26px"><Edit/></el-icon>
        <h1>{{courseTitle}}</h1>
      </div>
    </template>

    <el-form ref="ruleFormRef" :rules="rules" :model="courseForm" label-width="80px">
     <el-row>
       <el-col :span="24">
         <el-form-item label="课程内容" prop="remarks">
           <div style="border:1px solid #ccc">
             <Toolbar style="border-bottom: 1px solid #ccc"
                      :editor="editorRef"
                      :defaultConfig="toolbarConfig"
                      mode="simple"/>

             <Editor style="height: 300px;overflow-y:hidden;"
                     v-model="courseForm.remarks" :defaultConfig="editorConfig"
                     mode="simple" @onCreated="handleCreated"/>
           </div>
         </el-form-item>
       </el-col>
     </el-row>
    </el-form>

    <div class="dialog-button-wrap">
      <el-button @click="onCancel">取消</el-button>
      <el-button :loading="subLoading" type="primary" @click="editCourse">保存</el-button>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import {ref,watch,reactive,shallowRef} from 'vue'
import {FormInstance,FormRules,ElMessage} from 'element-plus'
import {editCourseApi, getCourseApi} from "@/api/edu/course/course"
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IEditorConfig } from '@wangeditor/editor'
import '@wangeditor/editor/dist/css/style.css' // 引入 css
const props = defineProps(['courseTitle','detailVisible','courseId'])
const emit = defineEmits(['onCancel'])
// 定义表单实例对象
const ruleFormRef = ref<FormInstance>()
// 表单约束规则对象
const rules = reactive<FormRules>({
  remarks: [{required: true,message: '课程内容不能为空',trigger: 'blur'}]
})
// 定义服务器路径
const url = import.meta.env.VITE_APP_BASE_API
// 编辑器图片上传到服务器的路径
const uploadURL = url+"aliVod/upload/uploadEditor"
// 编辑器实例
const editorRef = shallowRef()
const toolbarConfig = {}
const editorConfig: Partial<IEditorConfig> = { placeholder: '请输入内容...',MENU_CONF:{}}
const handleCreated = (editor)=> {
  editorRef.value =editor
}
// 配置编辑器上传图片
editorConfig.MENU_CONF['uploadImage'] = {
  server: uploadURL,
  fieldName: 'fileResource',
  // 自定义插入图片
  customInsert(res:any,insertFn){
    insertFn(res.result.urlPath,"上传图片",res.result.urlPath)
  }
}
/**
 * 点击关闭按钮
 */
const onCancel = ()=> {
  emit('onCancel')
}
// 表单数据对象
const courseForm = reactive({
  id: 0,
  remarks: ''
})
/**
 * 获取课程详情
 */
const getDet = async ()=> {
  if(props.courseId){
    const { data } = await getCourseApi(props.courseId)
    for (const key in courseForm) {
      courseForm[key] = data.result[key]
    }
  }
}
watch(props, (newCourseId) => {
  console.log('newCourseId:',newCourseId)
  getDet()

})
// 提交表单按钮状态
const subLoading = ref(false)
/**
 * 保存课程内容
 */
const editCourse = async () => {
  subLoading.value = true
  const { data } = await editCourseApi(courseForm)
  if(data.status === 200){
    ElMessage.success(data.message)
  }else {
    ElMessage.error(data.message)
  }
  subLoading.value = false
}
</script>

<style scoped>
/*自定义弹出框头部样式*/
.my-header {
  display: flex;
  justify-content: flex-start;
  color: #083a6d;
}
.dialog-button-wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
