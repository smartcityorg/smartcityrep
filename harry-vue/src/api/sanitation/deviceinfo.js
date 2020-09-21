import request from '@/utils/request'

// 查询硬件设备接口数据
export function getDeviceLocationInfo() {
  return request({
    url: '/sanitation/device/getDeviceLocation',
    method: 'get'
  })
}
