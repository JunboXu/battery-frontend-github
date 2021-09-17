import request from '@/utils/request'

//创建测试任务
export function login(formData) {
    return request({
      url: `/v1/users/`,
      method: 'PUT',
      data:formData
    })
}

//获取用户列表
export function getUserList(user_id) {
  return request({
    url: `/v1/users/`,
    method: 'GET',
    params:{
      user_id
    }
  })
}

//获取个人信息
export function getProfile(user_id) {
  return request({
    url: `/v1/users/${user_id}`,
    method: 'GET',
  })
}


//更新个人信息
export function updateProfile(user_id,formData) {
  return request({
    url: `/v1/users/${user_id}`,
    method:'PUT',
    data:formData
  })
}