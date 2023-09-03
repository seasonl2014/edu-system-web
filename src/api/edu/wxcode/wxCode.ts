import request from "@/api/request";

// 获取微信支付配置信息
export function getWxCodeInfoApi() {
    return request({
        url: 'wxCode',
        method: 'get'
    })
}

// 保存微信支付配置信息
export function saveWxCodeApi(data:object) {
    return request({
        url: 'wxCode',
        method: 'post',
        data
    })
}
