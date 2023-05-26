define(function(require, exports, module) {
    var kity = require('../core/kity')
    var utils = require('../core/utils')
    var Minder = require('../core/minder')
    var MinderNode = require('../core/node')
    var Command = require('../core/command')
    var Module = require('../core/module')
    var Renderer = require('../core/render')

    var DEFAULT_BACKGROUND = '#ffffff'

    Module.register('Jira', function() {
        var JiraIcon = kity.createClass('JiraIcon', {
            base: kity.Group,
            constructor: function (issueType) {
                this.callBase()
                this.setWidth(17);
                this.setHeight(20)
                this.create()
                this.setIconVisible(issueType);
                this.setId(utils.uuid(issueType))
                //this.translate(0.5, 0.5)
            },
            setWidth: function (size) {
                this.width = size;
            },
            setHeight: function (size) {
                this.height = size
            },
            create: function () {
                this.story1 = new kity.Path().setTranslate( - 10, -8).setPathData("M0 1.88806C0 0.845749 0.845749 0 1.88806 0L15.1119 0C16.1543 0 17 0.845749 17 1.88806L17 15.1119C17 16.1543 16.1543 17 15.1119 17L1.88806 17C1.63773 16.9999 1.39694 16.9519 1.1657 16.856C0.934448 16.7601 0.730316 16.6237 0.553314 16.4467C0.376297 16.2697 0.239868 16.0656 0.143997 15.8343C0.0481415 15.6031 0.000137329 15.3623 0 15.1119L0 1.88806Z").fill("#36B37E");
                this.story2 = new kity.Path().setTranslate( - 10, -8).setPathData("M4.75999 13.3025L4.75999 4.67287C4.75999 4.15756 5.1765 3.74 5.68968 3.74L11.2678 3.74C11.781 3.74 12.1975 4.15756 12.1975 4.67287L12.1975 13.3025L8.47874 9.571L4.75999 13.3025Z").fill("#FFF");

                this.bug1 = new kity.Path().setTranslate( - 10, -8).setPathData("M0 1.88806C0 0.845749 0.845749 0 1.88806 0L15.1119 0C16.1543 0 17 0.845749 17 1.88806L17 15.1119C17 16.1543 16.1543 17 15.1119 17L1.88806 17C1.63774 16.9999 1.39694 16.9519 1.1657 16.856C0.934448 16.7601 0.730316 16.6237 0.553314 16.4467C0.376297 16.2697 0.239868 16.0656 0.143997 15.8343C0.0481415 15.6031 0.000137329 15.3623 0 15.1119L0 1.88806Z").fill("#FF5630");
                this.bug2 = new kity.Circle(4.25, -1.5, 0   ).fill("#FFFFFF");

                this.view1 =  new kity.Path().setTranslate( - 10, -8).setPathData("M0 1.88806C0 0.845749 0.845749 0 1.88806 0L15.1119 0C16.1543 0 17 0.845749 17 1.88806L17 15.1119C17 16.1542 16.1543 17 15.1119 17L1.88806 17C1.63773 16.9999 1.39694 16.9519 1.1657 16.856C0.934448 16.7601 0.730316 16.6237 0.553314 16.4467C0.376297 16.2697 0.239868 16.0655 0.143997 15.8343C0.0481415 15.6031 0.000137329 15.3623 0 15.1119L0 1.88806Z").fill("#8993A4");

                this.view2 =  new kity.Path().setTranslate( - 10, -8).setPathData("M8.67 11.3262C9.02223 11.3262 9.36107 11.2589 9.68651 11.1241C10.0119 10.9893 10.2992 10.7973 10.5482 10.5482C10.7973 10.2992 10.9893 10.0119 11.1241 9.6865C11.2589 9.36108 11.3262 9.02224 11.3262 8.67C11.3262 8.31776 11.2589 7.97893 11.1241 7.6535C10.9893 7.32807 10.7973 7.04082 10.5482 6.79175C10.2992 6.54267 10.0119 6.35074 9.68651 6.21594C9.36107 6.08115 9.02223 6.01375 8.67 6.01375C8.31776 6.01375 7.97893 6.08115 7.65349 6.21594C7.32806 6.35074 7.04082 6.54267 6.79175 6.79175C6.54268 7.04082 6.35074 7.32806 6.21594 7.6535C6.08115 7.97892 6.01375 8.31776 6.01375 8.67C6.01375 9.02224 6.08115 9.36108 6.21594 9.6865C6.35074 10.0119 6.54268 10.2992 6.79175 10.5482C7.04082 10.7973 7.32806 10.9893 7.65349 11.1241C7.97893 11.2589 8.31776 11.3262 8.67 11.3262ZM8.67 12.92C8.10641 12.92 7.56429 12.8122 7.04359 12.5965C6.5229 12.3808 6.06331 12.0737 5.66479 11.6752C5.26628 11.2767 4.95918 10.8171 4.74352 10.2964C4.52783 9.77572 4.42 9.23358 4.42 8.67C4.42 8.10641 4.52783 7.56428 4.74352 7.04359C4.95918 6.52291 5.26628 6.06331 5.66479 5.66479C6.06331 5.26628 6.5229 4.95918 7.04359 4.74351C7.56429 4.52783 8.10641 4.42 8.67 4.42C9.23358 4.42 9.77571 4.52783 10.2964 4.74351C10.8171 4.95918 11.2767 5.26628 11.6752 5.66479C12.0737 6.06331 12.3808 6.52291 12.5965 7.04359C12.8122 7.56428 12.92 8.10641 12.92 8.67C12.92 9.23358 12.8122 9.77572 12.5965 10.2964C12.3808 10.8171 12.0737 11.2767 11.6752 11.6752C11.2767 12.0737 10.8171 12.3808 10.2964 12.5965C9.77571 12.8122 9.23358 12.92 8.67 12.92Z").fill("#FFF");


                /*this.p1 = new kity.Path().setTranslate( - 10, -7).setPathData("m-0.21739,1.6079c0,-1.00766 0.81763,-1.82529 1.82529,-1.82529l12.78421,0c1.00766,0 1.82529,0.81763 1.82529,1.82529l0,12.78421c0,1.00766 -0.81763,1.82529 -1.82529,1.82529l-12.78421,0a1.82632,1.82632 0 0 1 -1.82529,-1.82529l0,-12.78421z").fill("#36B37E");
                this.p2 = new kity.Path().setTranslate( - 10, -7).setPathData("m4.40489,12.62228l0,-8.34271c0,-0.49818 0.40265,-0.90186 0.89878,-0.90186l5.39266,0c0.49612,0 0.89878,0.40368 0.89878,0.90186l0,8.34271l-3.59511,-3.60743l-3.59511,3.60743z").fill("#FFFFFF");*/
                this.addShapes([this.view1, this.view2, this.story1, this.story2, this.bug1, this.bug2])
            },
            setIconVisible: function (issueType) {
                this.story1.setVisible(issueType == 'story');
                this.story2.setVisible(issueType == 'story');

                this.bug1.setVisible(issueType == 'bug');
                this.bug2.setVisible(issueType == 'bug');

                this.view1.setVisible(issueType == 'view');
                this.view2.setVisible(issueType == 'view');
            }
        })

        function getCommand(issueType) {
            return {
                base: Command,
                execute: function(minder, value) {
                    var nodes = minder.getSelectedNodes();
                    nodes.forEach(function(node) {
                        node.setData(issueType, value).render();
                    });
                    minder.layout(200);
                },

                queryValue: function(minder) {
                    var node = minder.getSelectedNode();
                    return node && node.getData(issueType) || null;;
                },
                queryState: function (km) {
                    var node = minder.getSelectedNode();
                    return node && node.getData('type') == minder.getTypeMap().case.id ? 0 : -1;
                },
            }
        }

        var StoryCommand = kity.createClass('StoryCommand', getCommand('story'));
        var BugCommand = kity.createClass('BugCommand', getCommand('bug'));
        var ViewCommand = kity.createClass('ViewCommand', getCommand('view'));

        function getRender(issueType) {
            return {
                base: Renderer,
                create: function (node) {
                    return new JiraIcon(issueType);
                },
                shouldRender: function (node) {
                    return node.getData(issueType) && !node.getData('hideState')
                },
                update: function (container, node, box) {
                    var spaceRight = node.getStyle('space-right');
                    var value = node.getData(issueType);
                    if (!value) return;

                    var icon = new JiraIcon(issueType);
                    container.setTranslate(box.right + 15, 0);
                    return new kity.Box({
                        x: box.right + icon.width,
                        y: Math.round(-icon.height / 2),
                        width: spaceRight,
                        height: icon.height
                    });
                }
            }
        }

        return {
            commands: {
                'story': StoryCommand,
                'bug': BugCommand,
                'view': ViewCommand
            },
            renderers: {
                right: [
                    kity.createClass('StoryRenderer', getRender('story')),
                    kity.createClass('BugRenderer', getRender('bug')),
                    kity.createClass('ViewRenderer', getRender('view'))
                ],
            }
        };
    });
});
