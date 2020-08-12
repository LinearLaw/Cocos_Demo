// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // 星星和主角之间的距离，小于这个值，则完成收集
        pickRadius:0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    getPlayerDistance(){
        let playerPos = this.game.player.getPosition();

        let dist = this.node.position.sub(playerPos).mag();

        return dist;
    },
    onPicked(){
        // 子组件触发父组件的事件。
        // 触发Game组件里面的再生成函数
        this.game.generateNewStar();

        // 触发Game组件里面的得分函数
        this.game.gainScore();

        // 当前节点销毁
        this.node.destroy();
    },

    update (dt) {
        if(this.getPlayerDistance() < this.pickRadius){
            this.onPicked();
            return;
        }
    },
});
