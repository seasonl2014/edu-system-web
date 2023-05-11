import { defineStore } from 'pinia'
import router from "../../router";
export const useTagsViewStore = defineStore({
    id: 'tagsViewState',
    state: ()=> ({
        activeTabsValue: '',
        visitedViews: [{path: '/home',name: 'home',meta: { title: '首页',affix: true},title: '首页'}]
    }),
    getters: {},
    actions: {
        setTabsMenuValue(val:string){
            this.activeTabsValue = val
        },
        addVisitedView(view){
            this.setTabsMenuValue(view.path)
            if (this.visitedViews.some(v => v.path === view.path)) return
            this.visitedViews.push(
                Object.assign({}, view, {
                    title: view.meta.title || 'no-name'
                })
            )
        },
        addView(view:any) {
            this.addVisitedView(view)
        },
        delView(activeTabPath){
            return new Promise(resolve => {
                this.delVisitedView(activeTabPath)
                resolve({
                    visitedViews: [...this.visitedViews]
                })
            })
        },
        delVisitedView(path){
            return new Promise(resolve => {
                this.visitedViews = this.visitedViews.filter(v=> {
                    return (v.path!==path||v.meta.affix)
                })
                resolve([...this.visitedViews])
            })
        },
        delOtherViews(path){
            this.visitedViews = this.visitedViews.filter(item => {
                return item.path === path || item.meta.affix
            })
        },
        delAllViews(){
            return new Promise((resolve)=> {
                this.visitedViews = this.visitedViews.filter(v=> v.meta.affix)
                resolve([...this.visitedViews])
            })
        },
        goHome() {
            this.activeTabsValue='/home'
            router.push({path: '/home'})
        }
    }
})
