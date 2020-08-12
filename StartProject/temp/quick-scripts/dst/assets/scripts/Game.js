
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
    // 星星的初始个数
    STAR_COUNT: {
      "default": 1,
      type: cc.Integer
    },
    // 每获得多少个星星，stage+1，星星数也+1
    STAGE_COUNT: 100,
    MAX_STAR_COUNT: 15,
    // 界面中增加星星的最大个数
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
    // 分数文本节点
    scoreDisplay: {
      "default": null,
      type: cc.Label
    },
    // 得分音效
    scoreAudio: {
      "default": null,
      type: cc.AudioClip
    }
  },
  // LIFE-CYCLE CALLBACKS:
  onLoad: function onLoad() {
    // 获取地板的高度
    this.groundY = this.ground.y + this.ground.height / 2; // 初始时，生成多个星星

    for (var i = 0; i < this.STAR_COUNT; i++) {
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
    var tempScore = this.score + 1; // 每过 STAGE_COUNT 分，界面上多一个星星，最多增加MAX_STAR_COUNT个

    var tempCount = Math.floor(tempScore / this.STAGE_COUNT);

    if (tempCount <= this.MAX_STAR_COUNT && Math.floor(this.score / this.STAGE_COUNT) < tempCount) {
      this.generateNewStar();
    }

    this.score = tempScore;
    this.scoreDisplay.string = "Score : " + this.score + " -Stage  : " + tempCount;
    cc.audioEngine.playEffect(this.scoreAudio, false);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcR2FtZS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInN0YXJQcmVmYWIiLCJ0eXBlIiwiUHJlZmFiIiwiU1RBUl9DT1VOVCIsIkludGVnZXIiLCJTVEFHRV9DT1VOVCIsIk1BWF9TVEFSX0NPVU5UIiwibWF4U3RhckR1cmF0aW9uIiwibWluU3RhckR1cmF0aW9uIiwiZ3JvdW5kIiwiTm9kZSIsInBsYXllciIsInNjb3JlRGlzcGxheSIsIkxhYmVsIiwic2NvcmVBdWRpbyIsIkF1ZGlvQ2xpcCIsIm9uTG9hZCIsImdyb3VuZFkiLCJ5IiwiaGVpZ2h0IiwiaSIsImdlbmVyYXRlTmV3U3RhciIsInNjb3JlIiwibmV3U3RhciIsImluc3RhbnRpYXRlIiwibm9kZSIsImFkZENoaWxkIiwic2V0UG9zaXRpb24iLCJnZW5lcmF0ZVN0YXJQb3MiLCJnZXRDb21wb25lbnQiLCJnYW1lIiwicmFuZFgiLCJyYW5kWSIsIk1hdGgiLCJyYW5kb20iLCJqdW1wSGVpZ2h0IiwibWF4WCIsIndpZHRoIiwidjIiLCJnYWluU2NvcmUiLCJ0ZW1wU2NvcmUiLCJ0ZW1wQ291bnQiLCJmbG9vciIsInN0cmluZyIsImF1ZGlvRW5naW5lIiwicGxheUVmZmVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQUEsRUFBRSxDQUFDQyxLQUFILENBQVM7QUFDTCxhQUFTRCxFQUFFLENBQUNFLFNBRFA7QUFHTEMsRUFBQUEsVUFBVSxFQUFFO0FBQ1I7OztBQUdBO0FBQ0FDLElBQUFBLFVBQVUsRUFBQztBQUNQLGlCQUFRLElBREQ7QUFFUEMsTUFBQUEsSUFBSSxFQUFFTCxFQUFFLENBQUNNO0FBRkYsS0FMSDtBQVNSO0FBQ0FDLElBQUFBLFVBQVUsRUFBQztBQUNQLGlCQUFRLENBREQ7QUFFUEYsTUFBQUEsSUFBSSxFQUFDTCxFQUFFLENBQUNR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QixZQUFMLENBQWtCK0IsTUFBbEIsZ0JBQXNDLEtBQUtyQixLQUEzQyxtQkFBOERtQixTQUE5RDtBQUVBN0MsSUFBQUEsRUFBRSxDQUFDZ0QsV0FBSCxDQUFlQyxVQUFmLENBQTBCLEtBQUsvQixVQUEvQixFQUEwQyxLQUExQztBQUdIO0FBMUdJLENBQVQiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXNDb250ZW50IjpbIi8vIExlYXJuIGNjLkNsYXNzOlxyXG4vLyAgLSBodHRwczovL2RvY3MuY29jb3MuY29tL2NyZWF0b3IvbWFudWFsL2VuL3NjcmlwdGluZy9jbGFzcy5odG1sXHJcbi8vIExlYXJuIEF0dHJpYnV0ZTpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvcmVmZXJlbmNlL2F0dHJpYnV0ZXMuaHRtbFxyXG4vLyBMZWFybiBsaWZlLWN5Y2xlIGNhbGxiYWNrczpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvbGlmZS1jeWNsZS1jYWxsYmFja3MuaHRtbFxyXG5cclxuY2MuQ2xhc3Moe1xyXG4gICAgZXh0ZW5kczogY2MuQ29tcG9uZW50LFxyXG5cclxuICAgIHByb3BlcnRpZXM6IHtcclxuICAgICAgICAvKipcclxuICAgICAgICAgKiB0eXBlIO+8mui/memHjOi/m+ihjOS6huWxnuaAp+ajgOafpVxyXG4gICAgICAgICAqL1xyXG4gICAgICAgIC8vIOaYn+aYn+mihOe9rui1hOa6kFxyXG4gICAgICAgIHN0YXJQcmVmYWI6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6IGNjLlByZWZhYlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g5pif5pif55qE5Yid5aeL5Liq5pWwXHJcbiAgICAgICAgU1RBUl9DT1VOVDp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6MSxcclxuICAgICAgICAgICAgdHlwZTpjYy5JbnRlZ2VyLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8g5q+P6I635b6X5aSa5bCR5Liq5pif5pif77yMc3RhZ2UrMe+8jOaYn+aYn+aVsOS5nysxXHJcbiAgICAgICAgU1RBR0VfQ09VTlQ6MTAwLFxyXG4gICAgICAgIE1BWF9TVEFSX0NPVU5UOjE1LCAgLy8g55WM6Z2i5Lit5aKe5Yqg5pif5pif55qE5pyA5aSn5Liq5pWwXHJcblxyXG4gICAgICAgIC8vIOaYn+aYn+a2iOWkseaXtumXtOeahOiMg+WbtFxyXG4gICAgICAgIG1heFN0YXJEdXJhdGlvbjowLFxyXG4gICAgICAgIG1pblN0YXJEdXJhdGlvbjowLFxyXG5cclxuICAgICAgICAvLyDlnLDpnaLoioLngrlcclxuICAgICAgICBncm91bmQ6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuTm9kZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBwbGF5ZXLoioLngrlcclxuICAgICAgICBwbGF5ZXI6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuTm9kZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIOWIhuaVsOaWh+acrOiKgueCuVxyXG4gICAgICAgIHNjb3JlRGlzcGxheTp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6bnVsbCxcclxuICAgICAgICAgICAgdHlwZTpjYy5MYWJlbFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIOW+l+WIhumfs+aViFxyXG4gICAgICAgIHNjb3JlQXVkaW86e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuQXVkaW9DbGlwXHJcbiAgICAgICAgfSxcclxuICAgIH0sXHJcblxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcblxyXG4gICAgb25Mb2FkICgpIHtcclxuICAgICAgICAvLyDojrflj5blnLDmnb/nmoTpq5jluqZcclxuICAgICAgICB0aGlzLmdyb3VuZFkgPSB0aGlzLmdyb3VuZC55ICsgdGhpcy5ncm91bmQuaGVpZ2h0LzI7XHJcblxyXG4gICAgICAgIC8vIOWIneWni+aXtu+8jOeUn+aIkOWkmuS4quaYn+aYn1xyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7aSA8IHRoaXMuU1RBUl9DT1VOVDtpKyspe1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlTmV3U3RhcigpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zY29yZSA9IDA7XHJcbiAgICB9LFxyXG5cclxuICAgIGdlbmVyYXRlTmV3U3RhcjpmdW5jdGlvbigpe1xyXG4gICAgICAgIC8vIDHjgIHmoLnmja5wcmVmYWLvvIznlJ/miJDkuIDkuKroioLngrlcclxuICAgICAgICBsZXQgbmV3U3RhciA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc3RhclByZWZhYik7XHJcblxyXG4gICAgICAgIC8vIDLjgIHlsIboioLngrnliqDlhaXliLDnlYzpnaLkuK1cclxuICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XHJcblxyXG4gICAgICAgIC8vIDPjgIHorr7nva7kvY3nva5cclxuICAgICAgICBuZXdTdGFyLnNldFBvc2l0aW9uKHRoaXMuZ2VuZXJhdGVTdGFyUG9zKCkpO1xyXG5cclxuICAgICAgICAvLyA044CB5Zyo5pif5pif57uE5Lu25LiK77yM5pqC5a2YR2FtZeWvueixoeeahOW8leeUqFxyXG4gICAgICAgIG5ld1N0YXIuZ2V0Q29tcG9uZW50KFwiU3RhclwiKS5nYW1lID0gdGhpcztcclxuICAgIH0sXHJcblxyXG4gICAgLy8g55Sf5oiQ6ZqP5py65L2N572uXHJcbiAgICBnZW5lcmF0ZVN0YXJQb3MoKXtcclxuICAgICAgICBsZXQgcmFuZFggPSAwO1xyXG4gICAgICAgIGxldCByYW5kWSA9IHRoaXMuZ3JvdW5kWSArIE1hdGgucmFuZG9tKCkgKiB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJQbGF5ZXJcIikuanVtcEhlaWdodCArIDUwO1xyXG4gICAgICAgIGxldCBtYXhYID0gdGhpcy5ub2RlLndpZHRoIC8gMjtcclxuXHJcbiAgICAgICAgcmFuZFggPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyICogbWF4WDtcclxuICAgICAgICByZXR1cm4gY2MudjIocmFuZFgscmFuZFkpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcclxuICAgIFxyXG4gICAgZ2FpblNjb3JlKCl7XHJcbiAgICAgICAgbGV0IHRlbXBTY29yZSA9IHRoaXMuc2NvcmUgKyAxO1xyXG5cclxuICAgICAgICAvLyDmr4/ov4cgU1RBR0VfQ09VTlQg5YiG77yM55WM6Z2i5LiK5aSa5LiA5Liq5pif5pif77yM5pyA5aSa5aKe5YqgTUFYX1NUQVJfQ09VTlTkuKpcclxuICAgICAgICBsZXQgdGVtcENvdW50ID0gTWF0aC5mbG9vcih0ZW1wU2NvcmUvdGhpcy5TVEFHRV9DT1VOVClcclxuICAgICAgICBpZih0ZW1wQ291bnQgPD0gdGhpcy5NQVhfU1RBUl9DT1VOVCBcclxuICAgICAgICAgICAgJiYgTWF0aC5mbG9vcih0aGlzLnNjb3JlIC8gdGhpcy5TVEFHRV9DT1VOVCkgPCB0ZW1wQ291bnRcclxuICAgICAgICApe1xyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlTmV3U3RhcigpXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNjb3JlID0gdGVtcFNjb3JlO1xyXG4gICAgICAgIHRoaXMuc2NvcmVEaXNwbGF5LnN0cmluZyA9IGBTY29yZSA6ICR7dGhpcy5zY29yZX0gLVN0YWdlICA6ICR7dGVtcENvdW50fWA7XHJcblxyXG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5zY29yZUF1ZGlvLGZhbHNlKTtcclxuXHJcblxyXG4gICAgfVxyXG59KTtcclxuIl19