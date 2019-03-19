// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const utils = require("../Utils/utils.js")

cc.Class({
    extends: cc.Component,

    properties: {
        // 地图
        map: {
            default:null,
            type:cc.TiledMap
        },
        // 当前角色
        player:{
            default: null,
            type: cc.Sprite,
        },
        npcPosition:{
            default:{}
        },
        xSpeed:5,
        ySpeed:5,
        blockSpace:10,

        timing:1,
        keybordCtrl:false,

        // 屏幕大小
        screenSize:{
            default:{}
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.screenSize = cc.winSize;

        this.npcPosition.x = this.screenSize.x / 2;
        this.npcPosition.y = this.screenSize.y / 2;
        this.xSpeed = 15;
        this.ySpeed = 15;

        this.timing = 1; // 时序，控制sprite
        this.keybordCtrl = false; // 键盘节流，防止按键触发事件过快

        // 初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyDown, this);    
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_LEFT, this.onKeyDown, this);    
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_RIGHT, this.onKeyDown, this);    
    },
    // 时序  down:1-4,left:5-8,right:9-12,up:13-16
    onKeyDown(event){
        const _this = this;
        let x = this.npcPosition.x;
        let y = this.npcPosition.y;
        if(this.keybordCtrl == true){
            return;
        }
        this.keybordCtrl = true;
        setTimeout(()=>{
            _this.keybordCtrl = false;
        },100);
        switch(event.keyCode) {
            case cc.macro.KEY.up:
                (this.timing >= 13 && this.timing < 16) ? this.timing++ : this.timing = 13;
                this.setPosition(x,y + this.ySpeed);
                break;
            case cc.macro.KEY.down:
                (this.timing >= 1 && this.timing < 4) ? this.timing++ : this.timing = 1;
                this.setPosition(x,y - this.ySpeed);
                break;
            case cc.macro.KEY.left:
                (this.timing >= 5 && this.timing < 8) ? this.timing++ : this.timing = 5;
                this.setPosition(x - this.xSpeed,y);
                break;
            case cc.macro.KEY.right:
                (this.timing >= 9 && this.timing < 12) ? this.timing++ : this.timing = 9;
                this.setPosition(x + this.xSpeed,y);
                break;
        }
        this.changePic(_this.timing);
    },

    changePic(num){
        var _this = this;
        cc.loader.loadRes(`Player/NPC_1/NPC_${num}`, cc.SpriteFrame, (err, spriteFrame)=>{
            _this.player.spriteFrame = spriteFrame;
        });
    },
    setPosition (x,y) {
        const _this = this;
        let world = utils.localConvertWorldPointAR(this.node);
        if(world.x > this.screenSize.width-this.blockSpace){
            x = this.screenSize.width/2 - this.node.width/2;
        }else if(world.x < this.blockSpace){
            x = - this.screenSize.width/2 + this.node.width/2;
        }
        if(world.y > this.screenSize.height-this.blockSpace){
            y = this.screenSize.height / 2 - this.node.height/2;
        }else if(world.y < this.blockSpace){
            y = - this.screenSize.height/2 + this.node.height/2;
        }

        this.npcPosition.x = x;
        this.npcPosition.y = y;
    },


    update (dt) {
        this.node.x = this.npcPosition.x;
        this.node.y = this.npcPosition.y;
    },
});
