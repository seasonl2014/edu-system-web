<template>
  <div id="J_prismPlayer" class="prism-player" />
</template>

<script setup lang="ts">
import {  onMounted, ref } from 'vue'
const props = defineProps(['videoInfo','visible'])
// 定义事件
const emit = defineEmits(['onCancel'])
const onCancel = ()=> {
  emit('onCancel')
}
const player = ref<any>()
const creatAliplayer = () => {
  player.value = new window.Aliplayer({
    id: 'J_prismPlayer',
    autoplay: true,
    width: '100%',
    vid: props.videoInfo.videoSourceId,
    playauth: props.videoInfo.playAuth,
    cover: 'http://picture.xueden.cn/moyuplaylogo.jpg'
  }, function(player: any) {
    console.log('播放器创建好了。')
  })
}
onMounted(() => {
  creatAliplayer()
})
</script>

<style scoped>

</style>
