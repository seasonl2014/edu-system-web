import request from "@/api/request";

export function getIndexColumnCoursesApi() {
    return request({
        url: 'edu/front/index/getIndexColumnCourses',
        method: 'get'
    })
}
// 获取首页幻灯片
export function getBannerListApi(params:object) {
    return request({
        url:'edu/front/index/getBanner',
        method: 'get',
        params
    })
}
// 获取课程列表
export function findIndexCourseListApi(params:object) {
    return request({
        url: 'edu/front/index/findIndexCourseList',
        method: 'get',
        params
    })
}
