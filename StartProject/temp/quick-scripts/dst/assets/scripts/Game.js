
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
    },
    scoreAudio: {
      "default": null,
      type: cc.AudioClip
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFzc2V0c1xcc2NyaXB0c1xcR2FtZS5qcyJdLCJuYW1lcyI6WyJjYyIsIkNsYXNzIiwiQ29tcG9uZW50IiwicHJvcGVydGllcyIsInN0YXJQcmVmYWIiLCJ0eXBlIiwiUHJlZmFiIiwic3RhckNvdW50IiwiSW50ZWdlciIsIm1heFN0YXJEdXJhdGlvbiIsIm1pblN0YXJEdXJhdGlvbiIsImdyb3VuZCIsIk5vZGUiLCJwbGF5ZXIiLCJzY29yZURpc3BsYXkiLCJMYWJlbCIsInNjb3JlQXVkaW8iLCJBdWRpb0NsaXAiLCJvbkxvYWQiLCJncm91bmRZIiwieSIsImhlaWdodCIsImkiLCJnZW5lcmF0ZU5ld1N0YXIiLCJzY29yZSIsIm5ld1N0YXIiLCJpbnN0YW50aWF0ZSIsIm5vZGUiLCJhZGRDaGlsZCIsInNldFBvc2l0aW9uIiwiZ2VuZXJhdGVTdGFyUG9zIiwiZ2V0Q29tcG9uZW50IiwiZ2FtZSIsInJhbmRYIiwicmFuZFkiLCJNYXRoIiwicmFuZG9tIiwianVtcEhlaWdodCIsIm1heFgiLCJ3aWR0aCIsInYyIiwiZ2FpblNjb3JlIiwic3RyaW5nIiwiYXVkaW9FbmdpbmUiLCJwbGF5RWZmZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBQSxFQUFFLENBQUNDLEtBQUgsQ0FBUztBQUNMLGFBQVNELEVBQUUsQ0FBQ0UsU0FEUDtBQUdMQyxFQUFBQSxVQUFVLEVBQUU7QUFDUjs7O0FBR0E7QUFDQUMsSUFBQUEsVUFBVSxFQUFDO0FBQ1AsaUJBQVEsSUFERDtBQUVQQyxNQUFBQSxJQUFJLEVBQUVMLEVBQUUsQ0FBQ007QUFGRixLQUxIO0FBU1JDLElBQUFBLFNBQVMsRUFBQztBQUNOLGlCQUFRLENBREY7QUFFTkYsTUFBQUEsSUFBSSxFQUFDTCxFQUFFLENBQUNRO0FBRkYsS0FURjtBQWNSO0FBQ0FDLElBQUFBLGVBQWUsRUFBQyxDQWZSO0FBZ0JSQyxJQUFBQSxlQUFlLEVBQUMsQ0FoQlI7QUFrQlI7QUFDQUMsSUFBQUEsTUFBTSxFQUFDO0FBQ0gsaUJBQVEsSUFETDtBQUVITixNQUFBQSxJQUFJLEVBQUNMLEVBQUUsQ0FBQ1k7QUFGTCxLQW5CQztBQXdCUjtBQUNBQyxJQUFBQSxNQUFNLEVBQUM7QUFDSCxpQkFBUSxJQURMO0FBRUhSLE1BQUFBLElBQUksRUFBQ0wsRUFBRSxDQUFDWTtBQUZMLEtBekJDO0FBOEJSRSxJQUFBQSxZQUFZLEVBQUM7QUFDVCxpQkFBUSxJQURDO0FBRVRULE1BQUFBLElBQUksRUFBQ0wsRUFBRSxDQUFDZTtBQUZDLEtBOUJMO0FBbUNSQyxJQUFBQSxVQUFVLEVBQUM7QUFDUCxpQkFBUSxJQUREO0FBRVBYLE1BQUFBLElBQUksRUFBQ0wsRUFBRSxDQUFDaUI7QUFGRDtBQW5DSCxHQUhQO0FBOENMO0FBRUFDLEVBQUFBLE1BaERLLG9CQWdESztBQUNOLFNBQUtDLE9BQUwsR0FBZSxLQUFLUixNQUFMLENBQVlTLENBQVosR0FBZ0IsS0FBS1QsTUFBTCxDQUFZVSxNQUFaLEdBQW1CLENBQWxEOztBQUVBLFNBQUksSUFBSUMsQ0FBQyxHQUFHLENBQVosRUFBY0EsQ0FBQyxHQUFHLEtBQUtmLFNBQXZCLEVBQWlDZSxDQUFDLEVBQWxDLEVBQXFDO0FBQ2pDLFdBQUtDLGVBQUw7QUFDSDs7QUFHRCxTQUFLQyxLQUFMLEdBQWEsQ0FBYjtBQUNILEdBekRJO0FBMkRMRCxFQUFBQSxlQUFlLEVBQUMsMkJBQVU7QUFDdEI7QUFDQSxRQUFJRSxPQUFPLEdBQUd6QixFQUFFLENBQUMwQixXQUFILENBQWUsS0FBS3RCLFVBQXBCLENBQWQsQ0FGc0IsQ0FJdEI7O0FBQ0EsU0FBS3VCLElBQUwsQ0FBVUMsUUFBVixDQUFtQkgsT0FBbkIsRUFMc0IsQ0FPdEI7O0FBQ0FBLElBQUFBLE9BQU8sQ0FBQ0ksV0FBUixDQUFvQixLQUFLQyxlQUFMLEVBQXBCLEVBUnNCLENBVXRCOztBQUNBTCxJQUFBQSxPQUFPLENBQUNNLFlBQVIsQ0FBcUIsTUFBckIsRUFBNkJDLElBQTdCLEdBQW9DLElBQXBDO0FBRUgsR0F4RUk7QUEwRUw7QUFDQUYsRUFBQUEsZUEzRUssNkJBMkVZO0FBQ2IsUUFBSUcsS0FBSyxHQUFHLENBQVo7QUFDQSxRQUFJQyxLQUFLLEdBQUcsS0FBS2YsT0FBTCxHQUFlZ0IsSUFBSSxDQUFDQyxNQUFMLEtBQWdCLEtBQUt2QixNQUFMLENBQVlrQixZQUFaLENBQXlCLFFBQXpCLEVBQW1DTSxVQUFsRSxHQUErRSxFQUEzRjtBQUNBLFFBQUlDLElBQUksR0FBRyxLQUFLWCxJQUFMLENBQVVZLEtBQVYsR0FBa0IsQ0FBN0I7QUFFQU4sSUFBQUEsS0FBSyxHQUFHLENBQUNFLElBQUksQ0FBQ0MsTUFBTCxLQUFnQixHQUFqQixJQUF3QixDQUF4QixHQUE0QkUsSUFBcEM7QUFDQSxXQUFPdEMsRUFBRSxDQUFDd0MsRUFBSCxDQUFNUCxLQUFOLEVBQVlDLEtBQVosQ0FBUDtBQUNILEdBbEZJO0FBb0ZMO0FBRUFPLEVBQUFBLFNBdEZLLHVCQXNGTTtBQUNQLFNBQUtqQixLQUFMLEdBQWEsS0FBS0EsS0FBTCxHQUFhLENBQTFCO0FBQ0EsU0FBS1YsWUFBTCxDQUFrQjRCLE1BQWxCLGdCQUFzQyxLQUFLbEIsS0FBM0M7QUFFQXhCLElBQUFBLEVBQUUsQ0FBQzJDLFdBQUgsQ0FBZUMsVUFBZixDQUEwQixLQUFLNUIsVUFBL0IsRUFBMEMsS0FBMUM7QUFDSDtBQTNGSSxDQUFUIiwic291cmNlUm9vdCI6Ii8iLCJzb3VyY2VzQ29udGVudCI6WyIvLyBMZWFybiBjYy5DbGFzczpcclxuLy8gIC0gaHR0cHM6Ly9kb2NzLmNvY29zLmNvbS9jcmVhdG9yL21hbnVhbC9lbi9zY3JpcHRpbmcvY2xhc3MuaHRtbFxyXG4vLyBMZWFybiBBdHRyaWJ1dGU6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL3JlZmVyZW5jZS9hdHRyaWJ1dGVzLmh0bWxcclxuLy8gTGVhcm4gbGlmZS1jeWNsZSBjYWxsYmFja3M6XHJcbi8vICAtIGh0dHBzOi8vZG9jcy5jb2Nvcy5jb20vY3JlYXRvci9tYW51YWwvZW4vc2NyaXB0aW5nL2xpZmUtY3ljbGUtY2FsbGJhY2tzLmh0bWxcclxuXHJcbmNjLkNsYXNzKHtcclxuICAgIGV4dGVuZHM6IGNjLkNvbXBvbmVudCxcclxuXHJcbiAgICBwcm9wZXJ0aWVzOiB7XHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogdHlwZSDvvJrov5nph4zov5vooYzkuoblsZ7mgKfmo4Dmn6VcclxuICAgICAgICAgKi9cclxuICAgICAgICAvLyDmmJ/mmJ/pooTnva7otYTmupBcclxuICAgICAgICBzdGFyUHJlZmFiOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOiBjYy5QcmVmYWJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHN0YXJDb3VudDp7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6MSxcclxuICAgICAgICAgICAgdHlwZTpjYy5JbnRlZ2VyLFxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIOaYn+aYn+a2iOWkseaXtumXtOeahOiMg+WbtFxyXG4gICAgICAgIG1heFN0YXJEdXJhdGlvbjowLFxyXG4gICAgICAgIG1pblN0YXJEdXJhdGlvbjowLFxyXG5cclxuICAgICAgICAvLyDlnLDpnaLoioLngrlcclxuICAgICAgICBncm91bmQ6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuTm9kZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBwbGF5ZXLoioLngrlcclxuICAgICAgICBwbGF5ZXI6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuTm9kZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzY29yZURpc3BsYXk6e1xyXG4gICAgICAgICAgICBkZWZhdWx0Om51bGwsXHJcbiAgICAgICAgICAgIHR5cGU6Y2MuTGFiZWxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBzY29yZUF1ZGlvOntcclxuICAgICAgICAgICAgZGVmYXVsdDpudWxsLFxyXG4gICAgICAgICAgICB0eXBlOmNjLkF1ZGlvQ2xpcFxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgIH0sXHJcblxyXG4gICAgLy8gTElGRS1DWUNMRSBDQUxMQkFDS1M6XHJcblxyXG4gICAgb25Mb2FkICgpIHtcclxuICAgICAgICB0aGlzLmdyb3VuZFkgPSB0aGlzLmdyb3VuZC55ICsgdGhpcy5ncm91bmQuaGVpZ2h0LzI7XHJcblxyXG4gICAgICAgIGZvcihsZXQgaSA9IDA7aSA8IHRoaXMuc3RhckNvdW50O2krKyl7XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVOZXdTdGFyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgdGhpcy5zY29yZSA9IDA7XHJcbiAgICB9LFxyXG5cclxuICAgIGdlbmVyYXRlTmV3U3RhcjpmdW5jdGlvbigpe1xyXG4gICAgICAgIC8vIDHjgIHmoLnmja5wcmVmYWLvvIznlJ/miJDkuIDkuKroioLngrlcclxuICAgICAgICBsZXQgbmV3U3RhciA9IGNjLmluc3RhbnRpYXRlKHRoaXMuc3RhclByZWZhYik7XHJcblxyXG4gICAgICAgIC8vIDLjgIHlsIboioLngrnliqDlhaXliLDnlYzpnaLkuK1cclxuICAgICAgICB0aGlzLm5vZGUuYWRkQ2hpbGQobmV3U3Rhcik7XHJcblxyXG4gICAgICAgIC8vIDPjgIHorr7nva7kvY3nva5cclxuICAgICAgICBuZXdTdGFyLnNldFBvc2l0aW9uKHRoaXMuZ2VuZXJhdGVTdGFyUG9zKCkpO1xyXG5cclxuICAgICAgICAvLyA044CB5Zyo5pif5pif57uE5Lu25LiK77yM5pqC5a2YR2FtZeWvueixoeeahOW8leeUqFxyXG4gICAgICAgIG5ld1N0YXIuZ2V0Q29tcG9uZW50KFwiU3RhclwiKS5nYW1lID0gdGhpcztcclxuICAgICAgICBcclxuICAgIH0sXHJcblxyXG4gICAgLy8g55Sf5oiQ6ZqP5py65L2N572uXHJcbiAgICBnZW5lcmF0ZVN0YXJQb3MoKXtcclxuICAgICAgICBsZXQgcmFuZFggPSAwO1xyXG4gICAgICAgIGxldCByYW5kWSA9IHRoaXMuZ3JvdW5kWSArIE1hdGgucmFuZG9tKCkgKiB0aGlzLnBsYXllci5nZXRDb21wb25lbnQoXCJQbGF5ZXJcIikuanVtcEhlaWdodCArIDUwO1xyXG4gICAgICAgIGxldCBtYXhYID0gdGhpcy5ub2RlLndpZHRoIC8gMjtcclxuXHJcbiAgICAgICAgcmFuZFggPSAoTWF0aC5yYW5kb20oKSAtIDAuNSkgKiAyICogbWF4WDtcclxuICAgICAgICByZXR1cm4gY2MudjIocmFuZFgscmFuZFkpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvLyB1cGRhdGUgKGR0KSB7fSxcclxuXHJcbiAgICBnYWluU2NvcmUoKXtcclxuICAgICAgICB0aGlzLnNjb3JlID0gdGhpcy5zY29yZSArIDE7XHJcbiAgICAgICAgdGhpcy5zY29yZURpc3BsYXkuc3RyaW5nID0gYFNjb3JlIDogJHt0aGlzLnNjb3JlfWA7XHJcblxyXG4gICAgICAgIGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5zY29yZUF1ZGlvLGZhbHNlKTtcclxuICAgIH1cclxufSk7XHJcbiJdfQ==