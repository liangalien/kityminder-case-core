define(function(require, exports, module) {
    var kity = require('../core/kity');
    var Command = require('../core/command');
    var Module = require('../core/module');
    var Renderer = require('../core/render');
    var Minder = require('../core/minder');

    Module.register('Type', function() {
        var types = {
            module: {id: 1, key: 'module', name: '目录', color: '#fff4b3'},
            case: {id: 2, key: 'case', name: '用例', color: '#ffb3fb'},
            step: {id: 3, key: 'step', name: '步骤', color: '#ecffb3'},
            expect: {id: 4, key: 'expect', name: '预期', color: '#b3e5ff'},
            require: {id: 11, key: 'require', name: '需求', color: '#98fdb4'}
        };

        var getTypeByID = function (typeId) {
            for (var key in types) {
                if (types[key].id == typeId)
                    return types[key];
            }
            return {};
        };

        kity.extendClass(Minder, {
            getTypeMap: function() {
                return types;
            },
            getTypeByID: getTypeByID,
        });

        var TypeCommand = kity.createClass('TypeCommand', {

            base: Command,

            execute: function(minder, type) {
                var nodes = minder.getSelectedNodes();
                nodes.forEach(function(node) {
                    node.setData('type', type).render();
                });

                minder.layout(200);
            },

            queryValue: function(minder) {
                var node = minder.getSelectedNode();
                return node && node.getData('type') || null;
            },

            queryState: function(km) {
                return km.getSelectedNode() ? 0 : -1;
            }
        });

        /**
         * @class 资源的覆盖图形
         *
         * 该类为一个资源以指定的颜色渲染一个动态的覆盖图形
         */
        var TypeOverlay = kity.createClass('TypeOverlay', {
            base: kity.Group,

            constructor: function() {
                this.callBase();

                var rect = this.rect = new kity.Rect().setRadius(4);
                var text = this.text = new kity.Text()
                    .setFontSize(11)
                    .setVerticalAlign('middle');

                this.addShapes([rect, text]);
                this.setStyle('cursor', 'pointer');
                this.addClass('node-type');
            },

            setValue: function(type) {
                var paddingX = 5,
                    paddingY = 2,
                    borderRadius = 4;
                var text, box, rect;
                var name = getTypeByID(type).name;
                var color = getTypeByID(type).color;

                text = this.text;

                if (type == this.lastType) {
                    box = this.lastBox;

                } else {
                    text.setContent(name);
                    box = text.getBoundaryBox();
                    this.lastType = type;
                    this.lastBox = box;
                }

                text.setX(paddingX).setY(paddingY * 2 - 3).fill('#4d4100'); //字体颜色

                rect = this.rect;
                rect.setPosition(0, box.y + paddingY - 3);
                this.width = Math.round(box.width + paddingX * 2);
                this.height = Math.round(box.height + paddingY * 2);
                rect.setSize(this.width, this.height);
                rect.fill(color);
            }
        });

        /**
         * @class 资源渲染器
         */
        var TypeRenderer = kity.createClass('TypeRenderer', {
            base: Renderer,
            create: function(node) {
                var icon = new kity.Group();
                icon.on('mousedown', function(e) {
                    var minder = node.getMinder();
                    e.preventDefault();
                    minder.fire('edittype', {node: node});
                });

                return icon;
            },

            shouldRender: function(node) {
                return node.getData('type')  && !node.getData('hideState') && !node.hide
            },

            update: function(container, node, box) {
                var spaceRight = node.getStyle('space-right');
                var type = node.getData('type');
                if (!type) return;

                //var index = node.getIndex() || 0;
                var overlay = new TypeOverlay();
                if (container.getShapes() && container.getShapes().length > 0)
                    container.removeShape(0); //先删除再新增，避免发生重影
                container.addShape(overlay);
                overlay.setVisible(true);
                overlay.setValue(type);
                overlay.setTranslate(spaceRight, -1);

                container.setTranslate(box.right, 0);
                return new kity.Box({
                    x: box.right + overlay.width,
                    y: Math.round(-overlay.height / 2),
                    width: spaceRight,
                    height: overlay.height
                });
            }
        });

        return {
            commands: {
                'type': TypeCommand
            },

            renderers: {
                right: TypeRenderer
            }
        };
    });
});
