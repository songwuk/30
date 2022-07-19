<script setup lang="ts">
import * as PIXI from 'pixi.js'
const canvasRef = ref<HTMLElement | null>(null)
const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight / 2,
  resolution: window.devicePixelRatio || 1, // 清晰度
})
onMounted(() => {
  canvasRef.value!.appendChild(app.view)
  // load the texture we need
  // const bg = PIXI.Sprite.from('003/A2.png')
  // app.stage.addChild(bg)
  app.loader.add('sprite_start', '003/mega_man/start/sprite_start.json')
  app.loader.add('sprite_run1', '003/sprite_run1.json')
  app.loader.load((_loader, _resources) => {
    const explosionTextures = []
    for (let i = 0; i < 10; i++) {
      const texture = PIXI.Texture.from(`sprite_run/sprite${i}.png`)
      explosionTextures.push(texture)
    }
    const anim = new PIXI.AnimatedSprite(explosionTextures)
    anim.x = app.screen.width / 2
    anim.y = app.screen.height / 2
    anim.anchor.set(0.5)
    anim.animationSpeed = 0.18
    anim.scale.x = 0.2
    anim.scale.y = 0.2
    app.stage.buttonMode = true
    app.stage.interactive = true
    app.stage.on('pointerdown', (event) => {
      // eslint-disable-next-line no-console
      console.log(event)
    })
    // Capture the keyboard arrow keys
    const left = keyboard('ArrowLeft')
    const right = keyboard('ArrowRight')
    // Left arrow key `press` method
    left.press = () => {
      anim.scale.x = -0.2
      anim.x += -18
      anim.y += 0
      anim.play()
      // Change the cat's velocity when the key is pressed
    }

    // Left arrow key `release` method
    left.release = () => {
      anim.stop()
      // If the left arrow has been released, and the right arrow isn't down,
      // and the cat isn't moving vertically:
      // Stop the cat
      if (!right.isDown && anim.y === 0)
        anim.x += 0
    }

    // Right
    right.press = () => {
      anim.scale.x = 0.2
      anim.x += 18
      anim.y += 0
      anim.play()
    }
    right.release = () => {
      anim.stop()
      if (!left.isDown && anim.y === 0)
        anim.x += 0
    }
    app.stage.addChild(anim)
    // app.ticker.add(() => {
    //   anim.rotation += 0.01
    // })
  })
})
</script>

<template>
  <div ref="canvasRef" mt2 />
</template>

<style>
canvas {
    width: 100%;
    height: 100%;
}
</style>
