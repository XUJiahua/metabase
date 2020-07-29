### 概览

0. 对接灵犀SSO系统。
1. 灵犀用户有BI权限才能登录BI平台（通过对接接口检查）。
2. 灵犀用户只能SSO登录，无法密码登录。
3. 灵犀用户的BI平台ID生成规则：`lingxi_{mid}_{uid}@cardinfolink.com`
4. 灵犀用户无法更新生成的邮箱地址及密码，可以修改自己的FirstName/LastName（默认生成值：商户名称，"灵犀商户"）。
5. 灵犀用户自动加入通用看板组（管理员界面先配置）。

### LingXi SSO 集成

1. 配置，在SSO系统登记

{
    "name" : "metabase",
    "appId" : "T1010", -- 应用ID
    "desc" : "",
    "domain" : "220.248.13.226", -- user-info接口白名单限制
    "loginCallback" : "http://metabase-test.xunliandata.com:3000/api/user/lingxi/callback", -- 回调，SSO 通知 metabase
    "logoutCallback" : ""
}

2. 前端点击链接

http://metabase-test.xunliandata.com:3000/api/session/lingxi_auth

3. 服务端唤起SSO登录（302）

https://auth.xunliandata.com/v1/user/auth?appId=T1010&next=%s

example:
https://auth.xunliandata.com/v1/user/auth?appId=T1010&next=/

4. SSO登录成功，服务端收到回调 (302)

http://metabase-test.xunliandata.com:3000/api/session/lingxi_auth_callback?next={}

直接取cookie中的gsessionid作为token。（metabase需要与SSO同一个根域名）
next登录成功后的跳转地址。

5. 服务端获取用户信息

https://auth.xunliandata.com/v1/user/token/user_info?scope=userInfo&appId=T1010&token=%s

example:
https://auth.xunliandata.com/v1/user/token/user_info?scope=userInfo&appId=T1010&token=a4a49ceb3ef24cd98337a1de0e3e5add
{
    "status": 200,
    "message": "",
    "user": {
        "channelType": 0,
        "level": 0,
        "lxUserId": "19949",
        "username": "9920180608roar10",
        "password": "",
        "realName": "嘉华的小店",
        "userPhone": "",
        "userEmail": "",
        "userType": 7,
        "userStatus": 2,
        "mistakeCount": 0,
        "merName": "喵喵喵",
        "passwordExpired": false,
        "loginToken": "",
        "reviveToken": "",
        "platform": 6,
        "lgFlag": 0,
        "displayUserPhone": "",
        "merchantCode": "2088502222729252",
        "loginCount": 5,
        "insCode": "",
        "insName": "",
        "secondInsCode": "",
        "secondInsName": "",
        "clientId": "152421327267530",
        "userId": "2088502222729252"
    },
    "tencentGateway": {}
}

6. check permission

curl -H "api-access-token:SV7ORKG5TDBAU2J1" https://auth2.xunliandata.com/privilege/api/user/getPermissionIdList\?merchantCode\=2088502222729252

278w 权限代号

https://www.yuque.com/qb5h00/sr49h1/idipbf#4wJ6X

#### reference

1. API docs https://sso.ipay.so/swagger/
2. 时序图（流程已经变动很大，参考大体流程） https://www.yuque.com/qb5h00/sr49h1/lzwvsy
