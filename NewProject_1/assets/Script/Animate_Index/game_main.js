// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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
        // 速度、限流、方向
        xSpeed:18,
        ySpeed:18,
        keybordCtrl:false,
        currentDirection:'down',

        // 坐标
        targetPosition:{
            default:{}
        },
        currentPosition:{
            default:{}
        },
    },

    onLoad () {
        this.keybordCtrl = false; // 键盘节流，防止按键触发事件过快

        this.main();

        // 初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyDown, this);    
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_LEFT, this.onKeyDown, this);    
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_RIGHT, this.onKeyDown, this);  
    },
    // 获取坐标，设置坐标，初始化
    main(){
        const _this = this;
        let objects = this.map.getObjectGroup('objects');
        let playerObj = objects.getObject('player');

        // 获取当前角色的坐标
        let playerPos =cc.v2(playerObj.offset.x ,playerObj.offset.y);
        this.playerTile = this.getTilePosition(playerPos); // 转换成对应的瓦片坐标

        let pos = this.backLayer.getPositionAt(this.playerTile);
        this.player.setPosition(pos)
        this.currentPosition = pos;
        this.targetPosition = pos;

        this.updatePlayerPos();

        this.schedule(function(){
            _this.setPositionAsProgress(_this.currentPosition,_this.targetPosition);
        }, 0.1);
    },
    // 像素坐标转换成瓦片坐标
    getTilePosition:function(playerPos){
        let mapSize = this.node.getContentSize();
        let tileSize = this.map.getTileSize();
        let x = Math.floor(playerPos.x / tileSize.width) ;
        let y = Math.floor(playerPos.y / tileSize.height) ;
        return cc.v2(x ,y) ;
    },

    onKeyDown(event){
        const _this = this;

        // 键盘节流
        if(this.keybordCtrl == true){return;}
        this.keybordCtrl = true;
        setTimeout(()=>{
            _this.keybordCtrl = false;
        },100);

        let newTile = Object.assign({},_this.playerTile);
        switch(event.keyCode) {
            case cc.macro.KEY.up:
                newTile.y = newTile.y-1<0?0:newTile.y-1;
                this.currentDirection != 'up'?this.changeDirection('up'):1;
                break;
            case cc.macro.KEY.down:
                newTile.y = newTile.y+1;
                this.currentDirection != 'down'?this.changeDirection('down'):1;
                break;
            case cc.macro.KEY.left:
                newTile.x = newTile.x-1<0?0:newTile.x-1;
                this.currentDirection != 'left'?this.changeDirection('left'):1;
                break;
            case cc.macro.KEY.right:
                newTile.x = newTile.x+1;
                this.currentDirection != 'right'?this.changeDirection('right'):1;
                break;
        };
        this.tryToMove(newTile);
    },
    // 根据方向更换动画
    changeDirection(dir){
        this.currentDirection = dir;
        this.getComponent(cc.Animation).play('BAN_'+dir);
    },
    // 计算是否发生了碰撞
    tryToMove(newTile){
        try{
            if(this.blockLayer.getTileGIDAt(newTile)){
                cc.log('hit the wall .');
                return false;
            }
            this.playerTile = newTile;
            this.updatePlayerPos();
        }catch(e){
            this.updatePlayerPos();
        }
    },
    // 根据player的瓦片坐标，转换成像素坐标，进行移动
    updatePlayerPos:function(){
        let pos = this.backLayer.getPositionAt(this.playerTile);
        this.targetPosition = pos;
    },
    // 移动坐标到targetPosition
    setPositionAsProgress(current,target){
        let diff = {
            x:target.x - current.x,
            y:target.y - current.y
        }
        if(diff.x != 0){
            if(diff.x>0){
                // 向右走
                current.x = Math.abs(diff.x) <= this.xSpeed?target.x:current.x+this.xSpeed;
            }else{
                // 向左走
                current.x = Math.abs(diff.x) <= this.xSpeed?target.x:current.x-this.xSpeed;
            }
            this.keybordCtrl = true;
        }
        if(diff.y != 0){
            if(diff.y>0){
                // 向上走
                current.y = Math.abs(diff.y) <= this.ySpeed?target.y:current.y+this.ySpeed;
            }else{
                // 向下走
                current.y = Math.abs(diff.y) <= this.ySpeed?target.y:current.y-this.ySpeed;
            }
            this.keybordCtrl = true;
        }
        this.player.setPosition(current);
        if(diff.y == 0 && diff.x == 0){
            this.keybordCtrl = false;
        }
    },

    onDestroy(){
        // 取消键盘输入监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_LEFT, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_RIGHT, this.onKeyDown, this);
    },

    // update (dt) {},
});
