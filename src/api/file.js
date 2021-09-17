import request from '@/utils/request'

//新增文件
export function appendFile(formData) {
    return request({
        url: `/v1/files/`,
        method: 'POST',
        data:formData
        //type,plan_id,task_id,files
        //plan_statement
        //task_statement
    })
}

//删除文件
export function deleteFile(type,plan_id,task_id,file_id) {
    return request({
        url: `/v1/files/`,
        method: 'DELETE',
        params:{
            type,plan_id,task_id,file_id
        }
        //type,plan_id,task_id,file_id
        //plan_statement
        //task_statement
    })
}