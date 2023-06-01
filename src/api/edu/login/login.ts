// 会员登录
import request from "@/api/request";

export function loginApi(data: object) {
    return request({
        url: 'edu/front/login',
        method: 'post',
        data
    })
}
// 找回密码发送短信验证码
export function sendSmsApi(phone:string) {
    return request({
        url: `edu/front/findPwd/sendSms/${phone}`,
        method: 'post'
    })
}
// 保存更改密码
export function savePassWordApi(data:object) {
    return request({
        url: 'edu/front/saveFindPassWord',
        method:'put',
        data
    })
}
