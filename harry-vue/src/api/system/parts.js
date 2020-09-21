import request from '@/utils/request'

// 查询部件信息列表
export function listParts(query) {
  return request({
    url: '/sys/parts/list',
    method: 'get',
    params: query
  })
}

// 查询部件详细
export function getParts(partsId) {
  return request({
    url: '/sys/parts/' + partsId,
    method: 'get'
  })
}

// 新增部件信息
export function addParts(data) {
  return request({
    url: '/sys/parts/create',
    method: 'post',
    data: data
  })
}

// 修改设备信息
export function updateParts(id,data) {
  return request({
    url: '/sys/parts/update/' + id,
    method: 'put',
    data: data
  })
}

// 删除设备信息
export function delParts(id) {
  return request({
    url: '/sys/parts/deleteByIds/' + id,
    method: 'delete'
  })
}

// 导出设备信息
export function exportParts(query) {
  return request({
    url: '/sys/parts/export',
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

// 部件状态修改
export function changePartsStatus(partsId, status) {
  const params = {
    status
  }
  return request({
    url: '/sys/parts/update/status/' + partsId,
    method: 'put',
    params: params
  })
}

// 查询所有部件列表
export function listAllParts() {
  return request({
    url: '/sys/parts/listAll',
    method: 'get'
  })
}
