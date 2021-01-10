// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        rulePage:{
          default: null,
          type: cc.Node
        },
        ruleScrollView:{
          default:null,
          type:cc.ScrollView
        },
        scrollContent:{
          default:null,
          type:cc.Node
        },
        scrollItem:{
          default:null,
          type:cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
      this.addRules();
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
      
    },
    addRules(){
      const cList = [
        {

        }
      ]
      // console.log('cc',cc);
      
      for (let index = 0; index < 10; index++) {
        // const item = array[index];
        const sItem = cc.instantiate(this.scrollItem)
        this.ruleScrollView.content.addChild(sItem)
      }
      console.log('view',this.ruleScrollView);
      
    }
});
