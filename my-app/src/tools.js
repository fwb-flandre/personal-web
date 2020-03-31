var SMSClient = require('@alicloud/sms-sdk')

export function faceFormdata (url) {
  const apiKey = 'OFoe-8A0f2OH-WLv7kzzfumCurSxozSs'
  const apiSecret = '7BWYRR2L6s7DR9R3i2zZrVkXSdumpKDa'
  const imageUrl = url
  const formdata = new FormData()
  formdata.append('api_key', apiKey)
  formdata.append('api_secret', apiSecret)
  formdata.append('image_url', imageUrl)
  formdata.append('return_attributes', 'headpose')
  return formdata
}

// 此方法不如调用后台中的 api
export function sendSms (phone) {
  let str = '111'
  const accessKeyId = 'LTAI4FbsgUFk1Fs5n2HXucpJ'
  const secretAccessKey = 'NbQvqmPRY8io8yzb7V7LHAJMMxM3HI'
  // 初始化sms_client
  let smsClient = new SMSClient({accessKeyId, secretAccessKey})
  // 发送短信
  smsClient.sendSMS({
    PhoneNumbers: phone, // 必填:待发送手机号。支持以逗号分隔的形式进行批量调用，批量上限为1000个手机号码,批量调用相对于单条调用及时性稍有延迟,验证码类型的短信推荐使用单条调用的方式；发送国际/港澳台消息时，接收号码格式为：国际区号+号码，如“85200000000”
    // 以下短信签名和模板填入自己申请的即可
    SignName: 'flandre', // 必填:短信签名-可在短信控制台中找到
    TemplateCode: 'SMS_183797958', // 必填:短信模板-可在短信控制台中找到，发送国际/港澳台消息时，请使用国际/港澳台短信模版
    TemplateParam: `{"code":'${str}'}`// 可选:模板中的变量替换JSON串,如模板内容为"亲爱的${name},您的验证码为${code}"时。
  })
    .then(function (res) {
      console.log(res)
      if (res.Code === 'OK') {
        // 这里返回的数据自行确定
        let obj = {
          msg: 'ok',
          code: str // str是自行产生的手机验证码，返回到前端以做验证
        }
        res.json(obj)
        // 调试阶段打印出来便于调试
        console.log(res)
      }
    })
}

// 不满 10 则填充 0
export function addZero (date) {
  return date.toString().padEnd(2, '0')
}

// 根据当前时间获取随机数
export function getTimeRandom () {
  let date = new Date()
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  return addZero(year) + addZero(month) + addZero(day) + addZero(hour) + addZero(minute) + addZero(second)
}
