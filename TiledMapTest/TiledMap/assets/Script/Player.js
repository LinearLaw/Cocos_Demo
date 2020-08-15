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
        worldMap:{
            default:null,
            type:cc.TiledMap
        },

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


    onLoad () {
        // 绑定键盘事件
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
        // 解除键盘事件
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

    // 发生了碰撞 - 会发生穿透，不用它了
    // onCollisionEnter: function (other, self) {
    //     const offset = 5;
    //     switch(this._direction){
    //         case DIR_TYPE.left:
    //             break;
    //         case DIR_TYPE.right:
    //             break;
    //         case DIR_TYPE.up:
    //             break;
    //         case DIR_TYPE.down:
    //             break;
    //         default:break;
    //     }
    //     this._direction = 0;
    // },

    //
    /**
     * 将像素坐标转化为瓦片坐标，再计算该节点所在的 tiled 的 gid，没有瓦片则返回0，
     * @param {*} x 
     * @param {*} y 
     * @param {*} layer 
     */
    calcGid (x,y,layer){
        // posInPixel：目标节点的position
        const posInPixel = cc.v2(x,y);

        // 坐标转换，player的坐标 → 地图上的坐标
        var mapSize = this.worldMap.node.getContentSize();
        var tileSize = this.worldMap.getTileSize();

        var xInTiled = (posInPixel.x / tileSize.width);
        var yInTiled = ((mapSize.height - posInPixel.y) / tileSize.height);

        // 坐标转换完成后，返回player坐标上，地图块的gid，如果不在地图上则返回0
        return layer.getTileGIDAt( cc.v2(xInTiled,yInTiled) );
    },
    // 检测角色的四个角的碰撞，有一个角碰撞都不行
    calcCollidate(x,y){
        var layer = this.worldMap.getLayer('blocks');
        if(layer){
            let width = this.node.width;
            let height = this.node.height;
            try{
                // 1、检测角色四个角的gid
                if( this.calcGid(x-width/2, y+height/2, layer) 
                    || this.calcGid(x-width/2, y-height/2, layer)
                    || this.calcGid(x+width/2, y-height/2, layer)
                    || this.calcGid(x+width/2, y+height/2, layer)
                ){  // 1.1、发生了碰撞
                    // console.log("发生了碰撞")
                    return { x:this.node.x, y:this.node.y }
                }else {
                    return {x,y}
                }
            }catch(e){
                // 2、当角色走到地图边缘的时候，因为地图边缘超出了界限，此时会报错
                // console.log("地图边界发生错误");
                // console.log(e);
                return { x:this.node.x, y:this.node.y }
            }
        }

        // 3、地图上没有碰撞检测图层，则直接返回目的坐标
        return { x:x, y:y }
    },
    update (dt) {
        // 1、判断当前的行动方向。计算出位移量，生成新的xy坐标
        let x = this.node.x;
        let y = this.node.y;
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
            x = x + xOffset;
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
            y = y + yOffset;
        }

        // 2、判断当前的坐标是否和障碍物发生了碰撞
        let result = this.calcCollidate(x,y);
        this.node.x = result.x;
        this.node.y = result.y;
    },
});
