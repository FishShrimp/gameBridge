// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // 游戏背景音乐
        bgAudio:{
          default:null,
          type: cc.AudioClip
        },
        // 游戏开始蒙版
        startModal: {
          default: null,
          type: cc.Node
        },
        // 游戏背景音乐开始
        openMusicBg: {
          default: null,
          type: cc.Node
        },
        // 游戏背景音乐结束
        closeMusicBg: {
          default: null,
          type: cc.Node
        },
        // 游戏倒计时显示
        timeVal: {
          default: null,
          type: cc.Label
        },
        // 游戏时长
        gameDuration: 0,
        // 台阶预制
        footStepPreFab: {
          default: null,
          type: cc.Prefab
        },
        // 桥预制
        bridgePreFab: {
          default: null,
          type: cc.Prefab
        },
        // 小人预制
        peoplePreFab: {
          default: null,
          type: cc.Prefab
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
      // this.curDuration = 0
      this.curDuration = this.gameDuration
      this.timeVal.string = this.curDuration
      console.log('timeVal',this.timeVal);
      this.newStep(); // 生成第一个台阶

      // 点击蒙版开始游戏
      this.startModal.on('touchend', ()=> {
        this.startModal.active = false
        // this.playBgSound(); // 播放背景音乐
        // this.newStep(); // 生成第一个台阶
      }, this.startModal)
    },

    start () {
      console.log('gameDuration',this.gameDuration);
    },

    update (dt) {
      if(this.curDuration < 0) {
        this.timeVal.string = 0
        return
      }
      this.timeVal.string = Math.ceil(this.curDuration)
      this.curDuration -= dt;
      // console.log('curDuration',this.curDuration,dt);
      
    },

    /** 自定义方法 */

    /**人开始过桥
     * @param {*} bridgeHeight : 桥动态高度
     */
    peopleStartRun(bridgeHeight) {
      // this.peopleMain
      const peopleCurPos = this.peopleMain.getPosition()
      console.log('peopleCurPos',peopleCurPos);
      var seq =cc.sequence(cc.moveBy(1, cc.v2(bridgeHeight, 0)), null, this.starRunFinish());
    this.peopleMain.runAction(seq);
    this.peopleMain.getComponent('People').peopleRun()
    // let jumpUp = cc.moveBy(this.jumpTime, cc.v2(0, this.jumpHeight)).easing(cc.easeCircleActionOut());
    // let jumpDown = cc.moveBy(this.jumpTime, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
    // // 设置音效 作用在当前
    // const callback = cc.callFunc(this.playJumpSound, this)
    // return 
    // return cc.repeatForever(cc.sequence(jumpUp, jumpDown,callback))
    },
    // 走完回调
    starRunFinish() {
      this.peopleMain.getComponent('People').peopleStopRun()
    },
    // 初始化人物位置
    initPeople(step){
      const nPeople = cc.instantiate(this.peoplePreFab)
      nPeople.setPosition(cc.v2(-this.node.width/2, -this.node.height/2 + step.height))
      this.node.addChild(nPeople)
      this.peopleMain = nPeople // 人物全局
    },
    // 生成桥
    newBridge(step) {
      // bridgePreFab
      const nBridge = cc.instantiate(this.bridgePreFab)
      this.node.addChild(nBridge)
      const bridgeX = -this.node.width/2+step.width-(nBridge.width/2)
      const bridgeY = (-this.node.height/2)+step.height
      nBridge.setPosition(cc.v2(bridgeX, bridgeY))
      // console.log('footStepPreFab',step.height);
      nBridge.getComponent('BridgeItem').initial(this)
    },
    // 生成台阶 
    newStep() {
      const nStep = cc.instantiate(this.footStepPreFab);
      this.node.addChild(nStep);
      const stepY = -this.node.height/2
      nStep.setPosition(cc.v2(-this.node.width/2, stepY));
      // console.log('nstep',this.node.height/2 , nStep.height);
      const nStep2 = cc.instantiate(this.footStepPreFab);
      this.node.addChild(nStep2);
      nStep2.setPosition(this.setNewStepPostion());
      // setPosition
      this.newBridge(nStep); // 生成桥
      this.initPeople(nStep)
    },
    // 台阶位置
    setNewStepPostion() {
      // console.log('footStepPreFab',this.footStepPreFab);
      
      const step2Width = this.footStepPreFab.data.width * 2
      const maxStepX = (Math.random() - 0.5) * 2 * ((this.node.width - step2Width)/2)
      // console.log('maxStepX',maxStepX);
      
      // const randY = this.groundY + Math.random() * this.player.jumpHeight + 20
      return cc.v2(maxStepX, -this.node.height/2)
    },
    // 暂停背景音乐
    openMusicBtn() {
      this.openMusicBg.active = false
      this.closeMusicBg.active = true
      cc.audioEngine.pauseEffect(this.bgAudioId);
    },
    // 继续播放背景音乐
    closeMusicBtn() {
      this.closeMusicBg.active = false
      this.openMusicBg.active = true
      cc.audioEngine.resumeEffect(this.bgAudioId);
    },
    // 播放背景音乐 重复播放
    playBgSound(){
      // loop 不需要循环播放 false
      // 定义id用来停止/继续
      this.bgAudioId = cc.audioEngine.playEffect(this.bgAudio, true)
    },
});
