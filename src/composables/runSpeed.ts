function runspeed() {
  let speedA = 1
  function speedUp() {
    speedA += 3
    if (speedA >= 13)
      speedA = 13
    return speedA
  }

  function release() {
    speedA = 1
  }
  return {
    speedUp,
    release,
  }
}

export const runSpeed1 = runspeed()
