import request from '@/utils/request'

// 查询巡查时段信息列表
export function listPatrolDate(query) {
  return request({
    url: '/sanitation/patroldate/list',
    method: 'get',
    params: query
  })
}

// 查询巡查时段详细
export function getPatrolDate(patrolDateId) {
  return request({
    url: '/sanitation/patroldate/' + patrolDateId,
    method: 'get'
  })
}

// 新增巡查时段信息
export function addPatrolDate(data) {
  return request({
    url: '/sanitation/patroldate/create',
    method: 'post',
    data: data
  })
}

// 修改巡查时段信息
export function updatePatrolDate(id,data) {
  return request({
    url: '/sanitation/patroldate/update/' + id,
    method: 'put',
    data: data
  })
}

// 删除巡查时段信息
export function delPatrolDate(id) {
  return request({
    url: '/sanitation/patroldate/deleteByIds/' + id,
    method: 'delete'
  })
}

// 导出巡查时段信息
export function exportPatrolDate(query) {
  return request({
    url: '/sanitation/patroldate/export',
    method: 'get',
    params: query
  })
}

// 获取字典选择框列表
export function optionselect() {
  return request({
    url: '/sys/dict/optionselect',
    method: 'get'
  })
}
