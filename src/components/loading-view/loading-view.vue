<script setup lang="ts">
import { createStringProp } from '@/utils/helpers'

// import base64 from '../loading/base64';

defineProps({
  title: createStringProp(' 加载中'),
})
</script>

<template>
  <view class="flex flex-col items-center justify-center">
    <image
      class="loading-img"
      src="/static/images/loading.png"
      mode="aspectFill"
    />
    <view
      v-if="title"
      class="text-black-2 flex-center loading-title"
    >
      {{ title }}
    </view>
  </view>
</template>

<style lang="scss">
.loading-img {
  width: 400rpx;
  height: 280rpx;
}

.loading {
  height: 34rpx;
  width: 34rpx;
  animation: loading 1s 0s linear infinite;
}

@keyframes loading {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.loading-title {
  margin-top: 20rpx;
}
</style>
