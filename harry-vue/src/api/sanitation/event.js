import request from '@/utils/request'

// 查询事件列表
export function listEvent(query) {
  return request({
    url: '/sanitation/event/list',
    method: 'get',
    params: query
  })
}

// 查询事件详细信息
export function getlistEvent(eventId) {
  return request({
    url: '/sanitation/event/' + eventId,
    method: 'get'
  })
}


// 获取字典选择框列表
export function optionselect() {
  return request({
    url: '/sys/dict/optionselect',
    method: 'get'
  })
}