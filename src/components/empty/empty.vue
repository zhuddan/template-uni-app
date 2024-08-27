<script setup lang="ts">
import { createStringProp } from '@/utils/helpers'

defineProps({
  title: createStringProp('暂无数据...'),
})
defineEmits(['click'])
</script>

<template>
  <view class="flex flex-col items-center justify-center">
    <image
      class="empty-img"
      src="/static/images/empty.png"
      mode="aspectFill"
    />
    <view
      v-if="title"
      class="text-black-2 empty-title"
    >
      {{ title }}
    </view>

    <button
      type="primary"
      class="button"
      size="mini"
      @click="$emit('click')"
    >
      刷 新
    </button>
  </view>
</template>

<style lang="scss">
.empty-img {
  width: 400rpx;
  height: 280rpx;
}

.empty-title {
  margin-top: 20rpx;
}

.button {
  margin-top: 20rpx;
}
</style>
