[TOC]

# 首页列表字段
## currencyInfo

字段|类型|说明|备注
-|-|-|-
id|待定|标识列-
currencyName|string|币种名称|-
currencyEN|string|币种英文名称|此名称作为链接跳转功能标识使用
currencyIconSmall|string|小图标|-
currencyIcon|string|大图标|-
currencyType|int|显示币种|1:人民币(CNY),2:美元(USD),3:比特币(BTC),4:以太坊(ETH),5:日元(JPY),6:韩币(KRW),7:港币(HKD),8:卢布(RUB),9:卢比(INR),10:澳元(AUD),11:欧元(EUR),12:法郎(CHF),13:英镑(GBP),14:加元(CAD),15:印尼盾(IDR),16:巴西雷亚尔(BRL),17:比索(MXN)
marketCap|decimal(3)|流通市值|-
marketAll|decimal(3)|总市值|-
price|decimal(3)|价格|-
circulationNum|decimal(0)|流通数量|-
circulationAllNum|decimal(0)|总数量|
turnover|decimal(3)|成交额(24H)|-
rose|decimal(2)|涨幅(24H)|-
trend|string[N]|价格趋势(7d)|-
platformName|string|平台名称|-
platformUrl|string|平台链接地址|-

#主页所有货币借口
* api/currency/currencyindexAll
* POST 请求
* 提交数据
```javascript
{
    "pageSize":100,     //页面大小  可为空
    "page":1,           //页数      可为空
    "keyword":"",       //搜索关键字 可为空
    "sort"：""          //排序字段  可为空
}
```

* 返回数据
```javascript
{
    "code":"0",     //返回CODE代码
    "page":1,
    "error":null,
    "items":[
                {
                    "id":"**",
                    "currencyName":"BTC-比特币",
                    "currencyEN":"bitcoin",
                    "currencyIconSmall":"",
                    "currencyIcon":"",
                    "currencyType":1,
                    "marketCap":123123.000,
                    "marketAll":12312,
                    "price":123123.000,
                    "circulationNum":123123,
                    "circulationAllNum":123123.000,
                    "turnover":123123,
                    "rose":5.00,        //百分比数据
                    "trend":[1,2,3,4,5,6,7,8,8],
                    "platformName":"***",
                    "platformUrl":"****"
                }
    ]
}
```