import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}


export function getRoles() {
  return request({
    url: '/wechat.php?ctrl=api&action=getUserList',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/vue-element-admin/role',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  data.roles = data.roles.join(',')
  return request({
    url: '/wechat.php?ctrl=api&action=editUser',
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}
