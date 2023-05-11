import request from "@/api/request";

// 获取VIP类型列表数据
export function getVipTypeListApi(params:object) {
    return request({
        url: 'vipType',
        method: 'get',
        params
    })
}

// 新增VIP类型信息
export function addVipTypeApi(data:object) {
    return request({
        url: 'vipType',
        method: 'post',
        data
    })
}

// 根据ID获取VIP类型详情信息
export function getVipTypeApi(id:number) {
    return request({
        url: `vipType/${id}`,
        method: 'get'
    })
}
// 更新VIP类型信息
export function editVipTypeApi(data:object) {
    return request({
        url: 'vipType',
        method: 'put',
        data
    })
}

// 删除VIP类型信息
export function delVipTypeApi(id:number) {
    return request({
        url: `vipType/${id}`,
        method: 'delete'
    })
}
