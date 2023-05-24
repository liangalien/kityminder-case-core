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
                this.bg = new kity.Path().setTranslate( - 10, -9).setScale(.0185).setPathData("M64 64m128 0l640 0q128 0 128 128l0 640q0 128-128 128l-640 0q-128 0-128-128l0-640q0-128 128-128Z").fill("#FF9C23");
                this.d1 = new kity.Path().setTranslate( - 10, -9).setScale(.0185).setPathData("M479.488 768a64 64 0 0 1-64-64V576h192v128a64 64 0 0 1-64 64h-64z").fill("#FFFFFF");
                this.d2 = new kity.Path().setTranslate( - 10, -9).setScale(.0185).setPathData("M607.36 675.392h-64V623.36c0.128-7.232 0.704-13.952 1.984-20.48 4.224-22.08 16.32-38.72 28.288-53.952l15.488-19.008c6.592-8.064 13.248-16.064 19.52-24.384 26.304-34.56 35.328-71.488 27.584-112.896-10.816-57.856-64.256-101.632-124.288-101.888-60.992 0.256-114.432 44.032-125.248 101.888-7.68 41.408 1.344 78.336 27.584 112.896 6.4 8.32 13.056 16.512 19.776 24.64l15.232 18.816c13.824 17.024 26.496 32.768 30.592 54.016 1.216 6.4 1.792 13.248 1.92 19.84v52.48h-64V623.36a55.808 55.808 0 0 0-0.768-8.32c-1.088-5.504-7.936-13.952-13.888-21.376l-18.496-22.848a940.544 940.544 0 0 1-21.312-26.496c-37.312-49.088-50.624-104.064-39.552-163.456 16.576-88.96 95.232-153.728 186.944-154.112 93.184 0.384 171.84 65.152 188.416 154.112 11.072 59.392-2.24 114.368-39.552 163.456-6.784 8.896-13.888 17.6-21.056 26.24l-14.656 18.112c-7.424 9.344-14.208 18.368-15.68 26.368a52.928 52.928 0 0 0-0.832 8.896v51.456z").fill("#FFFFFF")
                this.addShapes([this.bg, this.d2, this.d1])
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
                return node && node.getData('story') || [];
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
