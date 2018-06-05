var astar = require("astar");

cc.Class({
    extends: cc.Component,
    editor: CC_EDITOR && {
        executeInEditMode: true
    },
    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        is_debug: true,
    },

    // use this for initialization
    onLoad: function () {
        this.time = 0;
        this.draw_node = new cc.DrawNode("drawPos");
        this.node._sgNode.addChild(this.draw_node);
        this.draw_label_node = new cc.Node("drawLabel")
        this.node.addChild(this.draw_label_node);
    },

    draw_debug_label:function(node,name,str,position) {
        var labelNode = node.getChildByName(name);
        if (labelNode) {
            node.removeChild(labelNode);
        }
        labelNode = new cc.Node(name)
        labelNode.parent = node;
        labelNode.position = position;
        labelNode.color =  new cc.Color(236,180,36,255);
        var label = labelNode.addComponent(cc.Label);
        label.string = str;
        label.fontSize = 12;
        label.lineHeight = 14;
        return labelNode;
    },

    map_degbu_draw: function() {
        if (this.draw_node) {
            // this.draw_node.destory();
            this.node._sgNode.removeChild(this.draw_node);
            this.draw_node = new cc.DrawNode("drawPos");
            this.node._sgNode.addChild(this.draw_node);
        }

        if (this.draw_label_node) {
            this.draw_label_node.removeAllChildren();
        }

        var x_line = this.map.item_size * 0.5;
        var ypos = this.map.item_size * 0.5;

        

        for(var i = 0; i < this.map.height; i ++) {
            var xpos = x_line;
            for(var j = 0; j < this.map.width; j ++) {
                if (this.map.data[i * this.map.width + j] === 0) {
                    this.draw_node.drawSegment(cc.p(xpos, ypos), 
                                          cc.p(xpos + 1, ypos + 1),
                                          2, cc.color(0, 255, 0, 255))
                }
                else {
                    this.draw_node.drawSegment(cc.p(xpos, ypos), 
                                          cc.p(xpos + 1, ypos + 1),
                                          2, cc.color(0, 0, 255, 255));
                }
                this.draw_debug_label(this.draw_label_node,'('+xpos+','+ypos+')','('+xpos+','+ypos+')',cc.p(xpos,ypos));
                xpos += this.map.item_size;
            }

            ypos += this.map.item_size;
        }
    },

    start: function() {
        this.map = require("game_map_" + this.node.name);
        if(this.is_debug) {
            this.map_degbu_draw();
        }
    },

    astar_search: function(src_w, dst_w) {
        var src = this.node.convertToNodeSpaceAR(src_w);
        var dst = this.node.convertToNodeSpaceAR(dst_w);

        var src_mx = Math.floor((src.x) / this.map.item_size);
        var src_my = Math.floor((src.y) / this.map.item_size);

        var dst_mx = Math.floor((dst.x) / this.map.item_size);
        var dst_my = Math.floor((dst.y) / this.map.item_size);
        
        var path = astar.search(this.map, src_mx, src_my, dst_mx, dst_my);
        
        var world_offset = this.node.convertToWorldSpaceAR(cc.p(this.map.item_size * 0.5, this.map.item_size * 0.5));
        var path_pos = [];
        // console.log(path_pos);

        for(var i = 0; i < path.length; i ++) {
            var x = path[i].x * this.map.item_size;
            var y = path[i].y * this.map.item_size;

            var pos = cc.p(world_offset.x + x, world_offset.y + y);
            path_pos.push(pos);
        }

        return path_pos;
    },
    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.time += dt;
        // cc.log(this.time);
        if(this.is_debug&&CC_EDITOR && this.time>0.1) {
            this.time = 0;
            cc.log("draw")
            // this.map_degbu_draw();
        }
    },
});
