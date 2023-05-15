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

// 根据视频Id获取播放凭证
export function getPlayAuthDataApi(vodId:string) {
    return request({
        url: `/edu/front/detail/getPlayAuth/${vodId}`
    })
}
