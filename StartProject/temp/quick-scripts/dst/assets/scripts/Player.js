
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
  // 设置跳跃动作
  setJumpAction: function setJumpAction() {
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
    var jumpUp = cc.moveBy(this.jumpDuration, cc.v2(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
    var jumpDown = cc.moveBy(this.jumpDuration, cc.v2(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
    var callback = cc.callFunc(this.playJumpSound, this);
    /**
     * 1、sequence，两个动作交替进行
     * 2、repeatForever，动作一直执行
     *      可以传入一个回调函数，回调函数会在两个动作交替的时候执行
     */

    return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
  },
  playJumpSound: function playJumpSound() {
    cc.audioEngine.playEffect(this.jumpAudio, false);
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
    }
  },
  // 键盘弹起
  onKeyUp: function onKeyUp(e) {
    switch (e.keyCode) {
      case cc.macro.KEY.left:
        this.accLeft = false;
        break;

      case cc.macro.KEY.right:
        this.accRight = false;
        break;
    }
  },
  onLoad: function onLoad() {
    // 1、角色默认动作 - 上下横跳
    this.jumpAction = this.setJumpAction();
    this.node.runAction(this.jumpAction); // 2、加速度方向的开关

    this.accLeft = false;
    this.accRight = false; // 3、当前水平方向的速度

    this.xSpeed = 0; // 4、挂载键盘事件

    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
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
      this.xSpeed = 0;
      return maxBackLeftWall;
    }

    if (temp > 0 && Math.abs(temp) > Math.abs(maxBackRightWall)) {
      this.xSpeed = 0;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcUGxheWVyLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwianVtcEhlaWdodCIsImp1bXBEdXJhdGlvbiIsImp1bXBBdWRpbyIsInR5cGUiLCJBdWRpb0NsaXAiLCJtYXhNb3ZlU3BlZWQiLCJhY2NlbCIsIm1heEJhY2tMZWZ0V2FsbCIsIm1heEJhY2tSaWdodFdhbGwiLCJzZXRKdW1wQWN0aW9uIiwianVtcFVwIiwibW92ZUJ5IiwidjIiLCJlYXNpbmciLCJlYXNlQ3ViaWNBY3Rpb25PdXQiLCJqdW1wRG93biIsImVhc2VDdWJpY0FjdGlvbkluIiwiY2FsbGJhY2siLCJjYWxsRnVuYyIsInBsYXlKdW1wU291bmQiLCJyZXBlYXRGb3JldmVyIiwic2VxdWVuY2UiLCJhdWRpb0VuZ2luZSIsInBsYXlFZmZlY3QiLCJvbktleURvd24iLCJlIiwia2V5Q29kZSIsIm1hY3JvIiwiS0VZIiwibGVmdCIsImFjY0xlZnQiLCJyaWdodCIsImFjY1JpZ2h0Iiwib25LZXlVcCIsIm9uTG9hZCIsImp1bXBBY3Rpb24iLCJub2RlIiwicnVuQWN0aW9uIiwieFNwZWVkIiwic3lzdGVtRXZlbnQiLCJvbiIsIlN5c3RlbUV2ZW50IiwiRXZlbnRUeXBlIiwiS0VZX0RPV04iLCJLRVlfVVAiLCJ1cGRhdGUiLCJkdCIsIk1hdGgiLCJhYnMiLCJ0ZW1wIiwieCIsImNhbGNMZWZ0UmlnaHQiLCJ0cmFuc2xhdGUiLCJvbkRlc3Ryb3kiLCJvZmYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0w7QUFDQUMsRUFBQUEsVUFBVSxFQUFFO0FBQ1I7QUFDQUMsSUFBQUEsVUFBVSxFQUFDLENBRkg7QUFHUjtBQUNBQyxJQUFBQSxZQUFZLEVBQUMsQ0FK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LENBQVNDLElBQVQsSUFBaUJGLElBQUksQ0FBQ0MsR0FBTCxDQUFTekMsZUFBVCxDQUFoQyxFQUEyRDtBQUN2RCxXQUFLK0IsTUFBTCxHQUFjLENBQWQ7QUFDQSxhQUFPL0IsZUFBUDtBQUNIOztBQUNELFFBQUcwQyxJQUFJLEdBQUcsQ0FBUCxJQUFZRixJQUFJLENBQUNDLEdBQUwsQ0FBU0MsSUFBVCxJQUFpQkYsSUFBSSxDQUFDQyxHQUFMLENBQVN4QyxnQkFBVCxDQUFoQyxFQUE0RDtBQUN4RCxXQUFLOEIsTUFBTCxHQUFjLENBQWQ7QUFDQSxhQUFPOUIsZ0JBQVA7QUFDSDs7QUFDRCxXQUFPeUMsSUFBUDtBQUNILEdBdkpJO0FBMEpMSSxFQUFBQSxTQTFKSyx1QkEwSk07QUFDUDtBQUNBekQsSUFBQUEsRUFBRSxDQUFDMkMsV0FBSCxDQUFlZSxHQUFmLENBQ0kxRCxFQUFFLENBQUM2QyxXQUFILENBQWVDLFNBQWYsQ0FBeUJDLFFBRDdCLEVBRUksS0FBS25CLFNBRlQsRUFHSSxJQUhKO0FBS0E1QixJQUFBQSxFQUFFLENBQUMyQyxXQUFILENBQWVlLEdBQWYsQ0FDSTFELEVBQUUsQ0FBQzZDLFdBQUgsQ0FBZUMsU0FBZixDQUF5QkUsTUFEN0IsRUFFSSxLQUFLWCxPQUZULEVBR0ksSUFISjtBQUtILEdBdEtJLENBd0tMOztBQXhLSyxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvLyBMZWFybiBjYy5DbGFzczpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvY2xhc3MuaHRtbFxyXG4vLyBMZWFybiBBdHRyaWJ1dGU6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL3JlZmVyZW5jZS9hdHRyaWJ1dGVzLmh0bWxcclxuLy8gTGVhcm4gbGlmZS1jeWNsZSBjYWxsYmFja3M6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL2xpZmUtY3ljbGUtY2FsbGJhY2tzLmh0bWxcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICAvLyDop5LoibLnmoTlkITnp43lsZ7mgKdcclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAvLyDot7Pot4Ppq5jluqZcclxuICAgICAgICBqdW1wSGVpZ2h0OjAsXHJcbiAgICAgICAgLy8g6Lez6LeD5oyB57ut5pe26Ze0XHJcbiAgICAgICAganVtcER1cmF0aW9uOjAsXHJcblxyXG4gICAgICAgIGp1bXBBdWRpbzp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5BdWRpb0NsaXBcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDmnIDlpKfnp7vliqjpgJ/luqZcclxuICAgICAgICBtYXhNb3ZlU3BlZWQ6MCxcclxuICAgICAgICAvLyDliqDpgJ/luqZcclxuICAgICAgICBhY2NlbDowLFxyXG5cclxuICAgICAgICAvLyDlt6blj7PnmoTloplcclxuICAgICAgICBtYXhCYWNrTGVmdFdhbGw6LTUwMCxcclxuICAgICAgICBtYXhCYWNrUmlnaHRXYWxsOjUwMCxcclxuICAgIH0sXHJcblxyXG4gICAgLy8g6K6+572u6Lez6LeD5Yqo5L2cXHJcbiAgICBzZXRKdW1wQWN0aW9uOmZ1bmN0aW9uICgpe1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIDHjgIFjYy5tb3ZlQnnvvIzlnKjmjIflrprnmoTml7bpl7TvvIznp7vliqjmjIflrprnmoTot53nprtcclxuICAgICAgICAgKiAgICAgIOWPguaVsOS4gO+8jOWKqOS9nOWujOaIkOeahOaXtumXtFxyXG4gICAgICAgICAqICAgICAg5Y+C5pWw5LqM77yMdjLmmK9WZWMy77yI6KGo56S6IDJEIOWQkemHj+WSjOWdkOagh++8ie+8jOS8oOWFpXgree+8jOi/lOWbnuS4gOS4quWQkemHj+WvueixoVxyXG4gICAgICAgICAqICAgICAg6L+U5Zue5YC877yM5pivQWN0aW9uSW50ZXJ2YWzlr7nosaHvvIzmmK/kuIDkuKrml7bpl7Tpl7TpmpTliqjkvZznmoTnsbvvvIxcclxuICAgICAgICAgKiAgICAgICAgICDnlKjmnaXooajnpLrov5nnp43liqjkvZzlnKjmn5DkuIDkuKrml7bpl7Tpl7TpmpTlhoXlrozmiJBcclxuICAgICAgICAgKiBcclxuICAgICAgICAgKiBtb3ZlQnnorr7orqHkuoblpJrmgIHvvIxcclxuICAgICAgICAgKiAgICAgIOS4pOS4quWPguaVsOaXtu+8muWPguaVsOS6jOaYr+WQkemHj+WvueixoVxyXG4gICAgICAgICAqICAgICAg5LiJ5Liq5Y+C5pWw5pe277yM5Y+C5pWw5LqM5piveOWdkOagh++8jOWPguaVsOS4ieaYr3nlnZDmoIdcclxuICAgICAgICAgKiBcclxuICAgICAgICAgKiAgICAgIOazqOaEj++8mui/memHjOeahHjlkox577yM5piv5Lul6KeS6Imy5Yqo5L2c55qE5b2T5YmN5L2N572u6ICM6KiA55qE44CC5piv5LiA5Liq55u45a+55L2N56e744CCXHJcbiAgICAgICAgICogXHJcbiAgICAgICAgICog5omA5LulanVtcFVw5piv5p6E6YCg5LqG5LiA5Liq5ZCR5LiK6Lez6LeD55qE5Yqo5L2c77yManVtcERvd27mmK/kuIvokL3nmoTliqjkvZxcclxuICAgICAgICAgKiBcclxuICAgICAgICAgKiAy44CBZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbk91dCgpKVxyXG4gICAgICAgICAqICAgICAgZWFzaW5n5pivQWN0aW9uSW50ZXJ2YWzkuIvnmoTmlrnms5XvvIzlj6/ku6XorqnliqjkvZznmoTmiafooYzlkYjnjrDkuIDmnaHmm7Lnur/vvIzogIzkuI3mmK/nm7Tnur/jgIJcclxuICAgICAgICAgKiAgICAgIOWKqOS9nOabsue6v+aAu+WFseaciTI056eN44CCXHJcbiAgICAgICAgICogICAgICBGcm9t77yaaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL2FwaS96aC9tb2R1bGVzL2NjLmh0bWwjZWFzZWN1YmljYWN0aW9ub3V0XHJcbiAgICAgICAgICogXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgbGV0IGp1bXBVcCA9IGNjXHJcbiAgICAgICAgICAgIC5tb3ZlQnkodGhpcy5qdW1wRHVyYXRpb24sIGNjLnYyKDAsdGhpcy5qdW1wSGVpZ2h0KSlcclxuICAgICAgICAgICAgLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25PdXQoKSk7XHJcbiAgICAgICAgbGV0IGp1bXBEb3duID0gY2NcclxuICAgICAgICAgICAgLm1vdmVCeSh0aGlzLmp1bXBEdXJhdGlvbiwgY2MudjIoMCwtdGhpcy5qdW1wSGVpZ2h0KSlcclxuICAgICAgICAgICAgLmVhc2luZyhjYy5lYXNlQ3ViaWNBY3Rpb25JbigpKTtcclxuXHJcbiAgICAgICAgbGV0IGNhbGxiYWNrID0gY2MuY2FsbEZ1bmModGhpcy5wbGF5SnVtcFNvdW5kLHRoaXMpO1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIDHjgIFzZXF1ZW5jZe+8jOS4pOS4quWKqOS9nOS6pOabv+i/m+ihjFxyXG4gICAgICAgICAqIDLjgIFyZXBlYXRGb3JldmVy77yM5Yqo5L2c5LiA55u05omn6KGMXHJcbiAgICAgICAgICogICAgICDlj6/ku6XkvKDlhaXkuIDkuKrlm57osIPlh73mlbDvvIzlm57osIPlh73mlbDkvJrlnKjkuKTkuKrliqjkvZzkuqTmm7/nmoTml7blgJnmiafooYxcclxuICAgICAgICAgKi9cclxuICAgICAgICByZXR1cm4gY2MucmVwZWF0Rm9yZXZlcihjYy5zZXF1ZW5jZShqdW1wVXAsanVtcERvd24sY2FsbGJhY2spKVxyXG4gICAgfSxcclxuICAgIHBsYXlKdW1wU291bmQoKXtcclxuICAgICAgICBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KHRoaXMuanVtcEF1ZGlvLGZhbHNlKTtcclxuICAgIH0sXHJcblxyXG4gICAgLy8g6ZSu55uY5oyJ5LiLXHJcbiAgICBvbktleURvd24oZSl7XHJcbiAgICAgICAgc3dpdGNoKGUua2V5Q29kZSl7XHJcbiAgICAgICAgICAgIGNhc2UgY2MubWFjcm8uS0VZLmxlZnQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjY0xlZnQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgY2MubWFjcm8uS0VZLnJpZ2h0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5hY2NSaWdodCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgLy8g6ZSu55uY5by56LW3XHJcbiAgICBvbktleVVwKGUpe1xyXG4gICAgICAgIHN3aXRjaChlLmtleUNvZGUpe1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5sZWZ0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5hY2NMZWZ0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkucmlnaHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjY1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG9uTG9hZCAoKSB7XHJcbiAgICAgICAgLy8gMeOAgeinkuiJsum7mOiupOWKqOS9nCAtIOS4iuS4i+aoqui3s1xyXG4gICAgICAgIHRoaXMuanVtcEFjdGlvbiA9IHRoaXMuc2V0SnVtcEFjdGlvbigpO1xyXG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24odGhpcy5qdW1wQWN0aW9uKTtcclxuXHJcbiAgICAgICAgLy8gMuOAgeWKoOmAn+W6puaWueWQkeeahOW8gOWFs1xyXG4gICAgICAgIHRoaXMuYWNjTGVmdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYWNjUmlnaHQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy8gM+OAgeW9k+WJjeawtOW5s+aWueWQkeeahOmAn+W6plxyXG4gICAgICAgIHRoaXMueFNwZWVkID0gMDtcclxuXHJcbiAgICAgICAgLy8gNOOAgeaMgui9vemUruebmOS6i+S7tlxyXG4gICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9uKFxyXG4gICAgICAgICAgICBjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX0RPV04sXHJcbiAgICAgICAgICAgIHRoaXMub25LZXlEb3duLFxyXG4gICAgICAgICAgICB0aGlzXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjYy5zeXN0ZW1FdmVudC5vbihcclxuICAgICAgICAgICAgY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9VUCxcclxuICAgICAgICAgICAgdGhpcy5vbktleVVwLFxyXG4gICAgICAgICAgICB0aGlzXHJcbiAgICAgICAgKVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyDop4blm77muLLmn5PnmoTmr4/kuIDluKfvvIzlsIbkvJrmiafooYzkuIDmrKF1cGRhdGVcclxuICAgIHVwZGF0ZSAoZHQpIHtcclxuICAgICAgICAvLyAx44CB5qC55o2u5Lik5Liq5byA5YWz77yM5p2l6K6h566X5b2T5YmN55qEeOaWueWQkeeahOWKoOmAn+W6plxyXG4gICAgICAgIGlmKHRoaXMuYWNjTGVmdCl7XHJcbiAgICAgICAgICAgIHRoaXMueFNwZWVkIC09IHRoaXMuYWNjZWwgKiBkdDtcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLmFjY1JpZ2h0KXtcclxuICAgICAgICAgICAgdGhpcy54U3BlZWQgKz0gdGhpcy5hY2NlbCAqIGR0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gMuOAgeWIpOaWreWKoOmAn+W6puaYr+WQpui2heWHuuacgOWkp+WKoOmAn+W6pu+8jOi2heWHuuWImemZkOWItlxyXG4gICAgICAgIGlmKE1hdGguYWJzKHRoaXMueFNwZWVkKSA+IHRoaXMubWF4TW92ZVNwZWVkKXtcclxuICAgICAgICAgICAgLy8g5rGC5q2j6LSf5Y+3XHJcbiAgICAgICAgICAgIGxldCB0ZW1wID0gdGhpcy54U3BlZWQvTWF0aC5hYnModGhpcy54U3BlZWQpO1xyXG4gICAgICAgICAgICAvLyDpmZDliLZ4U3BlZWTkuLrmnIDlpKflgLxcclxuICAgICAgICAgICAgdGhpcy54U3BlZWQgPSB0aGlzLm1heE1vdmVTcGVlZCAqIHRlbXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAz44CB6K6+572u6IqC54K55L2N56e7XHJcbiAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLmNhbGNMZWZ0UmlnaHQodGhpcy5ub2RlLnggLCB0aGlzLnhTcGVlZCAqIGR0KTtcclxuICAgIH0sXHJcbiAgICAvLyDmo4DmtYvlt6blj7PlnZDmoIfvvIzmnaXpmZDliLbmnIDlsI/lkozmnIDlpKfnmoTlt6blj7PkvY3np7tcclxuICAgIGNhbGNMZWZ0UmlnaHQoeCx0cmFuc2xhdGUpe1xyXG4gICAgICAgIGxldCB0ZW1wID0geCArIHRyYW5zbGF0ZTtcclxuICAgICAgICBsZXQge1xyXG4gICAgICAgICAgICBtYXhCYWNrTGVmdFdhbGwsXHJcbiAgICAgICAgICAgIG1heEJhY2tSaWdodFdhbGxcclxuICAgICAgICB9ID0gdGhpcztcclxuICAgICAgICBpZih0ZW1wIDwgMCAmJiBNYXRoLmFicyh0ZW1wKSA+IE1hdGguYWJzKG1heEJhY2tMZWZ0V2FsbCkgKXtcclxuICAgICAgICAgICAgdGhpcy54U3BlZWQgPSAwO1xyXG4gICAgICAgICAgICByZXR1cm4gbWF4QmFja0xlZnRXYWxsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRlbXAgPiAwICYmIE1hdGguYWJzKHRlbXApID4gTWF0aC5hYnMobWF4QmFja1JpZ2h0V2FsbCkgKXtcclxuICAgICAgICAgICAgdGhpcy54U3BlZWQgPSAwO1xyXG4gICAgICAgICAgICByZXR1cm4gbWF4QmFja1JpZ2h0V2FsbFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGVtcDtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIG9uRGVzdHJveSgpe1xyXG4gICAgICAgIC8vIOe7hOS7tumUgOavgeaXtu+8jOWwhue7keWumueahOmUruebmOS6i+S7tuino+e7kVxyXG4gICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9mZihcclxuICAgICAgICAgICAgY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9ET1dOLFxyXG4gICAgICAgICAgICB0aGlzLm9uS2V5RG93bixcclxuICAgICAgICAgICAgdGhpc1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgY2Muc3lzdGVtRXZlbnQub2ZmKFxyXG4gICAgICAgICAgICBjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX1VQLFxyXG4gICAgICAgICAgICB0aGlzLm9uS2V5VXAsXHJcbiAgICAgICAgICAgIHRoaXNcclxuICAgICAgICApXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9LFxyXG59KTtcclxuIl19