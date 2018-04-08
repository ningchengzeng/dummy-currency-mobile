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
        var uri = BASE_URL + "api/currency/HomeCoinMaxChange";
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
        var uri = BASE_URL + "api/currency/hotconcept";
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
        return "<tr style='height: 20px;' id=\"" + data["code"] + "\">" +
            "<td>" + data["index"] + "</td>" +
            "<td>" +
            "<a href=\"currencies.html?currency=" + data["code"] + "\" target=\"_blank\">" +
            "<img src=\"" + data["icon"] + "\" alt=\"" + data["title"] + "\">" + data["title"] +
            "</a>" +
            "</td>" +
            "<td class=\"market-cap\" data-usd=\"" + data["circulation"]["usd"] + "\" data-cny=\"" + data["circulation"]["cny"] + "\" data-btc=\"" + data["circulation"]["btc"] + "\">" + data["circulation"]["init"] + "</td>" +
            "<td>" +
            " <a href=\"currencies.html?currency=" + data["code"] + "\" target=\"_blank\" class=\"price\" data-usd=\"" + data["price"]["usd"] + "\" data-cny=\"" + data["price"]["usd"] + "\"" +
            "   data-btc=\"" + data["price"]["btc"] + "\">" + data["price"]["init"] + "</a>" +
            " </td>" +
            " <td>" + data["amount"] + "</td>" +
            " <td>" +
            " <a href=\"currencies.html?currency=" + data["code"] + "\" target=\"_blank\" class=\"volume\" " +
            "data-usd=\"" + data["circulation"]["usd"] + "\"" +
            "data-cny=\"" + data["circulation"]["usd"] + "\" " +
            "data-btc=\"" + + data["circulation"]["usd"] + + "\">" + data["circulation"]["init"] + "</a>" +
            "</td>" +
            "<td class=\"change\">" +
            "  <span class=\"text-green\">" + data["circulationRate"] + "</span>" +
            " </td>" +
            " <td class=\"change\">" +
            "   <span class=\"text-green\">" + data["roseRate"]["day"] + "</span>" +
            "</td>" +
            "</tr>";
    },
    page: {
        pageReader: function () {
            $("div.pageList").empty();

            if (index.pageCurrent == 1) {
                $("div.pageList").append('<a href=\'#\' class=\'btn btn-white\' onclick="index.page.prev()"><</a>' +
                    '<a href="#" class="btn btn-white">首页</a>' +
                    '<a class=\'btn btn-white\' onclick="index.page.next()" href=\'#\'>></a>');
            } else if (index.pageCurrent == index.pageCount - 1) {
                $("div.pageList").append('<a href=\'#\' class=\'btn btn-white\' onclick="index.page.prev()"><</a>' +
                    '<a href="#" class="btn btn-white">尾页</a>' +
                    '<a class=\'btn btn-white\' onclick="index.page.next()" href=\'#\'>></a>');
            } else {
                $("div.pageList").append('<a href=\'#\' class=\'btn btn-white\' onclick="index.page.prev()"><</a>' +
                    '<a href="#" class="btn btn-white">第' + index.pageCurrent + '页</a>' +
                    '<a class=\'btn btn-white\' onclick="index.page.next()" href=\'#\'>></a>');
            }
        },
        next: function () {
            if (index.pageCurrent < index.pageSize) {
                index.pageCurrent++;
            }
            index.page.pageReader();
            index.ajaxData();
        },
        prev: function () {
            if (index.pageCurrent > 1) {
                index.pageCurrent--;
            }
            index.page.pageReader();
            index.ajaxData();
        }
    },
    ajaxData: function () {
        if (window.interval) {
            window.clearInterval(window.interval);
            delete window.interval;
        }
        exchange.page.pageReader();

        var data = function () {
            var urip = BASE_URL + "api/currency/indexAll?pageSize=" + index.pageSize + "&page=" + index.pageCurrent;
            $.ajax({
                url: urip,
                type: "GET",
                dataType: 'json',
                success: function (data) {
                    index.pageCount = Math.ceil(data.count / index.pageSize);
                    $("div.boxContain table#table tbody").empty();
                    $(data.result).each(function (indexData, item) {
                        $("div.boxContain table#table tbody").append(index.row(item));
                    });
                }
            });
        };

        data();
        window.interval = window.setInterval(data, 1000 * 2);
    },
    process: function () {
        index.ajaxData();
        util.loadHomeNewCoin(); //新币
        util.loadHomevolrank(); //销售量排行
        util.loadHomeCoinMaxChange(); //自大交易
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
