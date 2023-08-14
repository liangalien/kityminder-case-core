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
            this.solve2 = new kity.Path().setPathData("M6.81305 11.7755C6.755 11.7921 6.69583 11.8004 6.63547 11.8004C6.47229 11.8004 6.25949 11.7371 6.0531 11.4883C5.83472 9.84568 6.71786 8.19026 8.28015 7.43735C10.3016 6.46042 12.8302 7.17572 13.9181 9.02957L13.9997 9.16799L10.3344 9.17359L10.332 8.14065C9.76404 8.14065 9.27847 8.24386 8.84808 8.45029C7.73218 8.99036 7.11383 10.1049 7.27301 11.2923C7.2626 11.4739 7.07544 11.7011 6.81305 11.7755ZM13.9621 10.6882C14.1997 12.2828 13.3038 13.8486 11.7303 14.5791C11.1186 14.8612 10.476 15.0015 9.80243 15C8.30173 15 6.84265 14.2879 6.0827 13.0437L6.00031 12.9085L9.66565 12.9077L9.65524 13.871C10.194 13.9005 10.7095 13.8045 11.2015 13.583C12.295 13.0805 12.9246 12.0244 12.7806 10.933C12.7318 10.5522 12.8806 10.3722 13.015 10.2881C13.179 10.1809 13.4134 10.1713 13.6213 10.2617C13.8237 10.3498 13.9509 10.509 13.9621 10.6882Z").fill("#FFF")

            this.ready1 = new kity.Path().setPathData("M15 0L15 13.125C15 14.1562 14.1562 15 13.125 15L0 15L15 0Z").fill("#00ECFF");
            this.ready2 = new kity.Path().setPathData("M9.82526 6.43452C9.65637 6.27337 9.31853 6.25689 9.12943 6.45504L3.49181 12.3629C3.30354 12.5602 3.33093 12.8938 3.4995 13.0546C3.66795 13.2154 4.007 13.2315 4.19533 13.0341L9.83282 7.12636C10.0219 6.92821 9.99377 6.59534 9.82526 6.43452ZM12.9886 10.3927C11.9961 9.44553 12.4506 8.96923 11.4582 8.02216C10.8852 7.47545 10.1442 7.36622 10.1442 7.36622L6.73755 10.9279C6.73755 10.9279 7.4823 11.0415 8.05522 11.5882C9.04768 12.5353 8.59319 13.0116 9.58571 13.9587C10.2066 14.5512 11.1945 14.7647 11.1945 14.7647L14.5968 11.1994C14.5968 11.1994 13.6096 10.9852 12.9886 10.3927Z").fill("#FFF");

            this.block1 = new kity.Path().setPathData("M15 0L15 13.125C15 14.1562 14.1562 15 13.125 15L0 15L15 0Z").fill("#F4A21D");
            this.block2 = new kity.Path().setPathData("M6.81305 11.7755C6.755 11.7921 6.69583 11.8004 6.63547 11.8004C6.47229 11.8004 6.25949 11.7371 6.0531 11.4883C5.83472 9.84568 6.71786 8.19026 8.28015 7.43735C10.3016 6.46042 12.8302 7.17572 13.9181 9.02957L13.9997 9.16799L10.3344 9.17359L10.332 8.14065C9.76404 8.14065 9.27847 8.24386 8.84808 8.45029C7.73218 8.99036 7.11383 10.1049 7.27301 11.2923C7.2626 11.4739 7.07544 11.7011 6.81305 11.7755ZM13.9621 10.6882C14.1997 12.2828 13.3038 13.8486 11.7303 14.5791C11.1186 14.8612 10.476 15.0015 9.80243 15C8.30173 15 6.84265 14.2879 6.0827 13.0437L6.00031 12.9085L9.66565 12.9077L9.65524 13.871C10.194 13.9005 10.7095 13.8045 11.2015 13.583C12.295 13.0805 12.9246 12.0244 12.7806 10.933C12.7318 10.5522 12.8806 10.3722 13.015 10.2881C13.179 10.1809 13.4134 10.1713 13.6213 10.2617C13.8237 10.3498 13.9509 10.509 13.9621 10.6882Z").fill("#FFF");
            this.block3 = new kity.Path().setPathData("M7.20065 8.20192C7.46738 7.93297 7.90582 7.93297 8.17255 8.20025L12.7985 12.8242C13.0669 13.0915 13.0669 13.5308 12.8002 13.7981C12.5334 14.067 12.095 14.067 11.8283 13.7998L7.20065 9.17582C6.93396 8.90854 6.93228 8.47087 7.20065 8.20192").fill("#FFF");

            this.running1 = new kity.Path().setPathData("M15 0L15 13.125C15 14.1562 14.1562 15 13.125 15L0 15L15 0Z").fill("#2b8cff");
            this.running2 = new kity.Path().setPathData("M6.81305 11.7755C6.755 11.7921 6.69583 11.8004 6.63547 11.8004C6.47229 11.8004 6.25949 11.7371 6.0531 11.4883C5.83472 9.84568 6.71786 8.19026 8.28015 7.43735C10.3016 6.46042 12.8302 7.17572 13.9181 9.02957L13.9997 9.16799L10.3344 9.17359L10.332 8.14065C9.76404 8.14065 9.27847 8.24386 8.84808 8.45029C7.73218 8.99036 7.11383 10.1049 7.27301 11.2923C7.2626 11.4739 7.07544 11.7011 6.81305 11.7755ZM13.9621 10.6882C14.1997 12.2828 13.3038 13.8486 11.7303 14.5791C11.1186 14.8612 10.476 15.0015 9.80243 15C8.30173 15 6.84265 14.2879 6.0827 13.0437L6.00031 12.9085L9.66565 12.9077L9.65524 13.871C10.194 13.9005 10.7095 13.8045 11.2015 13.583C12.295 13.0805 12.9246 12.0244 12.7806 10.933C12.7318 10.5522 12.8806 10.3722 13.015 10.2881C13.179 10.1809 13.4134 10.1713 13.6213 10.2617C13.8237 10.3498 13.9509 10.509 13.9621 10.6882Z").fill("#FFF");

            this.addShapes([this.ready1, this.ready2, this.pass1, this.pass2, this.fail1, this.fail2, this.fail3, this.solve1, this.solve2, this.block1, this.block2, this.block3, this.running1, this.running2])
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
            this.block1.setVisible(value == 5);
            this.block2.setVisible(value == 5);
            this.block3.setVisible(value == 5);
            this.running1.setVisible(value == 6);
            this.running2.setVisible(value == 6);
        }
    })

    var StatusCommand = kity.createClass({
        base: Command,
        execute: function(minder, status) {
            var nodes = minder.getSelectedNodes();
            nodes.forEach(function (node) {
                node.setData('status', status).render();
                node.getDescendants().forEach(function(child) {
                    child.setData('status', status).render();
                });
            });
            minder.layout(200);
        },

        queryState: function(minder) {
            return minder.getSelectedNodes().length > 0;
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

                    var b2 = node.getContentBox();

                    var paddingRight = node.getStyle('padding-right');
                    var paddingBottom = node.getStyle('padding-bottom');
                    var stroke = node.getStyle('selected-stroke-width')
                    var x = box.x;
                    var y = box.y;
                    icon.setValue(data);
                    icon.setTranslate(box.right + paddingRight - icon.width / 2 - stroke,
                        box.bottom  + paddingBottom - icon.width / 2 - stroke);
                    return new kity.Box(0, 0, 0, 0);
                }
            })
        }
    });
});
