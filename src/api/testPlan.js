import request from '@/utils/request'

//创建测试计划
export function createPlan(formData) {
    return request({
      url: `/v1/test-plans/`,
      method: 'POST',
      data:formData
      //software_id,version_number,title,description,files,creator
    })
}
//查看测试计划
export function checkPlan(id) {
    return request({
      url: `/v1/test-plans/${id}`,
      method: 'GET'
    })
}
//删除测试计划
export function deletePlan(id) {
    return request({
      url: `/v1/test-plans/${id}`,
      method: 'DELETE',
    })
}
//编辑测试计划
export function editPlan(id,formData) {
    return request({
      url: `/v1/test-plans/${id}`,
      method: 'PUT',
      data:formData
      //title,state,description,files
    })
}
//获取计划列表
export function getPlanList(creator_id,title,state,software_id,sort) {
    return request({
      url: `/v1/test-plans/`,
      method: 'GET',
      params:{
          creator_id,
          title,
          state,
          software_id,
          sort
      }
    })
}
