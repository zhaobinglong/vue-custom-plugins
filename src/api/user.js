import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/wechat.php?ctrl=api&action=login',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: '/wechat.php?ctrl=api&action=getInfo',
    method: 'post',
    data
  })
}

export function logout(data) {
  return request({
    url: '/wechat.php?ctrl=api&action=getInfo',
    method: 'post',
    data
  })
}
