"use strict";
cc._RF.push(module, '92451LDEWxFtbvrUSPn2v5+', 'Player');
// scripts/Player.js

"use strict";

// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
cc.Class({
  "extends": cc.Component,
  // 角色的各种属性
  properties: {
    // 跳跃高度
    jumpHeight: 0,
    // 跳跃持续时间
    jumpDuration: 0,
    jumpTriggle: false,
    jumpAudio: {
      "default": null,
      type: cc.AudioClip
    },
    // 最大移动速度
    maxMoveSpeed: 0,
    // 加速度
    accel: 0,
    // 左右的墙
    maxBackLeftWall: -500,
    maxBackRightWall: 500
  },
  onLoad: function onLoad() {
    // 1、角色默认动作 - 上下横跳
    // this.jumpAction = this.setJumpAction();
    // this.node.runAction(this.jumpAction);
    // 2、加速度方向的开关
    this.accLeft = false;
    this.accRight = false; // 跳跃的开关

    this.jumpTriggle = false, // 3、当前水平方向的速度
    this.xSpeed = 0; // 4、挂载键盘事件

    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  },
  // 键盘按下
  onKeyDown: function onKeyDown(e) {
    switch (e.keyCode) {
      case cc.macro.KEY.left:
        this.accLeft = true;
        break;

      case cc.macro.KEY.right:
        this.accRight = true;
        break;

      case cc.macro.KEY.alt:
        if (this.jumpTriggle == false) {
          this.jumpTriggle = true;
          this.onJumpClick();
        }

        break;
    }
  },
  // 键盘弹起
  onKeyUp: function onKeyUp(e) {
    switch (e.keyCode) {
      case cc.macro.KEY.left:
        this.accLeft = false;
        this.setXSpeedInit();
        break;

      case cc.macro.KEY.right:
        this.accRight = false;
        this.setXSpeedInit();
        break;

      case cc.macro.KEY.alt:
        break;
    }
  },
  // 设置跳跃动作
  setJumpAction: function setJumpAction() {
    var _this = this;

    /**
     * 1、cc.moveBy，在指定的时间，移动指定的距离
     *      参数一，动作完成的时间
     *      参数二，v2是Vec2（表示 2D 向量和坐标），传入x+y，返回一个向量对象
     *      返回值，是ActionInterval对象，是一个时间间隔动作的类，
     *          用来表示这种动作在某一个时间间隔内完成
     * 
     * moveBy设计了多态，
     *      两个参数时：参数二是向量对象
     *      三个参数时，参数二是x坐标，参数三是y坐标
     * 
     *      注意：这里的x和y，是以角色动作的当前位置而言的。是一个相对位移。
     * 
     * 所以jumpUp是构造了一个向上跳跃的动作，jumpDown是下落的动作
     * 
     * 2、easing(cc.easeCubicActionOut())
     *      easing是ActionInterval下的方法，可以让动作的执行呈现一条曲线，而不是直线。
     *      动作曲线总共有24种。
     *      From：https://docs.cocos.com/creator/api/zh/modules/cc.html#easecubicactionout
     * 
     */
    // 1、播放音乐
    var callback = cc.callFunc(this.playJumpSound, this); // 2、跳起

    var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut()); // 3、下落

    var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn()); // 4、将跳跃锁定打开

    var afterAction = cc.callFunc(function () {
      _this.jumpTriggle = false;
    });
    /**
     * 1、sequence，动作序列，里面的是一连串的动作
     * 2、repeatForever，动作一直执行
     *      可以传入一个回调函数，回调函数会在两个动作交替的时候执行
     */

    return cc.sequence([callback, jumpUp, jumpDown, afterAction]);
  },
  playJumpSound: function playJumpSound() {
    cc.audioEngine.playEffect(this.jumpAudio, false);
  },
  // 按下跳跃键
  onJumpClick: function onJumpClick() {
    this.jumpAction = this.setJumpAction();
    this.node.runAction(this.jumpAction);
  },
  // 横向speed归零
  setXSpeedInit: function setXSpeedInit() {
    this.xSpeed = 0;
  },
  // 视图渲染的每一帧，将会执行一次update
  update: function update(dt) {
    // 1、根据两个开关，来计算当前的x方向的加速度
    if (this.accLeft) {
      this.xSpeed -= this.accel * dt;
    } else if (this.accRight) {
      this.xSpeed += this.accel * dt;
    } // 2、判断加速度是否超出最大加速度，超出则限制


    if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
      // 求正负号
      var temp = this.xSpeed / Math.abs(this.xSpeed); // 限制xSpeed为最大值

      this.xSpeed = this.maxMoveSpeed * temp;
    } // 3、设置节点位移


    this.node.x = this.calcLeftRight(this.node.x, this.xSpeed * dt);
  },
  // 检测左右坐标，来限制最小和最大的左右位移
  calcLeftRight: function calcLeftRight(x, translate) {
    var temp = x + translate;
    var maxBackLeftWall = this.maxBackLeftWall,
        maxBackRightWall = this.maxBackRightWall;

    if (temp < 0 && Math.abs(temp) > Math.abs(maxBackLeftWall)) {
      this.setXSpeedInit();
      return maxBackLeftWall;
    }

    if (temp > 0 && Math.abs(temp) > Math.abs(maxBackRightWall)) {
      this.setXSpeedInit();
      return maxBackRightWall;
    }

    return temp;
  },
  onDestroy: function onDestroy() {
    // 组件销毁时，将绑定的键盘事件解绑
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  } // update (dt) {},

});

cc._RF.pop();