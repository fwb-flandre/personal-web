const qiniu = require('qiniu')

// 创建上传凭证
const accessKey = 'PZPLgLe9596iq2NF4Ls0Ob8FCxwiHo-w-N5BWYB1'    //accessKey 
const secretKey = 'Ovy16eE5fj9HaPBWNFNj93hfgoXc9bOS0frbXkHA'    //secretKey 
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const options = {
    scope: 'flandre',         //对象存储空间名字
    expires: 3600 * 24
}
const putPolicy = new qiniu.rs.PutPolicy(options)
const uploadToken = putPolicy.uploadToken(mac)
 
module.exports = {
    uploadToken
}