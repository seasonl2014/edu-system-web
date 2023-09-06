import request from "@/api/request";

// 获取退款记录列表数据
export function getListApi(params:object) {
    return request({
        url: 'refund',
        method: 'get',
        params
    })
}
