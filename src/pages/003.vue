<script setup lang="ts">
import * as PIXI from 'pixi.js'
import type { Texture } from 'pixi.js'
const canvasRef = ref<HTMLElement | null>(null)
const app = new PIXI.Application({
  width: 800,
  height: 600,
  resolution: window.devicePixelRatio || 1, // 清晰度
})
// Capture the keyboard arrow keys
const left = $ref(keyboard({ value: 'KeyA', isContinuously: true })) // left
const right = $ref(keyboard({ value: 'KeyD', isContinuously: true })) // right
const jump = $ref(keyboard({ value: 'KeyH' })) // jump
const baseHeight = $ref(app.screen.height / 3) // baseHeight
onMounted(() => {
  canvasRef.value!.appendChild(app.view)
  // load the texture we need
  const startMegaMan: Texture[] = []
  const standMegaMan: Texture[] = []
  const jumpMegaMan: Texture[] = []
  const runMegaMan: Texture[] = []
  const animationSpeed = 0.167
  const anchor = 0.5
  const scale = 1.4
  const mega_man = PIXI.Sprite.from('/003/mega_man/stand/sprite6.png') // mega_man
  mega_man.anchor.set(anchor)
  mega_man.scale.x = scale
  mega_man.scale.y = scale
  app.loader.add('sprite_start', '003/mega_man/start/sprite_start.json') // start
  app.loader.add('sprite_stand', '003/mega_man/stand/sprite_stand.json') // stand
  app.loader.add('sprite_run', '003/mega_man/run/1/sprite_run.json') // run -left -right
  // app.loader.add('sprite_slide', '003') // slide
  app.loader.add('sprite_jump', '003/mega_man/jump/1/sprite_jump.json') // jump
  app.loader.load((_loader, _resources) => {
    Object.entries(_resources).filter(_arr => !_arr[0].endsWith('image')).forEach(([_key, value]) => {
      Object.entries(value.textures!).forEach(([_k, v]) => {
        if (value.name === 'sprite_start')
          startMegaMan.push(v)
        else if (value.name === 'sprite_stand')
          standMegaMan.push(v)
        else if (value.name === 'sprite_jump')
          jumpMegaMan.push(v)
        else if (value.name === 'sprite_run')
          runMegaMan.push(v)
      })
    })
    const jumpMegaManSprite = new PIXI.AnimatedSprite(jumpMegaMan)
    jumpMegaManSprite.x = app.screen.width / 3
    jumpMegaManSprite.y = baseHeight
    jumpMegaManSprite.anchor.set(anchor)
    jumpMegaManSprite.animationSpeed = animationSpeed
    jumpMegaManSprite.scale.x = scale
    jumpMegaManSprite.scale.y = scale

    const standMegaManSprite = new PIXI.AnimatedSprite(standMegaMan)
    standMegaManSprite.x = app.screen.width / 3
    standMegaManSprite.y = baseHeight
    standMegaManSprite.anchor.set(anchor)
    standMegaManSprite.animationSpeed = animationSpeed
    standMegaManSprite.scale.x = scale
    standMegaManSprite.scale.y = scale

    const startMegaManSprite = new PIXI.AnimatedSprite(startMegaMan)
    startMegaManSprite.x = app.screen.width / 3
    startMegaManSprite.y = baseHeight
    startMegaManSprite.anchor.set(anchor)
    startMegaManSprite.animationSpeed = animationSpeed
    startMegaManSprite.scale.x = scale
    startMegaManSprite.scale.y = scale
    startMegaManSprite.play()
    startMegaManSprite.onLoop = () => {
      startMegaManSprite.destroy()
      standMegaManSprite.play()
      app.stage.addChild(standMegaManSprite)
    }
    const runMegaManSprite = new PIXI.AnimatedSprite(runMegaMan)
    runMegaManSprite.x = app.screen.width / 3
    runMegaManSprite.y = baseHeight
    runMegaManSprite.animationSpeed = animationSpeed
    runMegaManSprite.anchor.set(anchor)
    // runMegaManSprite.updateAnchor = true // update anchor for each animation frame
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
      // left = $ref(keyboard('KeyA')) // left
      // right = $ref(keyboard('KeyD')) // right
      // jump = $ref(keyboard('KeyH')) // jump
    }
    // Left arrow key `press` method
    left.press = () => {
      if (!jump?.isUp)
        return
      runMegaManSprite.scale.x = -scale
      runMegaManSprite.x += -runSpeed1.speedUp()
      runMegaManSprite.y += 0
      runMegaManSprite.play()
      runMegaManSprite.loop = true
      mega_man.visible = false
      runMegaManSprite.visible = true
      // Change the cat's velocity when the key is pressed
    }
    // Left arrow key `release` method
    left.release = () => {
      // If the left arrow has been released, and the right arrow isn't down,
      // and the cat isn't moving vertically:
      // Stop the cat
      if (!right.isDown) {
        mega_man.visible = true
        runMegaManSprite.visible = false
        runMegaManSprite.loop = false
        mega_man.scale.x = -scale
        mega_man.x = runMegaManSprite.x
        mega_man.y = runMegaManSprite.y
        runMegaManSprite.x += 0
        runSpeed1.release()
      }
    }

    // Right
    right.press = () => {
      if (!jump?.isUp)
        return
      mega_man.visible = false
      runMegaManSprite.visible = true
      runMegaManSprite.scale.x = scale
      runMegaManSprite.x += runSpeed1.speedUp()
      runMegaManSprite.y += 0
      runMegaManSprite.play()
      runMegaManSprite.loop = true
    }
    right.release = () => {
      if (!left.isDown) {
        mega_man.visible = true
        runMegaManSprite.visible = false
        runMegaManSprite.loop = false
        mega_man.scale.x = scale
        mega_man.x = runMegaManSprite.x
        mega_man.y = runMegaManSprite.y
        runMegaManSprite.x += 0
        runSpeed1.release()
      }
    }

    // jump only once
    jump.press = () => {
      runSpeed1.release() // release
      runMegaManSprite.visible = false
      runMegaManSprite.loop = false
      mega_man.visible = false
      jumpMegaManSprite.visible = true
      jumpMegaManSprite.y = runMegaManSprite.y - runSpeed1.speedUp() * 12
      if (runMegaManSprite.scale.x < 0) {
        jumpMegaManSprite.scale.x = -scale
        jumpMegaManSprite.x = runMegaManSprite.x - runSpeed1.speedUp() * 12
        runMegaManSprite.x = jumpMegaManSprite.x
      }
      else {
        jumpMegaManSprite.x = runMegaManSprite.x + runSpeed1.speedUp() * 12
        runMegaManSprite.x = jumpMegaManSprite.x
        jumpMegaManSprite.scale.x = scale
      }
      jumpMegaManSprite.play()
      jumpMegaManSprite.onLoop = function () {
        jumpMegaManSprite.stop()
        jump.release()
      }
    }
    jump.release = () => {
      jumpMegaManSprite.visible = false
      jumpMegaManSprite.loop = true
      if (runMegaManSprite.scale.x < 0)
        mega_man.scale.x = -scale
      else
        mega_man.scale.x = scale
      mega_man.x = jumpMegaManSprite.x
      mega_man.visible = true
      runSpeed1.release()
      if (!left.isDown && !right.isDown)
        mega_man.visible = true
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
    <div bg-gray w="100%" max-w-800px h-30 text-left>
      <p>[WASD] to move</p>
      <p>[H] to jump</p>
      <p>[G] to shot</p>
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
