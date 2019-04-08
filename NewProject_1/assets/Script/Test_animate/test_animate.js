cc.Class({
    extends: cc.Component,

    properties: {
        keybordCtrl:false,
        currentDirection:'down'
    },

    onLoad () {

        // 初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_LEFT, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_RIGHT, this.onKeyDown, this);

    },
    onKeyDown(event){
        const _this = this;
        if(this.keybordCtrl == true){
            return;
        }
        this.keybordCtrl = true;
        setTimeout(()=>{
            _this.keybordCtrl = false;
        },100);
        switch(event.keyCode) {
            case cc.macro.KEY.up:
                this.currentDirection != 'up'?this.changeDirection('up'):1;
                break;
            case cc.macro.KEY.down:
                this.currentDirection != 'down'?this.changeDirection('down'):1;
                break;
            case cc.macro.KEY.left:
                this.currentDirection != 'left'?this.changeDirection('left'):1;
                break;
            case cc.macro.KEY.right:
                this.currentDirection != 'right'?this.changeDirection('right'):1;
                break;
        };
    },
    changeDirection(dir){
        this.currentDirection = dir;
        this.getComponent(cc.Animation).play('DMM_'+dir);
    },
    onDestroy(){
        // 取消键盘输入监听
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_LEFT, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_RIGHT, this.onKeyDown, this);
    },
    start () {

    },

    update (dt) {

    },
});
