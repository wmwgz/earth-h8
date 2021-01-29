var arguments = process.argv.splice(2);
const [AccessKey, SecretKey, Bucket] = arguments || []

if (!AccessKey || !SecretKey || !Bucket) {
  return console.error('AccessKey, SecretKey or Bucket is empty.');
}

var qiniu = require("qiniu");

var config = new qiniu.conf.Config();
// 空间对应的机房
// config.zone = qiniu.zone.Zone_z2;
// 是否使用https域名
config.useHttpsDomain = true;
// 上传是否使用cdn加速
config.useCdnDomain = true;

var localFile = "./earth.png"; // 本地文件地址
var key = 'earth/earth.png'; // 七牛云存储地址
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();

var mac = new qiniu.auth.digest.Mac(AccessKey, SecretKey);
var options = {
  scope: Bucket,
};
var putPolicy = new qiniu.rs.PutPolicy(options);
var uploadToken = putPolicy.uploadToken(mac);

// 文件上传
formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr,
  respBody, respInfo) {
  if (respErr) {
    throw respErr;
  }
  if (respInfo.statusCode == 200) {
    console.log('上传成功', respBody);
  } else {
    console.log('上传失败', respInfo.statusCode, respBody);
  }
});