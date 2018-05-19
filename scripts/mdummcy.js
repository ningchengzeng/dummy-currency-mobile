var BASE_URL = "http://139.162.90.234:81/";

$($('.footer').children()[2]).css('display','none');
$($('.footer').children()[1]).css('display','none');

function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

function loadmhotconcept(conceptid) {
    $.ajax({
        url: baseUrl + "mapi/mobile/mhotconcept",
        async: true,
        dataType: "json",
        data: 'conceptid=' + conceptid,
        success: function (data) {
            if (null != data.result1 && data.result1.length > 0) {
                $("#hotconcept").html("");
                $("#hotconcept").append(data.result1);
                coinConceptSlide();
                $('body').on('click', "#hotconcept a", function () {
                    if ($(this).hasClass('active')) {
                        return;
                    }
                    $('#hotconcept a').removeClass('active');
                    $(this).addClass('active')

                })
            }
            if (null != data.result2 && data.result2.length > 0) {
                $("#hotconceptCoinTable").html("");
                $("#hotconceptCoinTable").append(data.result2);
            }

        }
    });
}

function loaduserinfo() {
    $.ajax({
        type: "POST",
        url: BASE_URL + "user/getUserInfo",
        dataType: "json",
        data: {
            "psession": localStorage.getItem("psession")
        },
        success: function (data) {
            if (data.status == "success") {
                if (data.username.length > 0 || data.userid.length > 0) {
                    $(".span .username").html(data.username);
                    $(".loginBar").css('display', 'none');
                    $('#userinfo').css('display', 'block');
                } else {
                    $(".loginBar").css('display', 'block');
                    $('#userinfo').css('display', 'none');
                }
            } else {
                $(".loginBar").css('display', 'block');
                $('#userinfo').css('display', 'none');
            }
        }
    });
};
function logout() {
    if (confirm("确认退出吗？")) {
        localStorage.removeItem("psession");
        window.location.reload();
    }
}

function addfocus(self) {
    if (localStorage.getItem("psession")) {
        var currency = $(self).attr("currency");
        if ($(self).attr("focus") == "true") {
            return;
        }

        if (currency) {
            $.ajax({
                type: "POST",
                url: BASE_URL + "user/addfocus",
                dataType: "json",
                data: {
                    "psession": localStorage.getItem("psession"),
                    "currency": currency
                },
                success: function (data) {
                    if (data.status == "success") {
                        $(self).attr("focus", true).html("已经关注");
                    }
                    else {
                        $(".login").click();
                    }
                }
            });
        }
        else {
            alert("关注失败!");
        }
    }
    else {
        $(".login").click();
    }
}

function unfocus(self) {
    var currency = $(self).attr("currency");
    $.ajax({
        type: "POST",
        url: BASE_URL + "user/unfocus",
        dataType: "json",
        data: {
            "psession": localStorage.getItem("psession"),
            "currency": currency
        },
        success: function (data) {
            alert(data.context)
            if (data.status == "success") {
                location.reload();
            }
        }
    });
}


//手机格式
function checkPhone(p) {

    var re = /^1(3|4|5|7|8)\d{9}$/;
    if (!re.test(p)) {
        return false;
    }
    else return true;
}
//帐号验证
function checkAccount() {
    var account = $('.signupForm .account').val();
    if (account.length > 0) {
        if (!checkPhone(account)) {
            alert("手机号码格式不正确");
            return false
        }
        else { return true }

    }
    else {
        alert("手机号码不能为空");
        return false
    }
}

var login = {
    loginResponse: function (result) {
        if (result.status == "success") {
            alert(result.content);
            window.location.replace('index.html?' + Math.random());
            window.localStorage.setItem("psession", result.content);
        }
        else {
            $("button#loginsite").removeAttr("disabled");
            $("button#loginsite").html("登陆");
            alert(result.content);
        }

    },
    process: function () {
        $("button#loginsite").click(function () {
            var cou = 0;
            if ($('#user').val().trim() == '') {
                alert("帐号名不能为空");
                cou = cou + 1

            }
            if ($('#pwd').val().trim() == '') {
                alert("密码名不能为空");
                cou = cou + 1
            }
            if (cou != 0) {
                return false;
            } else {

                $(this).attr("disabled", "disabled");
                $(this).html("登陆中...");

                var parms = new Object();
                parms["userid"] = $('#user').val().trim();
                parms["password"] = $('#pwd').val().trim();

                parms["isRemember"] = $('#rememberme').is(':checked');
                $.ajax({
                    url: BASE_URL + "user/login",
                    data: parms,
                    type: "post",
                    async: true,
                    success: function (data) {
                        login.loginResponse(data);
                    }
                });
            }
        });
    }
};
var register = {

    //处理手机重置密码发送短信验证码的反馈信息
    regsmsResponse: function (result) {
        if (result == "1") {
            alert("手机短信验证码发送成功!");
        }
        else if (result == "0") {
            alert("手机短信验证码发送失败!");
        }
        else if (result == "2") {
            alert("短信验证码发送频繁, 休息下吧!");
        }
        else if (result == "3") {
            alert("手机号码已注册!");
        }
        else {
            alert("手机号码不能为空!");
        }
    },
    //处理注册的反馈信息
    registerResponse: function (result) {
        if (result.status == "success") {
            alert(result.content);
            setTimeout(function () { window.location.href = 'login.html'; }, 3000);

        }
        else {
            alert(result.content);
        }

    },
    process: function () {
        $('#register').click(function () {
            var name = $('#user').val();
            var phonecode = $('#phonecode').val();
            var pwd1 = $('#pwd').val();
            var pwd2 = $('#pwd2').val();
            //var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            if (name == '' || phonecode == '' || pwd1 == '' || pwd2 == '') {
                alert('请填写完整表单再提交');
                return false
            }
            if (!checkPhone(name)) {
                alert('手机号码格式不正确');
                return false
            }
            if (pwd1 !== pwd2) {
                alert('两次密码输入必须一致');
                return false
            }
            if (pwd1.length < 6) {
                alert('密码长度必须大于6');
                return false
            }
            var parms = new Object();
            parms["userid"] = name;
            parms["password"] = pwd1;
            parms["confirmPwd"] = pwd2;
            parms["verifyCode"] = phonecode;
            $.ajax({
                url: BASE_URL + "user/register",
                type: 'post',
                data: parms,
                async: true,
                success: function (data) {
                    register.registerResponse(data);
                },
                error: function () {
                    alert('网络错误，请重试')
                }
            })
        });

        //发送短信验证码（手机找回）
        $('#sendsmsreg').click(function () {
            var telno = $('#user').val();
            debugger;
            if (telno.length == 0) {
                layer.msg("手机号码不能为空!");
            }
            else {
                $.ajax({
                    url: BASE_URL + "user/GetSms?telno=" + telno,
                    type: "get",
                    async: true,
                    success: function (data) {
                        register.regsmsResponse(data);
                    }
                });
            }

        })
    }
};





/**
 * 工具处理
 * @type {{loadHomeNewCoin: util.loadHomeNewCoin, loadHomevolrank: util.loadHomevolrank, loadHomeCoinMaxChange: util.loadHomeCoinMaxChange, loadconcept: util.loadconcept}}
 */
