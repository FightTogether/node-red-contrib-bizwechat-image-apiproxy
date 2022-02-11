#### #基于[企业微信节点](https://flows.nodered.org/node/node-red-contrib-bizwechat "企业微信节点")的图片上传补丁节点,可生成返回图片url供后续使用.

就是把原企业微信节点的临时素材上传功能拆出来小改了下,版权归属原作者@FlashSoft.
先要安装了企业微信节点,再安装这个,安装后会看到面板里多了一个上传图片节点.
企业微信节点有上传临时素材节点,但返回的是素材的媒体ID,不是直接的url,这个是返回的url.
有什么用呢,好像也没啥用,当图床?
好处是在微信中发图片url链接访问比较快,毕竟图片存在微信服务器里,而且点击链接后,微信不会弹出"*非微信官方网页,请确认是否继续访问*."的页面.


------------


##### ###### 以下为企业微信官方文档介绍
上传图片得到图片URL，该URL永久有效
返回的图片URL，仅能用于图文消息正文中的图片展示，或者给客户发送欢迎语等；若用于非企业微信环境下的页面，图片将被屏蔽。
每个企业每月最多可上传3000张图片，每天最多可上传1000张图片
图片文件大小应在 5B ~ 2MB 之间.

------------

###### 各人自行测试,我测试时使用范围没有限制,复制url到电脑浏览器可以打开图片,复制到手机浏览器用流量也可以打开图片.
###### 范例流程
---

```json
[
    {
        "id": "20ca8e2608570347",
        "type": "tab",
        "label": "流程 1",
        "disabled": false,
        "info": "",
        "env": []
    },
    {
        "id": "6873e21f435665d6",
        "type": "bizwechat-configurator",
        "name": "家庭通告板",
        "port": "30001",
        "corpid": "wwaAAAAAAAAAAAAA",
        "agentid": "1000003",
        "corpsecret": "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBB",
        "url": "http://www.xxxxxxx.com",
        "token": "ccccccccccccccccccccccccccccccccc",
        "aeskey": "ddddddddddddddddddddddddddddddddddddddd",
        "client_id": "",
        "client_secret": ""
    },
    {
        "id": "2f4c544bf5d50bcb",
        "type": "debug",
        "z": "20ca8e2608570347",
        "name": "",
        "active": true,
        "tosidebar": true,
        "console": false,
        "tostatus": false,
        "complete": "true",
        "targetType": "full",
        "statusVal": "",
        "statusType": "auto",
        "x": 610,
        "y": 360,
        "wires": []
    },
    {
        "id": "cc79f5c47fe76990",
        "type": "file in",
        "z": "20ca8e2608570347",
        "name": "",
        "filename": "",
        "format": "",
        "chunk": false,
        "sendError": false,
        "encoding": "none",
        "allProps": false,
        "x": 420,
        "y": 200,
        "wires": [
            [
                "58d07d2e96ef8827"
            ]
        ]
    },
    {
        "id": "5ccf309821487ebc",
        "type": "inject",
        "z": "20ca8e2608570347",
        "name": "",
        "props": [
            {
                "p": "filename",
                "v": "/home/3.jpg",
                "vt": "str"
            }
        ],
        "repeat": "",
        "crontab": "",
        "once": false,
        "onceDelay": 0.1,
        "topic": "",
        "x": 290,
        "y": 160,
        "wires": [
            [
                "cc79f5c47fe76990"
            ]
        ]
    },
    {
        "id": "58d07d2e96ef8827",
        "type": "bizwechat-image",
        "z": "20ca8e2608570347",
        "name": "",
        "bizwechat": "6873e21f435665d6",
        "x": 500,
        "y": 280,
        "wires": [
            [
                "2f4c544bf5d50bcb"
            ]
        ]
    }
]
```



