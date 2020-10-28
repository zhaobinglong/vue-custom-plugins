import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/wechat.php?ctrl=api&action=getList',
    method: 'post',
    data
  })
}

export function getDocument(data) {
  return request({
    url: '/wechat.php?ctrl=api&action=getDocument',
    method: 'post',
    data
  })
}

export function downLoadDocument(data) {
  return request({
    url: '/wechat.php?ctrl=api&action=downLoadDocument',
    method: 'post',
    data
  })
}

// export function fetchPv(pv) {
//   return request({
//     url: '/vue-element-admin/article/pv',
//     method: 'get',
//     params: { pv }
//   })
// }

// 编辑文档
export function editDocument(data) {
  return request({
    url: '/wechat.php?ctrl=api&action=editDocument',
    method: 'post',
    data
  })
}

// 编辑文档
export function delDocument(data) {
  return request({
    url: '/wechat.php?ctrl=api&action=changeStatus',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/vue-element-admin/article/update',
    method: 'post',
    data
  })
}
