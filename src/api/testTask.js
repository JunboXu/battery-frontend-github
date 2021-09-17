import request from '@/utils/request'

//创建测试任务
export function createTask(formData) {
    return request({
      url: `/v1/test-tasks/`,
      method: 'POST',
      data:formData
      //software_id,version_number,title,description,files,creator
    })
}
//查看测试任务
export function checkTask(id) {
    return request({
      url: `/v1/test-tasks/${id}`,
      method: 'GET'
    })
}
//删除测试任务
export function deleteTask(id) {
    return request({
      url: `/v1/test-tasks/${id}`,
      method: 'DELETE',
    })
}
//编辑测试任务
export function editTask(id,formData) {
    return request({
      url: `/v1/test-tasks/${id}`,
      method: 'PUT',
      data:formData
      //title,state,description,files
    })
}
//获取测试任务列表
export function getTaskList(title,state,software_id,executor_id,sort) {
    return request({
      url: `/v1/test-tasks/`,
      method: 'GET',
      params:{
        executor_id,
        title,
        state,
        software_id,
        sort
      }
    })
}

//执行测试任务
export function excuteTask(id,formData) {
  return request({
    url: `/v1/test-tasks/${id}/case-file`,
    method: 'PUT',
    data:formData
  })
}