var util = {
    loadHomeNewCoin: function () {
        var uri = BASE_URL + "mapi/mobile/homenewcoin";
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                $("#newCoin").append(data);
                $('#newCoinloadding').hide();
            }
        });
    },
    showmarket: function () {
        var uri = BASE_URL + "mapi/mobile/showmarket";
        $.ajax({
            url: uri,
            dataType: "json",
            success: function (data) {
                $("ul.rightNav li.showmarket").append(data.result);
                $('.line').peity("line", { width: 50, height: 15, fill: '#f5f5f5', min: 99999, strokeWidth: 1 });
            }
        });
    },
    toThousands: function (value) {
        if (value == 0) {
            return "?"
        }

        function scientificToNumber(num) {
            var str = num.toString();
            var reg = /^(\d+)(e)([\-]?\d+)$/;
            var arr, len,
                zero = '';

            /*6e7或6e+7 都会自动转换数值*/
            if (!reg.test(str)) {
                return num;
            } else {
                /*6e-7 需要手动转换*/
                arr = reg.exec(str);
                len = Math.abs(arr[3]) - 1;
                for (var i = 0; i < len; i++) {
                    zero += '0';
                }

                return '0.' + zero + arr[1];
            }
        }

        if (value < 1) {
            value = scientificToNumber(value);
        }

        var all = "" + value;
        var numbs = all.split(".");
        var num = numbs[0], result = '';

        while (num.length > 3) {
            result = ',' + num.slice(-3) + result;
            num = num.slice(0, num.length - 3);
        }
        if (num) { result = num + result; }
        if (numbs.length == 2) {
            return result + "." + numbs[1]
        }
        return result;
    },
    loadHomevolrank: function () {
        var uri = BASE_URL + "mapi/mobile/homevolrank";
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                $('#loadlrank').hide();
                $("#vol_coin").append(data.result1);
                $("#vol_upDown").append(data.result2);
            }
        });
    },

    loadHomeCoinMaxChange: function () {
        var uri = BASE_URL + "mapi/mobile/HomeCoinMaxChange";
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                $('#loadmaxchange').hide();
                $("#maxchange_up").after(data.result1);
                $("#maxchange_down").after(data.result2);
            }
        });
    },
    format_crypto_volume: function (val) {
        if (val >= 1000000) {
            val = Math.round(val / 10000).toLocaleString() + "万";
        } else if (val >= 100000) {
            val = (val / 10000).toLocaleString() + "万";
        } else if (val >= 1000) {
            val = (val / 10000).toFixed(2).toLocaleString() + "万";
        } else if (val >= 100) {
            val = val.toFixed(0).toLocaleString();
        } else if (val >= 0.1) {
            val = val.toFixed(2).toLocaleString();
        }
        else {
            val = val.toFixed(4).toLocaleString();
        }

        return util.formatprice(val);
    },
    formatprice: function (val) {
        var price = val.toString();
        var indx = price.indexOf('.');
        var priceStr = price;
        var counter = 0;
        if (indx > -1) {
            for (var i = price.length - 1; i >= 1; i--) {
                if (price[i] == "0") {
                    counter++;
                    if (price[i - 1] == ".") {
                        counter++;
                        break;
                    }
                } else {
                    break;
                }
            }
            priceStr = "";
            for (var i = 0; i < price.length - counter; i++) {
                priceStr += price[i];
            }
        }
        return priceStr;

    },
    loadconcept: function (conceptid) {
        var uri = BASE_URL + "mapi/mobile/hotconcept";
        $.ajax({
            url: uri,
            dataType: "json",
            data: 'conceptid=' + conceptid,
            success: function (data) {
                if (null != data.result1 && data.result1.length > 0) {
                    $('#loadhotconcept').hide();
                    $("#hotconcept").html("");
                    $("#hotconcept").append(data.result1);
                    coinConceptSlide();
                    $('body').on('click', "#hotconcept a", function () {
                        if ($(this).hasClass('active')) {
                            return;
                        }
                        $('#hotconcept a').removeClass('active');
                        $(this).addClass('active')

                    })
                }
                if (null != data.result2 && data.result2.length > 0) {
                    $('#loadhotconcept').hide();
                    $("#hotconceptCoinTable").html("");
                    $("#hotconceptCoinTable").append(data.result2);
                }
            }
        });
    }
};
/**
 * index.html
 * 主页处理
 * @type {{pageCount: number, pageSize: number, pageCurrent: number, row: index.row, page: {pageReader: index.page.pageReader, next: index.page.next, prev: index.page.prev}, ajaxData: index.ajaxData, process: index.process}}
 */
var index = {
    pageCount: 1,
    pageSize: 50,
    pageCurrent: 1,
    rowName: function (data) {
        return "<tr>" +
            "      <td>" + data.index + "</td>" +
            "      <td>" +
            "          <a href=\"currencies.html?currency=" + data.code + "\">" +
            "              <img src=\"" + data.icon + "\" alt=\"" + data.title + "\">" + data.title +
            "          </a>" +
            "      </td>" +
            "  </tr>";
    },
    row: function (data) {
        var updown24HCalss = "text-red";
        if (data.updown24H > 0) {
            updown24HCalss = "text-green";
        }

        return " <tr>" +
            "      <td>" + data.index + "</td>" +
            "      <td>" +
            "          <a href=\"currencies.html?currency=" + data.code + "\">" +
            "              <img src=\"" + data.icon + "\" alt=\"" + data.title + "\">" + data.title +
            "          </a>" +
            "      </td>" +
            "      <td>" +
            "          <a href=\"currencies.html?currency=" + data.code + "\" class=\"price\" data-usd=\"" + data.price.usd + "\" data-cny=\"" + data.price.cny + "\" data-btc=\"" + data.price.cny + "\">" + data.price.init + "</a>" +
            "      </td>" +
            "      <td>" +
            "          <div class=\"" + updown24HCalss + "\">" + data.updown24H + "%</div>" +
            "      </td>" +
            "      <td class=\"market-cap\" data-usd=\"" + data.marketCap.usd + "\" data-cny=\"" + data.marketCap.cny + "\" data-btc=\"" + data.marketCap.btc + "\">" + data.marketCap.init + " </td>" +
            "      <td>" + data.amount + "</td>" +
            "      <td>" +
            "          <a href=\"currencies.html?currency=bitcoin#markets\" class=\"volume\" data-usd=\"" + data.volume.usd + "\" data-cny=\"" + data.volume.cny + "\" data-btc=\"" + data.volume.cny + "\">" + data.volume.init + "</a>" +
            "      </td>" +
            "  </tr>";
    },
    header: function () {
        var uri = BASE_URL + "mapi/mobile/indexHeader";
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                var result = data.result;
                $("a#dummcy").text(result.dummcy);
                $("a#token").text(result.token);
                $("a#exchange").text(result.exchange);
                $("a#amount").text(result.amount.price);
                $("a#market").text(result.market.price);
            }
        });
    },
    ajaxData: function () {
        var data = function () {
            var urip = BASE_URL + "mapi/mobile/currencyindexAll?pageSize=20&page=" + $("div.seemore").attr("page");
            if (index.type) {
                urip += "&type=" + index.type;
            }
            if (index.limit) {
                urip += "&limit=" + index.limit;
            }
            if (index.volume) {
                urip += "&volume=" + index.volume;
            }
            if (index.price) {
                urip += "&price=" + index.price;
            }
            $.ajax({
                url: urip,
                type: "GET",
                dataType: 'json',
                success: function (data) {
                    $(data.result).each(function (indexData, item) {
                        $("table.tablefixed tbody").append(index.rowName(item));
                        $("table.tableMain tbody").append(index.row(item));
                    });
                }
            });
        };
        data();
    },
    type: GetRequest().type,
    limit: GetRequest().limit,
    volume: GetRequest().volume,
    price: GetRequest().price,
    process: function () {
        index.header();
        index.ajaxData();
        $("div.seemore").click(function () {
            var page = parseInt($(this).attr("page"));
            $(this).attr("page", ++page);
            index.ajaxData();
        });
    }
};

function search(value) {
    searchIndex.search = value;
    searchIndex.process();
}

