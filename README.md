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

    7、Tile Map
        使用tile map创建tmx文件，注意tmx文件和图块文件需要放到同一个目录下。
        cocos creator创建tile map 节点，导入tmx文件，在界面中就可以看到地图了。

        默认一个图块为32px * 32px，宽高 960 * 640 的画面需要30 * 20个图块
                                    宽高 375 * 640 的画面需要 12 * 20个图块

    8、在当前的节点内，访问其他节点
        假设，我在NPC.js中，希望能够访问TiledMap，
        NPC.js挂载在player节点上，TiledMap挂载在TiledMap这个节点上。

        首先、在properties中声明一个属性，命名为map，type设置为cc.TiledMap或cc.Node都行
            properties: {
                map: {
                    default:null,
                    type:cc.TiledMap
                },
                ...
            }
        接着，回到Cocos Creator界面，在【层级管理器】选中Player节点，
            观察【属性管理器】，可以看到有个属性叫做map，后面的值为null，
            在【层级管理器】中点击TiledMap节点，拖动到map后面的值当中，
            这时候，properties中的map就指向了同级下的TiledMap节点，可以直接在NPC.js中访问了。
    
    9、在当前组件，访问子节点或当前节点
        访问当前组件的节点。
            var node = this.node;

        访问当前组件节点下面的其他组件，以下两种方法是等效的。
            this.node.getComponent(cc.Sprite);
            this.getComponent(cc.Sprite);

        访问父组件下的子组件，多个节点挂载到同一个父节点下，父节点去访问子节点
            this.cannons = this.node.getChildren(); // 返回子节点组成的数组
            this.node.getChildByName("Cannon 01"); // 根据名称查找
            cc.find("Cannon 01/Barrel/SFX", this.node); // 传入路径，将从this.node出发查找该节点
            cc.find("Canvas/Menu/Back"); // 从根节点开始查找该节点

    10、共享数据
        Cococs Creator 共享数据可以通过js模块化实现。
            // global.js
            module.exports = {
                backNode: null,
                backLabel: null,
            };

            // NPC.js ，某一个需要用到共享数据的组件
            var global = require("global.js");
        

