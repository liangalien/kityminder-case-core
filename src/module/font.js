define(function(require, exports, module) {
    var kity = require('../core/kity');
    var utils = require('../core/utils');

    var Minder = require('../core/minder');
    var MinderNode = require('../core/node');
    var Command = require('../core/command');
    var Module = require('../core/module');

    var TextRenderer = require('./text');

    function getNodeDataOrStyle(node, name) {
        return node.getData(name) || node.getStyle(name);
    }

    TextRenderer.registerStyleHook(function(node, textGroup) {
        var dataColor = node.getData('color');
        var disabled = node.getData('disabled');
        var selectedColor = node.getStyle('selected-color');
        var styleColor = node.getStyle('color');

        var foreColor = dataColor || (node.isSelected() && selectedColor ? selectedColor : styleColor);
        var fontFamily = getNodeDataOrStyle(node, 'font-family');
        var fontSize = getNodeDataOrStyle(node, 'font-size');
        var fontDecoration = getNodeDataOrStyle(node, 'text-decoration');

        textGroup.fill(foreColor);

        textGroup.eachItem(function(index, item) {
            item.setFont({
                'family': fontFamily,
                'size': fontSize
            });

            if (fontDecoration) {
                item.node.setAttribute('text-decoration', fontDecoration)
            } else {
                item.node.removeAttribute('text-decoration')
            }

            if (disabled === 1) {
                item.container.node.setAttribute('text-decoration', 'line-through');
            } else {
                item.container.node.removeAttribute('text-decoration');
            }
        });
    });


    Module.register('fontmodule', {
        'commands': {
            /**
             * @command ForeColor
             * @description 设置选中节点的字体颜色
             * @param {string} color 表示颜色的字符串
             * @state
             *   0: 当前有选中的节点
             *  -1: 当前没有选中的节点
             * @return 如果只有一个节点选中，返回已选中节点的字体颜色；否则返回 'mixed'。
             */
            'forecolor': kity.createClass('fontcolorCommand', {
                base: Command,
                execute: function(km, color) {
                    var nodes = km.getSelectedNodes();
                    nodes.forEach(function(n) {
                        n.setData('color', color);
                        n.render();
                    });
                },
                queryState: function(km) {
                    return km.getSelectedNodes().length === 0 ? -1 : 0;
                },
                queryValue: function(km) {
                    if (km.getSelectedNodes().length == 1) {
                        return km.getSelectedNodes()[0].getData('color');
                    }
                    return 'mixed';
                }
            }),

            /**
             * @command Background
             * @description 设置选中节点的背景颜色
             * @param {string} color 表示颜色的字符串
             * @state
             *   0: 当前有选中的节点
             *  -1: 当前没有选中的节点
             * @return 如果只有一个节点选中，返回已选中节点的背景颜色；否则返回 'mixed'。
             */
            'background': kity.createClass('backgroudCommand', {
                base: Command,

                execute: function(km, color) {
                    var nodes = km.getSelectedNodes();
                    nodes.forEach(function(n) {
                        n.setData('background', color);
                        n.render();
                    });
                },
                queryState: function(km) {
                    return km.getSelectedNodes().length === 0 ? -1 : 0;
                },
                queryValue: function(km) {
                    if (km.getSelectedNodes().length == 1) {
                        return km.getSelectedNodes()[0].getData('background');
                    }
                    return 'mixed';
                }
            }),


            /**
             * @command FontFamily
             * @description 设置选中节点的字体
             * @param {string} family 表示字体的字符串
             * @state
             *   0: 当前有选中的节点
             *  -1: 当前没有选中的节点
             * @return 返回首个选中节点的字体
             */
            'fontfamily': kity.createClass('fontfamilyCommand', {
                base: Command,

                execute: function(km, family) {
                    var nodes = km.getSelectedNodes();
                    nodes.forEach(function(n) {
                        n.setData('font-family', family);
                        n.render();
                        km.layout();
                    });
                },
                queryState: function(km) {
                    return km.getSelectedNodes().length === 0 ? -1 : 0;
                },
                queryValue: function(km) {
                    var node = km.getSelectedNode();
                    if (node) return node.getData('font-family');
                    return null;
                }
            }),

             /**
             * @command FontSize
             * @description 设置选中节点的字体大小
             * @param {number} size 字体大小（px）
             * @state
             *   0: 当前有选中的节点
             *  -1: 当前没有选中的节点
             * @return 返回首个选中节点的字体大小
             */
            'fontsize': kity.createClass('fontsizeCommand', {
                base: Command,

                execute: function(km, size) {
                    var nodes = km.getSelectedNodes();
                    nodes.forEach(function(n) {
                        n.setData('font-size', size);
                        n.render();
                        km.layout(300);
                    });
                },
                queryState: function(km) {
                    return km.getSelectedNodes().length === 0 ? -1 : 0;
                },
                queryValue: function(km) {
                    var node = km.getSelectedNode();
                    if (node) return node.getData('font-size');
                    return null;
                }
            }),


            'fontdecoration': kity.createClass('fontdecorationCommand', {
                base: Command,

                execute: function(km, v) {
                    var nodes = km.getSelectedNodes();

                    nodes.forEach(function(n) {
                        if (v) n.setData('text-decoration', v);
                        else n.removeData('text-decoration')

                        n.render();
                        km.layout(300);
                    });
                },
                queryState: function(km) {
                    var nodes = km.getSelectedNodes(),
                        result = 0;
                    if (nodes.length === 0) {
                        return -1;
                    }
                    nodes.forEach(function(n) {
                        if (n && n.getData('text-decoration')) {
                            result = 1;
                            return false;
                        }
                    });
                    return result;
                },
                queryValue: function(km) {
                    var node = km.getSelectedNode();
                    if (node) return node.getData('text-decoration');
                    return null;
                }
            })
        }
    });
});
