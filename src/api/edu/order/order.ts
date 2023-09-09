import request from "@/api/request";

// 获取课程订单明细列表
export function getOrderCourseListApi(params:object) {
    return request({
        url: 'order/course',
        method: 'get',
        params
    })
}

// 获取课程订单详情信息
export function getCourseOrderInfoApi(id:number) {
    return request({
        url: `order/course/${id}`,
        method: 'get',
    })
}

// 课程订单退款
export function refundCourserOrderApi(data:object) {
    return request({
        url: 'order/course',
        method: 'post',
        data
    })
}

// 获取VIP订单明细列表
export function getOrderVipListApi(params:object) {
    return request({
        url: 'order/vip',
        method: 'get',
        params
    })
}

// 获取VIP订单详情信息
export function getVipOrderInfoApi(id:number) {
    return request({
        url: `order/vip/${id}`,
        method: 'get',
    })
}

// VIP订单退款
export function refundVipOrderApi(data:object) {
    return request({
        url: 'order/vip',
        method: 'post',
        data
    })
}
