// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

// const DIR_X_TYPE = {
//     stand:0,
//     left:-1,
//     right:1,
// }

// const DIR_Y_TYPE={
//     stand:0,
//     up:-1,
//     down:1,
// }

import {
    DIR_X_TYPE,
    DIR_Y_TYPE,

    COLLID_TYPE,
} from './Config/tools.js'


cc.Class({
    extends: cc.Component,

    properties: {
        // 游戏角色
        player:{
            default:null,
            type:cc.Node,
        },

        // x轴的实时速度
        playerXSpeed:32,
        // x轴的行走方向 
        xDirection:DIR_X_TYPE.stand,
        maxXSpeed:20,
        
        // y轴加速度
        yAccel:100,
        // y轴方向
        yDirection:DIR_Y_TYPE.stand,
        // y轴的实时速度值
        playerYSpeed:0,
        // y轴最大速度
        maxYSpeed:20,
    },


    onLoad () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
    },
    onDestroy(){
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
    },
    onKeyDown:function(e){
        switch(e.keyCode){
            case cc.macro.KEY.up:
                this.onPlayerUp();
                break;
            case cc.macro.KEY.down:
                this.onPlayerDown();
                break;
            case cc.macro.KEY.left:
                this.onPlayerLeft();
                break;
            case cc.macro.KEY.right:
                this.onPlayerRight();
                break;
            default:break;
        }
    },
    onKeyUp:function(e){
        switch(e.keyCode){
            case cc.macro.KEY.up:
                break;
            case cc.macro.KEY.down:
                break;
            case cc.macro.KEY.left:
            case cc.macro.KEY.right:
                this.xDirection = DIR_X_TYPE.stand;
                break;
            default:break;
        }
    },
    onPlayerLeft:function(){
        this.xDirection = DIR_X_TYPE.left;
    },
    onPlayerRight:function(){
        this.xDirection = DIR_X_TYPE.right;
    },
    onPlayerUp:function(){
        this.yDirection = DIR_Y_TYPE.up;
        this.playerYSpeed = this.maxYSpeed;
    },
    onPlayerDown:function(){

    },

    
    /* ——————————————————————————— ↓ 碰撞 ↓ ————————————————————————————— */
    /* 发生了碰撞 */
    onCollisionEnter: function (other, self) {
        // 判断撞到的碰撞体的类型，执行对应的方法。
        switch(other.tag){
            case COLLID_TYPE.ground:
                this.onGroundCollision(other,self);
                break;
            default:break;
        }
    },
    onCollisionStay: function (other, self) {
        /* 如果stay触发，说明角色在地面。 */
    },
    onCollisionExit:function(other,self){

        /*  如果当前角色不处于下落和上升状态，则说明角色已经悬空，
            需要将方向改为下落。
         */
        if(this.yDirection !== DIR_Y_TYPE.down && this.yDirection !== DIR_Y_TYPE.up){
            this.playerYSpeed = 0;
            this.yDirection = DIR_Y_TYPE.down;
        }
    },

    /* @desc 角色碰撞到了地板  */
    onGroundCollision(other, self) {
        
        /* 世界坐标下，当前节点的碰撞矩形框 */
        const selfAabb = self.world.aabb;
        // 上一帧的矩形框
        const selfPreAabb = self.world.preAabb.clone();
                
        /* 世界坐标下，被碰撞节点的矩形框 */
        const otherAabb = other.world.aabb;
        const otherPreAabb = other.world.preAabb.clone();

        /* 1、y轴方向上，碰撞时进行y轴位移矫正 */
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;
        /* 
         * @desc 判定两个矩形是否相交
         * cc.Intersection 用来测试两个形状是否相交
         *      rectRect 测试两个矩形是否相交
         * 
         * yMax，一个矩形，y轴上的最大值
         *      坐标系是哪儿？坐标系取的是父节点的相对坐标系
         * yMin，一个矩形，y轴上的最小值
         */
        selfPreAabb.y = selfAabb.y;
        otherPreAabb.y = otherAabb.y;
        if(cc.Intersection.rectRect(selfPreAabb,otherPreAabb)){
            /* 1、下落状态，然后当前节点在碰撞节点的上面 */
            if(this.yDirection === DIR_Y_TYPE.down && (selfPreAabb.yMax > otherPreAabb.yMax)){
                this.node.y = otherPreAabb.yMax - this.node.parent.y + selfPreAabb.height/2;
            
            
            }else if(this.yDirection === DIR_Y_TYPE.up && (selfPreAabb.yMin < otherPreAabb.yMin)){
                this.node.y = otherPreAabb.yMin - this.node.parent.y - selfPreAabb.height;
            }
        }

        /* 结束下落状态 */
        this.yDirection = DIR_Y_TYPE.stand;
        this.playerYSpeed = 0;
    },
    /* ——————————————————————————— ↑ 碰撞 ↑ ————————————————————————————— */
    
    start () {
        this.yDirection = DIR_Y_TYPE.down;
        this.xDirection = DIR_X_TYPE.stand;
    },
    
    update (dt) {
        
        // 计算y的坐标值
        this.calcYSpeed(dt);
        
        this.node.x = this.node.x + this.xDirection*this.playerXSpeed*dt;
    },

    /* @desc 判断竖直方向上的移动方向，计算出当前速度 
            向上：y坐标 ↑ ，移动速度 ↓
            向下：y坐标 ↓ ，移动速度 ↑
     */
    calcYSpeed: function(dt){
        let yOffset = this.playerYSpeed;
        switch(this.yDirection){
            case DIR_Y_TYPE.up:
                yOffset = yOffset - this.yAccel * dt;

                // 如果当前速度已经减到最小值，就开始下落
                if(yOffset < 0){
                    yOffset = 0;
                    this.yDirection = DIR_Y_TYPE.down;
                }
                break;

            case DIR_Y_TYPE.down:
                yOffset = yOffset + this.yAccel * dt;
                break;

            case DIR_Y_TYPE.stand:
                yOffset = 0;
                break;
            default:break;
        }

        if(Math.abs(yOffset) > this.maxYSpeed){
            yOffset = this.maxYSpeed * (Math.abs(yOffset)/yOffset);
        }
        this.playerYSpeed = yOffset;
        /* 作用到新的坐标值中
                yDirection，up的时候是1，down的时候是-1
         */
        this.node.y = this.node.y + this.yDirection * yOffset;
    }
});
