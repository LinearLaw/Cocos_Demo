// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        /**
         * type ：这里进行了属性检查
         */
        // 星星预置资源
        starPrefab:{
            default:null,
            type: cc.Prefab
        },
        starCount:{
            default:1,
            type:cc.Integer,
        },

        // 星星消失时间的范围
        maxStarDuration:0,
        minStarDuration:0,

        // 地面节点
        ground:{
            default:null,
            type:cc.Node,
        },

        // player节点
        player:{
            default:null,
            type:cc.Node,
        },

        scoreDisplay:{
            default:null,
            type:cc.Label
        },

        scoreAudio:{
            default:null,
            type:cc.AudioClip
        },


    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.groundY = this.ground.y + this.ground.height/2;

        for(let i = 0;i < this.starCount;i++){
            this.generateNewStar();
        }


        this.score = 0;
    },

    generateNewStar:function(){
        // 1、根据prefab，生成一个节点
        let newStar = cc.instantiate(this.starPrefab);

        // 2、将节点加入到界面中
        this.node.addChild(newStar);

        // 3、设置位置
        newStar.setPosition(this.generateStarPos());

        // 4、在星星组件上，暂存Game对象的引用
        newStar.getComponent("Star").game = this;
        
    },

    // 生成随机位置
    generateStarPos(){
        let randX = 0;
        let randY = this.groundY + Math.random() * this.player.getComponent("Player").jumpHeight + 50;
        let maxX = this.node.width / 2;

        randX = (Math.random() - 0.5) * 2 * maxX;
        return cc.v2(randX,randY);
    },

    // update (dt) {},

    gainScore(){
        this.score = this.score + 1;
        this.scoreDisplay.string = `Score : ${this.score}`;

        cc.audioEngine.playEffect(this.scoreAudio,false);
    }
});
