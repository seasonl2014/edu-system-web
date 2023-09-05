import request from "@/api/request";

// 获取微信支付配置信息
export function getSmsInfoApi() {
    return request({
        url: 'sms',
        method: 'get'
    })
}

// 保存微信支付配置信息
export function saveSmsApi(data:object) {
    return request({
        url: 'sms',
        method: 'post',
        data
    })
}
