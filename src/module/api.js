define(function(require, exports, module) {
    var kity = require('../core/kity')
    var utils = require('../core/utils')
    var Minder = require('../core/minder')
    var MinderNode = require('../core/node')
    var Command = require('../core/command')
    var Module = require('../core/module')
    var Renderer = require('../core/render')

    var DEFAULT_BACKGROUND = '#ffffff'

    Module.register('Api', function() {
        var ApiIcon = kity.createClass('ApiIcon', {
            base: kity.Group,
            constructor: function (value) {
                this.callBase()
                this.setSize(20)
                this.create()
                this.setValue(value)
                this.setId(utils.uuid('node_api'))
                this.translate(0.5, 0.5)
            },
            setSize: function (size) {
                this.width = this.height = size
            },
            create: function () {
                this.bg = new kity.Path().setTranslate( - 10, -12).setScale(.0195).setPathData("M780.130723 704.276561l-19.183406-19.183407 255.778751-255.778751c19.183406-19.183406 12.788938-51.15575-6.394469-76.733625L677.819222 20.068401c-25.577875-25.577875-57.550219-25.577875-76.733625-6.394469l-255.778751 255.778751-19.183407-19.183406c-25.577875-25.577875-57.550219-25.577875-76.733625-6.394469l-191.834064 191.834064c-12.788938 12.788938-19.183406 31.972344-12.788937 51.15575l44.761281 262.17322-70.339156 70.339157c-25.577875 25.577875-25.577875 57.550219 0 83.128094l102.3115 102.311501c25.577875 25.577875 57.550219 25.577875 83.128094 0l70.339157-70.339157 262.17322 44.761282c19.183406 6.394469 38.366813 6.394469 51.15575-6.394469l191.834064-191.834064c25.577875-19.183406 19.183406-51.15575 0-76.733625z m-102.311501-409.246002c-6.394469 6.394469-19.183406 6.394469-31.972344 0l-51.15575-57.550219c-12.788938-6.394469-12.788938-19.183406 0-31.972344l44.761282-44.761282c6.394469-6.394469 19.183406-6.394469 31.972344 0l57.550219 57.550219c6.394469 6.394469 6.394469 19.183406 0 31.972344l-51.155751 44.761282z m140.678314 140.678313c-6.394469 6.394469-19.183406 6.394469-31.972344 0l-57.550219-57.550219c-6.394469-6.394469-6.394469-19.183406 0-31.972344l44.761281-44.761282c6.394469-6.394469 19.183406-6.394469 31.972344 0l57.550219 57.550219c6.394469 6.394469 6.394469 19.183406 0 31.972344l-44.761281 44.761282z").fill("#29B294");

                this.addShapes([this.bg])
            },
            setValue: function (value) {

            }
        })

        var ApiCommand = kity.createClass('ApiCommand', {

            base: Command,

            execute: function(minder, api) {
                var nodes = minder.getSelectedNodes();
                nodes.forEach(function(node) {
                    node.setData('api', api).render();
                });
                minder.layout(200);
            },

            queryValue: function(minder) {
                var node = minder.getSelectedNode();
                return node && node.getData('api') || null;
            },
            queryState: function (km) {
                var node = minder.getSelectedNode();
                return node && (node.getData('type') == minder.getTypeMap().module.id ||
                    node.getData('type') == minder.getTypeMap().case.id) ? 0 : -1;
            },
        });

        return {
            commands: {
                'api': ApiCommand
            },
            renderers: {
                right: kity.createClass('ApiRenderer', {
                    base: Renderer,
                    create: function (node) {
                        return new ApiIcon()
                    },
                    shouldRender: function (node) {
                        return node.getData("api") && !node.getData('hideState')
                    },
                    update: function (container, node, box) {
                        var spaceRight = node.getStyle('space-right');
                        var api = node.getData('api');
                        if (!api) return;

                        var overlay = new ApiIcon();
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
