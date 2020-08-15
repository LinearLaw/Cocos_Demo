// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const DIR_TYPE = {
    left:1,
    right:2,

    up:3,
    down:4,
}

cc.Class({
    extends: cc.Component,

    properties: {
        /**
         * 方向指示器
         */
        _direction:{
            default:0,
            type:cc.Integer
        },
        // 在某一个方向上的加速度
        directionAccel:200,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.systemEvent.on(
            cc.SystemEvent.EventType.KEY_DOWN,
            this.onKeyPress,
            this
        );
        cc.systemEvent.on(
            cc.SystemEvent.EventType.KEY_UP,
            this.onKeyUp,
            this
        )
    },
    onDestroy(){
        cc.systemEvent.off(
            cc.SystemEvent.EventType.KEY_DOWN,
            this.onKeyPress,
            this
        );
        cc.systemEvent.off(
            cc.SystemEvent.EventType.KEY_UP,
            this.onKeyUp,
            this
        )
    },

    onKeyPress(e){
        switch(e.keyCode){
            case cc.macro.KEY.left:
                this.playerLeft();
                break;
            case cc.macro.KEY.right:
                this.playerRight();
                break;
            case cc.macro.KEY.up:
                this.playerTop();
                break;
            case cc.macro.KEY.down:
                this.playerBottom();
                break;
        }
    },
    onKeyUp(){
        this._direction = 0;
    },
    // 向左走
    playerLeft(){this._direction = DIR_TYPE.left;},
    // 向右走
    playerRight(){this._direction = DIR_TYPE.right;},
    // 向上走
    playerTop(){this._direction = DIR_TYPE.up;},
    // 向下走
    playerBottom(){this._direction = DIR_TYPE.down;},

    start () {

    },

    update (dt) {
        if(this._direction === DIR_TYPE.left || this._direction===DIR_TYPE.right){
            let xOffset = 0;
            switch(this._direction){
                case DIR_TYPE.left:
                    xOffset -= dt*this.directionAccel;
                    break;
                case DIR_TYPE.right:
                    xOffset += dt*this.directionAccel;
                    break;
                default:break;
            }
            this.node.x = this.node.x + xOffset;
        }
        if(this._direction === DIR_TYPE.up || this._direction===DIR_TYPE.down){
            let yOffset = 0;
            switch(this._direction){
                case DIR_TYPE.up:
                    yOffset += dt*this.directionAccel;
                    break;
                case DIR_TYPE.down:
                    yOffset -= dt*this.directionAccel;
                    break;
                default:break;
            }
            this.node.y = this.node.y + yOffset;
        }
    },
});
