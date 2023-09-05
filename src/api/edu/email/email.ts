import request from "@/api/request";

// 获取微信支付配置信息
export function getEmailInfoApi() {
    return request({
        url: 'email',
        method: 'get'
    })
}

// 保存微信支付配置信息
export function saveEmailApi(data:object) {
    return request({
        url: 'email',
        method: 'post',
        data
    })
}
