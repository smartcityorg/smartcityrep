import request from '@/utils/request'

// 查询考勤统计列表
export function listAttence(query) {
  return request({
    url: '/sanitation/attence/list',
    method: 'get',
    params: query
  })
}

// 查询考勤统计详细信息
export function getAttence(attenceId) {
  return request({
    url: '/sanitation/attence/' + attenceId,
    method: 'get'
  })
}


// 导出考勤统计信息
export function exportAttence(query) {
  return request({
    url: '/sanitation/attence/export',
    method: 'get',
    params: query
  })
}
