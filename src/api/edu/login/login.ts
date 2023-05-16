// 会员登录
import request from "@/api/request";

export function loginApi(data: object) {
    return request({
        url: 'edu/front/login',
        method: 'post',
        data
    })
}
