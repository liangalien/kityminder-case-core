define(function(require, exports, module) {
    var kity = require('../core/kity');
    var utils = require('../core/utils');

    var Minder = require('../core/minder');
    var MinderNode = require('../core/node');
    var Command = require('../core/command');
    var Module = require('../core/module');
    var Renderer = require('../core/render');

    /**
     * @command AppendChildNode
     * @description 添加子节点到选中的节点中
     * @param {string|object} textOrData 要插入的节点的文本或数据
     * @state
     *    0: 当前有选中的节点
     *   -1: 当前没有选中的节点
     */
    var AppendChildCommand = kity.createClass('AppendChildCommand', {
        base: Command,
        execute: function(km, text) {
            var parent = km.getSelectedNode();
            if (!parent) {
                return null;
            }
            var node = km.createNode(text, parent);
            km.select(node, true);
            if (parent.isExpanded()) {
                node.render();
            }
            else {
                parent.expand();
                parent.renderTree();
            }
            km.layout(600);
        },
        queryState: function(km) {
            var selectedNode = km.getSelectedNode();
            return selectedNode ? 0 : -1;
        }
    });

    /**
     * @command AppendSiblingNode
     * @description 添加选中的节点的兄弟节点
     * @param {string|object} textOrData 要添加的节点的文本或数据
     * @state
     *    0: 当前有选中的节点
     *   -1: 当前没有选中的节点
     */
    var AppendSiblingCommand = kity.createClass('AppendSiblingCommand', {
        base: Command,
        execute: function(km, text) {
            var sibling = km.getSelectedNode();
            var parent = sibling.parent;
            if (!parent) {
                return km.execCommand('AppendChildNode', text);
            }
            var node = km.createNode(text, parent, sibling.getIndex() + 1);
            node.setGlobalLayoutTransform(sibling.getGlobalLayoutTransform());
            km.select(node, true);
            node.render();
            km.layout(600);
        },
        queryState: function(km) {
            var selectedNode = km.getSelectedNode();
            return selectedNode ? 0 : -1;
        }
    });

    /**
     * @command RemoveNode
     * @description 移除选中的节点
     * @state
     *    0: 当前有选中的节点
     *   -1: 当前没有选中的节点
     */
    var RemoveNodeCommand = kity.createClass('RemoverNodeCommand', {
        base: Command,
        execute: function(km) {
            var nodes = km.getSelectedNodes();
            var ancestor = MinderNode.getCommonAncestor.apply(null, nodes);
            var index = nodes[0].getIndex();

            nodes.forEach(function(node) {
                if (!node.isRoot()) km.removeNode(node);
            });
            if (nodes.length == 1) {
                var selectBack = ancestor.children[index - 1] || ancestor.children[index];
                km.select(selectBack || ancestor || km.getRoot(), true);
            } else {
                km.select(ancestor || km.getRoot(), true);
            }
            km.layout(600);
        },
        queryState: function(km) {
            var selectedNode = km.getSelectedNode();
            return selectedNode && !selectedNode.isRoot() ? 0 : -1;
        }
    });

    var AppendParentCommand = kity.createClass('AppendParentCommand', {
        base: Command,
        execute: function(km, text) {
            var nodes = km.getSelectedNodes();

            nodes.sort(function(a, b) {
                return a.getIndex() - b.getIndex();
            });
            var parent = nodes[0].parent;

            var newParent = km.createNode(text, parent, nodes[0].getIndex());
            nodes.forEach(function(node) {
                newParent.appendChild(node);
            });
            newParent.setGlobalLayoutTransform(nodes[nodes.length >> 1].getGlobalLayoutTransform());

            km.select(newParent, true);
            km.layout(600);
        },
        queryState: function(km) {
            var nodes = km.getSelectedNodes();
            if (!nodes.length) return -1;
            var parent = nodes[0].parent;
            if (!parent) return -1;
            for (var i = 1; i < nodes.length; i++) {
                if (nodes[i].parent != parent) return -1;
            }
            return 0;
        }
    });

    /**
     * @command AppendNextNode
     * @description 根据父节点类型，智能添加子节点
     * @param {string|object} textOrData 要插入的节点的文本或数据
     * @state
     *    0: 当前有选中的节点
     *   -1: 当前没有选中的节点
     */
    var AppendNextCommand = kity.createClass('AppendNextCommand', {
        base: Command,
        execute: function(km, text) {
            var parent = km.getSelectedNode();
            if (!parent) {
                return null;
            }
            var typeMap = km.getTypeMap();
            var data = {text: text};
            var parentType = parent.getData("type");
            if (parentType == typeMap.expect.id) { //父节点是预期结果，无法新增子节点
                return null;
            }
            else if (parentType == typeMap.module.id || parentType == typeMap.require.id) { //父节点是模块，子节点应是用例
                data = {
                    text: text || "用例名称",
                    type: typeMap.case.id,
                };
            }
            else if (parentType == typeMap.case.id) { //父节点是用例，子节点应是步骤
                data = {
                    text: text || "操作步骤",
                    type: typeMap.step.id,
                };
            }
            else if (parentType == typeMap.step.id) { //父节点是步骤，子节点应是预期
                data = {
                    text: text || "预期结果",
                    type: typeMap.expect.id,
                };
            }
            var node = km.createNode(data, parent);
            km.select(node, true);
            if (parent.isExpanded()) {
                node.render();
            }
            else {
                parent.expand();
                parent.renderTree();
            }
            km.layout(600);
        },
        queryState: function(km) {
            var nodes = km.getSelectedNodes();
            if (!nodes.length) return -1;

            var typeMap = km.getTypeMap();
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].getData('type') == typeMap.expect.id) return -1; //步骤没有下一级
            }
            return 0;
        }
    });

    /**
     * @command AppendPrevNode
     * @description 根据节点类型，智能添加父节点
     * @param {string|object} textOrData 要插入的节点的文本或数据
     * @state
     *    0: 当前有选中的节点
     *   -1: 当前没有选中的节点
     */
    var AppendPrevCommand = kity.createClass('AppendPrevCommand', {
        base: Command,
        execute: function(km, text) {
            var nodes = km.getSelectedNodes();
            nodes.sort(function(a, b) {
                return a.getIndex() - b.getIndex();
            });
            var parent = nodes[0].parent;
            var typeMap = km.getTypeMap();
            var data = {text: text};
            var nodeType = nodes[0].getData("type");
            if (nodeType == typeMap.module.id || nodeType == typeMap.require.id || nodeType == typeMap.case.id) { //当前节点是模块或用例，父节点应是模块
                data = {
                    text: text || "目录名称",
                    type: typeMap.module.id,
                };
            }
            else if (nodeType == typeMap.step.id) { //当前节点是步骤，父节点应是用例
                data = {
                    text: text || "用例名称",
                    type: typeMap.case.id,
                };
            }
            else if (nodeType == typeMap.expect.id) { //当前节点是预期，父节点应是步骤
                data = {
                    text: text || "操作步骤",
                    type: typeMap.step.id,
                };
            }

            var newParent = km.createNode(data, parent, nodes[0].getIndex());
            nodes.forEach(function(node) {
                newParent.appendChild(node);
            });
            newParent.setGlobalLayoutTransform(nodes[nodes.length >> 1].getGlobalLayoutTransform());

            km.select(newParent, true);
            km.layout(600);
        },
        queryState: function(km) {
            var nodes = km.getSelectedNodes();
            if (!nodes.length) return -1;

            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].isRoot()) return -1; //Root没有上一层
            }
            return 0;
        }
    });


    /**
     * @command AppendSameNode
     * @description 根据节点类型，智能新建同级节点
     * @param {string|object} textOrData 要添加的节点的文本或数据
     * @state
     *    0: 当前有选中的节点
     *   -1: 当前没有选中的节点
     */
    var AppendSameCommand = kity.createClass('AppendSameCommand', {
        base: Command,
        execute: function(km, text) {
            var sibling = km.getSelectedNode();
            var typeMap = km.getTypeMap();
            var siblingType = sibling.getData("type");
            if (!text) {
                if (siblingType == typeMap.module.id) text = "目录名称";
                else if (siblingType == typeMap.require.id) text = "需求概述";
                else if (siblingType == typeMap.case.id) text = "用例名称";
                else if (siblingType == typeMap.step.id) text = "操作步骤";
                else if (siblingType == typeMap.expect.id) text = "预期结果";
            }
            var data = {text: text, type: siblingType || typeMap.module.id}
            var parent = sibling.parent;
            if (!parent) {
                return km.execCommand('AppendChildNode', data);
            }
            var node = km.createNode(data, parent, sibling.getIndex() + 1);
            node.setGlobalLayoutTransform(sibling.getGlobalLayoutTransform());
            km.select(node, true);
            node.render();
            km.layout(600);
        },
        queryState: function(km) {
            var selectedNode = km.getSelectedNode();
            return selectedNode ? 0 : -1;
        }
    });

    /**
     * @command AppendSameNode
     * @description 新增需求节点
     * @param {string|object} textOrData 要添加的节点的文本或数据
     * @state
     *    0: 当前有选中的节点
     *   -1: 当前没有选中的节点
     */
    var AppendRequireCommand = kity.createClass('AppendRequireCommand', {
        base: Command,
        execute: function(km, text) {
            var parent = km.getSelectedNode();
            var typeMap = km.getTypeMap();
            var data = {text: text || '需求概述', type: typeMap.require.id};
            var parentType = parent.getData("type");
            if (parentType != typeMap.module.id) { //父节点非目录，无法新增需求子节点
                return null;
            }

            var node = km.createNode(data, parent);
            km.select(node, true);
            if (parent.isExpanded()) {
                node.render();
            }
            else {
                parent.expand();
                parent.renderTree();
            }
            km.layout(600);

        },
        queryState: function(km) {
            var selectedNode = km.getSelectedNode();
            return selectedNode && selectedNode.getData('type') === km.getTypeMap().module.id ? 0 : -1;
        }
    });

    Module.register('NodeModule', function() {
        return {
            commands: {
                'AppendChildNode': AppendChildCommand,
                'AppendSiblingNode': AppendSiblingCommand,
                'RemoveNode': RemoveNodeCommand,
                'AppendParentNode': AppendParentCommand,
                'AppendNextNode': AppendNextCommand,
                'AppendRequireNode': AppendRequireCommand,
                'AppendPrevNode': AppendPrevCommand,
                'AppendSameNode': AppendSameCommand
            },

            'commandShortcutKeys': {
                //'appendsiblingnode': 'normal::Enter',
                //'appendchildnode': 'normal::Insert|Tab',
                //'appendparentnode': 'normal::Shift+Tab|normal::Shift+Insert',
                'appendnextnode': 'normal::Insert|Tab',
                'appendprevnode': 'normal::Insert|Tab',
                'appendsamenode': 'normal::Shift+Tab|normal::Shift+Insert',
                //'removenode': 'normal::Del|Backspace'
            }
        };
    });
});
