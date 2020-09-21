import request from '@/utils/request'

// 查询保洁时段信息列表
export function listCleaningDate(query) {
  return request({
    url: '/sanitation/cleaningdate/list',
    method: 'get',
    params: query
  })
}

// 查询保洁时段详细
export function getCleaningDate(cleaningDateId) {
  return request({
    url: '/sanitation/cleaningdate/' + cleaningDateId,
    method: 'get'
  })
}

// 新增保洁时段信息
export function addCleaningDate(data) {
  return request({
    url: '/sanitation/cleaningdate/create',
    method: 'post',
    data: data
  })
}

// 修改保洁时段信息
export function updateCleaningDate(id,data) {
  return request({
    url: '/sanitation/cleaningdate/update/' + id,
    method: 'put',
    data: data
  })
}

// 删除保洁时段信息
export function delCleaningDate(id) {
  return request({
    url: '/sanitation/cleaningdate/deleteByIds/' + id,
    method: 'delete'
  })
}

// 导出保洁时段信息
export function exportCleaningDate(query) {
  return request({
    url: '/sanitation/cleaningdate/export',
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
