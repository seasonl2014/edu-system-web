import request from "@/api/request"
// 获取课程列表数据
export function getCourseListApi(params:object) {
    return request({
        url: 'course',
        method: 'get',
        params
    })
}
// 新增课程信息
export function addCourseApi(data:object) {
    return request({
        url: 'course',
        method: 'post',
        data
    })
}
// 获取所有课程类型列表
export function getAllCourseTypeListApi() {
    return request({
        url: 'course/all',
        method: 'get'
    })
}


// 根据ID获取课程详情信息
export function getCourseApi(id:number) {
    return request({
        url: `course/${id}`,
        method: 'get'
    })
}
// 更新课程信息
export function editCourseApi(data:object) {
    return request({
        url: 'course',
        method: 'put',
        data
    })
}
// 删除课程信息
export function delCourseApi(id:number) {
    return request({
        url: `course/${id}`,
        method: 'delete'
    })
}
// 统计课程数量
export function countCourseApi() {
    return request({
        url: 'course/count',
        method: 'get'
    })
}

// 更改课程状态
export function updateStatusApi(courseId:number,status:string) {
    return request({
        url: 'course/updateStatus',
        method: 'put',
        params: {
            courseId,
            status
        }
    })
}

// 设置课程开发环境参数
export function setEnvironmenApi(data:object) {
    return request({
        url: 'course/saveOrUpdateEnvironmen',
        method: 'post',
        data
    })
}

// 根据课程ID获取环境参数列表数据
export function getEnvironmenListApi(courseId:number) {
    return request({
        url: `course/getEnvironmenList/${courseId}`,
        method: 'get'
    })
}

// 获取课程资料
export function getCourseDataListApi(courseId:number) {
    return request({
        url: `course/getCourseDataList/${courseId}`,
        method: 'get'
    })
}

// 保存课程配套资料
export function saveCourseDataApi(data:object) {
    return request({
        url: 'course/saveOrUpdateCourseData',
        method: 'post',
        data
    })
}

// 获取进度条数据
export function getPercentApi(fileKey:string) {
    return request({
        url: `aliVod/upload/getUploadPercent/${fileKey}`,
        method: 'get'
    })
}

// 获取树形课时
export function getChapterTreeListApi(params:object) {
    return request({
        url: 'course/chapterTree',
        method: 'get',
        params
    })
}
// 保存或更新课程大纲
export function setEduChapterApi(params:object) {
    return request({
        url: 'course/addEduChapter',
        method: 'post',
        params
    })
}

// 获取大章信息
export function getChapterApi(id:number) {
    return request({
        url: `course/chapter/${id}`,
        method: 'get'
    })
}

// 编辑课程小节
export function updateVideoApi(data:object) {
    return request({
        url: 'course/updateVideo',
        method: 'put',
        data
    })
}
// 删除课程大纲小节
export function delEduVideoApi(id:number) {
    return request({
        url: `course/delEduVideo/${id}`,
        method: 'delete'
    })
}

// 删除课程大纲大章
export function delEduChapterApi(id:number) {
    return request({
        url: `course/delEduChapter/${id}`,
        method: 'delete'
    })
}
// 根据课程小节ID获取信息
export function getVideoApi(id:number) {
    return request({
        url: `course/video/${id}`,
        method: 'get'
    })
}

//根据md5检查文件是否已经上传
export function checkMd5Api(md5:string) {
    return request({
        url: `aliVod/upload/check/${md5}`,
        method: 'get'
    })
}

// 保存分片数据
export function chunkApi(data:object) {
    return request({
        url: 'aliVod/upload/chunk',
        method: 'post',
        data
    })
}
