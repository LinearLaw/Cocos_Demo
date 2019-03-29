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
        // 背景图层
        backLayer:{
            default:null,
            type:cc.TiledLayer
        },
        // 障碍物图层
        blockLayer:{
            default:null,
            type:cc.TiledLayer
        },
        // 当前角色
        player:{
            default: null,
            type: cc.Node,
        },
        playerSprite:{
            default: null,
            type: cc.Sprite,
        },
        xSpeed:5,
        ySpeed:5,

        timing:1,
        keybordCtrl:false,

        // 屏幕大小
        screenSize:{
            default:{}
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        const _this = this;
        this.screenSize = cc.winSize;
        let objects = this.map.getObjectGroup('objects');
        let playerObj = objects.getObject('player');
        let playerPos =cc.v2(playerObj.offset.x ,playerObj.offset.y);
        this.playerTile = this.getTilePosition(playerPos); // 转换成对应的瓦片坐标
        this.updatePlayerPos();

        this.xSpeed = 12;
        this.ySpeed = 12;

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
        if(this.keybordCtrl == true){
            return;
        }
        this.keybordCtrl = true;
        setTimeout(()=>{
            _this.keybordCtrl = false;
        },100);

        let newTile = Object.assign({},_this.playerTile);
        switch(event.keyCode) {
            case cc.macro.KEY.up:
                (this.timing >= 13 && this.timing < 16) ? this.timing++ : this.timing = 13;
                newTile.y = newTile.y-1<0?0:newTile.y-1;
                break;
            case cc.macro.KEY.down:
                (this.timing >= 1 && this.timing < 4) ? this.timing++ : this.timing = 1;
                newTile.y = newTile.y+1;
                break;
            case cc.macro.KEY.left:
                (this.timing >= 5 && this.timing < 8) ? this.timing++ : this.timing = 5;
                newTile.x = newTile.x-1<0?0:newTile.x-1;
                break;
            case cc.macro.KEY.right:
                (this.timing >= 9 && this.timing < 12) ? this.timing++ : this.timing = 9;
                newTile.x = newTile.x+1;
                break;
        };
        this.changePic(_this.timing);
        this.tryToMove(newTile);
    },
    // 角色移动，切换图片
    changePic(num){
        var _this = this;
        cc.loader.loadRes(`Player/NPC_2/DTGF_${num}`, cc.SpriteFrame, (err, spriteFrame)=>{
            console.log(err);
            console.log(spriteFrame);
            _this.playerSprite.spriteFrame = spriteFrame;
        });
    },
    // 像素坐标转换成瓦片坐标
    getTilePosition:function(playerPos){
        let mapSize = this.node.getContentSize();
        let tileSize = this.map.getTileSize();
        let x = Math.floor(playerPos.x / tileSize.width) ;
        let y = Math.floor(playerPos.y / tileSize.height) ;
        return cc.v2(x ,y) ;
    },

    // 计算是否发生了碰撞
    tryToMove(newTile){
        try{
            if(this.blockLayer.getTileGIDAt(newTile)){
                cc.log('hit the wall .') ;
                return false;
            }
            this.playerTile = newTile;
            this.updatePlayerPos();
        }catch(e){
            console.log(e,newTile);
        }
        
    },
    // 根据player的瓦片坐标，转换成像素坐标，进行移动
    updatePlayerPos:function(){
        let pos = this.backLayer.getPositionAt(this.playerTile);
        this.player.setPosition(pos);
    },


    update (dt) {

    },
});
