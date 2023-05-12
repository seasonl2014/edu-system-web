import request from "@/api/request";

// 获取课程类型列表数据
export function getCategoryTreeApi(params:object) {
    return request({
        url: 'subject/categoryTree',
        method: 'get',
        params
    })
}

// 新增课程类型
export function addSubjectApi(data:object) {
    return request({
        url: 'subject',
        method: 'post',
        data
    })
}
// 根据ID获取课程类型信息
export function getSubjectApi(id:number) {
    return request({
        url: `subject/${id}`,
        method: 'get'
    })
}
// 更新课程类型信息
export function editSubjectApi(data:object) {
    return request({
        url: 'subject',
        method: 'put',
        data
    })
}
// 删除课程类型
export function delSubjectApi(id: number) {
    return request({
        url: `subject/${id}`,
        method: 'delete'
    })
}

// 新增或修改表单获取课程分类树形数据
export function getParentCategoryListApi() {
    return request({
        url: 'subject/getParentEduSubjectTreeNode',
        method: 'get'
    })

}
