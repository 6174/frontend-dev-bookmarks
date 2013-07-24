KISSY.add('fp-dsf/app', function(S, DOM, Event, DragDrop, Anim, Constrain) {
    var App = {
        init : function() {
            this.container = DOM.get('#J_DSF_container');
            this.DDM = DragDrop.DDM;
            this.filledCatCount = 0;

            //human altair and vega
            this.altair = DOM.get(".altair", this.container);
            this.vega = DOM.get(".vega", this.container);

            var self = this;
            Event.on(DOM.get('#J_DSF'), 'click', function(e) {
                DOM.toggle(self.container);
                self.createControlPanel();
            });
        },

        /**
         * 抓猫游戏的主控，包含生成猫，生成放置点
         */
        createControlPanel : function() {
            //范围控制
            var constrain = new Constrain({
                constrain : "#J_DSF_container"
            });

            //生成天猫
            this.createTmall(constrain);

            //云的涌动
            this._surgeBridges();

            //tmalls droped place -- the bridge stones
            this.createDrop();

            //create hearts around human
        },

        /**
         * create hearts around human
         */
        _createHumanAroundedHearts: function() {
            var self = this;
            var altairPosLeft = DOM.css(self.altair, "left");
            var vegaPosRight = DOM.css(self.vega, "right");
        },
        /**
         * vega meet altair animation
         */
        meet: function() {
            var self = this;
            var vega = self.vega;
            var altair = self.altair;

            var meetCenter = self.center = (function(){
                var content = DOM.get(".content", self.container);
                var contentWidth = DOM.css(content, "width").replace("px", "") - 0;
                return contentWidth/2;
            })();

            var altairWidth = DOM.css(altair, "width").replace("px", "") - 0;
            var vegaWidth = DOM.css(vega, "width").replace("px", "") - 0;
            var duration = 2;

            var altairAnim = new Anim(altair, {
                    "left": meetCenter - altairWidth + 10
                }, duration, "easeOut", function(){
                    //add big Heart
            }).run();

            var vegaAnim = new Anim(vega, {
                    "right": meetCenter - vegaWidth +  10
                }, duration, "easeOut", function(){
                    //add big 
            }).run();
        },
        /**
         * show big heart once after meeting
         */
        showBigHeart: function() {
            var self = this;
            if(self._showedBigHeart) return;
            self._showedBigHeart = true;
            //add big heart
        },
        /**
         * 生成随机位置
         */
        _randomIndex : function(lastIndex) {
            var index = Math.floor(Math.random() * 3);
            if(index === lastIndex) {
                index = this._randomIndex(lastIndex);
            }
            return index;
        },

        /**
         * 云的涌动
         */
        _surgeBridges : function() {
            var bridges = S.query('.updown',  this.container);
            S.each(bridges, function(item, index) {
                if(index % 2) {
                    moveDown(item);
                } else {
                    moveUp(item);
                }
            });
        },

        /**
         * 生成猫
         * @biz 竖直分配3个猫的入口，2秒吐一个，位置随机，颜色随机
         */
        createTmall : function(constrain) {
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
                var tmall = DOM.create('<div data-color="'+ catColor +
                    '" class="tmall ' + catColor + '"></div>');
                DOM.append(tmall, self.container);

                DOM.css(tmall, {
                    'top' : top + 'px'
                });

                var dragMode = DragDrop.Draggable.DropMode.STRICT;
                var drag = new DragDrop.Draggable({
                    node : tmall,
                    move : true,
                    mode : dragMode,
                    plugins : [
                        constrain
                    ]
                });

                //curPos record tmall's pos in x direction
                //can't reset curPos after draged
                var curPos = 0;
                //tmall speed in x direction
                var speedX = 80;
                //tmall position up down range
                var posRange = 30;
                //test fly down
                function flyDown(){
                    if(cWidth < curPos) {
                        DOM.remove(tmall);
                        return;
                    }
                    var duration = Math.random() * 3 + 2;
                    var rangeTop = top + Math.random() * posRange;
                    var left = duration * speedX + (DOM.css(tmall, "left").replace("px", "") - 0);

                    var flyDownAnim = new Anim(tmall, {
                            "top" : rangeTop,
                            "left": left + "px"
                        },duration, 'easeing', function(){
                            curPos = left;
                            flyUp();
                    });
                    tmall.anim = flyDownAnim;
                    flyDownAnim.run();
                }

                //test fly up
                function flyUp(){
                    if(cWidth < curPos) {
                        DOM.remove(tmall);
                        return;
                    }
                    var duration = Math.random() * 3 + 2;
                    var rangeTop = top - Math.random() * posRange;
                    var left = duration * speedX + (DOM.css(tmall, "left").replace("px", "") - 0); 
                    var flyUpAnim = new Anim(tmall, {
                            'top' : "20px",
                            "left": left + "px"
                        }, duration, 'easeing' , function(){
                            curPos = left;
                            flyDown();     
                    });
                    tmall.anim = flyUpAnim;
                    flyUpAnim.run();
                }
                (Math.random() * 10) > 5 ? flyUp() : flyDown();
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
                target.anim.run();
            });
        },

        /**
         * 生成放置点
         */
        createDrop : function() {
            var DroppableDelegate = DragDrop.DroppableDelegate;
            var delegate = new DroppableDelegate({
                container : '.bridge-container',
                selector : '.bridge'
            });
            this.DDM.on('drophit', onHit);
        },

        /**
         * 结束动画
         */
        endShow : function() {
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
        if(dropTarget.filledCat) {
            return;
        }
        var regExp = new RegExp(dragColor + '$');
        if(regExp.test(dropTarget.className)) {
            DOM.remove(dragTarget);
            DOM.addClass(dropTarget, 'fill-' + dragColor);
            dropTarget.filledCat = true;

            //判断填补猫数量，是否进入退出
            App.filledCatCount += 1;
            App.endShow();
            if(3 === App.filledCatCount) {
                //不再生产猫了
                clearInterval(App.tmallTimer);
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
            'margin-top' : '10px'
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
            'margin-top' : '0'
        }, duration, 'easing', function() {
            moveDown(item);
        });
        anim.run();
    }

    return App;
}, {
    requires : [
        'dom', 'event', 'dd', 'anim',
        'dd/plugin/constrain'
    ]
});

(function(S) {
    S.use('fp-dsf/app', function(S, App) {
        App.init();
    });
})(KISSY);