var searchIndex = {
    marketRowName: function () {
        return "<tr>" +
            "      <td>" + data.index + "</td>" +
            "      <td>" +
            "          <a href=\"exchangedetails.html?currency=" + data.code + "\">" +
            "              <img src=\"" + data.icon + "\" alt=\"" + data.title + "\">" + data.title +
            "          </a>" +
            "      </td>" +
            "  </tr>";
    },
    marketRow: function () {
        return " <tr>" +
            "      <td>" + data.index + "</td>" +
            "      <td>" +
            "          <a href=\"exchangedetails.html?currency=" + data.code + "\">" +
            "              <img src=\"" + data.icon + "\" alt=\"" + data.title + "\">" + data.title +
            "          </a>" +
            "      </td>" +
            "      <td>" + util.toThousands(data.price.cny) + " </td>" +
            "      <td>" + data.coinCount + "</td>" +
            "      <td>" + data.country.title + "</td>" +
            "  </tr>";
    },
    coinRowName: function (data) {
        return "<tr>" +
            "      <td>" + data.index + "</td>" +
            "      <td>" +
            "          <a href=\"currencies.html?currency=" + data.code + "\">" +
            "              <img src=\"" + data.icon + "\" alt=\"" + data.title + "\">" + data.title +
            "          </a>" +
            "      </td>" +
            "  </tr>";
    },
    coinRow: function (data) {
        var updown24HCalss = "text-red";
        if (data.updown24H > 0) {
            updown24HCalss = "text-green";
        }

        return " <tr>" +
            "      <td>" + data.index + "</td>" +
            "      <td>" +
            "          <a href=\"currencies.html?currency=" + data.code + "\">" +
            "              <img src=\"" + data.icon + "\" alt=\"" + data.title + "\">" + data.title +
            "          </a>" +
            "      </td>" +
            "      <td>" +
            "          <a href=\"currencies.html?currency=" + data.code + "\" class=\"price\" data-usd=\"" + data.price.usd + "\" data-cny=\"" + data.price.cny + "\" data-btc=\"" + data.price.cny + "\">" + data.price.init + "</a>" +
            "      </td>" +
            "      <td>" +
            "          <div class=\"" + updown24HCalss + "\">" + data.updown24H + "%</div>" +
            "      </td>" +
            "      <td class=\"market-cap\" data-usd=\"" + data.marketCap.usd + "\" data-cny=\"" + data.marketCap.cny + "\" data-btc=\"" + data.marketCap.btc + "\">" + data.marketCap.init + " </td>" +
            "      <td>" + data.amount + "</td>" +
            "      <td>" +
            "          <a href=\"currencies.html?currency=bitcoin#markets\" class=\"volume\" data-usd=\"" + data.volume.usd + "\" data-cny=\"" + data.volume.cny + "\" data-btc=\"" + data.volume.cny + "\">" + data.volume.init + "</a>" +
            "      </td>" +
            "  </tr>";
    },
    dataAjax: function () {
        var urip = BASE_URL + "mapi/mobile/search?search=" + searchIndex.search;
        $.ajax({
            url: urip,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                $(data.currencies).each(function (indexData, item) {
                    $("table.tablefixed tbody", $("div.coin")).append(searchIndex.coinRowName(item));
                    $("table.tableMain tbody", $("div.coin")).append(searchIndex.coinRow(item));
                });

                $(data.exchange).each(function (indexData, item) {
                    $("table.tablefixed tbody", $("div.market")).append(searchIndex.marketRowName(item));
                    $("table.tableMain tbody", $("div.market")).append(searchIndex.marketRow(item));
                });
            }
        });
    },
    search: "",
    process: function () {
        searchIndex.dataAjax();
    }
};

/**
 * currencies.html
 * @type {{process: currencies.process}}
 */
