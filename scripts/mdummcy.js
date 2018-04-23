var BASE_URL = "http://localhost:81/";

/**
 * 工具处理
 * @type {{loadHomeNewCoin: util.loadHomeNewCoin, loadHomevolrank: util.loadHomevolrank, loadHomeCoinMaxChange: util.loadHomeCoinMaxChange, loadconcept: util.loadconcept}}
 */
var util = {
    loadHomeNewCoin: function () {
        var uri = BASE_URL + "api/currency/homenewcoin";
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
        var uri = BASE_URL + "api/currency/showmarket";
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
        var uri = BASE_URL + "api/currency/homevolrank";
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
    row: function (data) {

    },
    page: {

    },
    ajaxData: function () {

    },
    process: function () {

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
            + '<td><a href="' + data.exchangeHref + '" target="_blank">' + data.exchangeTitle + '</a></td>'
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
            "        <a href=\"" + data.exchangeHref + "\" target=\"_blank\">" +
            "            <img height='15' width='18' src=\"" + data.exchangeIcon + ".jpg\" alt=\"" + data.exchangeTitle + "\">" + data.exchangeTitle + "</a>" +
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
            "    <td>" + data.proportion + "</td>" +
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
            $('#upOrDown').text(data.floatRate);//
            $('#remark').text('');
            $('#remark').append(data.describe);


            $('#cnName').text(data.title.en);
            $('#enName').text(data.title.cn);
            $('#level3').text("第" + data.twenty.price.ranking + "名");
            $('#sjjys').text(data.ticker.count + "家");// 交易所
            $('#fxtime').text(data.date); // 上架时间

            $('#qqzsz').text(util.toThousands(data.marketCapitalization));
            $('#ltl').text(util.toThousands(data.amount.circulationRate));
            $('#hsl').text(data.twenty.price.rate);

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

        //热门概念
        if (data.concept) {
            $(data.concept).each(function (index, item) {
                $("li#concept span.value").append("<a href=\"conceptcoin.html?id=" + item.index + "\" target=\"_blank\">" + item.title + "</a>");
            });
        } else {
            $("li#concept").hide();
        }

        if (data.funding) {
            $("li#funding span.value").append('<a href="#ico">' + data.funding.price + '</a>');
            if (data.funding.up != "") {
                $("li#funding span.value").append('<span class="tags-ico">' + data.funding.up + '</span>');
            }

            currencies.icoAjax(data.code, function (data) {
                if (data) {
                    console.log(data);
                    $("div#icotable table")
                        .append('<tr>' +
                            '    <th>状态</th>' +
                            '    <th>代币平台</th>' +
                            '    <th>ICO分配<div class="toolTips"><div class="text">T：团队/合作伙伴/贡献者，B:赏金，C：基金会，O:其他</div></div></th>' +
                            '    <th>投资者占比(%)<div class="toolTips"><div class="text">众筹目标的百分比，不是货币总量的百分比</div></div></th>' +
                            '    <th>ICO总量</th>' +
                            '    <th>ICO发售量</th>' +
                            '</tr>' +
                            '<tr>' +
                            '    <td>' + data.state + '</td>' +
                            '    <td>' + data.amount + '</td>' +
                            '    <td>' + data.distribution + '</td>' +
                            '    <td>' + data.proportion + '</td>' +
                            '    <td>' + data.volume + '</td>' +
                            '    <td>' + data.salesVolume + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '    <th>众筹起始时间</th>' +
                            '    <th>众筹结束时间</th>' +
                            '    <th>开售价格</th>' +
                            '    <th>众筹方式</th>' +
                            '    <th>众筹目标</th>' +
                            '    <th>众筹金额</th>' +
                            '</tr>' +
                            '<tr>' +
                            '    <td>' + data.startDate + '</td>' +
                            '    <td>' + data.endDate + '</td>' +
                            '    <td>' + data.price + '</td>' +
                            '    <td>' + data.method + '</td>' +
                            '    <td>' + data.object + '</td>' +
                            '    <td>' + data.platform + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '    <th>众筹均价</th>' +
                            '    <th>成功众筹数量</th>' +
                            '    <th>成功众筹金额</th>' +
                            '    <th>特点</th>' +
                            '    <th>安全审计</th>' +
                            '    <th>法律形式</th>' +
                            '</tr>' +
                            '<tr>' +
                            '    <td>' + data.argPrice + '</td>' +
                            '    <td>' + data.successAmount + '</td>' +
                            '    <td>' + data.successPrice + '</td>' +
                            '    <td>' + data.characteristic + '</td>' +
                            '    <td>' + data.audit + '</td>' +
                            '    <td>' + data.law + '</td>' +
                            '</tr>' +
                            '<tr>' +
                            '    <th>管辖区域</th>' +
                            '    <th>法律顾问</th>' +
                            '    <th>代售网址</th>' +
                            '    <th>Blog地址</th>' +
                            '    <th></th>' +
                            '    <th></th>' +
                            '</tr>' +
                            '<tr>' +
                            '    <td>' + data.area + '</td>' +
                            '    <td>' + data.lawer + '</td>' +
                            '    <td><a href=\'' + data.website + '\' target=\'_blank\' rel=\'nofollow\'>' + data.website + '</a></td>' +
                            '    <td><a href=\'' + data.blogSite + '\' target=\'_blank\' rel=\'nofollow\'>' + data.blogSite + '</a></td>' +
                            '    <td></td>' +
                            '    <td></td>' +
                            '  </tr>');
                    $("div#icotable").show();
                }
            });

        } else {
            $("li#funding").hide();
        }

        if (data.assets) {
            $("li#assets span.value").append(data.assets);
        } else {
            $("li#assets").hide();
        }

        if (data.assetsPlatform) {
            $("li#assetsPlatform span.value").append(data.assetsPlatform);
        } else {
            $("li#assetsPlatform").hide();
        }
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
                $('#mpiechart_coinvol').highcharts().series[0].setData(pieArr);
            }
        });
    },
    chart: function () {
        drawPie('#piechar1', Math.round(Hands) / 100, '#3cc9cb');
        if (MarketcapPercent > 0.1) {
            var Percent1 = $("#Percent1").val();
            drawPie('#piechar2', Math.round(Percent1) / 100, '#41ce48');
        }
        else if (MarketcapPercent < 0.1) {
            drawPie('#piechar22', 0.1, '#41ce48');
        }

        drawPie('#piechar3', Math.round(Supply) / 100, '#ff8080');

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
        var coinCode = GetRequest().currency.split('/')[0];
        var pieArr = [];

    },
    process: function () {
        currencies.chart();
        var coinCode = GetRequest().currency.split('/')[0];
        currencies.loadCoinEvent(coinCode);
        currencies.loadPiechartCoinvol(coinCode);
        currencies.dataAjax(coinCode);

        //util.loadhander();
        // util.showmarket();
        util.loadconcept(0);//热门概念
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
var exchange = {
    pageCount: 1,
    pageSize: 20,
    pageCurrent: 1,

    row: function (index, item) {
        if (item.title) {
            return '<li>'
                + '<div class="con"><a target="_blank" href="exchangedetails.html?currenty=' + item.code + '" class="pic"><img src="' + item.icon + '.jpg"></a>'
                + '<div class="info">'
                + '<div class="tit">'
                + '<a target="_blank" href="exchangedetails.html?currenty=' + item.code + '"><b>' + item.title + '</b></a>'
                + '<div class="star star' + item.star + ' style="float: right"></div>'
                + '</div>'
                + '<div class="des">' + item.desc + '</div>'
                + '<i class="space"></i>国家:'
                + '<a href="' + item.countryHref + '">' + item.countryTitle + '</a>'
                + '<a href=\ "{0}\"></a>'
                + '<a href=\ "{0}\"></a>'
                + '<i class="space"></i>成交额(24h):'
                + '<a href="exchangedetails.html?currenty=' + item.code + '">¥1,808,720万</a>支持：'
                + '<span class="tag">' + exchange.setIValue(item) + '</span>'
                + '</div>'
                + '</div>'
                + '</div>'
                + '</li>';
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
    page: {
        pageReader: function () {
            $("div.pageList").empty();

            if (exchange.pageCurrent == 1) {
                $("div#pageList").append('<a href=\'#\' class=\'btn btn-white\' onclick="exchange.page.prev()"><</a>' +
                    '<a href="#" class="btn btn-white">首页</a>' +
                    '<a class=\'btn btn-white\' onclick="exchange.page.next()" href=\'#\'>></a>');
            } else if (exchange.pageCurrent == exchange.pageCount - 1) {
                $("div#pageList").append('<a href=\'#\' class=\'btn btn-white\' onclick="exchange.page.prev()"><</a>' +
                    '<a href="#" class="btn btn-white">尾页</a>' +
                    '<a class=\'btn btn-white\' onclick="exchange.page.next()" href=\'#\'>></a>');
            } else {
                $("div#pageList").append('<a href=\'#\' class=\'btn btn-white\' onclick="exchange.page.prev()"><</a>' +
                    '<a href="#" class="btn btn-white">第' + exchange.pageCurrent + '页</a>' +
                    '<a class=\'btn btn-white\' onclick="exchange.page.next()" href=\'#\'>></a>');
            }
        },
        next: function () {
            if (exchange.pageCurrent < exchange.pageSize) {
                exchange.pageCurrent++;
            }
            exchange.page.pageReader();
            exchange.ajaxData();
        },
        prev: function () {
            if (exchange.pageCurrent > 1) {
                exchange.pageCurrent--;
            }
            exchange.page.pageReader();
            exchange.ajaxData();
        }
    },
    ajaxData: function () {
        var uri = BASE_URL + "api/currency/getExchange";
        exchange.page.pageReader();
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            data: "pagesize=" + exchange.pageSize + "&page=" + exchange.pageCurrent,
            success: function (data) {
                exchange.pageCount = Math.ceil(data.count / index.pageSize);

                $('#itemsList').empty();
                $(data.result).each(function (index, item) {
                    $('#itemsList').append(exchange.row(index, item));
                });
            }
        });
    },
    process: function () {
        util.loadHomevolrank();
        util.loadHomeNewCoin();
        util.loadHomevolrank();
        exchange.ajaxData();
    }
};

/**
 * concept.html
 * 概念行情
 * @type {{}}
 */
var concept = {
    row: function (data) {
        return "<tr>" +
            "<td>" +
            "<a href=\"conceptcoin.html?id=" + data.index + "\" target=\"_blank\">" + data.title + "</a></td>" +
            "<td>" + data.price24H + "</td>" +
            "<td class=\"text-red\">" + data.avrUpDown + "</td>" +
            "<td title=\"" + data.up.title + "\">" +
            "   <a href=\"currencies.html?currency=" + data.up.code + "\" target=\"_blank\">" + data.up.title + "</a>" +
            "   <span class=\"tags-green\">" + data.up.amount + "</span>" +
            "</td>" +
            "<td title=\"" + data.down.title + "\">" +
            "   <a href=\"currencies.html?currency=" + data.down.code + "\" target=\"_blank\">" + data.down.title + "</a>" +
            "   <span class=\"tags-red\">" + data.down.amount + "</span>" +
            "</td>" +
            "<td>" + data.coin.count + "</td>" +
            "<td>" +
            "   <span class=\"text-green\">" + data.coin.up + "</span>/<span class=\"text-red\">" + data.coin.down + "</span>" +
            "</td>" +
            "</tr>";
    },
    dataAjax: function () {
        var uri = BASE_URL + "api/currency/getConcept";
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                $('div.boxContain table.table3.ideaTabel tbody').empty();
                $(data).each(function (indexData, item) {
                    $('div.boxContain table.table3.ideaTabel tbody').append(concept.row(item));
                });
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
        $("#title").append(desc.title);
        $("#avrUpDown").append(desc.avrUpDown);
        $("#coinCount").append(desc.coin.count);
        $("#coinUp").append(desc.coin.up);
        $("#coinDown").append(desc.coin.down);

        $("#up").attr("title", desc.up.title);
        $("#upTitle").append(desc.up.title);
        $("#upTitle").attr("href", "currencies.html?currency=" + desc.up.code);
        $("#upAmount").append(desc.up.amount);

        $("#down").attr("title", desc.down.title);
        $("#downTitle").append(desc.down.title);
        $("#downTitle").attr("href", "currencies.html?currency=" + desc.up.code);
        $("#downAmount").append(desc.down.amount);
    },
    row: function (data) {
        return '<tr id="iota">' +
            '<td>' + data['index'] + '</td>' +
            '<td>' +
            '   <a href="currencies.html?currency=' + data["code"] + '" target="_blank">' +
            '   <img src="' + data['icon'] + '" alt="' + data['title'] + '">' + data['title'] + '</a>' +
            '</td>' +
            '<td class="market-cap" ' +
            '   data-usd="' + data['marketCap']["usd"] + '" ' +
            '   data-cny="' + data['marketCap']["cny"] + '" ' +
            '   data-btc="' + data['marketCap']["btc"] + '">' + data['marketCap']["init"] + '</td>' +
            '<td>' +
            ' <a href="details.html#markets" target="_blank" class="price" ' +
            '   data-usd="' + data['price']["usd"] + '" ' +
            '   data-cny="' + data['price']["cny"] + '"' +
            '   data-btc="' + data['price']["btc"] + '">' + data['price']["init"] + '</a>' +
            '</td>' +
            '<td>' + data['index'] + '</td>' +
            '<td>' +
            '<a href="details.html#markets" target="_blank" ' +
            '   class="volume" ' +
            '   data-usd="' + data['exchange24H']["usd"] + '" ' +
            '   data-cny="' + data['exchange24H']["cny"] + '"' +
            '   data-btc="' + data['exchange24H']["btc"] + '">' + data['exchange24H']["init"] + '</a>' +
            '</td>' +
            '<td class="change">' +
            '<span class="text-green">' + data['updown24H'] + '</span>' +
            '</td>' +
            '<td class="char">' +
            '<span class=\'{"stroke": "#3ca316"}\'>' + data['char7day'] + '</span>' +
            '</td>' +
            '</tr>';
    },
    dataAjax: function (index) {
        var uri = BASE_URL + "api/currency/getConceptCoin?index=" + index;
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            success: function (data) {
                if (data.desc) {
                    coneptCoin.baseReader(data.desc);

                    $('div.boxContain table.table3 tbody').empty();
                    $(data.list).each(function (indexData, item) {
                        $('div.boxContain table.table3 tbody').append(concept.row(item));
                    });
                }
            }
        });
    },
    process: function (index) {
        util.loadHomeCoinMaxChange();//涨跌幅
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
                if (data.result1.length > 0) {
                    $("#result1").append(data.result1);
                    $("#result2").append(data.result2);
                } else {
                    monthrank.pageIndex = 1;
                }
                $('.loading2').css("display", "none"); //显示加载时候的提示
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


/**
 *
 * @type {{}}
 */
var mexchange = {
    pageIndex: 0,
    dataAjax: function () {
        mexchange.pageIndex++;
        var uri = BASE_URL + "mapi/mobile/mexchange?page=" + mexchange.pageIndex;
        $.ajax({
            url: uri,
            type: "GET",
            dataType: 'json',
            beforeSend: function () {
                $('.loading2').css("display", "block"); //显示加载时候的提示
            },
            success: function (data) {
                if (data.result1.length > 0) {
                    $("#tablefixed").append(data.result1);
                    $("#tableMain").append(data.result2);
                } else {
                    mexchange.pageIndex = 1;
                }
                $('.loading2').css("display", "none"); //显示加载时候的提示
            },
            error: function () {
                if (mexchange.pageIndex > 0) {
                    mexchange.pageIndex--;
                }
            }
        });
    },
    scroll: function () {
        $(window).scroll(function () {
            if ($(document).scrollTop() >= $(document).height() - $(window).height()) {
                mexchange.dataAjax();
            }
        })
    },
    process: function () {
        mexchange.dataAjax();
        mexchange.scroll();
    }
};
