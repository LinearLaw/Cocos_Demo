
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/Player.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
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
                    }
                    if (nodeEnv) {
                        __define(__module.exports, __require, __module);
                    }
                    else {
                        __quick_compile_project__.registerModuleFunc(__filename, function () {
                            __define(__module.exports, __require, __module);
                        });
                    }
                })();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcUGxheWVyLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwianVtcEhlaWdodCIsImp1bXBEdXJhdGlvbiIsImp1bXBUcmlnZ2xlIiwianVtcEF1ZGlvIiwidHlwZSIsIkF1ZGlvQ2xpcCIsIm1heE1vdmVTcGVlZCIsImFjY2VsIiwibWF4QmFja0xlZnRXYWxsIiwibWF4QmFja1JpZ2h0V2FsbCIsIm9uTG9hZCIsImFjY0xlZnQiLCJhY2NSaWdodCIsInhTcGVlZCIsInN5c3RlbUV2ZW50Iiwib24iLCJTeXN0ZW1FdmVudCIsIkV2ZW50VHlwZSIsIktFWV9ET1dOIiwib25LZXlEb3duIiwiS0VZX1VQIiwib25LZXlVcCIsImUiLCJrZXlDb2RlIiwibWFjcm8iLCJLRVkiLCJsZWZ0IiwicmlnaHQiLCJhbHQiLCJvbkp1bXBDbGljayIsInNldFhTcGVlZEluaXQiLCJzZXRKdW1wQWN0aW9uIiwiY2FsbGJhY2siLCJjYWxsRnVuYyIsInBsYXlKdW1wU291bmQiLCJqdW1wVXAiLCJtb3ZlQnkiLCJ2MiIsImVhc2luZyIsImVhc2VDdWJpY0FjdGlvbk91dCIsImp1bXBEb3duIiwiZWFzZUN1YmljQWN0aW9uSW4iLCJhZnRlckFjdGlvbiIsInNlcXVlbmNlIiwiYXVkaW9FbmdpbmUiLCJwbGF5RWZmZWN0IiwianVtcEFjdGlvbiIsIm5vZGUiLCJydW5BY3Rpb24iLCJ1cGRhdGUiLCJkdCIsIk1hdGgiLCJhYnMiLCJ0ZW1wIiwieCIsImNhbGNMZWZ0UmlnaHQiLCJ0cmFuc2xhdGUiLCJvbkRlc3Ryb3kiLCJvZmYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0w7QUFDQUMsRUFBQUEsVUFBVSxFQUFFO0FBQ1I7QUFDQUMsSUFB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LEdBNUxJO0FBK0xMSSxFQUFBQSxTQS9MSyx1QkErTE07QUFDUDtBQUNBN0QsSUFBQUEsRUFBRSxDQUFDa0IsV0FBSCxDQUFlNEMsR0FBZixDQUNJOUQsRUFBRSxDQUFDb0IsV0FBSCxDQUFlQyxTQUFmLENBQXlCQyxRQUQ3QixFQUVJLEtBQUtDLFNBRlQsRUFHSSxJQUhKO0FBS0F2QixJQUFBQSxFQUFFLENBQUNrQixXQUFILENBQWU0QyxHQUFmLENBQ0k5RCxFQUFFLENBQUNvQixXQUFILENBQWVDLFNBQWYsQ0FBeUJHLE1BRDdCLEVBRUksS0FBS0MsT0FGVCxFQUdJLElBSEo7QUFLSCxHQTNNSSxDQTZNTDs7QUE3TUssQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTGVhcm4gY2MuQ2xhc3M6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL2NsYXNzLmh0bWxcclxuLy8gTGVhcm4gQXR0cmlidXRlOlxyXG4vLyAgLSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9yZWZlcmVuY2UvYXR0cmlidXRlcy5odG1sXHJcbi8vIExlYXJuIGxpZmUtY3ljbGUgY2FsbGJhY2tzOlxyXG4vLyAgLSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9saWZlLWN5Y2xlLWNhbGxiYWNrcy5odG1sXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgLy8g6KeS6Imy55qE5ZCE56eN5bGe5oCnXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8g6Lez6LeD6auY5bqmXHJcbiAgICAgICAganVtcEhlaWdodDowLFxyXG4gICAgICAgIC8vIOi3s+i3g+aMgee7reaXtumXtFxyXG4gICAgICAgIGp1bXBEdXJhdGlvbjowLFxyXG4gICAgICAgIGp1bXBUcmlnZ2xlOmZhbHNlLFxyXG5cclxuICAgICAgICBqdW1wQXVkaW86e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuQXVkaW9DbGlwXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8g5pyA5aSn56e75Yqo6YCf5bqmXHJcbiAgICAgICAgbWF4TW92ZVNwZWVkOjAsXHJcbiAgICAgICAgLy8g5Yqg6YCf5bqmXHJcbiAgICAgICAgYWNjZWw6MCxcclxuXHJcbiAgICAgICAgLy8g5bem5Y+z55qE5aKZXHJcbiAgICAgICAgbWF4QmFja0xlZnRXYWxsOi01MDAsXHJcbiAgICAgICAgbWF4QmFja1JpZ2h0V2FsbDo1MDAsXHJcbiAgICB9LFxyXG5cclxuICAgIG9uTG9hZCAoKSB7XHJcbiAgICAgICAgLy8gMeOAgeinkuiJsum7mOiupOWKqOS9nCAtIOS4iuS4i+aoqui3s1xyXG4gICAgICAgIC8vIHRoaXMuanVtcEFjdGlvbiA9IHRoaXMuc2V0SnVtcEFjdGlvbigpO1xyXG4gICAgICAgIC8vIHRoaXMubm9kZS5ydW5BY3Rpb24odGhpcy5qdW1wQWN0aW9uKTtcclxuXHJcbiAgICAgICAgLy8gMuOAgeWKoOmAn+W6puaWueWQkeeahOW8gOWFs1xyXG4gICAgICAgIHRoaXMuYWNjTGVmdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYWNjUmlnaHQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy8g6Lez6LeD55qE5byA5YWzXHJcbiAgICAgICAgdGhpcy5qdW1wVHJpZ2dsZSA9IGZhbHNlLFxyXG5cclxuICAgICAgICAvLyAz44CB5b2T5YmN5rC05bmz5pa55ZCR55qE6YCf5bqmXHJcbiAgICAgICAgdGhpcy54U3BlZWQgPSAwO1xyXG5cclxuICAgICAgICAvLyA044CB5oyC6L296ZSu55uY5LqL5Lu2XHJcbiAgICAgICAgY2Muc3lzdGVtRXZlbnQub24oXHJcbiAgICAgICAgICAgIGNjLlN5c3RlbUV2ZW50LkV2ZW50VHlwZS5LRVlfRE9XTixcclxuICAgICAgICAgICAgdGhpcy5vbktleURvd24sXHJcbiAgICAgICAgICAgIHRoaXNcclxuICAgICAgICApO1xyXG4gICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9uKFxyXG4gICAgICAgICAgICBjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX1VQLFxyXG4gICAgICAgICAgICB0aGlzLm9uS2V5VXAsXHJcbiAgICAgICAgICAgIHRoaXNcclxuICAgICAgICApXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIOmUruebmOaMieS4i1xyXG4gICAgb25LZXlEb3duKGUpe1xyXG4gICAgICAgIHN3aXRjaChlLmtleUNvZGUpe1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5sZWZ0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5hY2NMZWZ0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5yaWdodDpcclxuICAgICAgICAgICAgICAgIHRoaXMuYWNjUmlnaHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgY2MubWFjcm8uS0VZLmFsdDpcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuanVtcFRyaWdnbGUgPT0gZmFsc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuanVtcFRyaWdnbGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMub25KdW1wQ2xpY2soKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICAvLyDplK7nm5jlvLnotbdcclxuICAgIG9uS2V5VXAoZSl7XHJcbiAgICAgICAgc3dpdGNoKGUua2V5Q29kZSl7XHJcbiAgICAgICAgICAgIGNhc2UgY2MubWFjcm8uS0VZLmxlZnQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjY0xlZnQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0WFNwZWVkSW5pdCgpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgY2MubWFjcm8uS0VZLnJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5hY2NSaWdodCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRYU3BlZWRJbml0KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkuYWx0OlxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIOiuvue9rui3s+i3g+WKqOS9nFxyXG4gICAgc2V0SnVtcEFjdGlvbjpmdW5jdGlvbiAoKXtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiAx44CBY2MubW92ZUJ577yM5Zyo5oyH5a6a55qE5pe26Ze077yM56e75Yqo5oyH5a6a55qE6Led56a7XHJcbiAgICAgICAgICogICAgICDlj4LmlbDkuIDvvIzliqjkvZzlrozmiJDnmoTml7bpl7RcclxuICAgICAgICAgKiAgICAgIOWPguaVsOS6jO+8jHYy5pivVmVjMu+8iOihqOekuiAyRCDlkJHph4/lkozlnZDmoIfvvInvvIzkvKDlhaV4K3nvvIzov5Tlm57kuIDkuKrlkJHph4/lr7nosaFcclxuICAgICAgICAgKiAgICAgIOi/lOWbnuWAvO+8jOaYr0FjdGlvbkludGVydmFs5a+56LGh77yM5piv5LiA5Liq5pe26Ze06Ze06ZqU5Yqo5L2c55qE57G777yMXHJcbiAgICAgICAgICogICAgICAgICAg55So5p2l6KGo56S66L+Z56eN5Yqo5L2c5Zyo5p+Q5LiA5Liq5pe26Ze06Ze06ZqU5YaF5a6M5oiQXHJcbiAgICAgICAgICogXHJcbiAgICAgICAgICogbW92ZUJ56K6+6K6h5LqG5aSa5oCB77yMXHJcbiAgICAgICAgICogICAgICDkuKTkuKrlj4LmlbDml7bvvJrlj4LmlbDkuozmmK/lkJHph4/lr7nosaFcclxuICAgICAgICAgKiAgICAgIOS4ieS4quWPguaVsOaXtu+8jOWPguaVsOS6jOaYr3jlnZDmoIfvvIzlj4LmlbDkuInmmK955Z2Q5qCHXHJcbiAgICAgICAgICogXHJcbiAgICAgICAgICogICAgICDms6jmhI/vvJrov5nph4znmoR45ZKMee+8jOaYr+S7peinkuiJsuWKqOS9nOeahOW9k+WJjeS9jee9ruiAjOiogOeahOOAguaYr+S4gOS4quebuOWvueS9jeenu+OAglxyXG4gICAgICAgICAqIFxyXG4gICAgICAgICAqIOaJgOS7pWp1bXBVcOaYr+aehOmAoOS6huS4gOS4quWQkeS4iui3s+i3g+eahOWKqOS9nO+8jGp1bXBEb3du5piv5LiL6JC955qE5Yqo5L2cXHJcbiAgICAgICAgICogXHJcbiAgICAgICAgICogMuOAgWVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25PdXQoKSlcclxuICAgICAgICAgKiAgICAgIGVhc2luZ+aYr0FjdGlvbkludGVydmFs5LiL55qE5pa55rOV77yM5Y+v5Lul6K6p5Yqo5L2c55qE5omn6KGM5ZGI546w5LiA5p2h5puy57q/77yM6ICM5LiN5piv55u057q/44CCXHJcbiAgICAgICAgICogICAgICDliqjkvZzmm7Lnur/mgLvlhbHmnIkyNOenjeOAglxyXG4gICAgICAgICAqICAgICAgRnJvbe+8mmh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9hcGkvemgvbW9kdWxlcy9jYy5odG1sI2Vhc2VjdWJpY2FjdGlvbm91dFxyXG4gICAgICAgICAqIFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIC8vIDHjgIHmkq3mlL7pn7PkuZBcclxuICAgICAgICBsZXQgY2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLnBsYXlKdW1wU291bmQsdGhpcyk7XHJcblxyXG4gICAgICAgIC8vIDLjgIHot7PotbdcclxuICAgICAgICBsZXQganVtcFVwID0gY2NcclxuICAgICAgICAgICAgLm1vdmVCeSh0aGlzLmp1bXBEdXJhdGlvbiwgY2MudjIoMCx0aGlzLmp1bXBIZWlnaHQpKVxyXG4gICAgICAgICAgICAuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbk91dCgpKTtcclxuICAgICAgICAvLyAz44CB5LiL6JC9XHJcbiAgICAgICAgbGV0IGp1bXBEb3duID0gY2NcclxuICAgICAgICAgICAgLm1vdmVCeSh0aGlzLmp1bXBEdXJhdGlvbiwgY2MudjIoMCwtdGhpcy5qdW1wSGVpZ2h0KSlcclxuICAgICAgICAgICAgLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25JbigpKTtcclxuICAgICAgICAvLyA044CB5bCG6Lez6LeD6ZSB5a6a5omT5byAXHJcbiAgICAgICAgbGV0IGFmdGVyQWN0aW9uID0gY2MuY2FsbEZ1bmMoKCk9PntcclxuICAgICAgICAgICAgdGhpcy5qdW1wVHJpZ2dsZSA9IGZhbHNlO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogMeOAgXNlcXVlbmNl77yM5Yqo5L2c5bqP5YiX77yM6YeM6Z2i55qE5piv5LiA6L+e5Liy55qE5Yqo5L2cXHJcbiAgICAgICAgICogMuOAgXJlcGVhdEZvcmV2ZXLvvIzliqjkvZzkuIDnm7TmiafooYxcclxuICAgICAgICAgKiAgICAgIOWPr+S7peS8oOWFpeS4gOS4quWbnuiwg+WHveaVsO+8jOWbnuiwg+WHveaVsOS8muWcqOS4pOS4quWKqOS9nOS6pOabv+eahOaXtuWAmeaJp+ihjFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJldHVybiBjYy5zZXF1ZW5jZShbY2FsbGJhY2ssanVtcFVwLGp1bXBEb3duLGFmdGVyQWN0aW9uXSlcclxuICAgIH0sXHJcbiAgICBwbGF5SnVtcFNvdW5kKCl7XHJcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmp1bXBBdWRpbyxmYWxzZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIOaMieS4i+i3s+i3g+mUrlxyXG4gICAgb25KdW1wQ2xpY2soKXtcclxuICAgICAgICB0aGlzLmp1bXBBY3Rpb24gPSB0aGlzLnNldEp1bXBBY3Rpb24oKTtcclxuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHRoaXMuanVtcEFjdGlvbik7XHJcbiAgICB9LFxyXG5cclxuICAgIFxyXG5cclxuICAgIFxyXG4gICAgLy8g5qiq5ZCRc3BlZWTlvZLpm7ZcclxuICAgIHNldFhTcGVlZEluaXQoKXtcclxuICAgICAgICB0aGlzLnhTcGVlZCA9IDA7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIOinhuWbvua4suafk+eahOavj+S4gOW4p++8jOWwhuS8muaJp+ihjOS4gOasoXVwZGF0ZVxyXG4gICAgdXBkYXRlIChkdCkge1xyXG4gICAgICAgIC8vIDHjgIHmoLnmja7kuKTkuKrlvIDlhbPvvIzmnaXorqHnrpflvZPliY3nmoR45pa55ZCR55qE5Yqg6YCf5bqmXHJcbiAgICAgICAgaWYodGhpcy5hY2NMZWZ0KXtcclxuICAgICAgICAgICAgdGhpcy54U3BlZWQgLT0gdGhpcy5hY2NlbCAqIGR0O1xyXG4gICAgICAgIH1lbHNlIGlmKHRoaXMuYWNjUmlnaHQpe1xyXG4gICAgICAgICAgICB0aGlzLnhTcGVlZCArPSB0aGlzLmFjY2VsICogZHQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAy44CB5Yik5pat5Yqg6YCf5bqm5piv5ZCm6LaF5Ye65pyA5aSn5Yqg6YCf5bqm77yM6LaF5Ye65YiZ6ZmQ5Yi2XHJcbiAgICAgICAgaWYoTWF0aC5hYnModGhpcy54U3BlZWQpID4gdGhpcy5tYXhNb3ZlU3BlZWQpe1xyXG4gICAgICAgICAgICAvLyDmsYLmraPotJ/lj7dcclxuICAgICAgICAgICAgbGV0IHRlbXAgPSB0aGlzLnhTcGVlZC9NYXRoLmFicyh0aGlzLnhTcGVlZCk7XHJcbiAgICAgICAgICAgIC8vIOmZkOWItnhTcGVlZOS4uuacgOWkp+WAvFxyXG4gICAgICAgICAgICB0aGlzLnhTcGVlZCA9IHRoaXMubWF4TW92ZVNwZWVkICogdGVtcDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIDPjgIHorr7nva7oioLngrnkvY3np7tcclxuICAgICAgICB0aGlzLm5vZGUueCA9IHRoaXMuY2FsY0xlZnRSaWdodCh0aGlzLm5vZGUueCAsIHRoaXMueFNwZWVkICogZHQpO1xyXG4gICAgfSxcclxuICAgIC8vIOajgOa1i+W3puWPs+WdkOagh++8jOadpemZkOWItuacgOWwj+WSjOacgOWkp+eahOW3puWPs+S9jeenu1xyXG4gICAgY2FsY0xlZnRSaWdodCh4LHRyYW5zbGF0ZSl7XHJcbiAgICAgICAgbGV0IHRlbXAgPSB4ICsgdHJhbnNsYXRlO1xyXG4gICAgICAgIGxldCB7XHJcbiAgICAgICAgICAgIG1heEJhY2tMZWZ0V2FsbCxcclxuICAgICAgICAgICAgbWF4QmFja1JpZ2h0V2FsbFxyXG4gICAgICAgIH0gPSB0aGlzO1xyXG4gICAgICAgIGlmKHRlbXAgPCAwICYmIE1hdGguYWJzKHRlbXApID4gTWF0aC5hYnMobWF4QmFja0xlZnRXYWxsKSApe1xyXG4gICAgICAgICAgICB0aGlzLnNldFhTcGVlZEluaXQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG1heEJhY2tMZWZ0V2FsbFxyXG4gICAgICAgIH1cclxuICAgICAgICBpZih0ZW1wID4gMCAmJiBNYXRoLmFicyh0ZW1wKSA+IE1hdGguYWJzKG1heEJhY2tSaWdodFdhbGwpICl7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0WFNwZWVkSW5pdCgpO1xyXG4gICAgICAgICAgICByZXR1cm4gbWF4QmFja1JpZ2h0V2FsbFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGVtcDtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIG9uRGVzdHJveSgpe1xyXG4gICAgICAgIC8vIOe7hOS7tumUgOavgeaXtu+8jOWwhue7keWumueahOmUruebmOS6i+S7tuino+e7kVxyXG4gICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9mZihcclxuICAgICAgICAgICAgY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9ET1dOLFxyXG4gICAgICAgICAgICB0aGlzLm9uS2V5RG93bixcclxuICAgICAgICAgICAgdGhpc1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgY2Muc3lzdGVtRXZlbnQub2ZmKFxyXG4gICAgICAgICAgICBjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX1VQLFxyXG4gICAgICAgICAgICB0aGlzLm9uS2V5VXAsXHJcbiAgICAgICAgICAgIHRoaXNcclxuICAgICAgICApXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9LFxyXG59KTtcclxuIl19