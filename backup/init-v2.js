KISSY.add('fp-dsf/app', function(S, DOM, Event, DragDrop, Anim, Constrain) {
    var App = {
        init: function() {
            this.container = DOM.get('#J_DSF_container');
            this.DDM = DragDrop.DDM;
            this.filledCatCount = 0;

            //human altair and vega
            this.altair = DOM.get('.altair', this.container);
            this.vega = DOM.get('.vega', this.container);

            //stop controller
            this.stoped = false;

            var self = this;
            Event.on(DOM.get('#J_DSF'), 'click', function(e) {
                DOM.toggle(self.container);
                self.createControlPanel();
            });
        },

        /**
         * 抓猫游戏的主控，包含生成猫，生成放置点
         */
        createControlPanel: function() {
            var self = this;
            //范围控制
            var constrain = new Constrain({
                constrain: '#J_DSF_container'
            });

            //生成天猫
            this.createTmall(constrain);

            //云的涌动
            this._surgeBridges();

            //tmalls droped place -- the bridge stones
            this.createDrop();

            //create big heart
            this._createBigHeart();

            //create hearts around human
            this._createHumanAroundedHearts(self.vega);

            //create clouds
            this._createClouds();

            //make stone movable
            this._surgeStone();
        },
        /**
         * create hearts around human
         */
        _createHumanAroundedHearts: function(human) {
            if (!human) return;
            var self = this;
            var cWidth = parseFloat(DOM.css(self.container, 'width'));
            var humanWidth = DOM.css(human, 'width').replace('px', '') - 0;
            var humanTop = DOM.css(human, 'top').replace('px', '') - 0;
            var heartCls = 'little-heart';
            var interval = 2000;

            var timer = setInterval(function() {
                var container = DOM.get('.content', self.container);
                var curHumanLeft = DOM.css(human, 'left').replace('px', '') - 0;
                var littleHeart = DOM.create('<div class="' + heartCls + '"></div>')
                var deltaTop = Math.random() * 30 + 20;
                var deltaLeft = Math.random() * 50 + 30;
                // var randomBg = Math.random()*10 > 5 ? "little_heart_1.png": "little_heart_2.png";

                var curTop = humanTop + deltaTop;
                var curLeft = curHumanLeft + deltaLeft
                var speedY = 40;
                var posRange = 20;
                var maxTop = 200;
                DOM.css(littleHeart, {
                    'top': curTop + 'px',
                    'left': curLeft + 'px'
                });
                DOM.append(littleHeart, container);

                function flyLeftUp() {
                    var duration = Math.random() * 1 + 1;
                    var rangeLeft = curLeft + Math.random() * posRange;
                    var top = curTop - duration * speedY;
                    var flyLeftUpAnim = new Anim(littleHeart, {
                        'top': top,
                        'left': rangeLeft
                    }, duration, 'easing', function() {
                        if (self.stoped) return;
                        if (curTop < maxTop) {
                            DOM.remove(littleHeart);
                        }
                        curTop = top;
                        flyRightUp();
                    });
                    flyLeftUpAnim.run();
                }

                function flyRightUp() {
                    var duration = Math.random() * 3 + 2;
                    var rangeLeft = curLeft - Math.random() * posRange;
                    var top = curTop - duration * speedY;
                    var flyRightUpAnim = new Anim(littleHeart, {
                        'top': top,
                        'left': rangeLeft
                    }, duration, 'easing', function() {
                        if (curTop < maxTop) {
                            DOM.remove(littleHeart);
                        }
                        curTop = top;
                        flyLeftUp();
                    });
                    flyRightUpAnim.run();
                }
                (Math.random() * 10) > 5 ? flyRightUp() : flyLeftUp();
            }, interval);
        },
        _createBigHeart: function() {
            var self = this;
            var content = DOM.get('.content', self.container);
            var bigHeartHtml = '<img src="img/big_heart_high.png" class="big-heart"/>';
            var bigHeart = self.bigHeart = DOM.create(bigHeartHtml);

            var initWidth = 100;
            var initHeight = 100;

            var centerX = self.centerX = (DOM.css(content, 'width').replace('px', '') - 0) / 2;
            var left = centerX - initWidth / 2;
            var bottom = 140;
            self.bigHeartCenterY = bottom + initHeight / 2;

            DOM.css(bigHeart, {
                'left': left + 'px',
                'bottom': bottom + 'px',
                'width': initWidth + 'px',
                'height': initHeight + ''
            });
            DOM.prepend(bigHeart, content);
        },
        /**
         * show big heart once after meeting
         */
        showBigHeart: function() {
            var self = this;
            if (self._showedBigHeart) return;
            self._showedBigHeart = true;
            var centerX = self.centerX;
            var destWidth = 300;
            var destHeight = 300;
            var destLeft = centerX - destWidth / 2;
            var destBottom = self.bigHeartCenterY - destHeight / 2;

            var duration = 1;
            // console.log(destLeft, destBottom);
            var bigHeartAnim = new Anim(self.bigHeart, {
                'left': destLeft + 'px',
                'bottom': destBottom + 'px',
                'width': destWidth + 'px',
                'height': destHeight + 'px',
                'display': 'block'
            }, duration, 'bounceOut', function() {
                //do something after bouncing out bigheart
                // console.log("bouncing big heart");
                self.stopCreateCloud = true;
            }).run();
        },
        _createClouds: function() {
            var self = this;
            self.stopCreateCloud = false;

            var container = self.container;
            var containerWidth = DOM.css(container, 'width').replace('px', '') - 0;

            var frontCloud = {
                speedX: 40,
                width: 500,
                top: 60,
                left: 0,
                imgSrc: 'img/cloud_layer_1.png'
            };

            var midendCloud = {
                speedX: 10,
                width: 600,
                top: 35,
                left: 500,
                imgSrc: 'img/cloud_layer_2.png'
            };

            var backendCloud = {
                speedX: 6,
                width: 400,
                height: 74,
                top: 20,
                left: 0,
                imgSrc: 'img/cloud_layer_2.png'
            };



            function createCloud(cloud) {
                var cloudHtml = '<img src="' + cloud.imgSrc + '" class="cloud"/>';
                var cloudEl = DOM.create(cloudHtml);
                var left = 100;
                DOM.css(cloudEl, {
                    'position': 'absolute',
                    'width': cloud.width + 'px',
                    'height': cloud.height + "px",
                    'top': cloud.top + 'px',
                    'left': cloud.left + 'px'
                });
                DOM.prepend(cloudEl, container);

                var destLeft = containerWidth;
                var curLeft = cloud.left;
                var duration = (containerWidth - curLeft) / Math.abs(cloud.speedX);

                var cloudAnim = new Anim(cloudEl, {
                    'left': destLeft + 'px'
                }, duration, "easing", function() {
                    DOM.remove(cloudEl);
                    cloud.left = -500;
                    if (!self.stopCreateCloud) createCloud(cloud);
                }).run();
            }
            createCloud(backendCloud);
            createCloud(frontCloud);
            createCloud(midendCloud);

        },
        /**
         * vega meet altair animation
         */
        meet: function() {
            var self = this;
            var bottom = self.humanDefaultBottom = 128;
            var vega = self.vega;
            var altair = self.altair;
            self.stopHumanAnim = true;
            vega.anim && vega.anim.stop();
            altair.anim && altair.anim.stop();
            // console.log(vega.anim);

            var meetCenter = self.center = (function() {
                var content = DOM.get('.content', self.container);
                var contentWidth = DOM.css(content, 'width').replace('px', '') - 0;
                return contentWidth / 2;
            })();

            var altairWidth = DOM.css(altair, 'width').replace('px', '') - 0;
            var vegaWidth = DOM.css(vega, 'width').replace('px', '') - 0;
            var duration = 2;

            var altairAnim = new Anim(altair, {
                'left': meetCenter - altairWidth + 10,
                'bottom': bottom + "px"
            }, duration, 'easeOut', function() {
                self.showBigHeart();
            }).run();

            var vegaAnim = new Anim(vega, {
                'right': meetCenter - vegaWidth + 10,
                'bottom': bottom + "px"
            }, duration, 'easeOut', function() {
                self.showBigHeart();
            }).run();
        },

        /**
         * 生成随机位置
         */
        _randomIndex: function(lastIndex) {
            var index = Math.floor(Math.random() * 3);
            if (index === lastIndex) {
                index = this._randomIndex(lastIndex);
            }
            return index;
        },

        /**
         * 云的涌动
         */
        _surgeBridges: function() {
            var bridges = S.query('.updown', this.container);
            S.each(bridges, function(item, index) {
                if (index % 2) {
                    moveDown(item);
                } else {
                    moveUp(item);
                }
            });
        },
        /**
         * surge of stone
         */
        _surgeStone: function() {
            var self = this;
            var stones = S.query('.stone', this.container);
            var vega = self.vega;
            var altair = self.altair;
            var bottom = 128;

            function move(direction, human, stone) {
                var duration = Math.random() * 3 + 1;
                var stoneDestProps = {};
                var humanDestProps = {};
                switch (direction) {
                    case 'up':
                        stoneDestProps['margin-top'] = "-10px";
                        humanDestProps['bottom'] = (bottom + 10) + "px";
                        break;
                    case 'down':
                        stoneDestProps['margin-top'] = "10px";
                        humanDestProps['bottom'] = (bottom - 10) + "px";
                        break;
                }
                var humanAnim = new Anim(human, humanDestProps, duration, 'easeing', function() {});
                human.anim = humanAnim;
                var stoneAnim = new Anim(stone, stoneDestProps, duration, 'easeing', function() {
                    //nothing to do
                    switch (direction) {
                        case 'up':
                            if (!self.stoped && !self.stopHumanAnim) move('down', human, stone);
                            break;
                        case 'down':
                            if (!self.stoped && !self.stopHumanAnim) move('up', human, stone);
                            break;
                    }
                });
                stoneAnim.run();
                humanAnim.run();
            }
            setTimeout(function() {
                move('up', altair, stones[0]);
            }, 10);
            setTimeout(function() {
                move('down', vega, stones[1]);
            }, 100);
        },

        /**
         * 生成猫
         * @biz 竖直分配3个猫的入口，2秒吐一个，位置随机，颜色随机
         */
        createTmall: function(constrain) {
            var cWidth = parseFloat(DOM.css(this.container, 'width'));
            //单位pix/s 速度按照20秒飞过整个页面计算
            var speed = cWidth / 20;
            //入口的y坐标
            var entrances = [
                10,
                140,
                200
            ];
            var classNames = [
                'red',
                'yellow',
                'blue'
            ];
            //出猫的顺序
            var index;
            var lastIndex;
            var self = this;

            //全局的生成猫德interval timer
            this.tmallTimer = setInterval(function() {
                index = self._randomIndex(lastIndex);
                lastIndex = index;

                var top = entrances[index];
                var catColor = classNames[Math.floor(Math.random() * 3)];
                var tmall = DOM.create('<div data-color="' + catColor +
                    '" class="tmall ' + catColor + '"></div>');
                DOM.append(tmall, self.container);

                DOM.css(tmall, {
                    'top': top + 'px'
                });

                var dragMode = DragDrop.Draggable.DropMode.STRICT;
                var drag = new DragDrop.Draggable({
                    node: tmall,
                    move: true,
                    mode: dragMode,
                    plugins: [
                        constrain
                    ]
                });

                //curPos record tmall's pos in x direction
                //can't reset curPos after draged
                var curPos = 0;
                //tmall speed in x direction
                var speedX = 85 + Math.random() * 60;
                //tmall position up down range
                var posRange = 130;
                var top = 100;

                var lastFlyType = "";
                //dpFly

                function doFly(type) {
                    if (cWidth < curPos) {
                        DOM.remove(tmall);
                        return;
                    }
                    lastFlyType = type;
                    var duration = Math.random() * 3 + 2;
                    var delta = Math.random() * posRange;
                    var destProp = {};
                    switch (type) {
                        case 'up':
                            destProp['top'] = (top - delta) + 'px';
                            break;
                        case 'down':
                            destProp['top'] = (top + delta) + 'px';
                            break;
                        case 'forward':
                            duration = Math.random() * 0.2 + 0.2;
                            break;
                        default:
                            break;
                    }
                    var left = duration * speedX + (DOM.css(tmall, 'left').replace('px', '') - 0);
                    destProp['left'] = left + "px";
                    var flyAnim = new Anim(tmall, destProp, duration, 'easeing', function() {
                        curPos = left;
                        randomRun();
                    });
                    tmall.anim = flyAnim;
                    flyAnim.run();
                }

                function randomRun() {
                    var top = DOM.css(tmall, "top").replace("px", "") - 0;
                    if (top > 100) {
                        if (lastFlyType == 'forward') doFly('up');
                        else(Math.random() * 10) > 8 ? doFly('up') : doFly("forward");
                    } else {
                        if (lastFlyType == 'forward') doFly('down');
                        else(Math.random() * 10) > 8 ? doFly('down') : doFly("forward");
                    }
                }
                randomRun();
            }, 3000);

            //全局的drag控制
            this.DDM.on('dragstart', function(e) {
                var target = e.drag.get("node");
                //不飞了
                DOM.get(target).anim.stop();
                //改变鼠标
                DOM.addClass(target, 'ks-dd-dragging');
            });

            this.DDM.on('dragend', function(e) {
                var target = DOM.get(e.drag.get("node"));
                //鼠标还原
                DOM.removeClass(target, 'ks-dd-dragging');
                //重新开始灰走
                var curLeft = parseFloat(DOM.css(target, 'left'));
                var time = (cWidth - curLeft) / speed;
                var anim = target.anim;
                anim.config.props.left = curLeft + 100;
                anim._duration = 1000;
                target.anim.run();
            });
        },

        /**
         * 生成放置点
         */
        createDrop: function() {
            var DroppableDelegate = DragDrop.DroppableDelegate;
            var delegate = new DroppableDelegate({
                container: '.bridge-container',
                selector: '.bridge'
            });
            this.DDM.on('drophit', onHit);
        },

        /**
         * 结束动画
         */
        endShow: function() {
            //TODO
            this.meet();
        }
    };

    /**
     * 猫放到洞里面去的响应
     */

    function onHit(e) {
        var dropTarget = DOM.get(e.drop.get("node"));
        var dragTarget = DOM.get(e.drag.get("node"));
        var dragColor = DOM.attr(dragTarget, 'data-color');

        //如果已经填了猫，啥都不操作
        if (dropTarget.filledCat) {
            return;
        }
        var regExp = new RegExp(dragColor + '$');
        if (regExp.test(dropTarget.className)) {
            DOM.remove(dragTarget);
            DOM.addClass(dropTarget, 'fill-' + dragColor);
            dropTarget.filledCat = true;

            //判断填补猫数量，是否进入退出
            App.filledCatCount += 1;
            if (3 === App.filledCatCount) {
                //不再生产猫了
                clearInterval(App.tmallTimer);
                App.endShow();
                //结束动画
            }
        }
    }

    /**
     * 1-4秒之内的随机向下移动
     */

    function moveDown(item) {
        var duration = Math.random() * 3 + 1;
        var anim = new Anim(item, {
            'margin-top': '10px'
        }, duration, 'easing', function() {
            moveUp(item);
        });
        anim.run();
    }

    /**
     * 1-4秒之内的随机向上移动
     */

    function moveUp(item) {
        var duration = Math.random() * 3 + 1;
        var anim = new Anim(item, {
            'margin-top': '0'
        }, duration, 'easing', function() {
            moveDown(item);
        });
        anim.run();
    }

    return App;
}, {
    requires: [
        'dom', 'event', 'dd', 'anim',
        'dd/plugin/constrain'
    ]
});

(function(S) {
    S.use('fp-dsf/app', function(S, App) {
        App.init();
    });
})(KISSY);