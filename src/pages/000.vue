<script lang="ts" setup>
onMounted(() => {
  const canvas = document.querySelector('.canvas') as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx.fillStyle = 'red'
  ctx.fillRect(0, 0, 150, 150)

  ctx.fillStyle = 'blue'
  ctx.arc(230, 50, 50, 0, Math.PI * 2, true)
  ctx.fill()

  ctx.beginPath()
  ctx.fillStyle = 'green'
  ctx.moveTo(320, 25)
  ctx.lineTo(475, 25)
  ctx.lineTo(320, 105)

  ctx.fill()
})
</script>

<template>
  <canvas class="canvas" />
</template>
