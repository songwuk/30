/**
 * jump distance is the distance between the current position and the next position
 */
export function distance(y: number) {
  const r = y
  const T = Math.PI
  return {
    get value() {
      return T * r
    },
    distance: 1,
  }
}
