/**
 * keyboard.ts
 * @example {https://github.com/kittykatattack/learningPixi#keyboard}
 */
export interface Key {
  value: string | undefined
  isDown: boolean
  isUp: boolean
  press: () => void // function on press
  release: () => void // function on release
  _downHandler: any
  _upHandler: any
  unsubscribe: any
}
interface isContinuously {
  isContinuously?: boolean
}
export function keyboard<T extends Pick<Key, 'value'> & isContinuously>(data: T): Key {
  const key: Required<Key> = {
    value: '',
    isDown: false,
    isUp: true,
    press: () => {},
    release: () => {},
    _downHandler: () => {},
    _upHandler: () => {},
    unsubscribe: () => {},
  }
  key.value = data.value
  key.isDown = false
  key.isUp = true
  // The `downHandler`
  key._downHandler = (event: KeyboardEvent) => {
    if (event.code === key.value) {
      if (data.isContinuously && key.press)
        key.press()

      if (key.isUp && key.press) // key.isUp && key.press
        key.press()
      key.isDown = true
      key.isUp = false
      event.preventDefault()
    }
  }

  // The `upHandler`
  key._upHandler = (event: KeyboardEvent) => {
    if (event.code === key.value) {
      if (data.isContinuously && key.release)
        key.release()
      if (key.isDown && key.release) // key.isDown && key.release
        key.release()
      key.isDown = false
      key.isUp = true
      event.preventDefault()
    }
  }

  // Attach event listeners
  const downListener = key._downHandler.bind(key)
  const upListener = key._upHandler.bind(key)

  window.addEventListener('keydown', downListener, false)
  window.addEventListener('keyup', upListener, false)

  // Detach event listeners
  key.unsubscribe = () => {
    window.removeEventListener('keydown', downListener)
    window.removeEventListener('keyup', upListener)
  }

  return key
}
