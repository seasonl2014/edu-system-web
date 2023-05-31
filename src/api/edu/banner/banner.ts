import request from "@/api/request";

/**
 * 获取列表数据
 * @param params
 */
export function getBannerListApi(params:object) {
    return request({
        url: 'banner',
        method: 'get',
        params
    })
}

/**
 * 根据ID获取数据
 */
export function getBannerApi(id:number) {
    return request({
        url: `banner/${id}`,
        method: 'get'
    })
}
// 更新轮播图信息
export function editBannerApi(data:object) {
    return request({
        url:'banner',
        method: 'put',
        data
    })
}
// 新增轮播图信息
export function addBannerApi(data:object) {
    return request({
        url:'banner',
        method: 'post',
        data
    })
}
