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
        // 星星的初始个数
        STAR_COUNT:{
            default:1,
            type:cc.Integer,
        },
        // 每获得多少个星星，stage+1，星星数也+1
        STAGE_COUNT:100,
        MAX_STAR_COUNT:15,  // 界面中增加星星的最大个数

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
        // 分数文本节点
        scoreDisplay:{
            default:null,
            type:cc.Label
        },

        // 得分音效
        scoreAudio:{
            default:null,
            type:cc.AudioClip
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 获取地板的高度
        this.groundY = this.ground.y + this.ground.height/2;

        // 初始时，生成多个星星
        for(let i = 0;i < this.STAR_COUNT;i++){
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
        let tempScore = this.score + 1;

        // 每过 STAGE_COUNT 分，界面上多一个星星，最多增加MAX_STAR_COUNT个
        let tempCount = Math.floor(tempScore/this.STAGE_COUNT)
        if(tempCount <= this.MAX_STAR_COUNT 
            && Math.floor(this.score / this.STAGE_COUNT) < tempCount
        ){
            this.generateNewStar()
        }

        this.score = tempScore;
        this.scoreDisplay.string = `Score : ${this.score} -Stage  : ${tempCount}`;

        cc.audioEngine.playEffect(this.scoreAudio,false);


    }
});
