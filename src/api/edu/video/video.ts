import request from "@/api/request";

export function getVideoApi(videoId:number) {
    return request({
        url: `/edu/front/detail/video/${videoId}`,
        method: 'get'
    })
}

// 根据视频源ID获取视频信息
export function playVideoByVideoSourceIdApi(videoSourceId:string) {
    return request({
        url: `/edu/front/detail/getPlayAuth2/${videoSourceId}`,
        method: 'post'
    })
}
