// 查询企业的部门列表
import request from '@/utils/request'
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}
// 删除部门
export function DeleteDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'DELETE'
  })
}
// 新增部门
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
// 查询部门详细
export function departmentDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}
// 编辑部门
export function commitEdit(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}
