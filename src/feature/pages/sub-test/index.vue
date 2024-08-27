<route  lang="json" type="page">
    {
      "style": { "navigationBarTitleText": "子包测试页" }
    }
  </route>

<script setup lang="ts">
import Dialog from './component/dialog.vue'

const content = ref(1)
const number = ref(999)
function handleClick() {
  content.value++
  number.value++
}
</script>

<template>
  <view>
    子包测试页

    <view>
      <Dialog v-model="content" v-model:number="number" />
    </view>

    <button class="mt-20" @click="handleClick">
      父组件修改 + 1
    </button>
  </view>
</template>

  <style>

  </style>
