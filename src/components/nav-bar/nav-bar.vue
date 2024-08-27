<script lang="ts" setup>
import { NAV_BAR_HEIGHT, getStatusBarHeight } from './nav-bar'

const props = withDefaults(defineProps<{
  title?: string
  isLeft?: boolean
  customClick?: boolean
  transparent?: boolean
}>(), {
  // backgroundColor: 'transparent',
  transparent: false,
  customClick: false,
})

const emit = defineEmits(['click'])

const statusBarHeight = ref(getStatusBarHeight())
const navbarStyle = computed(() => {
  return {
    'margin-top': `${statusBarHeight.value}px`,
    'height': `${NAV_BAR_HEIGHT}px`,
  }
})

const slots = useSlots()
function back() {
  if (props.customClick) {
    emit('click')
  }
  else {
    uni.navigateBack({})
  }
}

const touched = ref(false)

function handleTouchstart() {
  touched.value = true
}

function handleTouchend() {
  touched.value = false
}

const sysInfo = uni.getSystemInfoSync()
const x = sysInfo.windowWidth - 70
const y = sysInfo.windowHeight - 140
const showFab = ref(false)
onMounted(() => {
  showFab.value = true
})
onBeforeUnmount(() => {
  showFab.value = false
})
</script>

<template>
  <view
    class="uni-navbar"
    :class="{ transparent }"
  >
    <view
      class="uni-navbar-inner"
      :style="navbarStyle"
    >
      <view
        class="left-content"
        @click="back"
      >
        <iconfont
          name="left"
          :color="transparent ? '#fff' : 'inherit'"
        />
      </view>
      <view
        class="uni-navbar-content"
        :class="{ 'is-left': isLeft }"
      >
        <slot>{{ title }}</slot>
      </view>
      <view
        class="right-content"
        :color="transparent ? '#fff' : 'inherit'"
      >
        <slot
          name="right"
        />
      </view>
    </view>
  </view>

  <Teleport
    v-if="showFab && slots?.right "
    to="uni-page-body"
  >
    <movable-area
      class="h5-movable-area"
      :class="{ touched }"
    >
      <movable-view
        direction="all"
        :x="x"
        :y="y"
      >
        <view
          class="movable-area-btn"
          @touchstart="handleTouchstart"
          @touchend="handleTouchend"
        >
          <slot
            name="right"
          />
        </view>
      </movable-view>
    </movable-area>
  </Teleport>
</template>

<style lang="scss">
  .uni-icons {
  font-family: 'UniIconsFontFamily' !important;
  font-size: 22px;
  font-style: normal;
  color: #333;
}

.uni-navbar {
  border: 1px #eee solid;
  background-color: #fff;
  box-sizing: border-box;

  &.transparent {
    border-color: transparent;
    background-color: transparent;

    .uni-navbar-content {
      color: #fff;
    }
  }
}

.uni-navbar-inner {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.left-content,
.right-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 100%;
}

.uni-navbar-content {
  position: absolute;
  height: 100%;
  top: 0;
  bottom: 0;
  left: 45px;
  right: 45px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.is-left {
  justify-content: flex-start;
}

.h5-movable-area {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  z-index: 99;

  &:not(.touched) {
    pointer-events: none;
  }
}

.movable-area-btn {
  background-color: $uni-color-primary;
  width: 100rpx;
  height: 100rpx;
  border-radius: 100rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto !important;

  > .iconfont {
    color: #ffffff !important;
  }
}
</style>
