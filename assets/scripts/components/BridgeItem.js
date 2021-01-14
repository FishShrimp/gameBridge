// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    bridgeCurHeight: 0,             // 桥最小高度
    bridgeTouchSpeed: 1000          // 上升速度
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {},

  start() {},

  update(dt) {
    // 移动大小
    const spt = dt * this.bridgeTouchSpeed
    if (this.isTouchStart === true) {
      // const maxW = games.node.width - games.nextStep.width
      const maxW = this.games.node.width - this.games.nextStep.width
      // 记录桥的增减方向：是向上还是向下
      if (this.node.height > maxW) {
        this.isDown = true
        // console.log('大于',spt);

      } else if (this.node.height < 0) {
        this.isDown = false
        // console.log('小于',spt);
      }
      // 桥高度的增减
      if (this.isDown) {
        this.node.height -= spt
      } else {
        this.node.height += spt
      }
    }
  },

  /** 自定义方法 */
  initial(games) {
    this.games = games
    this.isTouchStart = null
    this.isDown = false // 是否向下
    this.node.height = 0
    // 设置触摸事件
    this.curTouchReceiver = cc.Canvas.instance.node
    this.curTouchReceiver.on('touchstart', this.onTouchStart, this)
    this.curTouchReceiver.on('touchend', this.onTouchEnd, this)
    this.curTouchReceiver.pauseSystemEvents();
    this.recoveryTouch();    // 恢复桥的触摸事件
  },
  onTouchStart(event) {
    this.bridgeTouchSpeed = this.bridgeTouchSpeed + Math.random() * this.bridgeTouchSpeed
    this.isTouchStart = true
  },
  onTouchEnd(event) {
    this.isTouchStart = false
    this.rotateBridge()   // 开始搭桥
    this.pauseTouch();    // 暂停触摸事件
  },
  // 暂停触摸事件
  pauseTouch() {
    this.curTouchReceiver.pauseSystemEvents();
  },
  // 恢复触摸事件
  recoveryTouch() {
    this.curTouchReceiver.resumeSystemEvents();
  },
  // touchend之后：禁用当前节点并旋转90度搭桥
  rotateBridge() {
    this.enabled = false
    const callback = cc.callFunc(this.rotateBridgeEnd, this)
    var _v3 = cc.sequence(cc.rotateTo(0.5, 90), callback);//旋转90度
    this.node.runAction(_v3);
  },
  /**桥搭好后的操作
   * 1.小人开始动画 并且开始移动
   */
  rotateBridgeEnd() {
    this.games.runBefore(this.node)
  }
});
