// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const step = require('StepItem')

cc.Class({
  extends: cc.Component,

  properties: {
    bridgeCurHeight: 0,    // 桥最小高度
    bridgeTouchSpeed: 200          // 上升速度
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.initial()

    const curTouchReceiver = cc.Canvas.instance.node
    curTouchReceiver.on('touchstart', this.onTouchStart, this)
    curTouchReceiver.on('touchend', this.onTouchEnd, this)

  },

  start() {

  },

  update(dt) {
    // 移动大小
    const spt = dt*this.bridgeTouchSpeed
    // touchstart
    if (this.isTouchStart === true) {
      // console.log('start', this.isTouchStart,this.games);
      // 记录桥的增减方向：是向上还是向下
      if (this.node.height > this.games.node.width) {
        this.isDown = true
        // console.log('大于',spt);
        
      } else if(this.node.height < 0) {
        this.isDown = false
        // console.log('小于',spt);
      }
      // 桥高度的增减
      if(this.isDown) {
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
    this.isTouchEnd = null
    this.isDown = false // 是否向下
// console.log('bridge-item-init',this.games.enabled);

  },
  onTouchStart(event) {
    // this.node.enable = true
    this.bridgeTouchSpeed = 100+Math.random()*200
    this.isTouchStart = true
    this.isTouchEnd = false
    // 当前位置
    const curPos = event.getLocation()
    // curPos.x > cc.winSize.width / 2
    // console.log('onTouchStart',event);
    // console.log('curPos', curPos, this);

  },
  onTouchEnd(event) {
    this.isTouchStart = false   
    this.rotateBridge()   // 开始搭桥
    
  },
  // touchend之后：禁用当前节点并旋转90度搭桥
  rotateBridge() {
    this.enabled = false
    const callback = cc.callFunc(this.rotateBridgeEnd, this)
    var _v3 = cc.sequence(cc.rotateTo(1,90), callback);//旋转90度
    this.node.runAction(_v3);
  },
  /**桥搭好后的操作
   * 1.小人开始动画 并且开始移动
   */
  rotateBridgeEnd(){
    console.log('rotate-end',this.node);
    // 桥最右端的x坐标
    const bridgeRightX = this.node.x + this.node.height
    console.log('bridgeRightX',bridgeRightX);
    console.log('step',step);
    this.games.peopleStartRun(this.node.height)
  }
});
