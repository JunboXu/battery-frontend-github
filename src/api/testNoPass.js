import request from '@/utils/request'

//获取版本不合格项
export function getTestNoPass(software_name,sort) {
    return request({
        url: `/v1/software/versions`,
        method: 'GET',
        params:{
            software_name,sort
        }

    })
}
//导出不合格项文件 type 0:全部 1:已执行  2:不合格
export function downloadNopassFile(software_id,type,version_number) {
    return request({
        url: `/v1/software/${software_id}/versions`,
        method: 'GET',
        params:{
            type,version_number
        }
        //type,plan_id,task_id,files
        //plan_statement
        //task_statement
    })
}

//导出不合格项文件 type 0:全部 1:已执行  2:不合格
export function downloadTaskNopassFile(taskid,type) {
    return request({
        url: `/v1/test-tasks/${taskid}/case-file`,
        method: 'GET',
        params:{
            type
        }
        //type,plan_id,task_id,files
        //plan_statement
        //task_statement
    })
}