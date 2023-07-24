/**
 * @fileOverview
 *
 * 支持节点详细信息（HTML）格式
 *
 * @author: techird
 * @copyright: Baidu FEX, 2014
 */
define(function(require, exports, module) {
    var kity = require('../core/kity');
    var utils = require('../core/utils');

    var Minder = require('../core/minder');
    var MinderNode = require('../core/node');
    var Command = require('../core/command');
    var Module = require('../core/module');
    var Renderer = require('../core/render');

    Module.register('NoteModule', function() {
        /**
         * @command Note
         * @description 设置节点的备注信息
         * @param {string} note 要设置的备注信息，设置为 null 则移除备注信息
         * @state
         *    0: 当前有选中的节点
         *   -1: 当前没有选中的节点
         */
        var NoteCommand = kity.createClass('NoteCommand', {
            base: Command,

            execute: function(minder, note) {
                var node = minder.getSelectedNode();
                node.setData('note', note);
                node.render();
                node.getMinder().layout(300);
            },

            queryState: function(minder) {
                return minder.getSelectedNodes().length === 1 ? 0 : -1;
            },

            queryValue: function(minder) {
                var node = minder.getSelectedNode();
                return node && node.getData('note');
            }
        });

        var NoteIcon = kity.createClass('NoteIcon', {
            base: kity.Group,

            constructor: function() {
                this.callBase();
                this.width = 16;
                this.height = 17;

                this.rect = new kity.Rect().fill('#d7d7d7').setId(utils.uuid('node_note'));

                this.text = new kity.Text()
                    .setFontSize(11)
                    .setVerticalAlign('middle');

                this.addShapes([this.rect, this.text]);
                this.setStyle('cursor', 'pointer');
            }
        });

        var NoteIconRenderer = kity.createClass('NoteIconRenderer', {
            base: Renderer,

            create: function(node) {
                if (!node.getData('note')) return;

                var icon = new NoteIcon();

                icon.getShapeNode().setAttribute("class", "node-note");
                icon.on('mousedown', function(e) {
                    e.preventDefault();
                    node.getMinder().fire('editnoterequest');
                });
                icon.on('mouseover', function() {
                    node.getMinder().fire('shownoterequest', {node: node, icon: icon});
                });
                icon.on('mouseout', function() {
                    node.getMinder().fire('hidenoterequest', {node: node, icon: icon});
                });
                return icon;
            },

            shouldRender: function(node) {
                return node.getData('note') && !node.getData('hideState') && !node.hide;
            },

            update: function(icon, node, box) {
                if (!node.getData('note')) {
                    return;
                }

                var maxLength = Math.ceil(box.width / 10 - 4);
                var note = node.getData('note');
                if (note.length > maxLength) {
                    note = note.substring(0, maxLength) + "...";
                }

                icon.rect.setTranslate(box.left, box.bottom + 2).setSize(box.width, 20);
                icon.text.setTranslate(box.left, box.bottom + 11).setContent(note)
                return new kity.Box(icon.x, icon.y, icon.width, icon.height);
            }

        });

        return {
            renderers: {
                outside: NoteIconRenderer
            },
            commands: {
                'note': NoteCommand
            }
        };
    });
});
