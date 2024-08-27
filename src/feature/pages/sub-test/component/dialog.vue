<route  lang="json" type="page">
    {
      "style": {
        "navigationBarTitleText": "子包测试页-弹窗",
         "backgroundColorTop":"#000000"
     }
    }
  </route>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0,
  },
  number: {
    type: Number,
    default: 0,
  },

})
const emit = defineEmits<{
  'update:modelValue': [number]
  'update:number': [number]
}>()
const data = useVModel(props, 'modelValue', emit)
const number = useVModel(props, 'number', emit)
function handleClick() {
  data.value--
  number.value--
}
</script>

<template>
  <view>
    子包测试页-Dialog2 ---
    {{ data }}---{{ number }}

    <button @click="handleClick">
      子组件修改 - 1
    </button>
  </view>
</template>

  <style>

  </style>
