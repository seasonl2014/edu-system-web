import request from "@/api/request";

// 根据课程ID获取课程详情
export function getCourseDetailApi(id:number) {
    return request({
        url: `/edu/front/detail/${id}`,
        method: 'get'
    })
}
// 根据课程ID获取相应的开发环境参数数据
export function getParamListByCourseIdApi(courseId:number) {
    return request({
        url: `/edu/front/detail/getParamListByCourseId/${courseId}`,
        method: 'get'
    })
}
// 根据课程ID获取相应的课程大纲数据
export function getChapterListByCourseIdApi(courseId:number) {
    return request({
        url: `/edu/front/detail/getChapterListByCourseId/${courseId}`,
        method: 'get'
    })
}

// 根据课程ID获取课程资料数据
export function getCourseDataByCourseIdApi(courseId:number) {
    return request({
        url: `/edu/front/detail/getCourseDataByCourseId/${courseId}`,
        method: 'get'
    })
}


// 根据视频Id获取播放凭证
export function getPlayAuthDataApi(vodId:string) {
    return request({
        url: `/edu/front/detail/getPlayAuth/${vodId}`
    })
}

// 学员购买课程
export function studyCourseApi(courseId:number) {
    return request({
        url: `/edu/front/detail/buy/${courseId}`,
        method: 'post'
    })
}
// 根据订单编号获取课程订单详情
export function getCourseOrderInfoApi(orderNo:string) {
    return request({
        url: `/edu/front/detail/getCourseOrderInfo/${orderNo}`
    })
}

// 购买课程支付
export function payBuyCourseApi(orderNo:string) {
    return request({
        url: `/edu/front/detail/pay/${orderNo}`,
        method: 'post'
    })
}

// 点击下载课程资料
export function downloadCourseDataApi(courseDataId:number) {
    return request({
        url: `/edu/front/detail/download/${courseDataId}`
    })
}
