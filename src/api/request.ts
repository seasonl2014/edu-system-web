import axios from 'axios'
import {useStudentStore} from "../store/modules/student";
import {useUserStore} from "../store/modules/user";
// 获取会员在pinia对象
const { studentToken } = useStudentStore()
// 获取系统用户在pinia对象
const { token } = useUserStore()
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 36000000,
    // 自定义请求头
    headers: {'studentToken': studentToken,'userToken': token},
})
export default service
