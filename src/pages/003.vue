<script setup lang="ts">
import * as PIXI from 'pixi.js'
const canvasRef = ref<HTMLElement | null>(null)
const app = new PIXI.Application({
  width: 800,
  height: 600,
  resolution: window.devicePixelRatio || 1, // 清晰度
})
// Capture the keyboard arrow keys
const left = keyboard('KeyA') // left
const right = keyboard('KeyD') // right
const jump = keyboard('KeyH') // jump
onMounted(() => {
  canvasRef.value!.appendChild(app.view)
  // load the texture we need
  const animationSpeed = 0.11
  const scale = 1.4
  const mega_man = PIXI.Sprite.from('/003/mega_man/stand/sprite6.png') // mega_man
  mega_man.anchor.set(0.5)
  mega_man.scale.x = scale
  mega_man.scale.y = scale
  app.loader.add('sprite_start', '003/mega_man/start/sprite_start.json') // start
  app.loader.add('sprite_stand', '003/mega_man/stand/sprite_stand.json') // stand
  app.loader.add('sprite_run1', '003/mega_man/run/1/sprite_run.json') // run -left -right

  app.loader.add('sprite_jump', '003/mega_man/jump/1/sprite_jump.json') // jump
  app.loader.load((_loader, _resources) => {
    const startMegaMan = []
    for (let i = 0; i < 9; i++) {
      const texture = PIXI.Texture.from(`mega_man/start/sprite${i + 1}.png`)
      startMegaMan.push(texture)
    }
    const standMegaMan = []
    for (let index = 0; index < 6; index++) {
      const texture = PIXI.Texture.from(`sprite${index + 1}.png`)
      standMegaMan.push(texture)
    }

    const jumpMegaMan = []
    for (let index = 0; index < 5; index++) {
      const texture = PIXI.Texture.from(`sprite_jump${index + 1}.png`)
      jumpMegaMan.push(texture)
    }
    const jumpMegaManSprite = new PIXI.AnimatedSprite(jumpMegaMan)
    jumpMegaManSprite.x = app.screen.width / 3
    jumpMegaManSprite.y = app.screen.height / 3
    jumpMegaManSprite.anchor.set(0.5)
    jumpMegaManSprite.animationSpeed = animationSpeed
    jumpMegaManSprite.scale.x = scale
    jumpMegaManSprite.scale.y = scale

    const standMegaManSprite = new PIXI.AnimatedSprite(standMegaMan)
    standMegaManSprite.x = app.screen.width / 3
    standMegaManSprite.y = app.screen.height / 3
    standMegaManSprite.anchor.set(0.5)
    standMegaManSprite.animationSpeed = animationSpeed
    standMegaManSprite.scale.x = scale
    standMegaManSprite.scale.y = scale

    const startMegaManSprite = new PIXI.AnimatedSprite(startMegaMan)
    startMegaManSprite.x = app.screen.width / 3
    startMegaManSprite.y = app.screen.height / 3
    startMegaManSprite.anchor.set(0.5)
    startMegaManSprite.animationSpeed = animationSpeed
    startMegaManSprite.scale.x = scale
    startMegaManSprite.scale.y = scale
    startMegaManSprite.play()

    startMegaManSprite.onLoop = () => {
      startMegaManSprite.destroy()
      standMegaManSprite.play()
      app.stage.addChild(standMegaManSprite)
    }

    const runMegaMan = []
    for (let i = 0; i < 10; i++) {
      const texture = PIXI.Texture.from(`sprite_run${i + 1}.png`)
      runMegaMan.push(texture)
    }

    const runMegaManSprite = new PIXI.AnimatedSprite(runMegaMan)
    runMegaManSprite.x = app.screen.width / 3
    runMegaManSprite.y = app.screen.height / 3
    runMegaManSprite.animationSpeed = animationSpeed
    runMegaManSprite.anchor.set(0.5)
    runMegaManSprite.scale.x = scale
    runMegaManSprite.scale.y = scale
    runMegaManSprite.play()

    standMegaManSprite.onLoop = () => {
      mega_man.x = standMegaManSprite.x
      mega_man.y = standMegaManSprite.y
      standMegaManSprite.destroy()
      app.stage.addChild(mega_man, runMegaManSprite, jumpMegaManSprite)
      runMegaManSprite.visible = false
      runMegaManSprite.stop()
      jumpMegaManSprite.visible = false
    }
    // Left arrow key `press` method
    left.press = () => {
      runMegaManSprite.scale.x = -scale
      runMegaManSprite.x += -runSpeed1.speedUp()
      runMegaManSprite.y += 0
      runMegaManSprite.play()
      mega_man.visible = false
      runMegaManSprite.visible = true
      // Change the cat's velocity when the key is pressed
    }
    // jump
    jump.press = () => {
      jumpMegaManSprite.visible = true
      mega_man.visible = false
      jumpMegaManSprite.x = runMegaManSprite.x
      jumpMegaManSprite.y = runMegaManSprite.y

      if (runMegaManSprite.scale.x < 0)
        jumpMegaManSprite.scale.x = -scale
      else
        jumpMegaManSprite.scale.x = scale

      jumpMegaManSprite.play()
    }
    jump.release = () => {
      if (!left.isDown) {
        jumpMegaManSprite.onLoop = () => {
          console.log('finish!')
          jumpMegaManSprite.visible = false
          jumpMegaManSprite.stop()
          mega_man.visible = true
        }
      }
    }
    // Left arrow key `release` method
    left.release = () => {
      // If the left arrow has been released, and the right arrow isn't down,
      // and the cat isn't moving vertically:
      // Stop the cat
      if (!right.isDown) {
        mega_man.visible = true
        runMegaManSprite.visible = false
        runMegaManSprite.stop()
        mega_man.scale.x = -scale
        mega_man.x = runMegaManSprite.x
        mega_man.y = runMegaManSprite.y
        runMegaManSprite.x += 0
        runSpeed1.release()
      }
    }

    // Right
    right.press = () => {
      mega_man.visible = false
      runMegaManSprite.visible = true
      runMegaManSprite.scale.x = scale
      runMegaManSprite.x += runSpeed1.speedUp()
      runMegaManSprite.y += 0
      runMegaManSprite.play()
    }
    right.release = () => {
      if (!left.isDown) {
        mega_man.visible = true
        runMegaManSprite.visible = false
        runMegaManSprite.stop()
        mega_man.scale.x = scale
        mega_man.x = runMegaManSprite.x
        mega_man.y = runMegaManSprite.y
        runMegaManSprite.x += 0
        runSpeed1.release()
      }
    }
    app.stage.addChild(startMegaManSprite)
    // app.ticker.add(() => {
    //   runMegaManSprite.rotation += 0.01
    // })
  })
})

onUnmounted(() => {
  left.unsubscribe()
  right.unsubscribe()
  jump.unsubscribe()
})
</script>

<template>
  <div flex="~ col" justify-center items-center>
    <div bg-gray w="100%" max-w-800px h-30>
      <p>[WASD] to move</p>
    </div>
    <div ref="canvasRef" max-w-800px ma />
  </div>
</template>

<style>
canvas {
    width: 100%;
    height: 100%;
}
</style>