var currencies = {
    exchageRowTop: function (data) {
        var transaction = "";
        if (data.transaction.href != "") {
            transaction = "<a href=\"" + data.transaction.href + "\" target=\"_blank\"> " + data.transaction.title + " </a>";
        } else {
            transaction = data.transaction.title;
        }

        return '<tr class="adList">'
            + '<td>' + data.index + '</td>'
            + '<td><a href="' + data.exchange.href + '" target="_blank">' + data.exchange.title + '</a></td>'
            + '</tr>';
    },
    exchageRow: function (data) {
        var transaction = "";
        if (data.transaction.href != "") {
            transaction = "<a href=\"" + data.transaction.href + "\" target=\"_blank\"> " + data.transaction.title + " </a>";
        } else {
            transaction = data.transaction.title;
        }

        return "<tr>" +
            "    <td>" + data.index + "</td>" +
            "    <td>" +
            "        <a href=\"" + data.exchange.href + "\" target=\"_blank\">" +
            "            <img height='15' width='18' src=\"" + data.exchange.icon + "\" alt=\"" + data.exchange.title + "\">" + data.exchange.title + "</a>" +
            "    </td>" +
            "    <td>" + transaction + "</td>" +
            "    <td class=\"price\" " +
            "         data-usd=\"" + data.price.usd + "\" data-cny=\"" + data.price.cny + "\" " +
            "         data-btc=\"" + data.price.btc + "\" " +
            "         data-native=\"" + data.price.native + "\">" + data.price.init + "</td>" +
            "    <td>" + data.ammount + "</td>" +
            "    <td class=\"volume\" " +
            "             data-usd=\"" + data.volume.usd + "\" data-cny=\"" + data.volume.cny + "\" " +
            "         data-btc=\"" + data.volume.btc + "\" " +
            "         data-native=\"" + data.volume.native + "\">" + data.volume.init + "</td>" +
            "    <td>" + data.exchange.proportion + "</td>" +
            "    <td>" + data.time + "</td>" +
            "<td><div class='more add' onclick='addlogin();'>添加自选</div></td>"
        "</tr>"
    },
    exchage: function (list) {
        $(".tableMain tbody:eq(0)").empty();
        $(".tablefixed tbody:eq(0)").empty();
        $(list).each(function (index, item) {
            $(".tablefixed tbody:eq(0)").append(currencies.exchageRowTop(item));
            $(".tableMain tbody:eq(0)").append(currencies.exchageRow(item));

        });
    },
    details: function (data, focus) {
        if (data != null) {
            $('#midName').text(data.title.cn + "(" + data.title.en + ")");//
            $('#coinLogo').attr('src', data.icon);//
            $('#fixedPriceimg').attr('src', data.icon);//
            $('#fixedPrice1').text("￥" + util.toThousands(data.price.cny));
            $('#fixedRange').text(data.floatRate + '%');//

            $('#24TopData').text("最高￥" + util.toThousands(data.twenty.price.max) + " / " + "￥最低" + util.toThousands(data.twenty.price.min));

            $('#24Max').text("￥" + util.toThousands(data.twenty.price.max));
            $('#24Min').text("￥" + util.toThousands(data.twenty.price.min));

            $('#unit').text(data.unit + "介绍");//
            $('.unitName').text(data.unit);//

            $('#mainy').text("≈$" + util.toThousands(data.price.usd));
            $('#price').text("￥" + util.toThousands(data.price.cny));
            $('#mainbtc').text("≈" + util.toThousands(data.price.btc) + " BTC");

            $('#ltinit').text("￥" + util.toThousands(data.circulationPrice.cny));
            $('#lty').text("≈$" + util.toThousands(data.circulationPrice.usd));
            $('#ltbtc').text("≈" + util.toThousands(data.circulationPrice.btc) + " BTC");
            $('#ltlevel').text("第" + data.circulationRanking + "名");

            $('#ltlltcz').text(util.toThousands(data.amount.issue) + " " + data.unit);
            $('#ltlltc').text(util.toThousands(data.amount.circulation) + " " + data.unit);

            $('#cjmoney').text("￥" + util.toThousands(data.twentyPrice.cny));
            $('#cjy').text("≈$" + util.toThousands(data.twentyPrice.usd));
            $('#cjbtc').text("≈" + util.toThousands(data.twentyPrice.btc) + " " + data.unit);
            $('#upOrDown').text(data.floatRate + "%");//
            if(data.floatRate >= 0){
                $('#upOrDown').attr("class","tag green");//
            }else{
                $('#upOrDown').attr("class","tag red");//
            }
            $('#remark').text('');
            $('#remark').append(data.describe);

            $('#cnName').text(data.title.cn);
            $('#enName').text(data.title.en);
            $('#level3').text("第" + data.twenty.price.ranking + "名");
            $('#sjjys').text(data.ticker.count + "家");// 交易所
            $('#fxtime').text(data.date); // 上架时间

            $('#piechar1').val(data.twenty.price.rate);
            $('#piechar2').val(util.toThousands(data.marketCapitalization))
            $('#piechar3').val(util.toThousands(data.amount.circulationRate))

            $('#hsl').text(data.twenty.price.rate + "%");
            $('#qqzsz').text(util.toThousands(data.marketCapitalization) + "%");
            $('#ltl').text(util.toThousands(data.amount.circulationRate) + "%");
            $('#MarketcapPercent').val(util.toThousands(data.marketCapitalization));

            $('#bbook').text(data.whitePaper.title);
            $('#bbook').attr('href', data.whitePaper.title);
            if (data.webSite.length != 0) {
                var res = '';
                for (var i = 0; i < data.webSite.length; i++) {
                    res += "<a href=" + data.webSite[0].href + " rel='nofollow' target='_blank'>" + data.webSite[0].title + "</a>,";
                }
                $('#net').append(res.substr(0, res.length - 1));
            }

            if (data.blockStation.length != 0) {
                var res = '';
                for (var i = 0; i < data.blockStation.length; i++) {
                    res += "<a href=" + data.blockStation[0].href + " rel='nofollow' target='_blank'>" + data.blockStation[0].title + "</a>,";
                }
                $('#qknet').append(res.substr(0, res.length - 1));
            }
        }

        // //热门概念
        // if (data.concept) {
        //     $(data.concept).each(function (index, item) {
        //         $("li#concept span.value").append("<a href=\"conceptcoin.html?id=" + item.index + "\" target=\"_blank\">" + item.title + "</a>");
        //     });
        // } else {
        //     $("li#concept").hide();
        // }

        // if (data.funding) {
        //     $("li#funding span.value").append('<a href="#ico">' + data.funding.price + '</a>');
        //     if (data.funding.up != "") {
        //         $("li#funding span.value").append('<span class="tags-ico">' + data.funding.up + '</span>');
        //     }

        //     currencies.icoAjax(data.code, function (data) {
        //         if (data) {
        //             console.log(data);
        //             $("div#icotable table")
        //                 .append('<tr>' +
        //                     '    <th>状态</th>' +
        //                     '    <th>代币平台</th>' +
        //                     '    <th>ICO分配<div class="toolTips"><div class="text">T：团队/合作伙伴/贡献者，B:赏金，C：基金会，O:其他</div></div></th>' +
        //                     '    <th>投资者占比(%)<div class="toolTips"><div class="text">众筹目标的百分比，不是货币总量的百分比</div></div></th>' +
        //                     '    <th>ICO总量</th>' +
        //                     '    <th>ICO发售量</th>' +
        //                     '</tr>' +
        //                     '<tr>' +
        //                     '    <td>' + data.state + '</td>' +
        //                     '    <td>' + data.amount + '</td>' +
        //                     '    <td>' + data.distribution + '</td>' +
        //                     '    <td>' + data.proportion + '</td>' +
        //                     '    <td>' + data.volume + '</td>' +
        //                     '    <td>' + data.salesVolume + '</td>' +
        //                     '</tr>' +
        //                     '<tr>' +
        //                     '    <th>众筹起始时间</th>' +
        //                     '    <th>众筹结束时间</th>' +
        //                     '    <th>开售价格</th>' +
        //                     '    <th>众筹方式</th>' +
        //                     '    <th>众筹目标</th>' +
        //                     '    <th>众筹金额</th>' +
        //                     '</tr>' +
        //                     '<tr>' +
        //                     '    <td>' + data.startDate + '</td>' +
        //                     '    <td>' + data.endDate + '</td>' +
        //                     '    <td>' + data.price + '</td>' +
        //                     '    <td>' + data.method + '</td>' +
        //                     '    <td>' + data.object + '</td>' +
        //                     '    <td>' + data.platform + '</td>' +
        //                     '</tr>' +
        //                     '<tr>' +
        //                     '    <th>众筹均价</th>' +
        //                     '    <th>成功众筹数量</th>' +
        //                     '    <th>成功众筹金额</th>' +
        //                     '    <th>特点</th>' +
        //                     '    <th>安全审计</th>' +
        //                     '    <th>法律形式</th>' +
        //                     '</tr>' +
        //                     '<tr>' +
        //                     '    <td>' + data.argPrice + '</td>' +
        //                     '    <td>' + data.successAmount + '</td>' +
        //                     '    <td>' + data.successPrice + '</td>' +
        //                     '    <td>' + data.characteristic + '</td>' +
        //                     '    <td>' + data.audit + '</td>' +
        //                     '    <td>' + data.law + '</td>' +
        //                     '</tr>' +
        //                     '<tr>' +
        //                     '    <th>管辖区域</th>' +
        //                     '    <th>法律顾问</th>' +
        //                     '    <th>代售网址</th>' +
        //                     '    <th>Blog地址</th>' +
        //                     '    <th></th>' +
        //                     '    <th></th>' +
        //                     '</tr>' +
        //                     '<tr>' +
        //                     '    <td>' + data.area + '</td>' +
        //                     '    <td>' + data.lawer + '</td>' +
        //                     '    <td><a href=\'' + data.website + '\' target=\'_blank\' rel=\'nofollow\'>' + data.website + '</a></td>' +
        //                     '    <td><a href=\'' + data.blogSite + '\' target=\'_blank\' rel=\'nofollow\'>' + data.blogSite + '</a></td>' +
        //                     '    <td></td>' +
        //                     '    <td></td>' +
        //                     '  </tr>');
        //             $("div#icotable").show();
        //         }
        //     });

        // } else {
        //     $("li#funding").hide();
        // }

        // if (data.assets) {
        //     $("li#assets span.value").append(data.assets);
        // } else {
        //     $("li#assets").hide();
        // }

        // if (data.assetsPlatform) {
        //     $("li#assetsPlatform span.value").append(data.assetsPlatform);
        // } else {
        //     $("li#assetsPlatform").hide();
        // }
    },
    icoAjax: function (code, callback) {
        $.ajax({
            url: BASE_URL + "mapi/mobile/getico",
            type: "GET",
            dataType: 'json',
            data: "currency=" + code,
            success: function (data) {
                callback(data.result);
            }
        });
    },
    dataAjax: function (code) {
        $.ajax({
            url: BASE_URL + "mapi/mobile/getCurrencies",
            type: "POST",
            dataType: 'json',
            data: {
                "currency": code,
                "psession": localStorage.getItem("psession")
            },
            success: function (data) {
                currencies.details(data.detail, data.focus);
                currencies.exchage(data.exchange);
                currencies.chart();
            }
        });
    },
    loadCoinEvent: function (code) {
        var uri = BASE_URL + "mapi/mobile/getCoinevent";
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            data: "currency=" + code,
            success: function (data) {
                if (data.length > 0) {
                    $("#coineventtimeline").append(data);
                    $("#timeLineBox").css("display", "block");
                }
            }
        });
    },
    loadPiechartCoinvol: function (code) {
        $.ajax({
            url: BASE_URL + "mapi/mobile/getCointradesPercent",
            type: "GET",
            dataType: 'json',
            data: "currency=" + code,
            success: function (data) {
                var pieArr = [];
                $(data).each(function (index, item) {
                    pieArr.push([item.name, item.y]);
                });

                $('#mpiechart_coinvol').highcharts({
                    legend: {
                        itemStyle: {
                            color: '#666',
                            fontWeight: 'normal',
                        },
                        itemWidth: 80,
                        symbolRadius: 0
                    },
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false
                    },
                    title: {
                        text: ''
                    },
                    tooltip: {
                        headerFormat: '{series.name}<br>',
                        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: false
                            },
                            showInLegend: true
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: '交易对成交量占比'
                    }]

                });
                // var coinCode = GetRequest().currency.split('/')[0];
                // var pieArr = [];
                $('#mpiechart_coinvol').highcharts().series[0].setData(pieArr);
            }
        });
    },
    chart: function () {
        var Supply = $("#Supply").val();
        var Hands = $("#Hands").val();
        var MarketcapPercent = $("#MarketcapPercent").val();
        drawPie('#piechar1', Math.round(Hands) / 100, '#3cc9cb');
        if (MarketcapPercent > 0.1) {
            var Percent1 = MarketcapPercent;
            drawPie('#piechar2', Math.round(Percent1) / 100, '#41ce48');
        }
        else if (MarketcapPercent < 0.1) {
            drawPie('#piechar2', 0.1, '#41ce48');
        }
        drawPie('#piechar3', Math.round(Supply) / 100, '#ff8080');
    },
    process: function () {
        var coinCode = GetRequest().currency.split('/')[0];
        currencies.dataAjax(coinCode);
        currencies.loadCoinEvent(coinCode);
        currencies.loadPiechartCoinvol(coinCode);

        //util.loadhander();
        // util.showmarket();
        //util.loadconcept(0);//热门概念
    }
};

