cc.Class({
    extends: cc.Component,

    properties: {

    },

    // use this for initialization
    start: function () {
        /* 开启碰撞控制器 */
        cc.director.getCollisionManager().enabled = true;

        /* 对碰撞体绘制用于调试的边框 */
        cc.director.getCollisionManager().enabledDebugDraw = true;
        cc.director.getCollisionManager().enabledDrawBoundingBox = true;
    },

    // called every frame
    update: function (dt) {

    },
});
