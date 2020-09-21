import request from '@/utils/request'

// 查询质量标准列表
export function listQuality(query) {
  return request({
    url: '/sys/quality/list',
    method: 'get',
    params: query
  })
}

// 查询质量标准
export function getQuality(qualityId) {
  return request({
    url: '/sys/quality/' + qualityId,
    method: 'get'
  })
}

// 新增质量标准
export function addQuality(data) {
  return request({
    url: '/sys/quality/create',
    method: 'post',
    data: data
  })
}

// 修改质量标准
export function updateQuality(id,data) {
  return request({
    url: '/sys/quality/update/' + id,
    method: 'put',
    data: data
  })
}

// 删除质量标准
export function delQuality(id) {
  return request({
    url: '/sys/quality/deleteByIds/' + id,
    method: 'delete'
  })
}

// 导出质量标准
export function exportQuality(query) {
  return request({
    url: '/sys/quality/export',
    method: 'get',
    params: query
  })
}

// 质量标准状态修改
export function changeQualityStatus(qualityId, status) {
  const params = {
    status
  }
  return request({
    url: '/sys/quality/update/status/' + qualityId,
    method: 'put',
    params: params
  })
}