/**
 * newcoin.html
 * 最近一个月上市的虚拟币列表
 * @type {{row: newCoin.row, getNewCoin: newCoin.getNewCoin, setvalue: newCoin.setvalue, validate: newCoin.validate, process: newCoin.process}}
 */
var newCoin = {
    row1: function (data, index) {
        return '<tr>'
            + '<td>' + (index + 1) + '</td>'
            + '<td><a href="currencies.html?currency=' + data.code + '"><img src="' + data.icon + '" alt="' + data.title.short + '"> ' + data.title.short + '</a></td>'
            + '</tr>';
    },
    row2: function (data, index) {
        return '<tr>'
            + '<td>' + (index + 1) + '</td>'
            + '<td><a href="currencies.html?currency=' + data.code + '"><img src="' + data.icon + '" alt="' + data.title.short + '"> ' + data.title.short + '</a></td>'
            + '<td><a href="currencies.html?currency=' + data.code + '" target="_blank" class="price" data-usd="' + data.price.usd + '" data-cny="' + data.price.cny + '" data-btc="' + data.price.btc + '">' + data.price.init + '</a></td>'
            + '<td><div ' + newCoin.validate(data.updown.replace("%", "")) + '>' + data.updown + '</div></td>'
            + '<td class="market-cap" data-usd="' + data.marketCap.usd + '" data-cny="' + data.marketCap.cny + '" data-btc="' + data.marketCap.btc + '">' + data.marketCap.init + '</td>'
            + '<td>' + data.amount + '</td>'
            + '<td class="volume" data-usd="' + data.volume.usd + '" data-cny="' + data.volume.cny + '" data-btc="' + data.volume.btc + '"><a href="currencies.html?currency=' + data.code + '">' + data.volume.init + '</a></td>'
            + '<td>' + data.date + '</td>'
            + '</tr>';
    },
    getNewCoin: function () {
        var uri = BASE_URL + "mapi/mobile/getNewCoin";
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                $('#items').empty();
                $(data).each(function (indexData, item) {
                    $('#items1').append(newCoin.row1(item, indexData));
                    $('#items2').append(newCoin.row2(item, indexData));
                });
            }
        });
    },
    validate: function (num) {
        var reg = /^\d+(?=\.{0,1}\d+$|$)/
        if (reg.test(num)) {
            return 'class="text-green"';
        } else {
            return 'class="text-red"';
        }
    },
    process: function () {
        newCoin.getNewCoin();
    }
};

/**
 * maxchange.html
 * 涨跌幅榜
 * @type {{}}
 */
var upDown = {
    row1: function (index, data) {
        return '<tr>'
            + '<td>' + (index + 1) + '</td>'
            + '<td><a href="currencies.html?currency=' + data.code + '"><img src="' + upDown.setvalue(data.icon) + '" alt="' + data.title.cn + '"> ' + data.title.short + '</a></td>'
            + '</tr>';
    },
    row2: function (index, data) {
        return '<tr>'
            + '<td><span>' + (index + 1) + '</span></td>'
            + '<td><a href="currencies.html?currency=' + data.code + '" target="_blank"><img src="' + upDown.setvalue(data.icon) + '" alt="' + data.title.cn + '"> ' + data.title.cn + '</a></td>'
            + '<td><span ' + upDown.validate(data.proportion) + '>' + data.proportion + '%</span></td>'
            + '<td class="price" data-usd="' + data.price.usd + '" data-cny="' + data.price.cny + '" data-btc="' + data.price.btc + '"><a href="currencies.html?currency=' + data.code + '#markets" target="_blank">' + data.price.init + '</a></td>'
            + '<td class="volume" data-usd="' + data.volume.usd + '" data-cny="' + data.volume.cny + '" data-btc="' + data.volume.btc + '"><a href="currencies.html?currency=' + data.code + '#markets" target="_blank">' + data.volume.init + '</a></td>'
            + '</tr>';
    },
    gettingupDown: function () {
        var uri = BASE_URL + "mapi/mobile/getupdown";

        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            success: function (result) {
                data1 = result[0];
                data2 = result[1];
                data3 = result[2];
                data4 = result[3];
                data5 = result[4];
                data6 = result[5];

                if (data1.length != 0) {
                    $('#item24UpTop').empty();
                    $('#item24UpDetails').empty();
                    $(data1).each(function (index, item) {
                        $('#item24UpTop').append(upDown.row1(index, item));
                        $('#item24UpDetails').append(upDown.row2(index, item));
                    });
                }

                if (data2.length != 0) {
                    $('#item24DownTop').empty();
                    $('#item24DownDetails').empty();
                    $(data2).each(function (index, item) {
                        $('#item24DownTop').append(upDown.row1(index, item));
                        $('#item24DownDetails').append(upDown.row2(index, item));
                    });
                }

                if (data3.length != 0) {
                    $('#itemUpTop').empty();
                    $('#itemUpDetails').empty();
                    $(data3).each(function (index, item) {
                        $('#itemUpTop').append(upDown.row1(index, item));
                        $('#itemUpDetails').append(upDown.row2(index, item));
                    });
                }

                if (data4.length != 0) {
                    $('#itemDownTop').empty();
                    $('#itemDownDetails').empty();
                    $(data4).each(function (index, item) {
                        $('#itemDownTop').append(upDown.row1(index, item));
                        $('#itemDownDetails').append(upDown.row2(index, item));
                    });
                }

                if (data5.length != 0) {
                    $('#itemwup').empty();
                    $('#itemwdown').empty();
                    $(data5).each(function (index, item) {
                        $('#itemwup').append(upDown.row1(index, item));
                        $('#itemwdown').append(upDown.row2(index, item));
                    });
                }

                if (data6.length != 0) {
                    $('#itemwDownTop').empty();
                    $('#itemwDownDetails').empty();
                    $(data6).each(function (index, item) {
                        $('#itemwDownTop').append(upDown.row1(index, item));
                        $('#itemwDownDetails').append(upDown.row2(index, item));
                    });
                }
            }
        });
    },
    setvalue: function (val) {
        return val.replace(/(\/\d{8}\/)/, '/time/');
    },
    validate: function (num) {
        var reg = /^\d+(?=\.{0,1}\d+$|$)/
        if (reg.test(num)) {
            return 'class="text-green"';
        } else {
            return 'class="text-red"';
        }
    },
    process: function () {
        util.loadHomeNewCoin();
        util.loadHomevolrank();
        $('#zxss').hide();
        $('#phb').hide();
        upDown.gettingupDown();
    }
};

/**
 * exchange.html
 * 交易所处理
 * @type {{process: exchange.process}}
 */
