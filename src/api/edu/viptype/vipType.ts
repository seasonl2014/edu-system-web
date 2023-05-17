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

// 前台获取首页VIP类型
export function getAllVipApi() {
    return request({
        url: 'vipType/getAllVip',
        method: 'get'
    })
}
// 前台购买VIP会员
export function buyVipApi(id:number) {
    return request({
        url: `vipType/buyVip/${id}`,
        method: 'get'
    })
}

// 前台根据订单编号获取订单信息
export function getOrderInfoApi(orderNo:string) {
    return request({
        url: `vipType/getOrderInfo/${orderNo}`,
        method: 'get'
    })
}
// 去支付
export function payBuyApi(orderNo:string) {
    return request({
        url: `vipType/payBuy/${orderNo}`,
        method: 'get'
    })
}
