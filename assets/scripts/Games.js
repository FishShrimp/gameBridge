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
    // 游戏背景音乐
    bgAudio: {
      default: null,
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
    gameBg: {
      default: null,
      type: cc.Node
    },
    // 得分
    scoreStr: {
      default: null,
      type: cc.Label
    },
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    // this.curDuration = 0
    this.curDuration = this.gameDuration
    this.timeVal.string = this.curDuration
    this.scoreNum = 0
    console.log('timeVal', this.timeVal);
    this.newStep(); // 生成第一个台阶

    // 点击蒙版开始游戏
    this.startModal.on('touchend', () => {
      this.startModal.active = false
      // this.playBgSound(); // 播放背景音乐
      // this.newStep(); // 生成第一个台阶
    }, this.startModal)
  },

  start() {
    // console.log('gameDuration', this.gameDuration);
  },

  update(dt) {
    if (this.curDuration < 0) {
      this.timeVal.string = 0
      this.gameOverAfterHandle()
      return
    }
    this.timeVal.string = Math.ceil(this.curDuration)
    this.curDuration -= dt;
    // console.log('curDuration',this.curDuration,dt);

  },

  /** 自定义方法 */

  /**人物开始走之前判断
   * @param {*} bridgeNode : 桥实例
   * 1.判断桥位置是否到达对岸
   * ->到达则开始下一轮；否则结束游戏
   */
  runBefore(bridgeNode) {
    this.bridgeNode = bridgeNode  // 赋值全局变量
    // 
    const nextStepPos = this.nextStep
    const bridgeArrive = this.bridgeNode.x + this.bridgeNode.height + this.bridgeNode.width / 3
    // console.log('bridgeNode', bridgeArrive);
    // console.log('nextStepPos', this.nextStep.x, this.nextStep.width);
    let runWidth = 0;
    let status = null;
    // 如果桥当前位置在第二个台阶宽度的区间
    if (bridgeArrive >= nextStepPos.x && bridgeArrive < (this.nextStep.x + this.nextStep.width)) {
      // 过桥成功
      console.log('成功过桥');
      runWidth = (this.nextStep.x - this.bridgeNode.x) + this.nextStep.width / 2
      status = true
      // 得分+1
      this.scoreNum += 1
      this.scoreStr.string = this.scoreNum
    } else {
      // 过桥失败
      console.log('过桥失败');
      runWidth = this.bridgeNode.height + this.peopleMain.width / 1.5
    }
    this.peopleStartRun(runWidth, status)
  },
  /**人开始过桥
   * @param {*} runWidth : 人需要走的距离
   * @param {*} status : 成功/失败
   */
  peopleStartRun(runWidth, status) {
    // this.bridgeNode = bridgeNode  // 赋值全局变量
    const runFinishCallback = cc.callFunc(this.starRunFinish, this, status)
    var seq = cc.sequence(cc.moveBy(1, cc.v2(runWidth, 0)), null, runFinishCallback);
    this.peopleMain.runAction(seq);
    this.peopleMain.getComponent('People').peopleRun()
  },
  /**走完回调
   * 1.停止人物动画
   * 2.判断人物是否到达指定位置
   * @param {*} status : 成功/失败
   */
  starRunFinish(target, status) {
    // 停止人物动画
    this.peopleMain.getComponent('People').peopleStopRun()
    // 人物位置
    const peopleCurPos = this.peopleMain.getPosition()
    console.log('starRunFinish', status);

    if (status) { // 成功
      this.successGoStep()
      return
    }
    /**失败
     * 1.小人掉坑去
     * 2.切换游戏失败场景
     */
    this.peopleFallOff()  // 小人掉坑去
    // this.scoreNum += 1
    // this.scoreStr.string = this.scoreNum
  },
  /**
   * 1.销毁第一个台阶
   * 2.第二个台阶和人物的位置调整到最左侧
   * 3.将当前第二个台阶变成当前台阶，继续生成下一个台阶
   */
  successGoStep() {
    const leftRunTime = .5
    // 第一个台阶左移隐藏
    this.curStep.runAction(cc.moveBy(leftRunTime, cc.v2(-this.curStep.width, 0)));
    // 桥左移隐藏
    this.bridgeNode.runAction(cc.moveBy(leftRunTime, cc.v2(-(this.bridgeNode.height + this.curStep.width), 0)));
    const initX = -(this.node.width / 2 + this.nextStep.x)
    // 第二个台阶左移隐藏
    var seq = cc.sequence(
      cc.moveBy(leftRunTime, cc.v2(initX, 0)), null, cc.callFunc(() => {
        this.curStep.destroy()          // 销毁第一个台阶
        this.bridgeNode.destroy()       // 销毁桥
        this.curStep = this.nextStep    // 将第二个台阶换成第一个台阶
        this.createNewStep()            // 生成下一个台阶
        this.newBridge(this.nextStep);  // 生成桥
      }, this.nextStep));
    this.nextStep.runAction(seq);

    // 人物
    const peopleInitX = -(this.node.width / 2 + this.peopleMain.x)
    // console.log('peopleInitX',peopleInitX);
    var seq = cc.sequence(
      cc.moveBy(leftRunTime, cc.v2(peopleInitX, 0)), cc.callFunc(() => {
      }, this.nextStep));
    this.peopleMain.runAction(seq);
    // console.log('this.bridgeNode',this.bridgeNode);

    // return
    // let peopleInitX = initX+this.peopleMain.width/3*2
    // var seq = cc.sequence(
    //   cc.moveBy(0.5, cc.v2(peopleInitX, 0)), null);
    // this.bridgeNode.runAction(seq);
  },
  /**小人掉坑去
   * 1.屏幕抖动
   */
  peopleFallOff() {
    const callback = cc.callFunc(this.screenShakeCallback, this)
    var seq = cc.sequence(cc.moveBy(0.5, cc.v2(2, this.peopleMain.y - this.nextStep.height)), null, callback);
    this.peopleMain.runAction(seq);
  },
  // 屏幕抖动
  screenShakeCallback() {
    let y = this.gameBg.y;
    let action = cc.sequence(
      cc.moveTo(0.018, cc.v2(0, y - 20)),
      cc.moveTo(0.018, cc.v2(0, y)),
      cc.callFunc(() => {
        this.gameBg.stopAction(action); // 停止动画
        this.gameOverAfterHandle()
      }, this)
    )
    this.gameBg.runAction(action);
  },
  /**游戏失败后操作
   * 1.分数存储
   * 2.切换场景
   */
  gameOverAfterHandle() {
    COM.scoreRecord = this.scoreStr.string;
    cc.director.loadScene("GameOver");// 游戏结束-第三场景
  },
  // 初始化人物位置
  initPeople(step) {
    const nPeople = cc.instantiate(this.peoplePreFab)
    nPeople.setPosition(cc.v2(-this.node.width / 2, -this.node.height / 2 + step.height))
    this.node.addChild(nPeople)
    this.peopleMain = nPeople // 人物全局
  },
  // 生成桥
  newBridge(step) {
    const nBridge = cc.instantiate(this.bridgePreFab)
    this.node.addChild(nBridge)
    const bridgeX = -this.node.width / 2 + step.width - nBridge.width / 3
    const bridgeY = (-this.node.height / 2) + step.height - nBridge.width
    nBridge.setPosition(cc.v2(bridgeX, bridgeY))
    // console.log('footStepPreFab',step.height);
    nBridge.getComponent('BridgeItem').initial(this)
    console.log('newBridge', nBridge);


  },
  // 生成台阶 
  newStep() {
    const nStep = cc.instantiate(this.footStepPreFab);
    this.node.addChild(nStep);
    const stepY = -this.node.height / 2
    nStep.setPosition(cc.v2(-this.node.width / 2, stepY));
    // 当前台阶全局定义
    this.curStep = nStep

    this.createNewStep()  // 生成下一个台阶
    this.newBridge(nStep); // 生成桥
    this.initPeople(nStep)  // 生成人物
  },
  // 初始化生成下一个台阶
  createNewStep() {
    const nStep2 = cc.instantiate(this.footStepPreFab);
    this.node.addChild(nStep2);
    nStep2.setPosition(this.setNewStepPostion());
    // 下一个台阶全局定义
    this.nextStep = nStep2
    // console.log('nStep2',nStep2);
  },
  // 台阶位置
  setNewStepPostion() {
    // console.log('footStepPreFab',this.footStepPreFab);

    const step2Width = this.footStepPreFab.data.width * 2
    const maxStepX = (Math.random() - 0.5) * 2 * ((this.node.width - step2Width) / 2)
    // console.log('maxStepX',maxStepX);

    // const randY = this.groundY + Math.random() * this.player.jumpHeight + 20
    return cc.v2(maxStepX, -this.node.height / 2)
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
  playBgSound() {
    // loop 不需要循环播放 false
    // 定义id用来停止/继续
    this.bgAudioId = cc.audioEngine.playEffect(this.bgAudio, true)
  },
});
