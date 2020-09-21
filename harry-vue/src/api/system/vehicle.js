import request from '@/utils/request'
import { praseStrEmpty } from "@/utils/harry";

// 查询车辆列表
export function listVehicle(query) {
  return request({
    url: '/sys/vehicle/list',
    method: 'get',
    params: query
  })
}

// 查询车辆详细
export function getVehicle(vehicleId) {
  return request({
    url: '/sys/vehicle/info/' + praseStrEmpty(vehicleId),
    method: 'get'
  })
}

// 新增用户
export function addVehicle(data) {
  return request({
    url: '/sys/vehicle/create',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateVehicle(vehicleId,data) {
  return request({
    url: '/sys/vehicle/update/' + vehicleId,
    method: 'put',
    data: data
  })
}

// 删除用户
export function delVehicle(vehicleId) {
  return request({
    url: '/sys/vehicle/deleteByIds/' + vehicleId,
    method: 'delete'
  })
}

// 导出用户
export function exportVehicle(query) {
  return request({
    url: '/sys/vehicle/export',
    method: 'get',
    params: query
  })
}

// 用户状态修改
export function changeVehicleStatus(vehicleId, status) {
  const params = {
    status
  }
  return request({
    url: '/sys/vehicle/update/status/' + vehicleId,
    method: 'put',
    params: params
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/sys/vehicle/importTemplate',
    method: 'get'
  })
}

// 查询所有车辆列表
export function listAllVehicle() {
  return request({
    url: '/sys/vehicle/listAll',
    method: 'get'
  })
}