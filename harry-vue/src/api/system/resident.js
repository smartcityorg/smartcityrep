import request from '@/utils/request'

// 查询居民信息列表
export function listResident(query) {
  return request({
    url: '/sys/resident/list',
    method: 'get',
    params: query
  })
}










