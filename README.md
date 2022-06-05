# 数字华容道

### 介绍

这是一个基于 canvas 的数字华容道小游戏。

由 rollup 打包成 `umd`  模块。

# API

#### `createHRD`

创建一个华容道游戏

```
  
  // index.html
  <div>
    <canvas style="height: 300px;width: 300px;" id="canvas"></canvas>
  </div>
  <script src="./hrd.js"></script>
  <script>
    const canvas = document.getElementById('canvas')
    const hrdGame = HRD.createHRD({
      canvas,// canvas元素
      size: [3, 3],// 分成几乘几的格子
      initState: [1, 2, 3, 4, 5, 6, 7, 8, 9],// 初始状态
      src: 'https://pics3.baidu.com/feed/1b4c510fd9f9d72a63b4395f08507c33359bbb25.jpeg?token=8efeff0fc4beef5e0e39218b76b49033',
      isShowNumber: true,//是否显示数字
      start() {
        // 游戏开始的回调
        console.log('开始')
      },
      success() {
        // 游戏成功的回调
        console.log('成功')
        alert('成功')
      }
    })
    // 初始化
    hrdGame.init()
  </script>
```

##### 参数

* canvas——canvas元素
* size——分成几乘几的格子
* `initState`——// 初始状态
* `src`——图片地址
* `isShowNumber`——是否显示数字（可在游戏中切换）
* start——游戏开始的回调
* success——游戏成功的回调

