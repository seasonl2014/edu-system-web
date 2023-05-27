import request from "@/api/request";

// 获取教师列表数据
export function getTeacherListApi(params:object) {
    return request({
        url: 'teacher',
        method: 'get',
        params

    })
}

// 新增教师信息
export function addTeacherApi(data:Object) {
    return request({
        url: 'teacher',
        method: 'post',
        data
    })
}
// 获取所有课程列表
export function getAllUserListApi() {
    return request({
        url: 'user/all',
        method: 'get'
    })
}
// 获取所有讲师
export function getAllTeacherListApi(){
    return request({
        url: 'teacher/all',
        method: 'get'
    })
}
// 根据ID获取教师详情信息
export function getTeacherApi(id:number) {
    return request({
        url: `teacher/${id}`,
        method: 'get'
    })
}
// 更新教师信息
export function editTeacherApi(data:object) {
    return request({
        url: 'teacher',
        method: 'put',
        data
    })
}

// 删除教师信息
export function deleteTeacherApi(id:number) {
    return request({
        url: `teacher/${id}`,
        method: 'delete'
    })
}
