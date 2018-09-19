### 地球
1. 参考样例：https://arrivehydrated.cremedelamer.com/


### 遇到的问题
1. dragControl.js对于THREE.Group无效
2. 地球上的城市经纬度转换到坐标系
3. 拖拽旋转时，地标与地球的旋转不一致，产生偏移？
出现原因：(1) 频繁触发拖拽，动画冲突导致；(2) 受到地球本身自转速度影响
解决：(1)当触发新动画时，停止前一动画； (2) 当拖拽旋转时，禁止地球自转。
4. 手机上调试出现帧率下降，从60降低到30
`renderer.setPixelRatio(window.devicePixelRatio)`导致的，直接去除在安卓设备下，整个动画变模糊。