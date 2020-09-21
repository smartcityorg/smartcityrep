import request from '@/utils/request'

// 查询设备信息列表
export function listDevice(query) {
  return request({
    url: '/sys/device/list',
    method: 'get',
    params: query
  })
}

// 查询设备详细
export function getDevice(deviceId) {
  return request({
    url: '/sys/device/' + deviceId,
    method: 'get'
  })
}

// 新增设备信息
export function addDevice(data) {
  return request({
    url: '/sys/device/create',
    method: 'post',
    data: data
  })
}

// 修改设备信息
export function updateDevice(id,data) {
  return request({
    url: '/sys/device/update/' + id,
    method: 'put',
    data: data
  })
}

// 删除设备信息
export function delDevice(id) {
  return request({
    url: '/sys/device/deleteByIds/' + id,
    method: 'delete'
  })
}

// 导出设备信息
export function exportDevice(query) {
  return request({
    url: '/sys/device/export',
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

// 查询设备信息列表
export function deviceTypeInfo(dictType) {
  return request({
    url: '/sys/device/deviceTypeInfo/' + dictType,
    method: 'get'
  })
}

// 查询所有设备列表
export function listAllDevice() {
  return request({
    url: '/sys/device/listAll',
    method: 'get'
  })
}
