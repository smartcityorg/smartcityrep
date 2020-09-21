import request from '@/utils/request'

// 查询作业任务信息列表
export function listCleaningTask(query) {
  return request({
    url: '/sanitation/cleaningtask/list',
    method: 'get',
    params: query
  })
}

// 查询作业任务详细
export function getCleaningTask(cleaningTaskId) {
  return request({
    url: '/sanitation/cleaningtask/' + cleaningTaskId,
    method: 'get'
  })
}

// 新增作业任务信息
export function addCleaningTask(data) {
  return request({
    url: '/sanitation/cleaningtask/create',
    method: 'post',
    data: data
  })
}

// 修改作业任务信息
export function updateCleaningTask(id,data) {
  return request({
    url: '/sanitation/cleaningtask/update/' + id,
    method: 'put',
    data: data
  })
}

// 删除作业任务信息
export function delCleaningTask(id) {
  return request({
    url: '/sanitation/cleaningtask/deleteByIds/' + id,
    method: 'delete'
  })
}

// 导出作业任务信息
export function exportCleaningTask(query) {
  return request({
    url: '/sanitation/cleaningtask/export',
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
