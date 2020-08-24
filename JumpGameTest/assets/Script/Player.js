// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
        /*  记录x方向发生了什么样的碰撞，
            如果x，left方向发生了碰撞，设置为left
            如果x，right方向发生了碰撞，设置为right，

            xDirection * collisionX如果为正，说明发生了x方向的碰撞，
            此时，在update函数中，将playerXSpeed设置为0，不让角色继续向前
         */
        collisionX:0,
        
        // y轴加速度
        yAccel:100,
        // y轴方向
        yDirection:DIR_Y_TYPE.stand,
        // y轴的实时速度值
        playerYSpeed:0,
        // y轴最大速度
        maxYSpeed:20,

        /*  当前节点碰撞点数，可能会有x方向、y方向的碰撞
            如果touchingNumber为0，说明既没有跟x碰撞，也没有跟y碰撞，
            此时的节点就是处于悬空状态
         */
        touchingNumber:0,

        /*  当前角色是否处于跳跃状态，
            跳跃状态下，处于悬空状态，此时的动作会和touchingNumber的动作冲突，
            所以需要isJump标志位，来标识跳跃状态，绕过touchingNumber检查
         */
        isJump:false,
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
                if(this.isJump){ return; }
                this.isJump = true;
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
        this.playerXSpeed = this.maxXSpeed;

        // 调整角色的左朝向
        this.turnLeft();
    },
    onPlayerRight:function(){
        this.xDirection = DIR_X_TYPE.right;
        this.playerXSpeed = this.maxXSpeed;

        // 调整角色的右朝向
        this.turnRight();
    },
    // 角色贴图朝向改动
    turnLeft() { this.node.scaleX = -Math.abs(this.node.scaleX); },
    turnRight() { this.node.scaleX = Math.abs(this.node.scaleX); },

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
    /* @desc 角色碰撞到了地板  */
    onGroundCollision(other, self) {
        this.touchingNumber ++;
        
        /* 世界坐标下，当前节点的碰撞矩形框 */
        const selfAabb = self.world.aabb;
        // 上一帧的矩形框
        const selfPreAabb = self.world.preAabb.clone();
                
        /* 世界坐标下，被碰撞节点的矩形框 */
        const otherAabb = other.world.aabb;
        const otherPreAabb = other.world.preAabb.clone();


        /* 2、x轴方向上，碰撞时进行位移矫正
            先判断x方向的框。
         */
        selfPreAabb.x = selfAabb.x;
        otherPreAabb.x = otherAabb.x;
        if(cc.Intersection.rectRect(selfPreAabb,otherPreAabb)){

            // 这里增加了1px的偏移，主要为了防止碰撞盒的重叠。
            if(this.xDirection === DIR_X_TYPE.right && (selfPreAabb.xMax > otherPreAabb.xMin)){
                this.node.x = this.node.x - 1 - Math.floor(Math.abs(selfPreAabb.xMax - otherPreAabb.xMin));
                
                /* 当前在right方向发生了碰撞 */
                this.collisionX = DIR_X_TYPE.right;
            }
            else if(this.xDirection === DIR_X_TYPE.left && (selfPreAabb.xMin<otherPreAabb.xMax)){
                this.node.x = this.node.x + 1 + Math.floor(Math.abs(otherPreAabb.xMax - selfPreAabb.xMin));

                // 当前在left方向发生了碰撞
                this.collisionX = DIR_X_TYPE.left;
            }

            /* 记录，在other发生了X轴的碰撞 - 
                为什么会需要touchingX？
                在onCollisionExit的时候，需要将collisionX的值初始化。
             */
            other.touchingX = true;
            return;
        }

        /* 1、y轴方向上，碰撞时进行y轴位移矫正
            如果x方向的框没有交集，再判断y方向的框
         */
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
        if(cc.Intersection.rectRect(selfPreAabb,otherPreAabb)){
            /* 1、下落状态，然后当前节点在碰撞节点的上面
                这里的算法，需要用图来绘制。
             */

            if(this.yDirection === DIR_Y_TYPE.down && (selfPreAabb.yMin < otherPreAabb.yMax)){
                this.node.y = otherPreAabb.yMax - this.node.parent.y + selfPreAabb.height/2;
            }else if(this.yDirection === DIR_Y_TYPE.up && (selfPreAabb.yMin < otherPreAabb.yMin)){
                this.node.y = otherPreAabb.yMin - this.node.parent.y - selfPreAabb.height/2;
            }
            // 记录，在other发生了X轴的碰撞
            other.touchingY = true;
        }
        /* 结束下落状态 */
        this.yDirection = DIR_Y_TYPE.stand;
        this.playerYSpeed = 0;
        this.isJump = false;
    },

    onCollisionStay: function (other, self) {
        /* 如果stay触发，说明角色在地面。 */
        
    },
    onCollisionExit:function(other,self){

       if(other.tag === COLLID_TYPE.ground){
            this.touchingNumber--;

            /*  当碰撞面数为0，也就是说既没有跟x碰撞，也没有跟y碰撞，
                说明此时角色处于悬空状态，角色设置为自由落体。

                但是，如果是角色在跳跃状态，不设置状态。
             */
            if( this.touchingNumber === 0 && this.isJump === false){
                this.playerYSpeed = 0;
                this.yDirection = DIR_Y_TYPE.down;
            }

            if(other.touchingX){
                this.collisionX = DIR_X_TYPE.stand;
                other.touchingX = false;
            }else if(other.touchingY){
                other.touchingY = false;
            }
            // this.collisionX = DIR_X_TYPE.stand;
       }
    },

    
    /* ——————————————————————————— ↑ 碰撞 ↑ ————————————————————————————— */
    
    start () {
        this.yDirection = DIR_Y_TYPE.down;
        this.xDirection = DIR_X_TYPE.stand;
    },
    
    update (dt) {
        
        // 计算y的坐标值
        this.calcYSpeed(dt);
        
        // 利用collisionX来判定当前是否发生了x轴碰撞，发生了就停下来
        if(this.xDirection * this.collisionX > 0){
            this.playerXSpeed = 0;
        }
        console.log("update",this.xDirection,this.collisionX,"-->",this.playerXSpeed);
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
