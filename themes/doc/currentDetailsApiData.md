[TOC]

# 详情页表字段
## currencyDetails

字段|类型|说明|备注
-|-|-|-
id|待定|标识列-
currencyName|string|币种名称|-
currencyEN|string|英文名|此名称作为链接跳转功能标识使用
currencyCN|string|中文名|
currencyIconSmall|string|小图标|-
currencyIcon|string|大图标|-
currencyType|int|显示币种|1:人民币(CNY),2:美元(USD),3:比特币(BTC),4:以太坊(ETH),5:日元(JPY),6:韩币(KRW),7:港币(HKD),8:卢布(RUB),9:卢比(INR),10:澳元(AUD),11:欧元(EUR),12:法郎(CHF),13:英镑(GBP),14:加元(CAD),15:印尼盾(IDR),16:巴西雷亚尔(BRL),17:比索(MXN)
marketCap|decimal(3)|流通市值|-
marketAll|decimal(3)|总市值|-
ranking|int|排名|
price|decimal(3)|价格|-
circulationNum|decimal(0)|流通数量|-
circulationAllNum|decimal(0)|总数量(总发行量)|
turnover|decimal(3)|成交额(24H)|-
rose|decimal(2)|涨幅(24H)|-
trend|string[N]|价格趋势(7d)|-
platformName|string|平台名称|-
platformUrl|string|平台链接地址|-
paper|string|白皮书URL|
exchange|int|上架多少个交易所|
issueTime|datatime|发行时间|
netUrl|string|网站URL 多个网站用","分割
areUrl|string|区块站Url|多个区块站用","分割
remark|text|详细介绍说明|

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


#详情页表查询接口
* api/currency/+"货币英文名"+details
* POST 请求
* 提交数据
```javascript
{
    null
}
```

* 返回数据
```javascript
{
    "code":"0",     //返回CODE代码
    "error":null,
    "items":[
                {
                    "id":"**",
                    "currencyName":"BTC-比特币",
                    "currencyEN":"bitcoin",
                    "currencyCN":"比特币",
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
                    "platformUrl":"****",
                    "issueTime":"2008-11-01"
                    "areUrl":"****,****,****",
                    "netUrl":"****,****,***",
                    "ranking":1,
                    "remark":"**************************"
                }
    ]
}
```


#详情页交易对成交量占比饼状图数据接口
* api/cointrades_percent/"货币英文名称"/
* POST 请求
* 返回数据
```javascript
[
    {"name":"JPY","y":10.66},
    {"name":"USD","y":10.14},
    {"name":"KRW","y":5.68},
    {"name":"EUR","y":2.74},
    {"name":"HT","y":1.44},
    {"name":"ATMC","y":1.25},
    {"name":"BNB","y":1.08},
    {"name":"ADA","y":1.07},
    {"name":"BTN","y":0.85},
    {"name":"其他","y":65.09}
]
```

#详情页市场行情曲线图数据接口 曲线图表
* api/coinhisdata/"货币英文名称"/
* POST 请求
* 返回数据
```javascript
{
    "market_cap_by_available_supply":[
                                        [1367174841000, 1500517590], 
                                        [1367261101000, 1575032004],
                                        ...
                                    ],
    "price_btc":[
                    [1367174841000, 1], 
                    [1367261101000, 1],
                    ...
                ],
    "price_usd":[
                    [1367174841000, 135.3], 
                    [1367261101000, 141.96], 
                    ...
                ],
    "vol_usd":[
                [1367174841000, 0], 
                [1367261101000, 0],
                ...
            ]
}
备注：4个数据值的长度必须一致
```

#详情页历史市值排名 曲线图表
* api/coinrank/"货币英文名称"/
* POST 请求
* 返回数据
```javascript
{
    "coinrank": [
                    [1367078400000,1],
                    [1367164800000,1],
                    [1367251200000,1],
                    [1367337600000,1],
                    [1367424000000,1],
                    [1367510400000,1],
                    [1367596800000,1]
                    ...
                ]
}
```

#详情页大事件接口
* api/coinevent/"货币英文名称"/
* POST 请求
* 返回数据
```javascript
{
    [
        {
            "time":""
            "No":2
            "textRemark":"比特币支付在印度大爆发，印度音乐节BTC付款占比1%"
        },
        {
            "time":""
            "No":1
            "textRemark":"在BCD上线之际再聊IFO"
        }
    ]
}
```