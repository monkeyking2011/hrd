import { HRD } from './HRD'
const createHRD = ({ canvas, size, initState, src, start, success }) => {
  const hrd = new HRD({ canvas, size, initState, src, start, success })
  return hrd
}
export { createHRD }