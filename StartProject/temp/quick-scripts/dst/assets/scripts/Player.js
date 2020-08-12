
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

    /**
     * 思考：如果要实现二段跳？
     *      改成int类型，判断是否大于2来进行锁定，落地归0
     */
    // 跳跃键的锁定，false不锁定，true锁定
    jumpLock: false,
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
    this.accRight = false; // 跳跃按键的锁定开关 - 防止用户按多次导致跳跃动作叠加

    this.jumpLock = false, // 3、当前水平方向的速度
    this.xSpeed = 0; // 4、挂载键盘事件，按下，弹起

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
      // 按下alt键，角色跳跃

      case cc.macro.KEY.alt:
        if (this.jumpLock == false) {
          this.jumpLock = true;
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
  // 播放跳跃音效
  playJumpSound: function playJumpSound() {
    cc.audioEngine.playEffect(this.jumpAudio, false);
  },
  // 按下跳跃键
  onJumpClick: function onJumpClick() {
    this.jumpAction = this.setJumpAction();
    this.node.runAction(this.jumpAction);
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
      _this.jumpLock = false;
    });
    /**
     * 1、sequence，动作序列，里面的是一连串的动作，可以传多个参数，也可以传一个动作数组
     * 2、repeatForever，动作一直执行
     *      可以传入一个回调函数，回调函数会在两个动作交替的时候执行
     */

    return cc.sequence([callback, jumpUp, jumpDown, afterAction]);
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
  }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcUGxheWVyLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwianVtcEhlaWdodCIsImp1bXBEdXJhdGlvbiIsImp1bXBMb2NrIiwianVtcEF1ZGlvIiwidHlwZSIsIkF1ZGlvQ2xpcCIsIm1heE1vdmVTcGVlZCIsImFjY2VsIiwibWF4QmFja0xlZnRXYWxsIiwibWF4QmFja1JpZ2h0V2FsbCIsIm9uTG9hZCIsImFjY0xlZnQiLCJhY2NSaWdodCIsInhTcGVlZCIsInN5c3RlbUV2ZW50Iiwib24iLCJTeXN0ZW1FdmVudCIsIkV2ZW50VHlwZSIsIktFWV9ET1dOIiwib25LZXlEb3duIiwiS0VZX1VQIiwib25LZXlVcCIsImUiLCJrZXlDb2RlIiwibWFjcm8iLCJLRVkiLCJsZWZ0IiwicmlnaHQiLCJhbHQiLCJvbkp1bXBDbGljayIsInNldFhTcGVlZEluaXQiLCJwbGF5SnVtcFNvdW5kIiwiYXVkaW9FbmdpbmUiLCJwbGF5RWZmZWN0IiwianVtcEFjdGlvbiIsInNldEp1bXBBY3Rpb24iLCJub2RlIiwicnVuQWN0aW9uIiwiY2FsbGJhY2siLCJjYWxsRnVuYyIsImp1bXBVcCIsIm1vdmVCeSIsInYyIiwiZWFzaW5nIiwiZWFzZUN1YmljQWN0aW9uT3V0IiwianVtcERvd24iLCJlYXNlQ3ViaWNBY3Rpb25JbiIsImFmdGVyQWN0aW9uIiwic2VxdWVuY2UiLCJ1cGRhdGUiLCJkdCIsIk1hdGgiLCJhYnMiLCJ0ZW1wIiwieCIsImNhbGNMZWZ0UmlnaHQiLCJ0cmFuc2xhdGUiLCJvbkRlc3Ryb3kiLCJvZmYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0w7QUFDQUMsRUFBQUEsVUFBVSxFQUFFO0FBQ1I7QUFDQUMsSUFBQUEs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QUFDSDs7QUFDRCxXQUFPNEMsSUFBUDtBQUNILEdBak1JO0FBbU1MSSxFQUFBQSxTQW5NSyx1QkFtTU07QUFDUDtBQUNBN0QsSUFBQUEsRUFBRSxDQUFDa0IsV0FBSCxDQUFlNEMsR0FBZixDQUNJOUQsRUFBRSxDQUFDb0IsV0FBSCxDQUFlQyxTQUFmLENBQXlCQyxRQUQ3QixFQUVJLEtBQUtDLFNBRlQsRUFHSSxJQUhKO0FBS0F2QixJQUFBQSxFQUFFLENBQUNrQixXQUFILENBQWU0QyxHQUFmLENBQ0k5RCxFQUFFLENBQUNvQixXQUFILENBQWVDLFNBQWYsQ0FBeUJHLE1BRDdCLEVBRUksS0FBS0MsT0FGVCxFQUdJLElBSEo7QUFLSDtBQS9NSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvLyBMZWFybiBjYy5DbGFzczpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvY2xhc3MuaHRtbFxyXG4vLyBMZWFybiBBdHRyaWJ1dGU6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL3JlZmVyZW5jZS9hdHRyaWJ1dGVzLmh0bWxcclxuLy8gTGVhcm4gbGlmZS1jeWNsZSBjYWxsYmFja3M6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL2xpZmUtY3ljbGUtY2FsbGJhY2tzLmh0bWxcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICAvLyDop5LoibLnmoTlkITnp43lsZ7mgKdcclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAvLyDot7Pot4Ppq5jluqZcclxuICAgICAgICBqdW1wSGVpZ2h0OjAsXHJcbiAgICAgICAgLy8g6Lez6LeD5oyB57ut5pe26Ze0XHJcbiAgICAgICAganVtcER1cmF0aW9uOjAsXHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIOaAneiAg++8muWmguaenOimgeWunueOsOS6jOautei3s++8n1xyXG4gICAgICAgICAqICAgICAg5pS55oiQaW5057G75Z6L77yM5Yik5pat5piv5ZCm5aSn5LqOMuadpei/m+ihjOmUgeWumu+8jOiQveWcsOW9kjBcclxuICAgICAgICAgKi9cclxuICAgICAgICAvLyDot7Pot4PplK7nmoTplIHlrprvvIxmYWxzZeS4jemUgeWumu+8jHRydWXplIHlrppcclxuICAgICAgICBqdW1wTG9jazpmYWxzZSxcclxuXHJcbiAgICAgICAganVtcEF1ZGlvOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLkF1ZGlvQ2xpcFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIOacgOWkp+enu+WKqOmAn+W6plxyXG4gICAgICAgIG1heE1vdmVTcGVlZDowLFxyXG4gICAgICAgIC8vIOWKoOmAn+W6plxyXG4gICAgICAgIGFjY2VsOjAsXHJcblxyXG4gICAgICAgIC8vIOW3puWPs+eahOWimVxyXG4gICAgICAgIG1heEJhY2tMZWZ0V2FsbDotNTAwLFxyXG4gICAgICAgIG1heEJhY2tSaWdodFdhbGw6NTAwLFxyXG4gICAgfSxcclxuXHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgICAgIC8vIDHjgIHop5LoibLpu5jorqTliqjkvZwgLSDkuIrkuIvmqKrot7NcclxuICAgICAgICAvLyB0aGlzLmp1bXBBY3Rpb24gPSB0aGlzLnNldEp1bXBBY3Rpb24oKTtcclxuICAgICAgICAvLyB0aGlzLm5vZGUucnVuQWN0aW9uKHRoaXMuanVtcEFjdGlvbik7XHJcblxyXG4gICAgICAgIC8vIDLjgIHliqDpgJ/luqbmlrnlkJHnmoTlvIDlhbNcclxuICAgICAgICB0aGlzLmFjY0xlZnQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmFjY1JpZ2h0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgIC8vIOi3s+i3g+aMiemUrueahOmUgeWumuW8gOWFsyAtIOmYsuatoueUqOaIt+aMieWkmuasoeWvvOiHtOi3s+i3g+WKqOS9nOWPoOWKoFxyXG4gICAgICAgIHRoaXMuanVtcExvY2sgPSBmYWxzZSxcclxuXHJcbiAgICAgICAgLy8gM+OAgeW9k+WJjeawtOW5s+aWueWQkeeahOmAn+W6plxyXG4gICAgICAgIHRoaXMueFNwZWVkID0gMDtcclxuXHJcbiAgICAgICAgLy8gNOOAgeaMgui9vemUruebmOS6i+S7tu+8jOaMieS4i++8jOW8uei1t1xyXG4gICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9uKFxyXG4gICAgICAgICAgICBjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX0RPV04sXHJcbiAgICAgICAgICAgIHRoaXMub25LZXlEb3duLFxyXG4gICAgICAgICAgICB0aGlzXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjYy5zeXN0ZW1FdmVudC5vbihcclxuICAgICAgICAgICAgY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9VUCxcclxuICAgICAgICAgICAgdGhpcy5vbktleVVwLFxyXG4gICAgICAgICAgICB0aGlzXHJcbiAgICAgICAgKVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyDplK7nm5jmjInkuItcclxuICAgIG9uS2V5RG93bihlKXtcclxuICAgICAgICBzd2l0Y2goZS5rZXlDb2RlKXtcclxuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkubGVmdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuYWNjTGVmdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkucmlnaHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjY1JpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAvLyDmjInkuIthbHTplK7vvIzop5LoibLot7Pot4NcclxuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkuYWx0OlxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5qdW1wTG9jayA9PSBmYWxzZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5qdW1wTG9jayA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5vbkp1bXBDbGljaygpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIC8vIOmUruebmOW8uei1t1xyXG4gICAgb25LZXlVcChlKXtcclxuICAgICAgICBzd2l0Y2goZS5rZXlDb2RlKXtcclxuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkubGVmdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuYWNjTGVmdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRYU3BlZWRJbml0KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkucmlnaHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjY1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFhTcGVlZEluaXQoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5hbHQ6XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8g5pKt5pS+6Lez6LeD6Z+z5pWIXHJcbiAgICBwbGF5SnVtcFNvdW5kKCl7XHJcbiAgICAgICAgY2MuYXVkaW9FbmdpbmUucGxheUVmZmVjdCh0aGlzLmp1bXBBdWRpbyxmYWxzZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIOaMieS4i+i3s+i3g+mUrlxyXG4gICAgb25KdW1wQ2xpY2soKXtcclxuICAgICAgICB0aGlzLmp1bXBBY3Rpb24gPSB0aGlzLnNldEp1bXBBY3Rpb24oKTtcclxuICAgICAgICB0aGlzLm5vZGUucnVuQWN0aW9uKHRoaXMuanVtcEFjdGlvbik7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIOiuvue9rui3s+i3g+WKqOS9nFxyXG4gICAgc2V0SnVtcEFjdGlvbjpmdW5jdGlvbiAoKXtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiAx44CBY2MubW92ZUJ577yM5Zyo5oyH5a6a55qE5pe26Ze077yM56e75Yqo5oyH5a6a55qE6Led56a7XHJcbiAgICAgICAgICogICAgICDlj4LmlbDkuIDvvIzliqjkvZzlrozmiJDnmoTml7bpl7RcclxuICAgICAgICAgKiAgICAgIOWPguaVsOS6jO+8jHYy5pivVmVjMu+8iOihqOekuiAyRCDlkJHph4/lkozlnZDmoIfvvInvvIzkvKDlhaV4K3nvvIzov5Tlm57kuIDkuKrlkJHph4/lr7nosaFcclxuICAgICAgICAgKiAgICAgIOi/lOWbnuWAvO+8jOaYr0FjdGlvbkludGVydmFs5a+56LGh77yM5piv5LiA5Liq5pe26Ze06Ze06ZqU5Yqo5L2c55qE57G777yMXHJcbiAgICAgICAgICogICAgICAgICAg55So5p2l6KGo56S66L+Z56eN5Yqo5L2c5Zyo5p+Q5LiA5Liq5pe26Ze06Ze06ZqU5YaF5a6M5oiQXHJcbiAgICAgICAgICogXHJcbiAgICAgICAgICogbW92ZUJ56K6+6K6h5LqG5aSa5oCB77yMXHJcbiAgICAgICAgICogICAgICDkuKTkuKrlj4LmlbDml7bvvJrlj4LmlbDkuozmmK/lkJHph4/lr7nosaFcclxuICAgICAgICAgKiAgICAgIOS4ieS4quWPguaVsOaXtu+8jOWPguaVsOS6jOaYr3jlnZDmoIfvvIzlj4LmlbDkuInmmK955Z2Q5qCHXHJcbiAgICAgICAgICogXHJcbiAgICAgICAgICogICAgICDms6jmhI/vvJrov5nph4znmoR45ZKMee+8jOaYr+S7peinkuiJsuWKqOS9nOeahOW9k+WJjeS9jee9ruiAjOiogOeahOOAguaYr+S4gOS4quebuOWvueS9jeenu+OAglxyXG4gICAgICAgICAqIFxyXG4gICAgICAgICAqIOaJgOS7pWp1bXBVcOaYr+aehOmAoOS6huS4gOS4quWQkeS4iui3s+i3g+eahOWKqOS9nO+8jGp1bXBEb3du5piv5LiL6JC955qE5Yqo5L2cXHJcbiAgICAgICAgICogXHJcbiAgICAgICAgICogMuOAgWVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25PdXQoKSlcclxuICAgICAgICAgKiAgICAgIGVhc2luZ+aYr0FjdGlvbkludGVydmFs5LiL55qE5pa55rOV77yM5Y+v5Lul6K6p5Yqo5L2c55qE5omn6KGM5ZGI546w5LiA5p2h5puy57q/77yM6ICM5LiN5piv55u057q/44CCXHJcbiAgICAgICAgICogICAgICDliqjkvZzmm7Lnur/mgLvlhbHmnIkyNOenjeOAglxyXG4gICAgICAgICAqICAgICAgRnJvbe+8mmh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9hcGkvemgvbW9kdWxlcy9jYy5odG1sI2Vhc2VjdWJpY2FjdGlvbm91dFxyXG4gICAgICAgICAqIFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIC8vIDHjgIHmkq3mlL7pn7PkuZBcclxuICAgICAgICBsZXQgY2FsbGJhY2sgPSBjYy5jYWxsRnVuYyh0aGlzLnBsYXlKdW1wU291bmQsdGhpcyk7XHJcblxyXG4gICAgICAgIC8vIDLjgIHot7PotbdcclxuICAgICAgICBsZXQganVtcFVwID0gY2NcclxuICAgICAgICAgICAgLm1vdmVCeSh0aGlzLmp1bXBEdXJhdGlvbiwgY2MudjIoMCx0aGlzLmp1bXBIZWlnaHQpKVxyXG4gICAgICAgICAgICAuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbk91dCgpKTtcclxuICAgICAgICAvLyAz44CB5LiL6JC9XHJcbiAgICAgICAgbGV0IGp1bXBEb3duID0gY2NcclxuICAgICAgICAgICAgLm1vdmVCeSh0aGlzLmp1bXBEdXJhdGlvbiwgY2MudjIoMCwtdGhpcy5qdW1wSGVpZ2h0KSlcclxuICAgICAgICAgICAgLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25JbigpKTtcclxuICAgICAgICAvLyA044CB5bCG6Lez6LeD6ZSB5a6a5omT5byAXHJcbiAgICAgICAgbGV0IGFmdGVyQWN0aW9uID0gY2MuY2FsbEZ1bmMoKCk9PntcclxuICAgICAgICAgICAgdGhpcy5qdW1wTG9jayA9IGZhbHNlO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogMeOAgXNlcXVlbmNl77yM5Yqo5L2c5bqP5YiX77yM6YeM6Z2i55qE5piv5LiA6L+e5Liy55qE5Yqo5L2c77yM5Y+v5Lul5Lyg5aSa5Liq5Y+C5pWw77yM5Lmf5Y+v5Lul5Lyg5LiA5Liq5Yqo5L2c5pWw57uEXHJcbiAgICAgICAgICogMuOAgXJlcGVhdEZvcmV2ZXLvvIzliqjkvZzkuIDnm7TmiafooYxcclxuICAgICAgICAgKiAgICAgIOWPr+S7peS8oOWFpeS4gOS4quWbnuiwg+WHveaVsO+8jOWbnuiwg+WHveaVsOS8muWcqOS4pOS4quWKqOS9nOS6pOabv+eahOaXtuWAmeaJp+ihjFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJldHVybiBjYy5zZXF1ZW5jZShbY2FsbGJhY2ssanVtcFVwLGp1bXBEb3duLGFmdGVyQWN0aW9uXSlcclxuICAgIH0sXHJcbiAgICBcclxuICAgIC8vIOaoquWQkXNwZWVk5b2S6Zu2XHJcbiAgICBzZXRYU3BlZWRJbml0KCl7XHJcbiAgICAgICAgdGhpcy54U3BlZWQgPSAwO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyDop4blm77muLLmn5PnmoTmr4/kuIDluKfvvIzlsIbkvJrmiafooYzkuIDmrKF1cGRhdGVcclxuICAgIHVwZGF0ZSAoZHQpIHtcclxuICAgICAgICAvLyAx44CB5qC55o2u5Lik5Liq5byA5YWz77yM5p2l6K6h566X5b2T5YmN55qEeOaWueWQkeeahOWKoOmAn+W6plxyXG4gICAgICAgIGlmKHRoaXMuYWNjTGVmdCl7XHJcbiAgICAgICAgICAgIHRoaXMueFNwZWVkIC09IHRoaXMuYWNjZWwgKiBkdDtcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLmFjY1JpZ2h0KXtcclxuICAgICAgICAgICAgdGhpcy54U3BlZWQgKz0gdGhpcy5hY2NlbCAqIGR0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gMuOAgeWIpOaWreWKoOmAn+W6puaYr+WQpui2heWHuuacgOWkp+WKoOmAn+W6pu+8jOi2heWHuuWImemZkOWItlxyXG4gICAgICAgIGlmKE1hdGguYWJzKHRoaXMueFNwZWVkKSA+IHRoaXMubWF4TW92ZVNwZWVkKXtcclxuICAgICAgICAgICAgLy8g5rGC5q2j6LSf5Y+3XHJcbiAgICAgICAgICAgIGxldCB0ZW1wID0gdGhpcy54U3BlZWQvTWF0aC5hYnModGhpcy54U3BlZWQpO1xyXG4gICAgICAgICAgICAvLyDpmZDliLZ4U3BlZWTkuLrmnIDlpKflgLxcclxuICAgICAgICAgICAgdGhpcy54U3BlZWQgPSB0aGlzLm1heE1vdmVTcGVlZCAqIHRlbXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAz44CB6K6+572u6IqC54K55L2N56e7XHJcbiAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLmNhbGNMZWZ0UmlnaHQodGhpcy5ub2RlLnggLCB0aGlzLnhTcGVlZCAqIGR0KTtcclxuICAgIH0sXHJcbiAgICAvLyDmo4DmtYvlt6blj7PlnZDmoIfvvIzmnaXpmZDliLbmnIDlsI/lkozmnIDlpKfnmoTlt6blj7PkvY3np7tcclxuICAgIGNhbGNMZWZ0UmlnaHQoeCx0cmFuc2xhdGUpe1xyXG4gICAgICAgIGxldCB0ZW1wID0geCArIHRyYW5zbGF0ZTtcclxuICAgICAgICBsZXQge1xyXG4gICAgICAgICAgICBtYXhCYWNrTGVmdFdhbGwsXHJcbiAgICAgICAgICAgIG1heEJhY2tSaWdodFdhbGxcclxuICAgICAgICB9ID0gdGhpcztcclxuICAgICAgICBpZih0ZW1wIDwgMCAmJiBNYXRoLmFicyh0ZW1wKSA+IE1hdGguYWJzKG1heEJhY2tMZWZ0V2FsbCkgKXtcclxuICAgICAgICAgICAgdGhpcy5zZXRYU3BlZWRJbml0KCk7XHJcbiAgICAgICAgICAgIHJldHVybiBtYXhCYWNrTGVmdFdhbGxcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYodGVtcCA+IDAgJiYgTWF0aC5hYnModGVtcCkgPiBNYXRoLmFicyhtYXhCYWNrUmlnaHRXYWxsKSApe1xyXG4gICAgICAgICAgICB0aGlzLnNldFhTcGVlZEluaXQoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG1heEJhY2tSaWdodFdhbGxcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRlbXA7XHJcbiAgICB9LFxyXG5cclxuICAgIG9uRGVzdHJveSgpe1xyXG4gICAgICAgIC8vIOe7hOS7tumUgOavgeaXtu+8jOWwhue7keWumueahOmUruebmOS6i+S7tuino+e7kVxyXG4gICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9mZihcclxuICAgICAgICAgICAgY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9ET1dOLFxyXG4gICAgICAgICAgICB0aGlzLm9uS2V5RG93bixcclxuICAgICAgICAgICAgdGhpc1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgY2Muc3lzdGVtRXZlbnQub2ZmKFxyXG4gICAgICAgICAgICBjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX1VQLFxyXG4gICAgICAgICAgICB0aGlzLm9uS2V5VXAsXHJcbiAgICAgICAgICAgIHRoaXNcclxuICAgICAgICApXHJcbiAgICB9LFxyXG59KTtcclxuIl19