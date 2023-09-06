import request from "@/api/request";

// 获取成交金额列表数据
export function getListApi(params:object) {
    return request({
        url: 'dealMoney',
        method: 'get',
        params
    })
}
