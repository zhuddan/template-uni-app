<route  lang="json">
    {
      "style": { "navigationBarTitleText": "日志详情" }
    }
  </route>

<script setup lang="ts">
import { getGen } from '@/api/list-data-preview'

const { data } = useDataDetail(getGen)
</script>

<template>
  <view class="h-full w-full container">
    日志详情 --- {{ data }}
  </view>
</template>

<style scoped lang="scss">

</style>
