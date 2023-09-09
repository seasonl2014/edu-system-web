import request from "@/api/request";

// 获取学生列表数据
export function getStudentListApi(params:object){
    return request({
        url: 'student',
        method: 'get',
        params
    })
}

// 添加学生信息
export function addStudentApi(data:object) {
    return request({
        url: 'student',
        method: 'post',
        data
    })
}

// 获取所有班级列表
export function gradeClassListApi() {
    return request({
        url: 'gradeclass/all',
        method: 'get',
    })
}
// 根据id获取学生详情信息
export function getStudentApi(id: number) {
    return request({
        url: `student/${id}`,
        method: 'get'
    })
}
// 编辑学生信息
export function editStudentApi(data:object) {
    return request({
        url: 'student',
        method: 'put',
        data
    })
}
// 删除学生信息
export function deleteStudentApi(id: number) {
    return request({
        url: `student/${id}`,
        method: 'delete'
    })
}

/**
 * 前台获取个人信息
 */
export function getStudentInfoApi() {
    return request({
        url: '/edu/front/student/center/info',
        method: 'get'
    })
}

/**
 * 前台更新学员个人信息
 */
export function updateApi(data: object) {
    return request({
        url: 'edu/front/student/center/update',
        method: 'post',
        data
    })
}

// 获取学员我的课程
export function getMyCourseListApi(params: object) {
    return request({
        url: 'edu/front/student/center/getMyCourseList',
        method: 'get',
        params
    })
}
// 获取购买VIP记录
export function getBuyVipListApi() {
    return request({
        url: 'edu/front/student/center/getMyVipList',
        method: 'get'
    })
}

// 获取我的优惠券记录
export function getMyCouponListApi(params:object) {
    return request({
        url: 'edu/front/student/center/getMyCouponList',
        method: 'get',
        params
    })
}

// 获取邮箱验证码
export function sendEmailApi(email:string) {
    return request({
        url: 'user/sendEmail',
        method: 'get',
        params: {
            email
        }
    })
}
// 更改绑定邮箱
export function bindEmailApi(email:string,code:string) {
    return request({
        url: 'edu/front/student/center/bindEmail',
        method: 'put',
        params: {
            email,
            code
        }
    })
}

// 发送短信验证码
export function sendSmsApi(phone:string) {
    return request({
        url: `edu/front/student/center/sendSms/${phone}`,
        method: 'post'
    })
}
// 更新手机号
export function bindPhoneApi(phone:string,phoneCode:string) {
    return request({
        url: 'edu/front/student/center/updatePhone',
        method: 'put',
        params: {
            phone,
            phoneCode
        }
    })
}

// 更新密码
export function savePassWordApi(data:object) {
    return request({
        url: 'edu/front/student/center/savePassWord',
        method: 'put',
        data
    })
}

// 获取公众号二维码
export function getQrcodeApi() {
    return request({
        url: 'edu/front/student/center/getQrcode',
        method: 'get'
    })
}
