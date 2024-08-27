<script setup lang="ts">

</script>

<template>
  <view class="button-group-container fixed">
    <view class="button-group  pb-0 ">
      <slot />
    </view>
  </view>
</template>

<style lang="scss">
.button-group-container {
  background: white;
  overflow: hidden;

  &.fixed {
    position: fixed;
    bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    border-radius: 60rpx 60rpx 0 0;
    left: 0;
    right: 0;
    z-index: 2;
    box-shadow: 0 -4px 10px 0 rgba(0, 0, 0, 0.08);
  }
}

.button-group {
  box-shadow: 0 -8rpx 20rpx 0 rgba(0, 0, 0, 0.08);
  display: flex;
  padding: 20rpx 32rpx;
  box-sizing: border-box;

  :first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: 80rpx !important;
    border-bottom-left-radius: 80rpx !important;
  }

  :last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 80rpx !important;
    border-bottom-right-radius: 80rpx !important;
  }

  :deep(button) {
    height: 80rpx;
    margin: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 80rpx;
  }
}
</style>
