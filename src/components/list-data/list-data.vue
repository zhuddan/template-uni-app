<script setup lang="ts">
import type { ScrollViewOnRefresherabortEvent, ScrollViewOnRefresherpullingEvent, ScrollViewOnRefresherrefreshEvent, ScrollViewOnRefresherrestoreEvent, ScrollViewOnScrolltolowerEvent } from '@uni-helper/uni-app-types'
import { computed, ref, useSlots } from 'vue'
import { NAV_BAR_HEIGHT, getStatusBarHeight } from '../nav-bar/nav-bar'
import type { ListActions, ListDataState } from '@/composables/useListData'

import { getNumericValue, rpxToPx } from '@/utils/helpers'

const props = withDefaults(defineProps<{
  wrapperClass?: string
  height?: string | number
  withSearchBar?: boolean
  withNavbar?: boolean
  withTabBar?: boolean
  state: ListDataState
  actions: ListActions
  safeArea?: boolean
  refresherDisabled?: boolean
}>(), {
  wrapperClass: 'list-data-wrapper',
  safeArea: true,
  refresherDisabled: false,
})

const slots = useSlots()

const refresherTriggeredModel = computed({
  get() {
    return !!props.state?.refresherTriggered
  },
  set(value) {
    props.actions.setState('refresherTriggered', value)
  },
})

const height = computed(() => {
  if (props.height)
    return getNumericValue(props.height)
  const _searchBarHeight = props.withSearchBar ? ' - 120rpx' : ''
  const _statusBarHeight = props.withNavbar ? ` - ${getStatusBarHeight() + NAV_BAR_HEIGHT + 1}px` : ''
  const _tabBarHeight = props.withTabBar ? ' - 80rpx' : ''
  return `calc(100%${_statusBarHeight}${_tabBarHeight}${_searchBarHeight})`
})

const refresherEnabled = computed(() => {
  if (props.refresherDisabled)
    return false
  if (refresherTriggeredModel.value)
    return true
  if (props.state?.isEmpty)
    return false
  return !props.state.loading
})

const refresherStatus = ref<'continue' | 'ready' | 'loading'>('continue')
// const refresherStatusTitle = computed(() => {
//   const data: Record<typeof refresherStatus.value, string> = {
//     continue: '继续下拉刷新',
//     ready: '松开立即刷新',
//     loading: '正在刷新',
//   };
//   return data[refresherStatus.value];
// });

function handleRefresherrefresh(e: ScrollViewOnRefresherrefreshEvent) {
  props.actions.refresherrefresh()
  console.log(e, '下拉刷新被触发')
  refresherStatus.value = 'loading'
}
function handleRefresherpulling(e: ScrollViewOnRefresherpullingEvent) {
  const critical = rpxToPx(100)
  refresherStatus.value = e.detail.dy >= critical ? 'ready' : 'continue'
}
function handleRefresherrestore(e: ScrollViewOnRefresherrestoreEvent) {
  console.log(e, '下拉刷新被复位')
  refresherStatus.value = 'ready'
}
function handleRefresherabort(e: ScrollViewOnRefresherabortEvent) {
  console.log(e, '下拉刷新被中止')
  refresherStatus.value = 'ready'
}

function handleScrolltolower(e: ScrollViewOnScrolltolowerEvent) {
  console.log(e, 'scrolltolower ^^^^^^^^^^', '滚到底部')
  props.actions.getList()
}
</script>

<template>
  <scroll-view
    scroll-y
    :refresher-enabled="refresherEnabled"
    :refresher-triggered="refresherTriggeredModel"
    :refresher-threshold="rpxToPx(100)"
    :style="{ height }"
    refresher-background="#F8F8F8"
    @refresherrefresh="handleRefresherrefresh"
    @refresherpulling="handleRefresherpulling"
    @refresherrestore="handleRefresherrestore"
    @refresherabort="handleRefresherabort"
    @scrolltolower="handleScrolltolower"
  >
    <!--    <template #refresher>
      <view class="flex-center w-full refresher">
        <view class="icon-box flex-center">
          <view v-if="refresherStatus !== 'loading'" class="flex-center arrow-box" :class="[refresherStatus]">
            <iconfont name="arrow-down" size="28" />
          </view>
          <image v-else class="loading" :src="base64"></image>
        </view>
        <text class="text-sm ml-10">
          {{ refresherStatusTitle }}
        </text>
      </view>
    </template> -->
    <view
      v-if="state?.isEmpty"
      :style="{ height: '100%' }"
      class="empty-container-wrapper"
    >
      <slot
        v-if="slots.prefix"
        name="prefix"
      />

      <view class="empty-container">
        <template v-if="state?.loading">
          <slot
            v-if="slots.loading"
            name="loading"
          />
          <loading-view v-else />
        </template>

        <template v-else-if="state?.error">
          <slot
            v-if="slots.error"
            name="error"
          />
          <empty
            v-else
            title="加载失败，点击重试"
            @click="actions.onSearch"
          />
        </template>

        <template v-else>
          <slot
            v-if="slots.empty"
            name="empty"
          />
          <empty
            v-else
            title="暂无数据"
            @click="actions.onSearch"
          />
        </template>
      </view>
    </view>

    <template v-else>
      <slot
        v-if="slots.prefix"
        name="prefix"
      />

      <view
        class="list-data-wrapper-default"
        :class="[wrapperClass]"
      >
        <slot v-if="slots.default" />
      </view>

      <view v-if="state?.status === 'noMore'" class="text-center">
        {{ state?.error ? `加载失败 点击重试` : '没有更多数据了' }}
      </view>
      <view v-if="state?.status === 'more'" class="text-center">
        上拉显示更多
      </view>
      <view v-if="state?.status === 'loading'" class="text-center">
        正在加载...
      </view>
      <view
        v-if="safeArea"
        class="padding-bottom-safe w-full"
      />
    </template>
  </scroll-view>
</template>

<style lang="scss">
.empty-container-wrapper {
  display: flex;
  flex-direction: column;
}

.empty-container {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  // padding-top: 10%;
  box-sizing: border-box;
}

.refresher {
  height: 80rpx;
  padding-top: 20rpx;
  // background-color: red
}

.icon-box {
  height: 34rpx;
  width: 34rpx;
  @keyframes loading {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .loading {
    height: 28rpx;
    width: 28rpx;
    animation: loading 1s 0s linear infinite;
  }

  .arrow-box {
    transition: 0.31s all;
    transform: rotate(0deg);
  }

  .continue {
    transform: rotate(0deg);
  }

  .ready {
    transform: rotate(-180deg);
  }
}
</style>
