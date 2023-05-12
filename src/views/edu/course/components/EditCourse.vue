<template>
<el-form ref="ruleFormRef" :rules="rules" :model="formCourse" label-width="80px">
  <el-row>
    <el-col :span="6">
      <el-form-item label="所属楼层" prop="floorId">
        <el-select v-model="formCourse.floorId" placeholder="请选择楼层" style="width: 100%;">
          <el-option v-for="item in floorOptions" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="6">
      <el-form-item label="房间类型" prop="CourseTypeId">
        <el-select v-model="formCourse.CourseTypeId" placeholder="请选择房间类型" style="width: 100%;">
          <el-option v-for="item in CourseTypeOptions" :key="item.id" :label="item.name" :value="item.id"/>
        </el-select>
      </el-form-item>
    </el-col>

    <el-col :span="6">
      <el-form-item label="房间名称" prop="CourseName">
        <el-input v-model="formCourse.CourseName" placeholder="请输入房间名称"/>
      </el-form-item>
    </el-col>

    <el-col :span="6">
      <el-form-item label="房间号" prop="CourseNumber">
        <el-input v-model="formCourse.CourseNumber" placeholder="请输入房间号"/>
      </el-form-item>
    </el-col>

    <el-col :span="6">
      <el-form-item label="床型" prop="bedType">
        <el-input v-model="formCourse.bedType" placeholder="请输入床型"/>
      </el-form-item>
    </el-col>

    <el-col :span="6">
      <el-form-item label="宽带" prop="broadband">
        <el-input v-model="formCourse.broadband" placeholder="请输入宽带"/>
      </el-form-item>
    </el-col>

    <el-col :span="6">
      <el-form-item label="标准价" prop="standardPrice">
        <el-input v-model="formCourse.standardPrice" placeholder="请输入标准价"/>
      </el-form-item>
    </el-col>

    <el-col :span="6">
      <el-form-item label="会员价" prop="memberPrice">
        <el-input v-model="formCourse.memberPrice" placeholder="请输入会员价"/>
      </el-form-item>
    </el-col>

    <el-col :span="24">
      <el-form-item label="房间封面" prop="coverImg">
        <!--上传图片控件 start-->
        <el-upload v-model:file-list="fileList" :action="uploadURL" name="fileResource" list-type="picture-card" :auto-upload="true"
                   :limit="1" :on-success="handleSuccess">
          <el-icon><Plus /></el-icon>
        </el-upload>
        <!--上传图片控件 end-->
      </el-form-item>
    </el-col>

    <el-col :span="24">
      <el-form-item label="备注" prop="remarks">
        <div style="border:1px solid #ccc">
          <Toolbar style="border-bottom: 1px solid #ccc"
                   :editor="editorRef"
                   :defaultConfig="toolbarConfig"
                   mode="simple"/>

          <Editor style="height: 300px;overflow-y:hidden;"
                  v-model="formCourse.remarks" :defaultConfig="editorConfig"
                  mode="simple" @onCreated="handleCreated"/>
        </div>
      </el-form-item>
    </el-col>

  </el-row>
</el-form>
  <div class="dialog-button-wrap">
    <el-button @click="close">取消</el-button>
    <el-button @click="editCourse(ruleFormRef)" type="success" :loading="subLoading" color="#083a6d">保存</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref,reactive,onMounted,shallowRef } from 'vue'
import {ElMessage,UploadFile,UploadProps,UploadUserFile,FormInstance,FormRules} from 'element-plus'

import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { IEditorConfig } from '@wangeditor/editor'
import {editCourseApi, getAllCourseTypeListApi} from "@/api/edu/course/course";
// 定义表单实例对象
const ruleFormRef = ref<FormInstance>()
// 表单约束规则对象
const rules = reactive<FormRules>({
  CourseName: [{ required: true,message: '房间名称不能为空',trigger: 'blur' }],
  CourseNumber: [{ required: true,message: '房间号不能为空',trigger: 'blur' }],
  bedType: [{ required: true,message: '床型不能为空',trigger: 'blur' }],
  broadband: [{required: true,message: '宽带不能为空',trigger: 'blur'}],
  standardPrice: [{ required: true,message: '标准价不能为空',trigger: 'blur'}],
  memberPrice: [{ required: true,message: '会员价不能为空',trigger: 'blur' }],
  CourseTypeId: [{ required: true,message: '房间类型ID不能为空',trigger: 'blur' }],
  floorId: [{ required: true,message: '楼层ID不能为空',trigger: 'blur' }],
  coverImg: [{required: true,message: '封面不能为空',trigger: 'blur'}],
  remarks: [{required: true,message: '备注不能为空',trigger: 'blur'}]
})
// 定义服务器路径
const url = import.meta.env.VITE_APP_BASE_API
// 图片上传到服务器的路径
const uploadURL = url+'user/userIcon'
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
    insertFn(url+'uploadFile/'+res.result.userIcon,"上传图片",url+'uploadFile/'+res.result.userIcon)
  }
}

// 定义事件
const emit = defineEmits(['closeEditCourseForm','success'])

// 按钮状态
const subLoading = ref(false)
// 表单数据对象
const formCourse = reactive({
  id: 0,
  CourseName: '',
  CourseNumber: '',
  bedType: '',
  broadband: '免费wifi',
  standardPrice: '',
  memberPrice: '',
  CourseTypeId: '',
  floorId: '',
  coverImg: '',
  remarks: ''
})
// 获取父组件传过来的CourseInfo对象
const props = defineProps(['CourseInfo'])
const CourseInfo = ref(props.CourseInfo)
// 给表单填充数据
for (const key in formCourse) {
  formCourse[key] = CourseInfo.value[key]
}

// 处理回显封面
const fileList = ref<UploadUserFile[]>([
    {
      name: '封面图',
      url: url+'uploadFile/'+formCourse.coverImg
    }
])

// 更新房间信息
const editCourse = async (formEl: FormInstance |undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=> {
    subLoading.value = true
    if(valid){
      const { data } = await editCourseApi(formCourse)
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
// 定义房间类型下拉框选择项
const CourseTypeOptions = ref<object[]>([])
// 获取所有房间类型信息
const getAllCourseTypeList = async ()=> {
  const { data } = await getAllCourseTypeListApi()
  CourseTypeOptions.value = data.result
}
// 定义楼层下拉框选择项
const floorOptions = ref<object[]>([])

onMounted(()=> {
  getAllCourseTypeList()
})
// 取消表单
const close = ()=>{
  emit('closeEditCourseForm')
}
</script>

<style scoped>
.dialog-button-wrap {
  text-align: center;
  margin-top: 20px;
}
</style>
