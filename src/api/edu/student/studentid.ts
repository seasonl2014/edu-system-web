import request from "@/api/request";

// 获取课程列表数据

export function getStudentIdListApi(params: object){
    return request({
        url: 'studentId',
        method: 'get',
        params
    })
}

// 添加学生学号信息
export function addStudentIdApi(data:object) {
    return request({
        url: 'studentId',
        method: 'post',
        data
    })
}

// 根据ID获取课程详情信息
export function getStudentIdApi(id:number) {
    return request({
        url: `studentId/${id}`,
        method: 'get'
    })
}

// 更新课程信息
export function editStudentIdApi(data:object) {
    return request({
        url: 'studentId',
        method: 'put',
        data
    })
}

// 删除课程信息
export function deleteStudentIdApi(id:number) {
    return request({
        url: `studentId/${id}`,
        method: 'delete'
    })
}
