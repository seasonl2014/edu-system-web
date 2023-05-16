import { defineStore } from 'pinia'
export const useStudentStore = defineStore({
    id: 'studentStore',
    state: ()=> {
        return {
            // 学员登录token
            studentToken: '',
            // 登录学员信息
            studentInfo: {
                studentIcon: '',
                phone: '',
                name: '',
                loginName: ''
            }
        }
    },
    getters: {},
    actions: {
        // 设置学员登录token
        setStudentToken(token:string){
            this.studentToken = token
        },
        // 设置登录学员的信息
        setStudentInfo(studentInfo: any){
            this.studentInfo = studentInfo
        },
        // 更新部分学员信息
        setStudentPartInfo(studentInfo:any){
            this.studentInfo.studentIcon = studentInfo.studentIcon
            this.studentInfo.name = studentInfo.name
        },
    },
    persist: true
})
