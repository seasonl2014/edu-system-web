import request from "@/api/request";

// 创建代金券批次
export function createCouponStockApi(data:object) {
    return request({
        url: 'coupon',
        method: 'post',
        data
    })
}
// 获取代金券列表数据
export function getListApi(params: object){
    return request({
        url: 'coupon',
        method: 'get',
        params
    })
}

// 生成代金券批次
export function generateCouponStockApi(id:number) {
    return request({
        url: `coupon/generate/${id}`,
        method: 'post'
    })
}

// 生成代金券批次
export function sendCouponApi(params:object) {
    return request({
        url: `coupon/send`,
        method: 'post',
        params
    })
}
// 启动激活指定代金券批次事件
export function startStockApi(id:number) {
    return request({
        url: `coupon/start/${id}`,
        method: 'post'
    })
}

// 查询指定批次详情
export function queryStockApi(id:number) {
    return request({
        url: `coupon/stock/query/${id}`
    })
}

// 根据批次编号查询对应的发送的代金券列表数据
export function viewCouponByStockIdApi(stockNo:number,params:object) {
    return request({
        url:`coupon/stock/view/${stockNo}`,
        method: 'get',
        params
    })
}
