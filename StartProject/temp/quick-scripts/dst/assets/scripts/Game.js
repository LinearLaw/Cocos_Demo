
                (function() {
                    var nodeEnv = typeof require !== 'undefined' && typeof process !== 'undefined';
                    var __module = nodeEnv ? module : {exports:{}};
                    var __filename = 'preview-scripts/assets/scripts/Game.js';
                    var __require = nodeEnv ? function (request) {
                        return cc.require(request);
                    } : function (request) {
                        return __quick_compile_project__.require(request, __filename);
                    };
                    function __define (exports, require, module) {
                        if (!nodeEnv) {__quick_compile_project__.registerModule(__filename, module);}"use strict";
cc._RF.push(module, '10385Y2eVtOfJrjMYYFPA4A', 'Game');
// scripts/Game.js

"use strict";

// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
cc.Class({
  "extends": cc.Component,
  properties: {
    /**
     * type ：这里进行了属性检查
     */
    // 星星预置资源
    starPrefab: {
      "default": null,
      type: cc.Prefab
    },
    starCount: {
      "default": 1,
      type: cc.Integer
    },
    // 星星消失时间的范围
    maxStarDuration: 0,
    minStarDuration: 0,
    // 地面节点
    ground: {
      "default": null,
      type: cc.Node
    },
    // player节点
    player: {
      "default": null,
      type: cc.Node
    },
    scoreDisplay: {
      "default": null,
      type: cc.Label
    }
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    this.groundY = this.ground.y + this.ground.height / 2;

    for (var i = 0; i < this.starCount; i++) {
      this.generateNewStar();
    }

    this.score = 0;
  },
  generateNewStar: function generateNewStar() {
    // 1、根据prefab，生成一个节点
    var newStar = cc.instantiate(this.starPrefab); // 2、将节点加入到界面中

    this.node.addChild(newStar); // 3、设置位置

    newStar.setPosition(this.generateStarPos()); // 4、在星星组件上，暂存Game对象的引用

    newStar.getComponent("Star").game = this;
  },
  // 生成随机位置
  generateStarPos: function generateStarPos() {
    var randX = 0;
    var randY = this.groundY + Math.random() * this.player.getComponent("Player").jumpHeight + 50;
    var maxX = this.node.width / 2;
    randX = (Math.random() - 0.5) * 2 * maxX;
    return cc.v2(randX, randY);
  },
  // update (dt) {},
  gainScore: function gainScore() {
    this.score = this.score + 1;
    this.scoreDisplay.string = "Score : " + this.score;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcR2FtZS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInN0YXJQcmVmYWIiLCJ0eXBlIiwiUHJlZmFiIiwic3RhckNvdW50IiwiSW50ZWdlciIsIm1heFN0YXJEdXJhdGlvbiIsIm1pblN0YXJEdXJhdGlvbiIsImdyb3VuZCIsIk5vZGUiLCJwbGF5ZXIiLCJzY29yZURpc3BsYXkiLCJMYWJlbCIsIm9uTG9hZCIsImdyb3VuZFkiLCJ5IiwiaGVpZ2h0IiwiaSIsImdlbmVyYXRlTmV3U3RhciIsInNjb3JlIiwibmV3U3RhciIsImluc3RhbnRpYXRlIiwibm9kZSIsImFkZENoaWxkIiwic2V0UG9zaXRpb24iLCJnZW5lcmF0ZVN0YXJQb3MiLCJnZXRDb21wb25lbnQiLCJnYW1lIiwicmFuZFgiLCJyYW5kWSIsIk1hdGgiLCJyYW5kb20iLCJqdW1wSGVpZ2h0IiwibWF4WCIsIndpZHRoIiwidjIiLCJnYWluU2NvcmUiLCJzdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUFBLEVBQUUsQ0FBQ0MsS0FBSCxDQUFTO0FBQ0wsYUFBU0QsRUFBRSxDQUFDRSxTQURQO0FBR0xDLEVBQUFBLFVBQVUsRUFBRTtBQUNSOzs7QUFHQTtBQUNBQyxJQUFBQSxVQUFVLEVBQUM7QUFDUCxpQkFBUSxJQUREO0FBRVBDLE1BQUFBLElBQUksRUFBRUwsRUFBRSxDQUFDTTtBQUZGLEtBTEg7QUFTUkMsSUFBQUEsU0FBUyxFQUFDO0FBQ04saUJBQVEsQ0FERjtBQUVORixNQUFBQSxJQUFJLEVBQUNMLEVBQUUsQ0FBQ1E7QUFGRixLQVRGO0FBY1I7QUFDQUMsSUFBQUEsZUFBZSxFQUFDLENBZlI7QUFnQlJDLElBQUFBLGVBQWUsRUFBQyxDQWhCUjtBQWtCUjtBQUNBQyxJQUFBQSxNQUFNLEVBQUM7QUFDSCxpQkFBUSxJQURMO0FBRUhOLE1BQUFBLElBQUksRUFBQ0wsRUFBRSxDQUFDWTtBQUZMLEtBbkJDO0FBd0JSO0FBQ0FDLElBQUFBLE1BQU0sRUFBQztBQUNILGlCQUFRLElBREw7QUFFSFIsTUFBQUEsSUFBSSxFQUFDTCxFQUFFLENBQUNZO0FBRkwsS0F6QkM7QUE4QlJFLElBQUFBLFlBQVksRUFBQztBQUNULGlCQUFRLElBREM7QUFFVFQsTUFBQUEsSUFBSSxFQUFDTCxFQUFFLENBQUNlO0FBRkM7QUE5QkwsR0FIUDtBQXlDTDtBQUVBQyxFQUFBQSxNQTNDSyxvQkEyQ0s7QUFDTixTQUFLQyxPQUFMLEdBQWUsS0FBS04sTUFBTCxDQUFZTyxDQUFaLEdBQWdCLEtBQUtQLE1BQUwsQ0FBWVEsTUFBWixHQUFtQixDQUFsRDs7QUFFQSxTQUFJLElBQUlDLENBQUMsR0FBRyxDQUFaLEVBQWNBLENBQUMsR0FBRyxLQUFLYixTQUF2QixFQUFpQ2EsQ0FBQyxFQUFsQyxFQUFxQztBQUNqQyxXQUFLQyxlQUFMO0FBQ0g7O0FBR0QsU0FBS0MsS0FBTCxHQUFhLENBQWI7QUFDSCxHQXBESTtBQXNETEQsRUFBQUEsZUFBZSxFQUFDLDJCQUFVO0FBQ3RCO0FBQ0EsUUFBSUUsT0FBTyxHQUFHdkIsRUFBRSxDQUFDd0IsV0FBSCxDQUFlLEtBQUtwQixVQUFwQixDQUFkLENBRnNCLENBSXRCOztBQUNBLFNBQUtxQixJQUFMLENBQVVDLFFBQVYsQ0FBbUJILE9BQW5CLEVBTHNCLENBT3RCOztBQUNBQSxJQUFBQSxPQUFPLENBQUNJLFdBQVIsQ0FBb0IsS0FBS0MsZUFBTCxFQUFwQixFQVJzQixDQVV0Qjs7QUFDQUwsSUFBQUEsT0FBTyxDQUFDTSxZQUFSLENBQXFCLE1BQXJCLEVBQTZCQyxJQUE3QixHQUFvQyxJQUFwQztBQUVILEdBbkVJO0FBcUVMO0FBQ0FGLEVBQUFBLGVBdEVLLDZCQXNFWTtBQUNiLFFBQUlHLEtBQUssR0FBRyxDQUFaO0FBQ0EsUUFBSUMsS0FBSyxHQUFHLEtBQUtmLE9BQUwsR0FBZWdCLElBQUksQ0FBQ0MsTUFBTCxLQUFnQixLQUFLckIsTUFBTCxDQUFZZ0IsWUFBWixDQUF5QixRQUF6QixFQUFtQ00sVUFBbEUsR0FBK0UsRUFBM0Y7QUFDQSxRQUFJQyxJQUFJLEdBQUcsS0FBS1gsSUFBTCxDQUFVWSxLQUFWLEdBQWtCLENBQTdCO0FBRUFOLElBQUFBLEtBQUssR0FBRyxDQUFDRSxJQUFJLENBQUNDLE1BQUwsS0FBZ0IsR0FBakIsSUFBd0IsQ0FBeEIsR0FBNEJFLElBQXBDO0FBQ0EsV0FBT3BDLEVBQUUsQ0FBQ3NDLEVBQUgsQ0FBTVAsS0FBTixFQUFZQyxLQUFaLENBQVA7QUFDSCxHQTdFSTtBQStFTDtBQUVBTyxFQUFBQSxTQWpGSyx1QkFpRk07QUFDUCxTQUFLakIsS0FBTCxHQUFhLEtBQUtBLEtBQUwsR0FBYSxDQUExQjtBQUNBLFNBQUtSLFlBQUwsQ0FBa0IwQixNQUFsQixnQkFBc0MsS0FBS2xCLEtBQTNDO0FBQ0g7QUFwRkksQ0FBVCIsInNvdXJjZVJvb3QiOiIvIiwic291cmNlc0NvbnRlbnQiOlsiLy8gTGVhcm4gY2MuQ2xhc3M6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL2NsYXNzLmh0bWxcclxuLy8gTGVhcm4gQXR0cmlidXRlOlxyXG4vLyAgLSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9yZWZlcmVuY2UvYXR0cmlidXRlcy5odG1sXHJcbi8vIExlYXJuIGxpZmUtY3ljbGUgY2FsbGJhY2tzOlxyXG4vLyAgLSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9saWZlLWN5Y2xlLWNhbGxiYWNrcy5odG1sXHJcblxyXG5jYy5DbGFzcyh7XHJcbiAgICBleHRlbmRzOiBjYy5Db21wb25lbnQsXHJcblxyXG4gICAgcHJvcGVydGllczoge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIHR5cGUg77ya6L+Z6YeM6L+b6KGM5LqG5bGe5oCn5qOA5p+lXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgLy8g5pif5pif6aKE572u6LWE5rqQXHJcbiAgICAgICAgc3RhclByZWZhYjp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTogY2MuUHJlZmFiXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzdGFyQ291bnQ6e1xyXG4gICAgICAgICAgICBkZWZhdWx0OjEsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuSW50ZWdlcixcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyDmmJ/mmJ/mtojlpLHml7bpl7TnmoTojIPlm7RcclxuICAgICAgICBtYXhTdGFyRHVyYXRpb246MCxcclxuICAgICAgICBtaW5TdGFyRHVyYXRpb246MCxcclxuXHJcbiAgICAgICAgLy8g5Zyw6Z2i6IqC54K5XHJcbiAgICAgICAgZ3JvdW5kOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLk5vZGUsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gcGxheWVy6IqC54K5XHJcbiAgICAgICAgcGxheWVyOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLk5vZGUsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2NvcmVEaXNwbGF5OntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLkxhYmVsXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgfSxcclxuXHJcbiAgICAvLyBMSUZFLUNZQ0xFIENBTExCQUNLUzpcclxuXHJcbiAgICBvbkxvYWQgKCkge1xyXG4gICAgICAgIHRoaXMuZ3JvdW5kWSA9IHRoaXMuZ3JvdW5kLnkgKyB0aGlzLmdyb3VuZC5oZWlnaHQvMjtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDtpIDwgdGhpcy5zdGFyQ291bnQ7aSsrKXtcclxuICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZU5ld1N0YXIoKTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB0aGlzLnNjb3JlID0gMDtcclxuICAgIH0sXHJcblxyXG4gICAgZ2VuZXJhdGVOZXdTdGFyOmZ1bmN0aW9uKCl7XHJcbiAgICAgICAgLy8gMeOAgeagueaNrnByZWZhYu+8jOeUn+aIkOS4gOS4quiKgueCuVxyXG4gICAgICAgIGxldCBuZXdTdGFyID0gY2MuaW5zdGFudGlhdGUodGhpcy5zdGFyUHJlZmFiKTtcclxuXHJcbiAgICAgICAgLy8gMuOAgeWwhuiKgueCueWKoOWFpeWIsOeVjOmdouS4rVxyXG4gICAgICAgIHRoaXMubm9kZS5hZGRDaGlsZChuZXdTdGFyKTtcclxuXHJcbiAgICAgICAgLy8gM+OAgeiuvue9ruS9jee9rlxyXG4gICAgICAgIG5ld1N0YXIuc2V0UG9zaXRpb24odGhpcy5nZW5lcmF0ZVN0YXJQb3MoKSk7XHJcblxyXG4gICAgICAgIC8vIDTjgIHlnKjmmJ/mmJ/nu4Tku7bkuIrvvIzmmoLlrZhHYW1l5a+56LGh55qE5byV55SoXHJcbiAgICAgICAgbmV3U3Rhci5nZXRDb21wb25lbnQoXCJTdGFyXCIpLmdhbWUgPSB0aGlzO1xyXG4gICAgICAgIFxyXG4gICAgfSxcclxuXHJcbiAgICAvLyDnlJ/miJDpmo/mnLrkvY3nva5cclxuICAgIGdlbmVyYXRlU3RhclBvcygpe1xyXG4gICAgICAgIGxldCByYW5kWCA9IDA7XHJcbiAgICAgICAgbGV0IHJhbmRZID0gdGhpcy5ncm91bmRZICsgTWF0aC5yYW5kb20oKSAqIHRoaXMucGxheWVyLmdldENvbXBvbmVudChcIlBsYXllclwiKS5qdW1wSGVpZ2h0ICsgNTA7XHJcbiAgICAgICAgbGV0IG1heFggPSB0aGlzLm5vZGUud2lkdGggLyAyO1xyXG5cclxuICAgICAgICByYW5kWCA9IChNYXRoLnJhbmRvbSgpIC0gMC41KSAqIDIgKiBtYXhYO1xyXG4gICAgICAgIHJldHVybiBjYy52MihyYW5kWCxyYW5kWSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8vIHVwZGF0ZSAoZHQpIHt9LFxyXG5cclxuICAgIGdhaW5TY29yZSgpe1xyXG4gICAgICAgIHRoaXMuc2NvcmUgPSB0aGlzLnNjb3JlICsgMTtcclxuICAgICAgICB0aGlzLnNjb3JlRGlzcGxheS5zdHJpbmcgPSBgU2NvcmUgOiAke3RoaXMuc2NvcmV9YDtcclxuICAgIH1cclxufSk7XHJcbiJdfQ==