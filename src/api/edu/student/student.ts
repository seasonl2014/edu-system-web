import request from "@/api/request";

// 获取学生列表数据
export function getStudentListApi(params:object){
    return request({
        url: 'student',
        method: 'get',
        params
    })
}

// 添加学生信息
export function addStudentApi(data:object) {
    return request({
        url: 'student',
        method: 'post',
        data
    })
}

// 获取所有班级列表
export function gradeClassListApi() {
    return request({
        url: 'gradeclass/all',
        method: 'get',
    })
}
// 根据id获取学生详情信息
export function getStudentApi(id: number) {
    return request({
        url: `student/${id}`,
        method: 'get'
    })
}
// 编辑学生信息
export function editStudentApi(data:object) {
    return request({
        url: 'student',
        method: 'put',
        data
    })
}
// 删除学生信息
export function deleteStudentApi(id: number) {
    return request({
        url: `student/${id}`,
        method: 'delete'
    })
}
