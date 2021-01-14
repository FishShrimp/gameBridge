// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
      // 规则背景
      rulePage:{
        default: null,
        type: cc.Node
      },
      // 按钮水波纹
        startBtnWare:{
          default: null,
          type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    start () {
      // 按钮波纹
      let action = cc.repeatForever(
        cc.sequence(cc.scaleTo(1, 0.8), cc.scaleTo(1, 1))
      );
      this.startBtnWare.runAction(action);
    },

    update (dt) {},

    /** 自定义方法 */

    // 开始游戏
    startGame() {
      cc.director.loadScene("Games");
    },
    // 查看规则
    lookRule() {
      console.log('lookRule',this.rulePage);
      this.rulePage.active = true;
    },
    // 返回游戏按钮
    backHome() {
      console.log('backHome');
      this.rulePage.active = false;
      
    }
});