var mexchange = {
    pageCount: 1,
    pageSize: 20,
    pageCurrent: 1,
    pageIndex: 0,
    rowTop: function (index, item) {
        if (item.title) {
            return '<tr>'
                + '<td><a href="exchangedetails.html?currenty=' + item.code + '"><img src="' + item.icon + '.jpg"></a></td>'
                + '<td><a href="exchangedetails.html?currenty=' + item.code + '">' + item.title + '</a></td>'
                + '</tr>';
        } else {
            return "";
        }
    },
    rowMain: function (index, item) {
        if (item.title) {
            return '<tr>'
                + '<td><a href="exchangedetails.html?currenty=' + item.code + '"><img src="' + item.icon + '.jpg"></a></td>'
                + '<td><a href="exchangedetails.html?currenty=' + item.code + '">' + item.title + '</a></td>'
                + '<td><div class="star-new star' + item.star + '"></div></td>'
                + '<td>¥' + util.format_crypto_volume(item.price.cny) + '</td>'
                + '<td>' + item.transactionPairCount + '</td>'
                + '<td>' + item.country.title + '</td>'
                + '<td>' + mexchange.settargs(item.tags) + '</td>'
                + '</tr>'
        } else {
            return "";
        }
    },
    setIValue: function (val) {
        var i = '';
        var tags = val.tags;
        for (var s = 0; s < tags.length; s++) {
            i += '<a href="exchangedetails.html?currenty=' + val.code + '&type=2"><i class="' + tags[s] + '"> </i></a>';
        }
        return i;
    },
    settargs: function (val) {
        var str = "";
        if (val) {
            for (var i = 0; i < val.length; i++) {
                if (val[i] == "xianhuo") {
                    str += '<a href="exchange.html?type=0">期货 </a>';
                } else if (val[i] == "qihuo") {
                    str += '<a href="exchange.html?type=1">现货 </a>';
                } else if (val[i] == "otc") {
                    str += '<a href="exchange.html?type=2">法币 </a>';
                }
            }
        }
        return str;
    },
    page: {
        pageReader: function () {
            $("div.pageList").empty();

            if (mexchange.pageCurrent == 1) {
                $("div#pageList").append('<a href=\'#\' class=\'btn btn-white\' onclick="exchange.page.prev()"><</a>' +
                    '<a href="#" class="btn btn-white">首页</a>' +
                    '<a class=\'btn btn-white\' onclick="exchange.page.next()" href=\'#\'>></a>');
            } else if (mexchange.pageCurrent == mexchange.pageCount - 1) {
                $("div#pageList").append('<a href=\'#\' class=\'btn btn-white\' onclick="exchange.page.prev()"><</a>' +
                    '<a href="#" class="btn btn-white">尾页</a>' +
                    '<a class=\'btn btn-white\' onclick="exchange.page.next()" href=\'#\'>></a>');
            } else {
                $("div#pageList").append('<a href=\'#\' class=\'btn btn-white\' onclick="exchange.page.prev()"><</a>' +
                    '<a href="#" class="btn btn-white">第' + mexchange.pageCurrent + '页</a>' +
                    '<a class=\'btn btn-white\' onclick="exchange.page.next()" href=\'#\'>></a>');
            }
        },
        next: function () {
            if (mexchange.pageCurrent < mexchange.pageSize) {
                mexchange.pageCurrent++;
            }
            mexchange.page.pageReader();
            mexchange.ajaxData();
        },
        prev: function () {
            if (mexchange.pageCurrent > 1) {
                mexchange.pageCurrent--;
            }
            mexchange.page.pageReader();
            mexchange.ajaxData();
        }
    },
    scroll: function () {
        $(window).scroll(function () {
            if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                mexchange.ajaxData();
            }
        })
    },
    ajaxData: function () {
        var uri = BASE_URL + "mapi/mobile/mexchange";
        mexchange.pageIndex++;
        //mexchange.page.pageReader();
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            data: "pagesize=" + mexchange.pageSize + "&page=" + mexchange.pageIndex,
            beforeSend: function () {
                $('.loading2').css("display", "block"); //显示加载时候的提示
            },
            success: function (data) {
                //mexchange.pageCount = Math.ceil(data.count / index.pageSize);
                // $('#tablefixed').empty();
                // $('#tableMain').empty();
                $(data.result).each(function (index, item) {
                    //$('#itemsList').append(mexchange.row(index, item));
                    $("#tablefixed").append(mexchange.rowTop(index, item));
                    $("#tableMain").append(mexchange.rowMain(index, item));
                });
            },
            error: function () {
                if (mexchange.pageIndex > 0) {
                    mexchange.pageIndex--;
                }
            }
        });
    },
    process: function () {
        util.loadHomevolrank();
        util.loadHomeNewCoin();
        //util.loadHomevolrank();
        mexchange.ajaxData();
        mexchange.scroll();
    }
};

/**
 * concept.html
 * 概念行情
 * @type {{}}
 */
var concept = {
    pageTop: function (data) {
        return '<li><a href="conceptcoin.html?id=' + data.index + '">'
            + '<div class="tit">' + data.title + '</div><div class="price text-green">' + data.avrUpDown + '</div>'
            + '<div class="sub">' + data.up.title + '<span class="' + concept.setTargClass(data.up.amount) + '">' + data.up.amount + '</span></div></a></li>';
    },
    rowTop: function (data) {
        return "<tr>" +
            "<td>" +
            "<a href=\"conceptcoin.html?id=" + data.index + "\" target=\"_blank\">" + data.title + "</a></td>" +
            "</tr>";
    },
    rowMain: function (data) {
        return "<tr>" +
            "<td>" +
            "<a href=\"conceptcoin.html?id=" + data.index + "\" target=\"_blank\">" + data.title + "</a></td>" +
            "<td>" + data.price24H + "</td>" +
            "<td class=\"text-green\">" + data.avrUpDown + "</td>" +
            "<td title=\"" + data.up.title + "\">" +
            "   <a href=\"currencies.html?currency=" + data.up.code + "\" target=\"_blank\">" + data.up.title + "</a>" +
            '   <span class="' + concept.setTargClass(data.up.amount) + '">' + data.up.amount + '</span>' +
            "</td>" +
            "<td title=\"" + data.down.title + "\">" +
            "   <a href=\"currencies.html?currency=" + data.down.code + "\" target=\"_blank\">" + data.down.title + "</a>" +
            '   <span class="' + concept.setTargClass(data.down.amount) + '">' + data.down.amount + '</span>' +
            "</td>" +
            '<td>' + data.coin.count + '</td>' +
            "<td>" +
            "   <span class=\"text-green\">" + data.coin.up + "</span>/<span class=\"text-red\">" + data.coin.down + "</span>" +
            "</td>" +
            "</tr>";
    },
    setTargClass: function (val) {
        if (val.replace("%", "") > 0) {
            return "tag green"
        } else {
            return "tag red"
        }
    },
    dataAjax: function () {
        var uri = BASE_URL + "mapi/mobile/getConceptNew";
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                $('#tablefixed').empty();
                $('#tableMain').empty();
                $(data).each(function (indexData, item) {
                    $('#tablefixed').append(concept.rowTop(item));
                    $('#tableMain').append(concept.rowMain(item));
                });
                if (data.length >= 6) {
                    for (var i = 0; i < 6; i++) {
                        $('#PageTop').append(concept.pageTop(data[i]));
                    }
                } else {
                    if (data) {
                        for (var i = 0; i < data.length; i++) {
                            $('#PageTop').append(concept.pageTop(data[i]));
                        }
                    }
                }

            }
        });
    },
    process: function () {
        util.loadHomeCoinMaxChange();//涨跌幅
        concept.dataAjax();
    }
};

/**
 * conceptcoin.html?id={index}
 * 概念行情 内容
 * @type {{process: coneptCoin.process}}
 */
