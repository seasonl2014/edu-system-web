import axios from 'axios'
import {useMemberStore} from "../store/modules/member";
import {useUserStore} from "../store/modules/user";
// 获取会员在pinia对象
const { memberToken } = useMemberStore()
// 获取系统用户在pinia对象
const { token } = useUserStore()
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,
    timeout: 100000,
    // 自定义请求头
    headers: {'memberToken': memberToken,'userToken': token},
})
export default service
