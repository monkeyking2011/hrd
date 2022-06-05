class Rect {
  constructor(config) {
    this.ctx = config.ctx // canvas 对象
    this.img = config.img // 图片
    // this.position = config.position || [0, 0]
    this.number = config.number
    this.initPosition = config.initPosition || [0, 0]
    this.rectHeight = config.rectHeight
    this.rectWidth = config.rectWidth
    this.isBlank = config.isBlank // 是否是 “空白快” 
    this.isShowNumber = config.isShowNumber || false // 是否显示 number
  }
  draw(position) {
    const sx = this.initPosition[0] * this.rectWidth // 图片偏移x
    const sy = this.initPosition[1] * this.rectHeight
    const sWidth = this.rectWidth // 图片
    const sHeight = this.rectHeight // 图片偏移y
    const dHeight = this.rectHeight // 长
    const dWidth = this.rectWidth // 宽
    const dx = position[0] * this.rectWidth
    const dy = position[1] * this.rectHeight
    if (this.isBlank) {
      this.ctx.globalAlpha = 0.1
      this.ctx.drawImage(this.img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      this.ctx.strokeRect(dx, dy, dWidth, dHeight)
    } else {
      this.ctx.globalAlpha = 1
      this.ctx.drawImage(this.img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
      this.ctx.strokeRect(dx, dy, dWidth, dHeight)
      if (this.isShowNumber) {
        this.ctx.fillRect(dx, dy, dWidth * 0.2, dHeight * 0.2)
        this.ctx.font = `${dHeight * 0.2}px serif`
        this.ctx.textBaseline = 'middle'
        this.ctx.textAlign = 'center'
        this.ctx.fillStyle = 'white'
        this.ctx.fillText(this.number, dx + dWidth * 0.1, dy + dHeight * 0.1)
        this.ctx.fillStyle = 'black'
      }
    }
  }
}

export { Rect }