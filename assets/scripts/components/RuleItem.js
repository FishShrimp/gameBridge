// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        content: cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      const arr = [
        {
          title: '须知',
          content: ''
        },{
          title: '活动一',
          content: ''
        }
      ]
      this.title.string = 'title--'
      this.content.string = 'content---'
    },

    start () {
      
    },

    // update (dt) {},
});
