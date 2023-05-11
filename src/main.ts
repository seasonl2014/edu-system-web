import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router"
import pinia from "./store";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 导入所有element-plus图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// svg-icons注册导入
import 'virtual:svg-icons-register'
import SvgIcon from "./components/SvgIcon/index.vue"
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
const app = createApp(App)
app.use(router)
app.use(pinia)
// 将所有图标进行全局注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus,{
    locale:zhCn
})
app.component('svg-icon',SvgIcon)

app.mount('#app')
