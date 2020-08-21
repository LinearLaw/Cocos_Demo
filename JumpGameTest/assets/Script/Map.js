// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import {
    COLLID_TYPE
} from './Config/tools.js'

cc.Class({
    extends: cc.Component,

    properties: {
        // 地图对象
        worldMap:{
            default:null,
            type:cc.TiledMap
        },

        // 碰撞图层的名称
        collisionLayerName:"groundObj",
        colliderPrefab:{
            default:null,
            type:cc.Prefab,
        }
    },

    start () {
        /* 获取碰撞图层，将碰撞体加入到界面中 */
        this.generateWallCollision();

    },
    // 给边缘墙体增加碰撞检测 - 现在没啥用。
    generateWallCollision(){
        // 获取碰撞对象
        const collisionPoints = this.worldMap.getObjectGroup(this.collisionLayerName);

        const objects = collisionPoints.getObjects();

        for(let i = 0;i<objects.length;i++){
            let collidItem = objects[i];

            // 初始化一个空节点
            const node = cc.instantiate(this.colliderPrefab);
            node.setAnchorPoint(0,0);

            node.width = collidItem.width;
            node.height = collidItem.height;
            node.x = collidItem.x;
            node.y = collidItem.y;
            // node.y = collidItem.y;

            // 在新节点上加入碰撞体
            node.addComponent(cc.BoxCollider);

            // 设置碰撞体的大小、偏移量
            node.getComponent(cc.BoxCollider).size = cc.size(collidItem.width,collidItem.height);
            node.getComponent(cc.BoxCollider).offset = cc.v2(collidItem.width / 2, -collidItem.height / 2);
            
            // 碰撞体的类型
            node.getComponent(cc.BoxCollider).tag = COLLID_TYPE.ground;

            // 加入到界面中
            this.node.addChild(node);
        }
    }

    // update (dt) {},
});
