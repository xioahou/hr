import request from '@/utils/request'
export function roleList(params) {
  return request({
    url: '/sys/role',
    params
  })
}
// 根据id查询企业
export function EnterpriseInquiries(companyId) {
  return request({
    url: `/company/{companyId}`
  })
}
// 根据ID删除角色
export function deleteRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}
// 根据ID更新角色
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}
// 根据ID获取角色详情
export function roleDetail(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'get'
  })
}
// 新增角色
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}
