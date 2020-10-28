let OSS = require('ali-oss');

let client = new OSS({
  accessKeyId: 'your access key',   // 你创建的Bucket时获取的
  accessKeySecret: 'your access secret',  // 你创建的Bucket时获取的
  bucket: 'your bucket name',  // 你创建的Bucket名称
  region: 'oss-cn-hangzhou'   //  你所购买oss服务的区域，默认oss-cn-hangzhou
});

// 上传
export async function put (filePath, file) {
  try {
    let result = await client.put(filePath, file)
    return result
  } catch (err) {
    console.log(err)
  }
}

// 删除
export async function remove (filePath) {
  try {
    let result = await client.delete(filePath)
    return result
  } catch (err) {
    console.log(err)
  }
}