
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
    /**
     * 1、sequence，两个动作交替进行
     * 2、repeatForever，动作一直执行
     */

    return cc.repeatForever(cc.sequence(jumpUp, jumpDown));
  },
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcUGxheWVyLmpzIl0sIm5hbWVzIjpbImNjIiwiQ2xhc3MiLCJDb21wb25lbnQiLCJwcm9wZXJ0aWVzIiwianVtcEhlaWdodCIsImp1bXBEdXJhdGlvbiIsIm1heE1vdmVTcGVlZCIsImFjY2VsIiwibWF4QmFja0xlZnRXYWxsIiwibWF4QmFja1JpZ2h0V2FsbCIsInNldEp1bXBBY3Rpb24iLCJqdW1wVXAiLCJtb3ZlQnkiLCJ2MiIsImVhc2luZyIsImVhc2VDdWJpY0FjdGlvbk91dCIsImp1bXBEb3duIiwiZWFzZUN1YmljQWN0aW9uSW4iLCJyZXBlYXRGb3JldmVyIiwic2VxdWVuY2UiLCJvbktleURvd24iLCJlIiwia2V5Q29kZSIsIm1hY3JvIiwiS0VZIiwibGVmdCIsImFjY0xlZnQiLCJyaWdodCIsImFjY1JpZ2h0Iiwib25LZXlVcCIsIm9uTG9hZCIsImp1bXBBY3Rpb24iLCJub2RlIiwicnVuQWN0aW9uIiwieFNwZWVkIiwic3lzdGVtRXZlbnQiLCJvbiIsIlN5c3RlbUV2ZW50IiwiRXZlbnRUeXBlIiwiS0VZX0RPV04iLCJLRVlfVVAiLCJ1cGRhdGUiLCJkdCIsIk1hdGgiLCJhYnMiLCJ0ZW1wIiwieCIsImNhbGNMZWZ0UmlnaHQiLCJ0cmFuc2xhdGUiLCJvbkRlc3Ryb3kiLCJvZmYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0w7QUFDQUMsRUFBQUEsVUFBVSxFQUFFO0FBQ1I7QUFDQUMsSUFBQUEsVUFBVSxFQUFDLENBRkg7QUFHUjtBQUNBQyxJQUFBQSxZQUFZLEVBQUMsQ0FKTDtBQUtSO0FBQ0FDLElBQUFBLFlBQVksRUFBQyxDQU5MO0FBT1I7QUFDQUMsSUFBQUEsS0FBSyxFQUFDLENBUkU7QUFVUjtBQUNBQyxJQUFBQSxlQUFlLEVBQUMsQ0FB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QUFlQyxTQUFmLENBQXlCQyxRQUQ3QixFQUVJLEtBQUtuQixTQUZULEVBR0ksSUFISjtBQUtBcEIsSUFBQUEsRUFBRSxDQUFDbUMsV0FBSCxDQUFlZSxHQUFmLENBQ0lsRCxFQUFFLENBQUNxQyxXQUFILENBQWVDLFNBQWYsQ0FBeUJFLE1BRDdCLEVBRUksS0FBS1gsT0FGVCxFQUdJLElBSEo7QUFLSCxHQXpKSSxDQTJKTDs7QUEzSkssQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTGVhcm4gY2MuQ2xhc3M6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL2NsYXNzLmh0bWxcclxuLy8gTGVhcm4gQXR0cmlidXRlOlxyXG4vLyAgLSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9yZWZlcmVuY2UvYXR0cmlidXRlcy5odG1sXHJcbi8vIExlYXJuIGxpZmUtY3ljbGUgY2FsbGJhY2tzOlxyXG4vLyAgLSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9saWZlLWN5Y2xlLWNhbGxiYWNrcy5odG1sXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgLy8g6KeS6Imy55qE5ZCE56eN5bGe5oCnXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLy8g6Lez6LeD6auY5bqmXHJcbiAgICAgICAganVtcEhlaWdodDowLFxyXG4gICAgICAgIC8vIOi3s+i3g+aMgee7reaXtumXtFxyXG4gICAgICAgIGp1bXBEdXJhdGlvbjowLFxyXG4gICAgICAgIC8vIOacgOWkp+enu+WKqOmAn+W6plxyXG4gICAgICAgIG1heE1vdmVTcGVlZDowLFxyXG4gICAgICAgIC8vIOWKoOmAn+W6plxyXG4gICAgICAgIGFjY2VsOjAsXHJcblxyXG4gICAgICAgIC8vIOW3puWPs+eahOWimVxyXG4gICAgICAgIG1heEJhY2tMZWZ0V2FsbDotNTAwLFxyXG4gICAgICAgIG1heEJhY2tSaWdodFdhbGw6NTAwLFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyDorr7nva7ot7Pot4PliqjkvZxcclxuICAgIHNldEp1bXBBY3Rpb246ZnVuY3Rpb24gKCl7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogMeOAgWNjLm1vdmVCee+8jOWcqOaMh+WumueahOaXtumXtO+8jOenu+WKqOaMh+WumueahOi3neemu1xyXG4gICAgICAgICAqICAgICAg5Y+C5pWw5LiA77yM5Yqo5L2c5a6M5oiQ55qE5pe26Ze0XHJcbiAgICAgICAgICogICAgICDlj4LmlbDkuozvvIx2MuaYr1ZlYzLvvIjooajnpLogMkQg5ZCR6YeP5ZKM5Z2Q5qCH77yJ77yM5Lyg5YWleCt577yM6L+U5Zue5LiA5Liq5ZCR6YeP5a+56LGhXHJcbiAgICAgICAgICogICAgICDov5Tlm57lgLzvvIzmmK9BY3Rpb25JbnRlcnZhbOWvueixoe+8jOaYr+S4gOS4quaXtumXtOmXtOmalOWKqOS9nOeahOexu++8jFxyXG4gICAgICAgICAqICAgICAgICAgIOeUqOadpeihqOekuui/meenjeWKqOS9nOWcqOafkOS4gOS4quaXtumXtOmXtOmalOWGheWujOaIkFxyXG4gICAgICAgICAqIFxyXG4gICAgICAgICAqIG1vdmVCeeiuvuiuoeS6huWkmuaAge+8jFxyXG4gICAgICAgICAqICAgICAg5Lik5Liq5Y+C5pWw5pe277ya5Y+C5pWw5LqM5piv5ZCR6YeP5a+56LGhXHJcbiAgICAgICAgICogICAgICDkuInkuKrlj4LmlbDml7bvvIzlj4LmlbDkuozmmK945Z2Q5qCH77yM5Y+C5pWw5LiJ5piveeWdkOagh1xyXG4gICAgICAgICAqIFxyXG4gICAgICAgICAqICAgICAg5rOo5oSP77ya6L+Z6YeM55qEeOWSjHnvvIzmmK/ku6Xop5LoibLliqjkvZznmoTlvZPliY3kvY3nva7ogIzoqIDnmoTjgILmmK/kuIDkuKrnm7jlr7nkvY3np7vjgIJcclxuICAgICAgICAgKiBcclxuICAgICAgICAgKiDmiYDku6VqdW1wVXDmmK/mnoTpgKDkuobkuIDkuKrlkJHkuIrot7Pot4PnmoTliqjkvZzvvIxqdW1wRG93buaYr+S4i+iQveeahOWKqOS9nFxyXG4gICAgICAgICAqIFxyXG4gICAgICAgICAqIDLjgIFlYXNpbmcoY2MuZWFzZUN1YmljQWN0aW9uT3V0KCkpXHJcbiAgICAgICAgICogICAgICBlYXNpbmfmmK9BY3Rpb25JbnRlcnZhbOS4i+eahOaWueazle+8jOWPr+S7peiuqeWKqOS9nOeahOaJp+ihjOWRiOeOsOS4gOadoeabsue6v++8jOiAjOS4jeaYr+ebtOe6v+OAglxyXG4gICAgICAgICAqICAgICAg5Yqo5L2c5puy57q/5oC75YWx5pyJMjTnp43jgIJcclxuICAgICAgICAgKiAgICAgIEZyb23vvJpodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvYXBpL3poL21vZHVsZXMvY2MuaHRtbCNlYXNlY3ViaWNhY3Rpb25vdXRcclxuICAgICAgICAgKiBcclxuICAgICAgICAgKi9cclxuICAgICAgICBsZXQganVtcFVwID0gY2NcclxuICAgICAgICAgICAgLm1vdmVCeSh0aGlzLmp1bXBEdXJhdGlvbiwgY2MudjIoMCx0aGlzLmp1bXBIZWlnaHQpKVxyXG4gICAgICAgICAgICAuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbk91dCgpKTtcclxuICAgICAgICBsZXQganVtcERvd24gPSBjY1xyXG4gICAgICAgICAgICAubW92ZUJ5KHRoaXMuanVtcER1cmF0aW9uLCBjYy52MigwLC10aGlzLmp1bXBIZWlnaHQpKVxyXG4gICAgICAgICAgICAuZWFzaW5nKGNjLmVhc2VDdWJpY0FjdGlvbkluKCkpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiAx44CBc2VxdWVuY2XvvIzkuKTkuKrliqjkvZzkuqTmm7/ov5vooYxcclxuICAgICAgICAgKiAy44CBcmVwZWF0Rm9yZXZlcu+8jOWKqOS9nOS4gOebtOaJp+ihjFxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIHJldHVybiBjYy5yZXBlYXRGb3JldmVyKGNjLnNlcXVlbmNlKGp1bXBVcCxqdW1wRG93bikpXHJcbiAgICB9LFxyXG5cclxuICAgIG9uS2V5RG93bihlKXtcclxuICAgICAgICBzd2l0Y2goZS5rZXlDb2RlKXtcclxuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkubGVmdDpcclxuICAgICAgICAgICAgICAgIHRoaXMuYWNjTGVmdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkucmlnaHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjY1JpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvbktleVVwKGUpe1xyXG4gICAgICAgIHN3aXRjaChlLmtleUNvZGUpe1xyXG4gICAgICAgICAgICBjYXNlIGNjLm1hY3JvLktFWS5sZWZ0OlxyXG4gICAgICAgICAgICAgICAgdGhpcy5hY2NMZWZ0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSBjYy5tYWNyby5LRVkucmlnaHQ6XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFjY1JpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIG9uTG9hZCAoKSB7XHJcbiAgICAgICAgLy8gMeOAgeinkuiJsum7mOiupOWKqOS9nCAtIOS4iuS4i+aoqui3s1xyXG4gICAgICAgIHRoaXMuanVtcEFjdGlvbiA9IHRoaXMuc2V0SnVtcEFjdGlvbigpO1xyXG4gICAgICAgIHRoaXMubm9kZS5ydW5BY3Rpb24odGhpcy5qdW1wQWN0aW9uKTtcclxuXHJcbiAgICAgICAgLy8gMuOAgeWKoOmAn+W6puaWueWQkeeahOW8gOWFs1xyXG4gICAgICAgIHRoaXMuYWNjTGVmdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuYWNjUmlnaHQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgLy8gM+OAgeW9k+WJjeawtOW5s+aWueWQkeeahOmAn+W6plxyXG4gICAgICAgIHRoaXMueFNwZWVkID0gMDtcclxuXHJcbiAgICAgICAgLy8gNOOAgeaMgui9vemUruebmOS6i+S7tlxyXG4gICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9uKFxyXG4gICAgICAgICAgICBjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX0RPV04sXHJcbiAgICAgICAgICAgIHRoaXMub25LZXlEb3duLFxyXG4gICAgICAgICAgICB0aGlzXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjYy5zeXN0ZW1FdmVudC5vbihcclxuICAgICAgICAgICAgY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9VUCxcclxuICAgICAgICAgICAgdGhpcy5vbktleVVwLFxyXG4gICAgICAgICAgICB0aGlzXHJcbiAgICAgICAgKVxyXG4gICAgfSxcclxuXHJcbiAgICAvLyDop4blm77muLLmn5PnmoTmr4/kuIDluKfvvIzlsIbkvJrmiafooYzkuIDmrKF1cGRhdGVcclxuICAgIHVwZGF0ZSAoZHQpIHtcclxuICAgICAgICAvLyAx44CB5qC55o2u5Lik5Liq5byA5YWz77yM5p2l6K6h566X5b2T5YmN55qEeOaWueWQkeeahOWKoOmAn+W6plxyXG4gICAgICAgIGlmKHRoaXMuYWNjTGVmdCl7XHJcbiAgICAgICAgICAgIHRoaXMueFNwZWVkIC09IHRoaXMuYWNjZWwgKiBkdDtcclxuICAgICAgICB9ZWxzZSBpZih0aGlzLmFjY1JpZ2h0KXtcclxuICAgICAgICAgICAgdGhpcy54U3BlZWQgKz0gdGhpcy5hY2NlbCAqIGR0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gMuOAgeWIpOaWreWKoOmAn+W6puaYr+WQpui2heWHuuacgOWkp+WKoOmAn+W6pu+8jOi2heWHuuWImemZkOWItlxyXG4gICAgICAgIGlmKE1hdGguYWJzKHRoaXMueFNwZWVkKSA+IHRoaXMubWF4TW92ZVNwZWVkKXtcclxuICAgICAgICAgICAgLy8g5rGC5q2j6LSf5Y+3XHJcbiAgICAgICAgICAgIGxldCB0ZW1wID0gdGhpcy54U3BlZWQvTWF0aC5hYnModGhpcy54U3BlZWQpO1xyXG4gICAgICAgICAgICAvLyDpmZDliLZ4U3BlZWTkuLrmnIDlpKflgLxcclxuICAgICAgICAgICAgdGhpcy54U3BlZWQgPSB0aGlzLm1heE1vdmVTcGVlZCAqIHRlbXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyAz44CB6K6+572u6IqC54K55L2N56e7XHJcbiAgICAgICAgdGhpcy5ub2RlLnggPSB0aGlzLmNhbGNMZWZ0UmlnaHQodGhpcy5ub2RlLnggLCB0aGlzLnhTcGVlZCAqIGR0KTtcclxuICAgIH0sXHJcbiAgICAvLyDmo4DmtYvlt6blj7PlnZDmoIfvvIzmnaXpmZDliLbmnIDlsI/lkozmnIDlpKfnmoTlt6blj7PkvY3np7tcclxuICAgIGNhbGNMZWZ0UmlnaHQoeCx0cmFuc2xhdGUpe1xyXG4gICAgICAgIGxldCB0ZW1wID0geCArIHRyYW5zbGF0ZTtcclxuICAgICAgICBsZXQge1xyXG4gICAgICAgICAgICBtYXhCYWNrTGVmdFdhbGwsXHJcbiAgICAgICAgICAgIG1heEJhY2tSaWdodFdhbGxcclxuICAgICAgICB9ID0gdGhpcztcclxuICAgICAgICBpZih0ZW1wIDwgMCAmJiBNYXRoLmFicyh0ZW1wKSA+IE1hdGguYWJzKG1heEJhY2tMZWZ0V2FsbCkgKXtcclxuICAgICAgICAgICAgdGhpcy54U3BlZWQgPSAwO1xyXG4gICAgICAgICAgICByZXR1cm4gbWF4QmFja0xlZnRXYWxsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmKHRlbXAgPiAwICYmIE1hdGguYWJzKHRlbXApID4gTWF0aC5hYnMobWF4QmFja1JpZ2h0V2FsbCkgKXtcclxuICAgICAgICAgICAgdGhpcy54U3BlZWQgPSAwO1xyXG4gICAgICAgICAgICByZXR1cm4gbWF4QmFja1JpZ2h0V2FsbFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGVtcDtcclxuICAgIH0sXHJcblxyXG5cclxuICAgIG9uRGVzdHJveSgpe1xyXG4gICAgICAgIC8vIOe7hOS7tumUgOavgeaXtu+8jOWwhue7keWumueahOmUruebmOS6i+S7tuino+e7kVxyXG4gICAgICAgIGNjLnN5c3RlbUV2ZW50Lm9mZihcclxuICAgICAgICAgICAgY2MuU3lzdGVtRXZlbnQuRXZlbnRUeXBlLktFWV9ET1dOLFxyXG4gICAgICAgICAgICB0aGlzLm9uS2V5RG93bixcclxuICAgICAgICAgICAgdGhpc1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgY2Muc3lzdGVtRXZlbnQub2ZmKFxyXG4gICAgICAgICAgICBjYy5TeXN0ZW1FdmVudC5FdmVudFR5cGUuS0VZX1VQLFxyXG4gICAgICAgICAgICB0aGlzLm9uS2V5VXAsXHJcbiAgICAgICAgICAgIHRoaXNcclxuICAgICAgICApXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9LFxyXG59KTtcclxuIl19