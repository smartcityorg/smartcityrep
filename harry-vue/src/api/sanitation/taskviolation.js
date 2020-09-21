import request from '@/utils/request'

// 查询任务违规信息列表
export function listTaskViolation(query) {
  return request({
    url: '/sanitation/taskviolation/list',
    method: 'get',
    params: query
  })
}

// 查询任务违规详细
export function getTaskViolation(taskViolationId) {
  return request({
    url: '/sanitation/taskviolation/' + taskViolationId,
    method: 'get'
  })
}

// 新增任务违规信息
export function addTaskViolation(data) {
  return request({
    url: '/sanitation/taskviolation/create',
    method: 'post',
    data: data
  })
}

// 修改任务违规信息
export function updateTaskViolation(id,data) {
  return request({
    url: '/sanitation/taskviolation/update/' + id,
    method: 'put',
    data: data
  })
}

// 删除任务违规信息
export function delTaskViolation(id) {
  return request({
    url: '/sanitation/taskviolation/deleteByIds/' + id,
    method: 'delete'
  })
}

// 导出任务违规信息
export function exportTaskViolation(query) {
  return request({
    url: '/sanitation/taskviolation/export',
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

// 任务违规状态修改
export function changeViolationStatus(taskViolationId, status) {
  const params = {
    status
  }
  return request({
    url: '/sanitation/taskviolation/update/status/' + taskViolationId,
    method: 'put',
    params: params
  })
}
