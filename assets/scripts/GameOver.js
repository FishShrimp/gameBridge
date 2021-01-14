// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const COM = require("Common");

cc.Class({
  extends: cc.Component,

  properties: {
    gameAgain: {
      default: null,
      type: cc.Node
    },
    totalScore: {
      default: null,
      type: cc.Label
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    // 全局分数赋值
    this.totalScore.string = COM.scoreRecord
  },

  start() {

  },

  // update (dt) {},

  /** 自定义 */
  againGame() {
    cc.director.loadScene("Games");
  }
});
