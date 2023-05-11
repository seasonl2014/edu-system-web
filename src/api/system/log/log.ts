
// 获取日志列表数据
import request from "../../request"

export function getLogListApi(params:object) {
    return request({
        url: 'log',
        method: 'get',
        params

    })
}
