import request from "@/api/request";

// 获取微信支付配置信息
export function getWxPayInfoApi() {
    return request({
        url: 'wxPay',
        method: 'get'
    })
}

// 保存微信支付配置信息
export function saveWxPayApi(data:object) {
    return request({
        url: 'wxPay',
        method: 'post',
        data
    })
}
