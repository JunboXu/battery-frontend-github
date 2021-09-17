import request from '@/utils/request'

//新建版本
export function createVersion(id,formData) {
    return request({
      url: `/v1/software/${id}/versions`,
      method: 'POST',
      data:formData
      //version file
    })
}
//删除版本
export function deleteVersion(id,version_number) {
    return request({
      url: `/v1/software/${id}/versions`,
      method: 'DELETE',
      params:{
        version_number
      }
    })
}
//编辑版本
export function editVersion(id,formData) {
    return request({
      url: `/v1/software/${id}/versions`,
      method: 'PUT',
      data:formData
      //version_id  file
    })
}