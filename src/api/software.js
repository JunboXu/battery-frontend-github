import request from '@/utils/request'

//获取测试项目列表
export function getSoftwareList(name,type,sort) {
    return request({
      url: `/v1/software`,
      method: 'GET',
      params:{
        name,
        type,
        sort
      }
    })
}

//查看测试项目
export function checkSoftware(id) {
  return request({
    url: `/v1/software/${id}`,
    method: 'GET'
  })
}

//编辑测试项目
export function editSoftware(id,formData) {
  return request({
    url: `/v1/software/${id}`,
    method: 'PUT',
    data:formData
  })
}

//删除测试项目
export function deleteSoftware(id) {
  return request({
    url: `/v1/software/${id}`,
    method: 'DELETE'
  })
}

//新建测试项目
export function createSoftware(formData) {
  return request({
    url: `/v1/software/`,
    method: 'POST',
    data:formData
  })
}

//生成测试报告
export function exportReport(id) {
  return request({
    url: `/v1/software/${id}/report`,
    method: 'GET',
  })
}

