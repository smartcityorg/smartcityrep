import request from '@/utils/request'

// 查询部件类型息列表
export function listPartsType(query) {
  return request({
    url: '/sys/partstype/list',
    method: 'get',
    params: query
  })
}

// 查询部件类型详细
export function getPartsType(partsTypeId) {
  return request({
    url: '/sys/partstype/' + partsTypeId,
    method: 'get'
  })
}

// 新增部件类型信息
export function addPartsType(data) {
  return request({
    url: '/sys/partstype/create',
    method: 'post',
    data: data
  })
}

// 修改部件类型信息
export function updatePartsType(id,data) {
  return request({
    url: '/sys/partstype/update/' + id,
    method: 'put',
    data: data
  })
}

// 删除部件类型信息
export function delPartsType(id) {
  return request({
    url: '/sys/partstype/deleteByIds/' + id,
    method: 'delete'
  })
}

// 导出设备信息
export function exportPartsType(query) {
  return request({
    url: '/sys/partstype/export',
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

// 车辆类型状态修改
export function changePartsTypeStatus(partsTypeId, status) {
  const params = {
    status
  }
  return request({
    url: '/sys/partstype/update/status/' + partsTypeId,
    method: 'put',
    params: params
  })
}

// 查询所有部件类型
export function listAllPartstype() {
  return request({
    url: '/sys/partstype/listAll',
    method: 'get'
  })
}
