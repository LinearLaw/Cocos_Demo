// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html



cc.Class({
    extends: cc.Component,

    properties: {
        /* 角色动画对象 */
        anim:{
            default:null,
            type:cc.Animation
        },
        player:{
            default:null,
            type:cc.Node
        },

        // 角色是否处于攻击状态
        playerIsAttack:false,
        // 按键是否按下
        isBtnPress:false,

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

        this.isBtnPress = true;
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
            case cc.macro.KEY.space:
                this.onPlayerAttack();
                break;
            default:break;
        }
    },
    onKeyUp:function(e){
        this.isBtnPress = false;

        // 键盘弹起，而此时处于攻击状态，需要等攻击状态停止
        if(!this.playerIsAttack){
            this.playAnimate("PlayerStand");
        }
    },
    // 按下space键，播放攻击动画
    onPlayerAttack:function(){
        this.playAnimate("PlayerAttack");
    },
    // 攻击动画起始帧触发事件，将标志置为true
    onPlayerAttachStart:function(){
        this.playerIsAttack = true;
    },
    // 攻击动画结束
    onPlayerAttackEnd:function(){
        this.playerIsAttack = false;

        // 攻击动画结束，而此时按钮没有被按下，就切换到站立动画 
        if(!this.isBtnPress){
            this.playAnimate("PlayerStand");
        }

    },
    onPlayerLeft:function(){
        // 调整角色的左朝向
        this.turnLeft();
        // 播放移动动画
        this.playAnimate("PlayerMove");
    },
    onPlayerRight:function(){
        // 调整角色的右朝向
        this.turnRight();
        this.playAnimate("PlayerMove");
    },
    // 角色贴图朝向改动
    turnLeft() { this.node.scaleX = Math.abs(this.node.scaleX); },
    turnRight() { this.node.scaleX = -Math.abs(this.node.scaleX); },

    playAnimate:function(aniName){
        /* 1、先判定当前是否有动画播放 - 默认动画不会计入当前动画 */
        if(this.anim.currentClip){
            /*  2、然后判断当前播放的动画和将要播放的动画是否相同，
                如果两者动画名称不一致，才去播放新动画aniName，
                因为onKeydown会不停触发，导致多次引用play方法，
                play方法会暂停当前动画播放下一个动画，这会导致动画一直都只播放第一帧，
            */
            if(this.anim.currentClip.name !== aniName){
                this.anim.play(aniName);
            }
        }else{
            this.anim.play(aniName);
        }
    },

    onPlayerUp:function(){ },
    onPlayerDown:function(){ },

    start () {

    },

    // update (dt) {},
});
