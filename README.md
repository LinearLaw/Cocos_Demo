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

    11、Tiled Map一种做碰撞检测思路
        Cocos Creator 自己提供了一套碰撞系统，不过不太适合Tiled Map
        主要是因为Tiled Map的障碍物太分散了，整个地图都是零散的。
        研究了一下，提供一种Tiled Map的思路
            1、设player 是一个sprite节点，map 是一个Tiled Map节点。
                用户操作player的位置，进行左右移动，
                map上面分层，障碍物一层，设为 soilLayer，
                            非障碍物一层，设为 mainLayer。

            2、player的上下左右移动，很简单，设置xy轴的坐标就行了。
                可是，怎么判断当前player和Tiled Map的障碍层发生了重叠？

            3、Tiled Map中，有个瓦片和瓦片坐标的概念，
                瓦片是map中的单个图块，
                单个瓦片坐标是当前处在x轴第几块y轴第几块；

            4、  首先，将player挂到map节点旗下，
                获取在map下的player坐标：
                关键！！！编辑地图时，需要创建地图对象层，

                    let objects = this.map.getObjectGroup('objects') ;
                    let playerObj = objects.getObject('player') ;
                    let playerPos =cc.p(playerObj.offset.x ,playerObj.offset.y);
                    // return {x:50,y:50} 相对于map节点而言的坐标。

                接着，将playerPos转换成瓦片坐标：
                    this.playerTile = this.getTilePosition(playerPos) ;

                    getTilePosition:function(playerPos){
                        let mapSize = this.node.getContentSize();
                        let tileSize = this.map.getTileSize();
                        let x = Math.floor(playerPos.x / tileSize.width) ;
                        let y = Math.floor(playerPos.y / tileSize.height) ;
                        return cc.v2(x ,y) ;
                    },

                然后，关键步骤，碰撞检测就在此，根据用户按下的上下左右操作，
                    给player的瓦片坐标进行x、y的+1-1，注意，是瓦片坐标，
                    得到即将移动后的瓦片坐标，设为 playerTarTile，
                    Tiled Map图层有一个方法getTileGIDAt，
                        传入瓦片坐标，返回当前瓦片坐标下是否有图块，
                        如果有图块，那就说明会发生碰撞，如果没有图块，那就可以移动。
                    即：soilLayer.getTileGIDAt(playerTarTile)，
                        // 返回 0 说明没有图块；
                        // 返回GID，说明当前位置有图块

                最后，判断好了当前的player的瓦片坐标后，
                    需要将瓦片坐标转换成像素坐标，对player设置像素坐标，从而移动。
                    瓦片坐标转换成像素坐标，使用getPositionAt这个方法进行，

                    let pos = this.mainLayer.getPositionAt(this.playerTile);
                    this.player.setPosition(pos);

            注意！！！这里有个坑，创建了TiledMap之后，Tiled图层的Archor需要设置成x=0,y=0！
                                同时，Tiled图层下面的所有跟地图有关的节点都要设置成x=0，y=0！
                                否则碰撞的坐标就冲突！

    12、动画
        在使用动画节点之前，需要创建一副动作帧图像，
            使用TexturePacker，导入多帧图片，生成plist文件。

        设置动画，需要用到cocos creator的动画编辑器，动画编辑器在控制台旁边
        启动编辑，然后设置帧动画，在plist文件下的单个图片拖进去，形成动画序列
            编辑帧动画时，下方的sample的值，指的是动画每秒帧率，值越大，动画播放速度越快。
            WrapMode，循环模式，设置loop，动画会循环播放。