var coneptCoin = {
    baseReader: function (desc) {
        $('#ceptTitle').text(desc.title);
        if (desc.avrUpDown.replace('%', '') > 0) {
            $('#ceptUpOrDown').append('<span class="text-green">' + desc.avrUpDown + '</span>');
        } else {
            $('#ceptUpOrDown').append('<span class="text-red">' + desc.avrUpDown + '</span>');
        }

        if (desc.up.amount.replace('%', '') > 0) {
            $('#maxUp').append(desc.up.title + '<span class="tag green">' + desc.up.amount + '</span>');
        } else {
            $('#maxUp').append(desc.up.title + '<span class="tag red">' + desc.up.amount + '</span>');
        }


        if (desc.down.amount.replace('%', '') > 0) {
            $('#minDown').append(desc.down.title + '<span class="tag green">' + desc.down.amount + '</span>');
        } else {
            $('#minDown').append(desc.down.title + '<span class="tag red">' + desc.down.amount + '</span>');
        }

        $('#coinNum').text(desc.coin.count);
        $('#coinUp').text(desc.coin.up);
        $('#coinDown').text(desc.coin.down);
    },
    rowTop: function (data) {
        return '<tr>'
            + '  <td>' + data.index + '</td>'
            + '   <td><a href="currencies.html?currency=' + data.code + '" target="_blank"><img src="' + data.icon + '">' + data.title + '</a></td>'
            + '</tr>';
    },
    rowMain: function (data) {

        return '<tr><td>' + data.index + '</td>'
            + '<td><a href="currencies.html?currency=' + data.code + '" target="_blank"><img src="' + data.icon + '">' + data.title + '</a></td>'
            + '<td class="market-cap" data-usd="' + data.marketCap.usd + '" data-cny="' + data.marketCap.cny + '" data-btc="' + data.marketCap.btc + '">' + data.marketCap.init + '</td>'
            + '<td><a href="currencies.html?currency=' + data.code + '" class="price" data-usd="' + data.price.usd + '" data-cny="' + data.price.cny + '" data-btc="' + data.price.btc + '">' + data.price.init + '</a></td>'
            + '<td>' + data.amount + '</td>'
            + '<td><a href="currencies.html?currency=' + data.code + '" class="volume" data-usd="' + data.volume.usd + '" data-cny="' + data.volume.cny + '" data-btc="' + data.volume.btc + '">' + data.volume.init + '</a></td>'
            + '<td class="change"><span class="' + coneptCoin.setColor(data.updown24H) + '">' + data.updown24H + '%</span></td>'
            + '</tr>';
    },
    setColor: function (val) {
        if (val > 0) {
            return "text-green";
        } else {
            return "text-red";
        }
    },
    dataAjax: function (index) {
        var uri = BASE_URL + "mapi/mobile/getConceptCoin?index=" + index;
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                if (data.desc) {
                    coneptCoin.baseReader(data.desc);
                    $('#tableMain').empty();
                    $('#tablefixed').empty();
                    $(data.list).each(function (indexData, item) {
                        $('#tablefixed').append(coneptCoin.rowTop(item));
                        $('#tableMain').append(coneptCoin.rowMain(item));
                    });
                }
            }
        });
    },
    process: function (index) {
        var index = GetRequest().id;
        coneptCoin.dataAjax(index);
    }
};

/**
 * vol.html
 * 24小时成交额排行榜人民币(CNY)
 * @type {{process: vol.process}}
 */

var vol = {
    pageIndex: 0,
    dataAjax: function () {
        vol.pageIndex++;
        $.ajax({
            type: "GET",
            url: BASE_URL + "mapi/mobile/getvol?page=" + vol.pageIndex,
            async: false,
            beforeSend: function () {
                $('.loading2').css("display", "block"); //显示加载时候的提示
            },
            success: function (ret) {
                if (ret.length > 0) {
                    $("#result").append(ret);
                } else {
                    vol.pageIndex = 1;
                }
                $('.loading2').css("display", "none"); //显示加载时候的提示
            },
            error: function () {
                if (vol.pageIndex > 0) {
                    vol.pageIndex--;
                }
            }
        });
    },
    scroll: function () {
        $(window).scroll(function () {
            if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                vol.dataAjax()
            }
        });
    },
    process: function () {
        vol.dataAjax();
        vol.scroll();
    }
};

/**
 *
 * @type {{pageIndex: number, dataAjax: volexchange.dataAjax, scroll: volexchange.scroll, process: volexchange.process}}
 */
var volexchange = {
    pageIndex: 0,
    icoAjax: function (code, callback) {
        $.ajax({
            url: BASE_URL + "mapi/mobile/getico",
            type: "GET",
            dataType: 'json',
            data: "currency=" + code,
            success: function (data) {
                callback(data.result);
            }
        });
    },
    dataAjax: function () {
        volexchange.pageIndex++;
        $.ajax({
            url: BASE_URL + "mapi/mobile/getvolexchange?page=" + volexchange.pageIndex,
            type: "GET",
            dataType: 'json',
            async: false,
            beforeSend: function () {
                $('.loading2').css("display", "block"); //显示加载时候的提示
            },
            success: function (data) {
                if (data.length > 0) {
                    $("#result").append(data);
                } else {
                    volexchange.pageIndex = 1;
                }
                $('.loading2').css("display", "none"); //显示加载时候的提示
            },
            error: function () {
                if (volexchange.pageIndex > 0) {
                    volexchange.pageIndex--;
                }
            }
        });
    },
    scroll: function () {
        $(window).scroll(function () {
            if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                volexchange.dataAjax();
            }
        })
    },
    process: function () {
        volexchange.dataAjax();
        volexchange.scroll();
    }
};

/**
 *
 * @type {{}}
 */
var monthrank = {
    pageIndex: 0,
    rowTop: function (index, item, pages) {
        if (item.title.cn) {
            return '<tr>' +
                '<td>' + (((pages - 1) * 50) + (index + 1)) + '</td>' +
                '<td>' +
                '   <a href="currencies.html?currency=' + item["code"] + '" target="_blank">' +
                '   <img src="' + item.icon + '" alt="' + item.title.cn + '"/> ' + item.title.short + '</a>' +
                '</td>' +
                '</tr>';
        } else {
            return "";
        }
    },
    rowMain: function (index, item, pages) {
        if (item.title.cn) {
            return '<tr>' +
                '<td>' + (((pages - 1) * 50) + (index + 1)) + '</td>' +
                '<td>' +
                '   <a href="currencies.html?currency=' + item["code"] + '" target="_blank">' +
                '   <img src="' + item.icon + '" alt="' + item.title.cn + '"/>  ' + item.title.short + '</a>' +
                '</td>' +
                '<td class="volume" ' +
                '   data-usd="' + item.oneday.usd + '" ' +
                '   data-cny="' + item.oneday.cny + '" ' +
                '   data-btc="' + item.oneday.btc + '">' +
                '   <a href="currencies.html?currency=' + item["code"] + '" target="_blank">' + item.oneday.init + '</a>' +
                '</td>' +
                '<td class="volume" ' +
                '   data-usd="' + item.siveday.usd + '" ' +
                '   data-cny="' + item.siveday.cny + '" ' +
                '   data-btc="' + item.siveday.btc + '">' +
                '   <a href="currencies.html?currency=' + item["code"] + '" target="_blank">' + item.siveday.init + '</a>' +
                '</td>' +
                '<td class="volume" ' +
                '   data-usd="' + item.month.usd + '" ' +
                '   data-cny="' + item.month.cny + '" ' +
                '   data-btc="' + item.month.btc + '">' +
                '   <a href="currencies.html?currency=' + item["code"] + '" target="_blank">' + item.month.init + '</a>' +
                '</td>' +
                '</tr>';
        } else {
            return "";
        }
    },
    dataAjax: function () {
        monthrank.pageIndex++;
        var uri = BASE_URL + "mapi/mobile/monthmxchange?page=" + monthrank.pageIndex;
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            beforeSend: function () {
                $('.loading2').css("display", "block"); //显示加载时候的提示
            },
            success: function (data) {
                $(data).each(function (index, item) {
                    $("#result1").append(monthrank.rowTop(index, item, monthrank.pageIndex));
                    $("#result2").append(monthrank.rowMain(index, item, monthrank.pageIndex));
                });
            },
            error: function () {
                if (monthrank.pageIndex > 0) {
                    monthrank.pageIndex--;
                }
            }
        });
    },
    scroll: function () {
        $(window).scroll(function () {
            if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                monthrank.dataAjax();
            }
        })
    },
    process: function () {
        monthrank.dataAjax();
        monthrank.scroll();
    }
};



