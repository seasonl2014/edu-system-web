import request from "@/api/request";

export function getListApi(params:object) {
    return request({
        url: 'edu/front/list/get',
        method: 'get',
        params
    })
}
