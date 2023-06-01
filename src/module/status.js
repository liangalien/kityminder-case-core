define(function(require, exports, module) {
    var kity = require('../core/kity')
    var utils = require('../core/utils')
    var Minder = require('../core/minder')
    var MinderNode = require('../core/node')
    var Command = require('../core/command')
    var Module = require('../core/module')
    var Renderer = require('../core/render')

    var StatusIcon = kity.createClass('StatusIcon', {
        base: kity.Group,
        constructor: function (value) {
            this.callBase()
            this.setWidth(30)
            this.setHeight(20)
            this.create()
            this.setValue(value)
            this.setId(utils.uuid('node_status'))
            this.translate(0.5, 0.5)
        },
        setWidth: function (size) {
            this.width = size;
        },
        setHeight: function (size) {
            this.height = size
        },
        create: function () {
            this.pass1 = new kity.Path().setPathData("M15 0L15 13.125C15 14.1562 14.1562 15 13.125 15L0 15L15 0Z").fill("#00d010")
            this.pass2 = new kity.Path().setPathData("M14.2356 5.83533C13.9909 5.62113 13.637 5.66644 13.4412 5.93419L8.63288 12.5496L6.88578 9.99982C6.6674 9.68265 6.25321 9.61674 5.96329 9.85565C5.67336 10.0946 5.61311 10.5477 5.8315 10.8649L8.09068 14.1602C8.12457 14.2096 8.17352 14.2673 8.22247 14.3044C8.50863 14.5433 8.91904 14.4815 9.13743 14.1684L14.3335 6.69212C14.5218 6.42437 14.4766 6.04541 14.2356 5.83533Z").fill("#FFF")

            this.fail1 = new kity.Path().setPathData("M15 0L15 13.125C15 14.1562 14.1562 15 13.125 15L0 15L15 0Z").fill("#ef6c77")
            this.fail2 = new kity.Path().setPathData("M14.482 4.33562C14.7323 4.55021 14.7733 4.94465 14.5725 5.21214L7.6383 14.467C7.43747 14.7345 7.06834 14.7783 6.81802 14.5637C6.5677 14.3492 6.52668 13.9547 6.72751 13.6872L13.6617 4.43233C13.8625 4.16484 14.2316 4.12253 14.482 4.33562Z").fill("#FFF")
            this.fail3 = new kity.Path().setPathData("M7.67057 8.26826C7.89728 8.04414 8.26994 8.04414 8.49666 8.26688L12.4287 12.1201C12.6569 12.3429 12.6569 12.709 12.4301 12.9317C12.2034 13.1559 11.8308 13.1559 11.604 12.9331L7.67057 9.07985C7.44386 8.85712 7.44244 8.49239 7.67057 8.26826Z").fill("#FFF")

            this.solve1 = new kity.Path().setPathData("M15 0L15 13.125C15 14.1562 14.1562 15 13.125 15L0 15L15 0Z").fill("#F4A21D");
            this.solve2 = new kity.Path().setPathData("M14.2356 5.83533C13.9909 5.62113 13.637 5.66644 13.4412 5.93419L8.63288 12.5496L6.88578 9.99982C6.6674 9.68265 6.25321 9.61674 5.96329 9.85565C5.67336 10.0946 5.61311 10.5477 5.8315 10.8649L8.09068 14.1602C8.12457 14.2096 8.17352 14.2673 8.22247 14.3044C8.50863 14.5433 8.91904 14.4815 9.13743 14.1684L14.3335 6.69212C14.5218 6.42437 14.4766 6.04541 14.2356 5.83533Z").fill("#FFF")

            this.ready1 = new kity.Path().setPathData("M15 0L15 13.125C15 14.1562 14.1562 15 13.125 15L0 15L15 0Z").fill("#2b8cff");
            this.ready2 = new kity.Path().setPathData("M9.82526 6.43452C9.65637 6.27337 9.31853 6.25689 9.12943 6.45504L3.49181 12.3629C3.30354 12.5602 3.33093 12.8938 3.4995 13.0546C3.66795 13.2154 4.007 13.2315 4.19533 13.0341L9.83282 7.12636C10.0219 6.92821 9.99377 6.59534 9.82526 6.43452ZM12.9886 10.3927C11.9961 9.44553 12.4506 8.96923 11.4582 8.02216C10.8852 7.47545 10.1442 7.36622 10.1442 7.36622L6.73755 10.9279C6.73755 10.9279 7.4823 11.0415 8.05522 11.5882C9.04768 12.5353 8.59319 13.0116 9.58571 13.9587C10.2066 14.5512 11.1945 14.7647 11.1945 14.7647L14.5968 11.1994C14.5968 11.1994 13.6096 10.9852 12.9886 10.3927Z").fill("#FFF");

            this.addShapes([this.ready1, this.ready2, this.pass1, this.pass2, this.fail1, this.fail2, this.fail3, this.solve1, this.solve2])
        },
        setValue: function (value) {
            this.ready1.setVisible(value == 1);
            this.ready2.setVisible(value == 1);
            this.pass1.setVisible(value == 2);
            this.pass2.setVisible(value == 2);
            this.fail1.setVisible(value == 3);
            this.fail2.setVisible(value == 3);
            this.fail3.setVisible(value == 3);
            this.solve1.setVisible(value == 4);
            this.solve2.setVisible(value == 4);
        }
    })

    var StatusCommand = kity.createClass({
        base: Command,
        execute: function(minder, status) {
            var nodes = minder.getSelectedNodes();
            nodes.forEach(function (node) {
                let curType = node.getData('type');
                if (curType == minder.getTypeMap().case.id)
                    node.setData('status', status).render();

                else if (curType == minder.getTypeMap().module.id) {
                    node.getDescendants().forEach(function (child) {
                        if (child.getData('type') == minder.getTypeMap().case.id) {
                            child.setData('status', status).render();
                        }
                    })
                }

            });
            minder.layout(200);
        },

        queryState: function(minder) {
            var node = minder.getSelectedNode();
            return node && (node.getData('type') == minder.getTypeMap().module.id ||
                node.getData('type') == minder.getTypeMap().case.id) ? 0 : -1;
        },
        queryValue: function(minder) {
            var node = minder.getSelectedNode();
            return node && node.getData('status') || null;
        }
    });


    Module.register('status', {
        commands: {
            status: StatusCommand,
        },
        renderers: {
            right: kity.createClass('StatusRenderer', {
                base: Renderer,
                create: function (node) {
                    return new StatusIcon(node.getData("status"))
                },
                shouldRender: function (node) {
                    return node.getData("status")  && !node.getData('hideState') && !node.hide
                },
                update: function (icon, node, box) {
                    var data = node.getData('status');
                    if (!data) return;

                    var paddingRight = node.getStyle('padding-right');
                    var x = box.right;
                    var y = box.top
                    icon.setValue(data);
                    icon.setTranslate(x + paddingRight - icon.width / 2 - 2, y + icon.height / 2 - 2);

                    return new kity.Box(x, y, 0, 0);
                }
            })
        }
    });
});
