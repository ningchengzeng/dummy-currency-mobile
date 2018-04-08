function series_is_visible(chartName, index, defaultState) {
    var preferences = Cookies.getJSON("highcharts_" + chartName);
    if (preferences === undefined) {
        return defaultState;
    }
    return preferences[index];
}
function tooltip_format_market_cap() {
    val = format_market_cap(this.y);
    return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>' + val + ' USD</b><br/>'
}
function tooltip_format_crypto() {
    val = this.y;
    return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>' + val + '</b><br/>'
}

function tooltip_format_fiat() {
    val = this.y;
    return '<span style="color:' + this.color + '">\u25CF</span> ' + this.series.name + ': <b>' + val + '</b><br/>'
}



function label_format_fiat() {
    val = this.y;
    return val;
}

function is_mobile() {

    var mobile = $("#metadata").data("mobile");
    return mobile == "True"
}
function HighChartsGraph(graphId, loadingId, noDataId) {
    this.graphId = graphId;
    this.loadingId = loadingId;
    this.noDataId = noDataId;
}

HighChartsGraph.prototype.init = function (start, end) {
    var that = this;
    that.fetchAndLoad(that.initCharts, start, end)
}
HighChartsGraph.prototype.chartsLoaded = function () {
    var chart = $("#" + this.graphId).highcharts();
    return chart !== undefined;
}
HighChartsGraph.prototype.hideLoading = function () {
    $("#" + this.loadingId).hide();
}
HighChartsGraph.prototype.showNoData = function () {
    $("#" + this.noDataId).removeClass('hidden');
}
HighChartsGraph.prototype.afterSetExtremes = function (e) {
    if (e.dataMin != e.min || e.dataMax != e.max) {
        that = this;
        var min = Math.round(e.min);
        var max = Math.round(e.max);
        that.updateCharts(min, max)
    }
}
HighChartsGraph.prototype.updateCharts = function (min, max) {
    var that = this;
    var chart = $('#' + that.graphId).highcharts();
    chart.showLoading('');
    that.fetchAndLoad(that.finishUpdateCharts, min, max);
}
HighChartsGraph.prototype.finishUpdateCharts = function (seriesData) {
}
HighChartsGraph.prototype.fetchAndLoad = function (callback, start, end) {
}
HighChartsGraph.prototype.initCharts = function (seriesData) {
}
function GbiGraph(graphId, loadingId, noDataId) {
    HighChartsGraph.call(this, graphId, loadingId, noDataId);

}
GbiGraph.prototype = new HighChartsGraph;
GbiGraph.constructor = GbiGraph;
GbiGraph.prototype.finishUpdateCharts = function (seriesData) {
    var that = this;
    var chart = $('#' + that.graphId).highcharts();
    chart.series[0].setData(seriesData["coinrank"]);
    chart.hideLoading();
}
GbiGraph.prototype.fetchAndLoad = function (callback, start, end) {
    var coincode = $("#coincode").val();
    var that = this;
    //var apiDomain = "//mapi.feixiaohao.com";
    timeParams = ""
    if (start !== undefined && end !== undefined) {
        timeParams = start + "/" + end + "/";
    }

    var data2={"coinrank": []};

    if(undefined!=data2 && null!=data2)
			{
				if(data2.coinrank.length>=1)
				{
					$("#coinrankBox").css("display","block");
				}					
			}
        callback.call(that, data2);
             
    // $.ajax({
    //     url: apiDomain + "/coinrank/" +coincode+"/"+ timeParams,
    //     type: "GET",
    //     dataType: "json",
    //     error: function () {
    //         that.hideLoading();
    //         that.showNoData();
    //     },
    //     success: function (data) {
			
			 
    //     }
    // });
}
GbiGraph.prototype.initCharts = function (seriesData) {
    var that = this;
    Highcharts.setOptions({
        global: { useUTC: false },
        lang: {
            downloadJPEG: "下载jpg",
            downloadPDF: '下载pdf',
            downloadPNG: '下载png',
            downloadSVG: '下载svg',
            loading: '',
            months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
            printChart: '打印图表',
            shortMonths: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
           
            rangeSelectorZoom: "缩放",
            resetZoom: "恢复初始缩放等级",
            resetZoomTitle: " 1:1缩放等级",
            shortWeekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            weekdays: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
            numericSymbols: ["千", "百万", '十亿'],
            thousandsSep: ","
        }
    });
    var titleName =   $("#coinname").val()+"历史排名趋势图"; 
    $('#' + that.graphId).highcharts('StockChart', {
        chart: { type: 'line', zoomType: is_mobile() ? 'null' : 'x',  ignoreHiddenSeries: true },
        tooltip: { shared: true, hideDelay: 50, xDateFormat: '%A, %b %d %Y' },
        legend: {
            enabled: false,
            align: 'center',
            backgroundColor: '#FFFFFF',
            borderColor: 'black',
            borderWidth: 0,
            layout: 'horizontal',
            verticalAlign: 'bottom',
            y: 0,
            shadow: false,
            floating: false
        },
        navigator: { adaptToUpdatedData: false },
        scrollbar: { liveRedraw: false },
        title: { text: "", align: "left", style: { fontSize: "24px" } },
        subtitle: { text: '' },
      
        xAxis: [{
            dateTimeLabelFormats: {
                day: '%Y<br/>%m-%d',
                week: '%Y<br/>%m-%d',
                month: '%Y-%m',
                year: '%Y'
            },
            events: {
                afterSetExtremes: function (e) {
                    that.afterSetExtremes(e)
                }
            }, minRange: 24 * 3600 * 1000
        }],
        yAxis: [{
            labels: { formatter: label_format_fiat, style: { color: '#666666', }, align: "left", x: -30 },
            title: { text: '', style: { color: '#666666', 'font-weight': 'bold' } },
            showEmpty: false,
            height: '100%',
            opposite: true,
            floor: 0,
            min: 1, 
            reversed: true
        }],
        series: [{
            name: $("#coinname").val()+"排名",
            yAxis: 0,
            color: '#85BCEB',
            tooltip: { pointFormatter: tooltip_format_fiat },
            data: seriesData["coinrank"],
            dataGrouping: { enabled: false }
        }],
        plotOptions: {
            series: {
                events: {
                    legendItemClick: function (event) {
                        var index = event.target.index
                        save_preferences(that.chartName, index, this.chart);
                    }
                }
            }
        },
    });
    that.hideLoading();
}

$(document).ready(function () {
    $(function () {
        var gbiGraph = new GbiGraph("highcharts-graph_coinrank", "highcharts-loading_coinrank", "highcharts-nodata_coinrank");
        gbiGraph.init();

    });

});