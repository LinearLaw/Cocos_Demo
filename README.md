# Cocos Creator 

    Hello Cocos !!!

# 笔记

    1、图片资源加载
        图片资源必须要放在 assets/resources文件夹里面，方便sprite组件替换图片。

    2、事件监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    
    3、事件keyCode
        event.keyCode
        cc.macro.KEY 该对象下有一堆的键盘按键名，直接用。

    4、获取屏幕宽高
        cc.winSize
        -> { width:996 ,height:640 }

    5、替换图片
        首先获取当前节点下的Sprite对象
            this.player = this.node.getComponent(cc.Sprite);

        使用cc.loader加载器，加载图片资源，
            cc.loader.loadRes(`Player/NPC_1/NPC_1`, cc.SpriteFrame, (err, spriteFrame)=>{
                _this.player.spriteFrame = spriteFrame;
            });

        注意：这里的路径是 Player/NPC_1/NPC_1 ，
            它等效于assets/resources/Player/NPC_1/NPC_1.png，
            后缀名可以不写，前面的assets/resources是固定的（好像，没有深究）

    6、生命周期
        onLoad：在组件加载的时候就触发，可用来初始化数据，绑定事件。
        update：每一帧渲染时触发update，一般一秒60帧，自带参数dt，dt为帧间时延。
