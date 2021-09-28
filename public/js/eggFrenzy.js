var EggPlugin = function(option) {
    var prizeItemList = option.prizeItemList;
    var animationCount = option.animationCount;
    var _this = this;
    var eggCount = option.lastCount; //奖励个数
    var isRun = false;
    // var programIndex = 0; //砸蛋逻辑 

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
                var rewardProbability = [1, 5, 10, 15, 20, 20, 20];
                rewardProbability = rewardProbability.slice(0, prizeItemList.length)
                for (var i = 0; i <= prizeItemList.length - 1; i++) {
                    var rewardRemainCount = localStorage.getItem('reward_remain_' + i);
                    if(rewardRemainCount === null) {
                        localStorage.setItem('reward_remain_' + i, prizeItemList[i].count)
                    }
                    rewardRemainCount = localStorage.getItem('reward_remain_' + i);
                    // 数量为 0 后，概率调整到 0 
                    if(rewardRemainCount <= 0) {
                        rewardProbability[i] = 0
                    }
                }
                var totalProbability = 0;
                for (var i in rewardProbability) {
                    totalProbability += rewardProbability[i];
                }
                if (totalProbability <= 0) {
                    alert('奖品已经抽完了，请关注下次活动..')
                    return false;
                }
                prizeIndex = getRandomNum(rewardProbability);
                currentRewardRemainCount = parseInt(localStorage.getItem('reward_remain_' + prizeIndex));
                localStorage.setItem('reward_remain_' + prizeIndex, currentRewardRemainCount - 1);

                doc[0].src = 'public/images/egg0.png';

                doJinDanResult(prizeIndex);
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
    doJinDanResult = function(index) {
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
        str += `<div style="font-weight:700;color: white;text-align:center;font-size: 40px;">${prizeItemList[index].name}</div>`
        str += '</div>';
        //禁用滚动条
        disableScrool(true);
        $('body').append(str);

        //绑定关闭抽奖结果按钮
        $('.pop-cj .close').bind('click', '.close', closePop);
    }

    //获取随机数
    getRandomNum = function(arr) {
        var pSum = eval(arr.join("+")); // 获取总概率区间
        for (var i = 0; i < arr.length; i++) {
            var random = parseInt(Math.random() * pSum); // 获取 0-总概率区间的一个随随机整数
            if (random < arr[i]) {
                return i; //如果在当前的概率范围内,得到的就是当前概率
            } else {
                pSum -= arr[i]; //否则减去当前的概率范围,进入下一轮循环
            }
        }
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
    // programIndex = getRandomNum();
}