import request from '@/utils/request'

//创建测试计划
export function getLog(entity_class,action,executor_username,executor_identify,sort,dontGet) {
    return request({
        url: `/v1/log-info/`,
        method: 'GET',
        params:{
            entity_class,action,executor_username,executor_identify,sort,dontGet
        }
    })
}