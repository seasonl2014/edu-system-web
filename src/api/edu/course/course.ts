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
