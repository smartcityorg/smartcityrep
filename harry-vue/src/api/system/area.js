import request from '@/utils/request'

// 查询区域列表
export function listArea(query) {
  return request({
    url: '/sys/area/list',
    method: 'get',
    params: query
  })
}

// 查询区域详细
export function getArea(areaId) {
  return request({
    url: '/sys/area/' + areaId,
    method: 'get'
  })
}

// 查询区域下拉树结构
export function treeselect() {
  return request({
    url: '/sys/area/treeselect',
    method: 'get'
  })
}


// 新增区域
export function addArea(data) {
  return request({
    url: '/sys/area/create',
    method: 'post',
    data: data
  })
}

// 修改区域
export function updateArea(id,data) {
  return request({
    url: '/sys/area/update/' + id,
    method: 'put',
    data: data
  })
}

// 删除区域
export function delArea(areaId) {
  return request({
    url: '/sys/area/delete/' + areaId,
    method: 'delete'
  })
}
