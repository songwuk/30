<script setup lang="ts">
/**
 * description: share
 * desgin from {@link https://codepen.io/GreenSock/pen/qBWjOMK}
 */
import { gsap } from 'gsap'
import type { TweenLite } from 'gsap'
const lightColor = ['#ff8177', '#ff867a', '#ff8c7f', '#cf556c', '#f99185', '#b12a5b']
const clickNum = ref<number>(-1)
const numBoxes = ref<number>(100)
const theme = ref('#ff8177')
let tween: null | TweenLite = null
watchEffect(() => {
  const nameColor = lightColor[Math.floor(Math.random() * 3)]
  tween = gsap.to('.box', 1, {
    scale: 0.1,
    y: 60,
    yoyo: true,
    repeat: 1,
    ease: 'power1.inOut',
    delay: 0.1,
    stagger: {
      amount: 1.5,
      grid: 'auto',
      from: clickNum.value,
    },
    backgroundColor: nameColor,
    onComplete: () => {
      theme.value = nameColor
    },
  })
})

function clickTween(idx: number) {
  clickNum.value = idx
}
</script>

<template lang="pug">
div#dayone
  <h2 my2>click box</h2>
      .box.green(v-for="item,index in numBoxes" @click.stop='clickTween(index)' :class="{'c-black':true,'dark:c-white':true}") {{item}}
</template>

<style>
body {
  margin: 10px;
}
#dayone {
  max-width: 600px;
  margin: auto;
}
.box {
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  background: v-bind(theme);
  margin: 0px 1.5% 1.5% 0px;
  border-radius: 0;
  display: inline-block;
  cursor: pointer;
}
</style>
