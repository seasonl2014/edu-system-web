import request from "@/api/request";

// 获取微信支付配置信息
export function getOssInfoApi() {
    return request({
        url: 'aliOss',
        method: 'get'
    })
}

// 保存微信支付配置信息
export function saveOssApi(data:object) {
    return request({
        url: 'aliOss',
        method: 'post',
        data
    })
}
