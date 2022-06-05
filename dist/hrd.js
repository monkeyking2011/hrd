(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
      (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.HRD = {}));
})(this, (function (exports) {
  'use strict';

  class Rect {
    constructor(config) {
      this.ctx = config.ctx; // canvas 对象
      this.img = config.img; // 图片
      // this.position = config.position || [0, 0]
      this.number = config.number;
      this.initPosition = config.initPosition || [0, 0];
      this.rectHeight = config.rectHeight;
      this.rectWidth = config.rectWidth;
      this.isBlank = config.isBlank; // 是否是 “空白快” 
      this.isShowNumber = config.isShowNumber || false; // 是否显示 number
    }
    draw(position) {
      const sx = this.initPosition[0] * this.rectWidth; // 图片偏移x
      const sy = this.initPosition[1] * this.rectHeight;
      const sWidth = this.rectWidth; // 图片
      const sHeight = this.rectHeight; // 图片偏移y
      const dHeight = this.rectHeight; // 长
      const dWidth = this.rectWidth; // 宽
      const dx = position[0] * this.rectWidth;
      const dy = position[1] * this.rectHeight;
      if (this.isBlank) {
        this.ctx.globalAlpha = 0.1;
        this.ctx.drawImage(this.img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        this.ctx.strokeRect(dx, dy, dWidth, dHeight);
      } else {
        this.ctx.globalAlpha = 1;
        this.ctx.drawImage(this.img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
        this.ctx.strokeRect(dx, dy, dWidth, dHeight);
        if (this.isShowNumber) {
          this.ctx.fillRect(dx, dy, dWidth * 0.2, dHeight * 0.2);
          this.ctx.font = `${dHeight * 0.2}px serif`;
          this.ctx.textBaseline = 'middle';
          this.ctx.textAlign = 'center';
          this.ctx.fillStyle = 'white';
          this.ctx.fillText(this.number, dx + dWidth * 0.1, dy + dHeight * 0.1);
          this.ctx.fillStyle = 'black';
        }
      }
    }
  }

  // 通过位置获取编号
  const getNumber = (size, [x, y]) => {
    return y * size[0] + x + 1
  };
  // 通过编号获取位置
  const getPosition = (size, number) => {
    number = number - 1;
    const x = number % size[0];
    const y = Math.floor(number / size[0]);
    return [x, y]
  };
  // 华容道游戏
  class HRD {
    constructor(config) {
      this.canvas = config.canvas;
      this.size = config.size;
      this.initState = config.initState;
      this.src = config.src;
      this.img = null;
      this.start = config.start;
      this.isShowNumber = false;
      this.success = config.success;
      this.isStart = false;
      this.rectMap = {};
      this.rectObj = {};
      this.ctx = this.canvas.getContext("2d");
      this.handleClick = this.handleClick.bind(this);
    }
    // 显示数字
    showNumber(isShowNumber) {
      this.isShowNumber = isShowNumber;
      Object.values(this.rectMap).forEach(rect => { rect.isShowNumber = isShowNumber; });
      this.draw();
    }
    //判断是否成功
    isSuccess() {
      for (const number in this.rectObj) {
        if (Number(number) !== this.rectObj[number].number) {
          return false
        }
      }
      return true
    }
    // 点击事件
    async handleClick(e) {
      const realRectWidth = (this.canvas.clientWidth / this.size[0]);
      const realRectHeight = (this.canvas.clientHeight / this.size[0]);
      const offsetX = e.offsetX;
      const offsetY = e.offsetY;
      const x = Math.floor(offsetX / realRectWidth);
      const y = Math.floor(offsetY / realRectHeight);
      const position = [x, y];
      const number = getNumber(this.size, position);
      const roundPosition = [[x, y + 1], [x, y - 1], [x - 1, y], [x + 1, y]]
        .filter(position => position[0] >= 0 && position[1] >= 0 && position[0] < this.size[0] && position[1] < this.size[1]);
      const roundNumber = roundPosition.map(position => getNumber(this.size, position));
      const activeNumber = roundNumber.find(number => this.rectObj[number]?.isBlank);
      const rect1 = this.rectObj[number];
      const rect2 = this.rectObj[activeNumber];
      if (activeNumber) {
        if (this.isStart === false) {
          if (typeof this.start === 'function') {
            this.start();
          }
          this.isStart = true;
        }
        this.rectObj[number] = rect2;
        this.rectObj[activeNumber] = rect1;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw();
      }
      if (this.isSuccess()) {
        if (typeof this.success === 'function') {
          setTimeout(() => {
            this.success();
          });
        }
      }
    }
    // 初始化 canvas
    initCanvas(width, height) {
      this.isStart = false;
      this.rectMap = {};
      this.rectObj = {};
      // canvas画布的长宽
      this.canvas.height = height;
      this.canvas.width = width;
      // rect 画布内的长宽
      const rectHeight = height / this.size[1];
      const rectWidth = width / this.size[0];
      for (let y = 0; y < this.size[1]; y++) {
        for (let x = 0; x < this.size[0]; x++) {
          const number = getNumber(this.size, [x, y]);
          const rect = new Rect({
            position: [x, y],
            initPosition: [x, y],
            size: this.size,
            rectHeight,
            rectWidth,
            ctx: this.ctx,
            img: this.img,
            number
          });
          if (number === this.size[0] * this.size[1]) {
            rect.isBlank = true;
          }
          this.rectMap[number] = rect;
        }
      }
      this.initState.forEach((item, index) => {
        if (this.rectMap[item]) {
          this.rectObj[index + 1] = this.rectMap[item];
        }
      });
      this.draw();
      this.canvas.addEventListener('click', this.handleClick);
    }
    // 绘画方法
    draw() {
      const width = this.canvas.width;
      const height = this.canvas.height;
      this.ctx.clearRect(0, 0, width, height);
      for (const number in this.rectObj) {
        const rect = this.rectObj[number];
        if (rect) {
          const position = getPosition(this.size, number);
          rect.draw(position);
        }
      }
    }
    // 初始化游戏
    init() {
      const img = new Image();
      img.src = this.src;
      this.img = img;
      // 图片加载成功之后
      img.onload = () => {
        // 图片的长宽(canvas画布内部)
        const width = img.naturalWidth;
        const height = img.naturalHeight;
        // 初始化 rect 
        this.initCanvas(width, height);
      };
    }
    // 销毁当前游戏
    remove() {
      this.canvas.removeEventListener('click', this.handleClick);
    }
  }

  const createHRD = ({ canvas, size, initState, src, start, success }) => {
    const hrd = new HRD({ canvas, size, initState, src, start, success });
    return hrd
  };

  exports.createHRD = createHRD;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
