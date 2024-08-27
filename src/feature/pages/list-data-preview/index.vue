<route  lang="json">
    {
      "style": { "navigationBarTitleText": "列表预览" }
    }
  </route>

<script setup lang="ts">
import { listGen } from '@/api/list-data-preview'

const router = useRouter()

const [state, actions] = useListData(listGen, {
  filter() {
    return {
    }
  },
})

function handleDetail(item: Api.GenModel) {
  router.push('/feature/pages/list-data-preview/detail', { id: item.tableId })
}

console.log(state, actions, 'listGen')
</script>

<template>
  <view class="h-full w-full container">
    <list-data
      :actions="actions"
      :state="state"
    >
      <view
        v-for="(item, index) in state.list"
        :key="index"
        class="list-data-item border-rd-8 "
      >
        <view class="info-item flex justify-between items-center">
          <!-- <text class="text-black-2 text-medium">
            表名称 --- {{ item.tableName }}
          </text> -->

          <text class="text-black-2 text-medium">
            {{ item.tableName }} - {{ item.functionName }}
          </text>

          <view>
            <button type="primary" class="detail-btn" @click="handleDetail(item)">
              详情
            </button>
          </view>
        </view>
      </view>
    </list-data>
  </view>
</template>

<style scoped lang="scss">
.container {
  background: #f8f8f8;
}
.info-item {
  height: 100rpx;
  // border: 2rpx solid #000;
}
.border-rd-8 {
  border-radius: 8rpx;
}
.list-data-item {
  background-color: #fff;
  padding: 20rpx;
}
// #f8f8f8
.detail-btn {
  font-size: 16px;
}
</style>
