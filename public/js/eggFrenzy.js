var EggPlugin = function(option) {
    var prizeItemList = option.prizeItemList;
    var animationCount = option.animationCount;
    var _this = this;
    var eggCount = option.lastCount; //奖励个数
    var preResult = false; //上一次结果是否中奖 
    var isRun = false;
    var programIndex = 0; //砸蛋逻辑 

    _this.Init = function(document) {
        //if (isRun || !document.hasClass("action") || eggCount <= 0) return; //等待上一个砸完才能再砸 ||  已经砸过的不能砸 || 数量没了不能砸
        if (isRun || eggCount <= 0) return; 
        //document.removeClass(); //禁用点击 
        isRun = true; //同时只能点一个
        var timer = null;
        var num = 0;
        var prizeIndex; //奖品编号 
        var doc = document.find('img');
        var count = animationCount; //动画次数

        //砸蛋动画
        timer = setInterval(function() {
            if (num < 4) {
                doc[0].src = 'public/images/egg' + num + '.png';
            } else {
                num = 0;
                count--;
            }

            if (count == 0) {
                //业务逻辑处理
                clearInterval(timer); //停止动画

                prizeIndex = getRandomNum(1);

                doc[0].src = 'public/images/egg0.png';
            
                doJinDanResult(prizeIndex);
                console.log("p=" + programIndex + "  i=" + prizeIndex);
            }
            num++;
        }, 200);

        // eggCount--; //蛋数-1 
        editEggCountPage();
    }

    //修改页面eggCount
    editEggCountPage = function() {
        // $('#eggC')[0].innerText = eggCount; //修改页面 
    }
    // 参数 0 未中奖  
    // 参数 1-8 对应1到8的奖品
    doJinDanResult = function(index) {
        if (index > 0) { //中奖了
            preResult = true;
        }
        clickJinDanView(index); //弹窗结果 
    }

    clickJinDanView = function(index) {
        var str = '';
        str += '<div class="bg-mask"></div>';
        str += '<div class="pop-cj">';
        str += '<div class="close" alt="关闭"></div>';
        str += '<img class ="link" src="public/images/';
        str += prizeItemList[index].url;
        str += '" alt="结果">';
        str += `<div style="font-weight:700;color: white;text-align:center;">${prizeItemList[index].name}</div>`
        str += '</div>';
        //禁用滚动条
        disableScrool(true);
        $("#imglink").attr("href","prizeResult.html");
        $('body').append(str);

        if(index > 0)
        {
            $('.pop-cj .link').bind('click', function() {
                location.href = prizeItemList[index].link;
            });
        }
        
        //10秒后关闭
        //setTimeout(closePop, 10000);

        //绑定关闭抽奖结果按钮
        $('.pop-cj .close').bind('click', '.close', closePop);
    }

    //获取随机数
    getRandomNum = function(isMoreZero) {
        totalCountDividedByTen = option.prizeItemList.length/10
        var Rand = Math.random();
        if (Rand > totalCountDividedByTen) {
            Rand = 1 - Rand;
        }
        return Math.round(Rand * 10);
    }

    //是否禁用页面滚动（包括移动端）
    disableScrool = function(flag) {
            if (flag) {
                $('html').addClass('noscroll').on('touchmove', function(event) {
                    event.preventDefault();
                });
            } else {
                $('html').removeClass('noscroll').unbind('touchmove');
            }
        }
        //关闭弹窗
    closePop = function() {
            $('.bg-mask').remove();
            $('.pop-cj').remove();
            disableScrool(false);
            isRun = false;
        }
        //根据参数修改页面数据
        //eggCount = 0;
    editEggCountPage();
    programIndex = getRandomNum();
}