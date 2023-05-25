define(function(require, exports, module) {
    var kity = require('../core/kity')
    var utils = require('../core/utils')
    var Minder = require('../core/minder')
    var MinderNode = require('../core/node')
    var Command = require('../core/command')
    var Module = require('../core/module')
    var Renderer = require('../core/render')

    var DEFAULT_BACKGROUND = '#ffffff'

    Module.register('Story', function() {
        var StoryIcon = kity.createClass('StoryIcon', {
            base: kity.Group,
            constructor: function (value) {
                this.callBase()
                this.setSize(20)
                this.create()
                this.setValue(value)
                this.setId(utils.uuid('node_story'))
                this.translate(0.5, 0.5)
            },
            setSize: function (size) {
                this.width = this.height = size
            },
            create: function () {
                this.p1 = new kity.Path().setTranslate( - 10, -7).setPathData("m-0.21739,1.6079c0,-1.00766 0.81763,-1.82529 1.82529,-1.82529l12.78421,0c1.00766,0 1.82529,0.81763 1.82529,1.82529l0,12.78421c0,1.00766 -0.81763,1.82529 -1.82529,1.82529l-12.78421,0a1.82632,1.82632 0 0 1 -1.82529,-1.82529l0,-12.78421z").fill("#36B37E");
                this.p2 = new kity.Path().setTranslate( - 10, -7).setPathData("m4.40489,12.62228l0,-8.34271c0,-0.49818 0.40265,-0.90186 0.89878,-0.90186l5.39266,0c0.49612,0 0.89878,0.40368 0.89878,0.90186l0,8.34271l-3.59511,-3.60743l-3.59511,3.60743z").fill("#FFFFFF");
                this.addShapes([this.p1, this.p2])
            },
            setValue: function (value) {

            }
        })

        var StoryCommand = kity.createClass('StoryCommand', {

            base: Command,

            execute: function(minder, story) {
                var nodes = minder.getSelectedNodes();
                nodes.forEach(function(node) {
                    node.setData('story', story).render();
                });
                minder.layout(200);
            },

            queryValue: function(minder) {
                var node = minder.getSelectedNode();
                return node && node.getData('story') || null;
            },
            queryState: function (km) {
                var node = minder.getSelectedNode();
                return node && node.getData('type') == minder.getTypeMap().case.id ? 0 : -1;
            },
        });

        return {
            commands: {
                'story': StoryCommand
            },
            renderers: {
                right: kity.createClass('StoryRenderer', {
                    base: Renderer,
                    create: function (node) {
                        return new StoryIcon()
                    },
                    shouldRender: function (node) {
                        return node.getData("story") && !node.getData('hideState')
                    },
                    update: function (container, node, box) {
                        var spaceRight = node.getStyle('space-right');
                        var story = node.getData('story');
                        if (!story) return;

                        var overlay = new StoryIcon();
                        container.setTranslate(box.right + 15, 0);
                        return new kity.Box({
                            x: box.right + overlay.width,
                            y: Math.round(-overlay.height / 2),
                            width: spaceRight,
                            height: overlay.height
                        });
                    }
                })
            }
        };
    });
});
