<script setup lang="ts">

</script>

<template>
  <view class="flex items-center h-full justify-center text-primary">
    This is a
    <navigator url="/feature/pages/sub-test/index">
      /feature/pages/sub-test/index
    </navigator>
    <bottom-button-group>
      1
    </bottom-button-group>
  </view>
</template>

<route  lang="json" type="home">
  {
    "style": { "navigationBarTitleText": "template-uni-app" }
  }
</route>
