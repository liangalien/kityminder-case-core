define(function(require, exports, module) {
    var kity = require('../core/kity');
    var Command = require('../core/command');
    var Module = require('../core/module');

    var DisabledCommand = kity.createClass({
        base: Command,
        execute: function(minder, disabled) {
            function setDisabled(node, disabled) {
                node.setData('disabled', disabled);
                node.render();
                node.getChildren().forEach(function (child) {
                    setDisabled(child, disabled);
                });
            }

            var nodes = minder.getSelectedNodes();
            nodes.forEach(function (node) {
                setDisabled(node, disabled);
                node.getMinder().layout(300);
            });
        },

        queryState: function(minder) {
            return minder.getSelectedNodes().length > 0 ? 0 : -1;
        },
        queryValue: function(minder) {
            var disabled = minder.getSelectedNode();
            if (disabled) return disabled.getData('disabled');
            return 0;
        }
    });


    Module.register('disabled', {
        'commands': {
            'disabled': DisabledCommand,
        },
    });
});
