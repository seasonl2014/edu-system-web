import { defineStore } from 'pinia'

export const useRoomStore = defineStore({
    id: 'roomState',
    state: ()=> ({
        // 关键字搜索
        keywords: ''
    }),
    getters: {},
    actions: {
        // 切换Collapse
        setKeywords(keywords:string){
            this.keywords = keywords
        }
    }
})
