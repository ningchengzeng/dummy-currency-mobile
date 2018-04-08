function loadmhotconcept(conceptid) {
    $.ajax({
        url: baseUrl + "mapi/mobile/mhotconcept",
        async: true,
        dataType: "json",
        data:'conceptid='+conceptid,
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