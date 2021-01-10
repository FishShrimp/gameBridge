// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    anim: {
      default: null,
      type: cc.Animation
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    
  },

  start() {

  },

  // update (dt) {},

  /** 自定义方法 */

  // 小人开始动起来
  peopleRun() {
    this.animState = this.anim.play('PeopleClip')
    // console.log('anim', this.anim);
    // 获取动画的播放速度
    // var speed = animState.speed;
    // console.log('anim-speed', speed);
    // 使动画播放速度减速
    // animState.speed = 0.5;
    // 设置循环模式为 Loop
    this.animState.wrapMode = cc.WrapMode.Loop;
  },
  // 小人停止动起来
  peopleStopRun() {
    this.animState.stop();
    // 指定暂停 test 动画
    // this.anim.pause('PeopleClip');
  }
});
