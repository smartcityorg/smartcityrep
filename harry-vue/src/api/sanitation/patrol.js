import request from '@/utils/request'

// 查询巡查排班信息列表
export function listPatrol(query) {
  return request({
    url: '/sanitation/patrol/list',
    method: 'get',
    params: query
  })
}

// 查询巡查排班详细
export function getPatrol(patrolId) {
  return request({
    url: '/sanitation/patrol/' + patrolId,
    method: 'get'
  })
}

// 新增巡查排班信息
export function addPatrol(data) {
  return request({
    url: '/sanitation/patrol/create',
    method: 'post',
    data: data
  })
}

// 修改巡查排班信息
export function updatePatrol(id,data) {
  return request({
    url: '/sanitation/patrol/update/' + id,
    method: 'put',
    data: data
  })
}

// 删除巡查排班信息
export function delPatrol(id) {
  return request({
    url: '/sanitation/patrol/deleteByIds/' + id,
    method: 'delete'
  })
}

// 导出巡查排班信息
export function exportPatrol(query) {
  return request({
    url: '/sanitation/patrol/export',
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
