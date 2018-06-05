// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var nav_agent = require("./comm/nav_agent")
cc.Class({
    extends: cc.Component,

    properties: {
        map:{
            type:cc.Node,
            default:null
        },
        player_agent:{
            type:nav_agent,
            default:null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.map.on(cc.Node.EventType.TOUCH_START, function (t) {
            var w_pos = t.getLocation();
            this.player_agent.nav_to_map(w_pos);
        }.bind(this),this.map);

    },

    start () {

    },

    // update (dt) {},
});
