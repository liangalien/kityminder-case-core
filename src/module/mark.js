define(function(require, exports, module) {
    var kity = require('../core/kity');
    var utils = require('../core/utils');
    var Minder = require('../core/minder');
    var MinderNode = require('../core/node');
    var Command = require('../core/command');
    var Module = require('../core/module');
    var Renderer = require('../core/render');


    Module.register('Mark', function() {
        var MarkIcon = kity.createClass('MarkIcon', {
            base: kity.Group,
            constructor: function (value) {
                this.callBase()
                this.create()
                this.setId(utils.uuid('node_mark'))
            },
            create: function () {
                this.circle = new kity.Circle(4).fill("#ff2e2e");
                this.addShapes([this.circle])
            },
            setValue: function (value) {
                this.circle.setVisible(value == 1);
            }
        })

        var MarkCommand = kity.createClass('MarkCommand', {

            base: Command,

            execute: function(minder, mark) {
                var nodes = minder.getSelectedNodes();
                nodes.forEach(function(node) {
                    node.setData('mark', mark).render();
                });
                minder.layout(200);
            },

            queryValue: function(minder) {
                var node = minder.getSelectedNode();
                return node && node.getData('mark') || null;
            },
            queryState: function (km) {
                return km.getSelectedNodes().length > 0 ? 0 : -1
            },
        });

        return {
            commands: {
                'mark': MarkCommand
            },
            renderers: {
                right: kity.createClass('MarkRenderer', {
                    base: Renderer,
                    create: function (node) {
                        return new MarkIcon()
                    },
                    shouldRender: function (node) {
                        return node.getData("mark")  && !node.getData('hideState') && !node.hide
                    },
                    update: function (container, node, box) {
                        var value = node.getData("mark");
                        container.setValue(value);
                        if (!value) return;

                        var marginRight = node.getStyle('padding-right');
                        var stroke = node.getStyle('selected-stroke-width');

                        container.setTranslate(
                            box.x + box.width + marginRight - stroke,
                            box.y - stroke);

                        return new kity.Box(0, 0, 0, 0);
                    }
                })
            }
        };
    });
});
