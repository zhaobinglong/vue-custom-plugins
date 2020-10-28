import request from '@/utils/request'

export function uploadFile(data) {
  return request({
    url: '/upload_alibaba_cloud.php', // 假地址 自行替换
    method: 'post',
    data
  })
}