var coinmarket = {
    pageIndex: 0,
    exchageRowTop: function (index, data, pages) {
        var transaction = "";
        if (data.transaction.href != "") {
            transaction = "<a href=\"" + data.transaction.href + "\" target=\"_blank\"><img height='15' width='18' src=\"" + data.exchange.icon + "\" alt=\"" + data.exchange.title + "\"> " + data.transaction.title + " </a>";
        } else {
            transaction = data.transaction.title;
        }
        return '<tr class="adList">'
            + '<td>' + (((pages - 1) * 50) + (index + 1)) + '</td>'
            + '<td><a href="' + data.exchange.href + '" target="_blank"><img height="15" width="18" src="' + data.exchange.icon + '" alt="' + data.exchange.title + '"> ' + data.exchange.title + '</a></td>'
            + '</tr>';
    },
    exchageRow: function (index, data, pages) {
        var transaction = "";
        if (data.transaction.href != "") {
            transaction = "<a href=\"" + data.transaction.href + "\" target=\"_blank\"> " + data.transaction.title + " </a>";
        } else {
            transaction = data.transaction.title;
        }

        return "<tr>" +
            "    <td>" + (((pages - 1) * 50) + (index + 1)) + "</td>" +
            "    <td>" +
            "        <a href=\"" + data.exchange.href + "\" target=\"_blank\">" +
            "            <img height='15' width='18' src=\"" + data.exchange.icon + "\" alt=\"" + data.exchange.title + "\">" + data.exchange.title + "</a>" +
            "    </td>" +
            "    <td>" + transaction + "</td>" +
            "    <td class=\"price\" " +
            "         data-usd=\"" + data.price.usd + "\" data-cny=\"" + data.price.cny + "\" " +
            "         data-btc=\"" + data.price.btc + "\" " +
            "         data-native=\"" + data.price.native + "\">" + data.price.init + "</td>" +
            "    <td>" + data.ammount + "</td>" +
            "    <td class=\"volume\" " +
            "             data-usd=\"" + data.volume.usd + "\" data-cny=\"" + data.volume.cny + "\" " +
            "         data-btc=\"" + data.volume.btc + "\" " +
            "         data-native=\"" + data.volume.native + "\">" + data.volume.init + "</td>" +
            "    <td>" + data.exchange.proportion + "</td>" +
            "    <td>" + data.time + "</td>" +
            "<td><div class='more add' onclick='addlogin();'>添加自选</div></td>"
        "</tr>"
    },
    dataAjax: function () {
        coinmarket.pageIndex++;
        var code = GetRequest().currency.split('/')[0];
        var uri = BASE_URL + "mapi/mobile/getcoinmarket?page=" + coinmarket.pageIndex;
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            data: "currency=" + code,
            beforeSend: function () {
                $('.loading2').css("display", "block"); //显示加载时候的提示
            },
            success: function (data) {

                $(data.result).each(function (index, item) {
                    $("#result1").append(coinmarket.exchageRowTop(index, item, coinmarket.pageIndex));
                    $("#result2").append(coinmarket.exchageRow(index, item, coinmarket.pageIndex));
                });
                $('#title_coin').text(data.title.split('-')[1] + "-市场行情");
            },
            error: function () {
                if (coinmarket.pageIndex > 0) {
                    coinmarket.pageIndex--;
                }
            }
        });
    },
    scroll: function () {
        $(window).scroll(function () {
            if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                coinmarket.dataAjax();
            }
        })
    },
    process: function () {
        coinmarket.dataAjax();
        coinmarket.scroll();
    }

}
var exchangedetails = {
    detail: function (detail) {
        if (detail.icon) {
            $("div.cover img").attr("src", detail.icon + ".jpg");
            $('.info h1').text(detail.title);
            for (var i = 0; i < detail.star; i++) {
                $(".gread").append("<i class='star'></i>");
            }
            $('#valtopMoney').text("");
            $('#valtopMoney').append('￥' + util.toThousands(detail.price.cny) + '<span class="tag blue">排名:' + detail.rank + '</span>');
            $('.country').empty();
            $('.country').append('<a href="exchange.html?code=' + detail.country.code + '">' + detail.country.title + '</a>');
            $('#subM').empty()
            $('#subM').append('≈' + util.toThousands(detail.price.usd) + '&nbsp;&nbsp;&nbsp;≈' + util.toThousands(detail.price.btc) + 'BTC')//
            $('.jyd').text(detail.coinCount)
            $('.gfwz').empty();
            $('.gfwz').append('<a href="' + detail.wetsitHref + '" rel="nofollow" target="_blank">' + detail.wetsitTitle + '</a>');
            $('.messagede').empty();
            $('.messagede').append(detail.description);
            $('.fymessage').empty();
            $('.fymessage').append(detail.costDescription);

        }
    },
    cointop: function (list) {
        $("#tablefixed").empty();
        $(list).each(function (index, item) {
            $("#tablefixed").append('<tr>'
                + '<td>' + (index + 1) + '</td>'
                + '  <td><a href="currencies.html?currency=' + item.coin.code + '">'
                + '         <img src="' + item.coinIcon + '" alt="' + item.coin.title + '"> ' + item.coin.title + '</a></td>'
                + '</tr>');
        });
    },
    coin: function (list) {
        $("#tableMain").empty();
        $(list).each(function (index, item) {
            $("#tableMain").append('<tr>'
                + '<td>' + (index + 1) + '</td>'
                + '<td>'
                + '  <a href="currencies.html?currency=' + item.coinCode + '">'
                + '       <img src="' + item.coinIcon + '" alt="' + item.coin.title + '"> ' + item.coin.title + '</a>'
                + '</td>'
                + '<td>' + item.transaction.title + '</td>'
                + '<td class="price" data-usd="' + item.price.usd + '" data-cny="' + item.price.cny + '" data-btc="' + item.price.btc + '" data-native="' + item.price.native + '">' + item.price.init + '</td>'
                + '<td>' + item.ammount + '</td>'
                + '<td class="volume" data-usd="' + item.volume.usd + '" data-cny="' + item.volume.cny + '" data-btc="' + item.volume.btc + '" data-native="' + item.volume.native + '">' + item.volume.init + ' </td>'
                + '<td>' + item.exchange.proportion + '%</td>'
                + '<td>' + item.time + '</td>'
                + '   <td><div class="more add" onclick="addlogin();">添加自选</div></td>'
                + '</tr>');
        });
    },
    chart: function () {
        $('#piechart_coinvol').highcharts({
            legend: {
                itemStyle: {
                    color: '#666',
                    fontWeight: 'normal',
                },
                itemWidth: 80,
                symbolRadius: 0
            },
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: ''
            },
            tooltip: {
                headerFormat: '{series.name}<br>',
                pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: '币种成交额占比'
            }]

        });
        var siteCode = $("#HSiteCode").val();
        var pieArr = [];

    },
    loadPiechartCoinvol: function (code) {
        $.ajax({
            url: BASE_URL + "mapi/mobile/exchange_coinvol",
            type: "GET",
            dataType: 'json',
            data: "currency=" + code,
            success: function (data) {
                var pieArr = [];
                $(data).each(function (index, item) {
                    pieArr.push([item.name, item.y]);
                });
                $('#piechart_coinvol').highcharts().series[0].setData(pieArr);
            }
        });
    },
    dataAjax: function (code) {
        $.ajax({
            url: BASE_URL + "mapi/mobile/getExchangeDetail?currenty=" + code,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                exchangedetails.detail(data.detail);
                exchangedetails.coin(data.code);
                exchangedetails.cointop(data.code);
            }
        });
    },
    process: function () {
        var currenty = GetRequest().currenty;
        exchangedetails.dataAjax(currenty);
        exchangedetails.chart();
        exchangedetails.loadPiechartCoinvol(currenty);
    }
};

