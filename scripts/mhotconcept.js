function loadmhotconcept(conceptid) {
//    var url = "//mapi.feixiaohao.com/";
    //var url = "http://api.feixiaohao.com/";

    var data3={"result1":"超级算力市场预测平台币数据经济侧链概念内容版权游戏概念社交通讯","result2":"XEL¥1.9619.48%¥1,640万GNT¥1.610.9%¥4,494万RLC¥7.372.39%¥1,436万SNM¥0.8646-2.21%¥540万"};
    if (null != data3.result1 && data3.result1.length > 0) {
        $("#hotconcept").html("");
        $("#hotconcept").append(data3.result1);
        coinConceptSlide();
        $('body').on('click', "#hotconcept a", function () {
            if ($(this).hasClass('active')) {
                return;
            }
            $('#hotconcept a').removeClass('active');
            $(this).addClass('active')

        })
    }
    if (null != data3.result2 && data3.result2.length > 0) {
        $("#hotconceptCoinTable").html("");
        $("#hotconceptCoinTable").append(data3.result2);
    }
    // $.ajax({
    //     url: url + "v2/mhotconcept/" + conceptid + "/",
    //     async: true,
    //     dataType: "json",
    //     success: function (data) {

            
    //     }
    // });
}
var length = 0
function coinConceptSlide() {
    length = $('.hotidea a').length;

    var max = Math.ceil(length / 4);
    var d = 292;
    var page = 1;
    $('.slideBar .slideright').click(function () {
        if (page < max) {
            $('.hotidea>div').eq(0).animate({ 'margin-left': -292 * page + 'px' }, 500)
            page++;
        }
    });
    $('.slideBar .slideleft').click(function () {
        if (page != 1) {
            page--;
            $('.hotidea>div').eq(0).animate({ 'margin-left': -292 * (page - 1) + 'px' }, 500)
        }
    })
}