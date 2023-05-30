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
                this.setWidth(30)
                this.setHeight(20)
                this.create()
                this.setValue(value)
                this.setId(utils.uuid('node_api'))
                this.translate(0.5, 0.5)
            },
            setWidth: function (size) {
                this.width = size;
            },
            setHeight: function (size) {
                this.height = size
            },
            create: function () {
                //this.bg = new kity.Path().setTranslate( -15, -9).setScale(.0195).setPathData("M475.249778 690.176h-48.355556l-19.228444-49.948444h-87.836445l-18.204444 49.948444h-47.104l85.674667-219.818667H386.844444zM393.443556 603.022222l-30.264889-81.578666L333.482667 603.022222zM498.801778 690.176V470.357333h71.224889a252.814222 252.814222 0 0 1 52.792889 3.299556 57.685333 57.685333 0 0 1 31.630222 21.504 68.266667 68.266667 0 0 1 12.743111 42.780444 69.973333 69.973333 0 0 1-7.395556 34.133334 59.392 59.392 0 0 1-18.659555 21.731555 63.943111 63.943111 0 0 1-22.755556 10.467556 259.640889 259.640889 0 0 1-45.511111 3.072h-29.696v82.944z m44.373333-182.044444v62.350222h24.234667a116.394667 116.394667 0 0 0 35.157333-3.413334 29.354667 29.354667 0 0 0 13.880889-10.808888 29.809778 29.809778 0 0 0 5.006222-17.066667A28.330667 28.330667 0 0 0 614.4 518.826667a30.378667 30.378667 0 0 0-17.863111-9.784889 210.375111 210.375111 0 0 0-31.971556-1.479111zM702.350222 690.176V470.357333h44.373334v219.818667z").fill("#FF9C23");
                //this.d1 = new kity.Path().setTranslate( -15, -9).setScale(.0195).setPathData("M761.173333 832.853333H525.880889v-52.337777H761.173333c67.697778 0 121.628444-29.696 152.007111-83.740445a205.368889 205.368889 0 0 0-3.868444-199.793778c-36.408889-59.847111-102.4-91.022222-186.254222-88.405333l-26.965334 1.024v-27.192889c0-56.888889-19.000889-104.334222-54.727111-136.533333a181.248 181.248 0 0 0-122.311111-44.487111c-88.405333 0-187.278222 56.888889-187.278222 181.248V409.6l-27.534222-1.479111c-85.219556-4.323556-152.348444 25.941333-189.44 85.333333a198.428444 198.428444 0 0 0-4.664889 196.608c32.199111 58.140444 91.022222 90.112 166.115555 90.112h95.004445v52.337778h-95.004445c-93.411556 0-170.666667-42.666667-211.854222-116.963556a251.676444 251.676444 0 0 1 6.030222-250.311111c43.576889-69.745778 117.532444-108.316444 210.261334-110.250666 12.856889-135.168 128.113778-206.165333 238.364444-206.165334a233.472 233.472 0 0 1 157.468445 58.026667 222.549333 222.549333 0 0 1 70.769777 149.390222c91.022222 3.527111 164.067556 43.349333 206.734223 113.777778a255.544889 255.544889 0 0 1 4.778666 252.586667c-39.480889 69.973333-111.502222 110.250667-197.632 110.250666z").fill("#FF9C23");
                //this.d2 = new kity.Path().setTranslate( -15, -9).setScale(.0195).setPathData("M486.058667 806.912l91.022222 68.266667v-136.533334l-91.022222 68.266667z").fill("#FF9C23");
                this.path1 = new kity.Path().setTranslate( - 10, -8.5).setPathData("M17 12.75C17 15.0971 15.0971 17 12.75 17L4.25 17C1.90294 17 0 15.0971 0 12.75L0 4.25C0 1.90294 1.90294 0 4.25 0L12.75 0C15.0971 0 17 1.90294 17 4.25L17 12.75Z").fill("#FF9C23");
                this.path2 = new kity.Path().setTranslate( - 10, -8.5).setPathData("M3.98101 5.53386L5.11151 5.53386L7.43201 11.6032L6.36951 11.6032L5.81701 10.0817L3.27516 10.0817L2.72266 11.6032L1.66016 11.6032L3.98101 5.53386ZM3.57301 9.26536L5.51951 9.26536L4.56751 6.60486L3.57301 9.26536ZM8.02701 5.53386L10.543 5.53386C12.0107 5.53386 12.7445 6.15471 12.7445 7.39571C12.7445 8.64804 12.005 9.27421 10.526 9.27421L9.02151 9.27421L9.02151 11.6032L8.02666 11.6032L8.02701 5.53386ZM9.02151 6.38386L9.02151 8.42385L10.4665 8.42385C10.9025 8.42385 11.2258 8.34452 11.4352 8.18585C11.6392 8.02152 11.7412 7.75802 11.7412 7.39571C11.7412 7.03835 11.6363 6.78088 11.4267 6.62185C11.228 6.46354 10.9082 6.38386 10.4662 6.38386L9.02151 6.38386ZM13.5942 5.53386L14.589 5.53386L14.589 11.6032L13.5942 11.6032L13.5942 5.53386Z").fill("#FFF")
                this.addShapes([this.path1, this.path2])
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
                        return node.getData("api")  && !node.getData('hideState') && !node.hide
                    },
                    update: function (container, node, box) {
                        var spaceRight = node.getStyle('space-right');
                        var api = node.getData('api');
                        if (!api) return;

                        var overlay = new ApiIcon();
                        container.setTranslate(box.right + 14, 0);
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
