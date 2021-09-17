<template>
  <div>
        <CCard>
          <CCardHeader>
            不合格项管理
          </CCardHeader>
          <CCardBody>
            <CTabs :active-tab="0">
              <CTab title="项目版本" active> 
                <CDataTable
                  :items="versionList"
                  :fields="versionFields"
                  :sorter="true"
                  :tableFilter='{ label:"搜索",placeholder:"输入任意信息检索" }'
                  :noItemsView='{ noResults: "无结果", noItems: "无测试项目" }'
                  cleaner
                  :items-per-page="5"
                  hover
                  :pagination="{ doubleArrows: true, align: 'center'}"
                >
                <template #opt_details="{item, index}">
                    <td class="py-2"  v-if="checkPerm('CHECK')">
                      <CButton
                        color="success"
                        variant="outline"
                        square
                        size="sm"
                        style="width:50px"
                        @click="exportVersionNopass(item)"
                      >
                      导出
                      </CButton>
                    </td>
                  </template>
                </CDataTable>


              </CTab>
              <CTab title="任务" active>
                <CCard>
                  <CCardBody>
                    <CDataTable
                      :items="taskList"
                      :fields="taskFields"
                      :items-per-page="8"
                      :tableFilter='{ label:"搜索",placeholder:"输入任意信息检索" }'
                      :noItemsView='{ noResults: "无结果", noItems: "无测试任务" }'
                      hover
                      :pagination="{ doubleArrows: true, align: 'center'}"
                    >
                      <template #state="{item}">
                        <td>
                          <CBadge :color="getBadge(item.state)" style="fontSize:14px;height:25px;line-height:20px">
                            {{item.state | taskStateFilter}}
                          </CBadge>
                        </td>
                      </template>
                      <template #opt_exportNoPass="{item, index}">
                        <td class="py-2" v-if="checkPerm('CHECK')">
                          <CButton
                            color="success"
                            variant="outline"
                            square
                            size="sm"
                            style="width:50px"
                            @click="downloadTaskNopa(item,index)"
                          >
                          导出
                          </CButton>
                        </td>
                      </template>

                    </CDataTable>
                  </CCardBody>
                </CCard>
              </CTab>
            </CTabs>
          </CCardBody>
        </CCard>
  </div>
</template>

<script>
import { taskStateFilter , targetDateFilter } from '../../utils/filters';
import { getTaskList , checkTask ,deleteTask,createTask} from "../../api/testTask";
import {getSoftwareList} from '../../api/software'
import { getPlanList } from "../../api/testPlan";
import { checkPermission } from "../../utils/permission";
import { getUserList } from "../../api/user";
import { getTestNoPass , downloadNopassFile , downloadTaskNopassFile} from "../../api/testNoPass";


export default {
  name: 'softwareTestNoPass',
  data() {
    return {
      taskList:[],
      taskFields:[
        { key: 'title', label: '任务名称', _style:'min-width:300px' },
        { key: 'description',label: '描述',_style:'min-width:200px'},
        { key: 'software_name',label: '所属软件', _style:'min-width:200px' },
        { key: 'version',label: '所属版本', _style:'min-width:100px' },
        { key: 'plan_name',label: '所属计划', _style:'min-width:200px' },
        { key: 'state',label: '状态',sorter: false,filter: false,_style:'min-width:100px;' },
        // { key: 'create_time',label: '创建时间', _style:'min-width:100px;' },
        // { key: 'update_time',label: '更新时间', _style:'min-width:100px;' },
                // { key: 'create_time',label: '创建时间', _style:'min-width:100px;' },
                { key: 'fail_num',label: '不合格项数量', _style:'min-width:150px;' },
        { key: 'opt_exportNoPass',label: '不合格项', _style:'min-width:10px;' },
      ],
      versionList:[
      ],
      versionFields : [
                { key: 'software_name', label: '软件名称', _style:'min-width:200px;' },
                { key: 'version_number',label: '版本号', _style:'min-width:200px;' },
                { key: 'fail_num',label: '不合格项数量', _style:'min-width:100px;' },
                // { key: 'create_time',label: '创建时间', _style:'min-width:100px;' },
                { 
                  key: 'opt_details', 
                  label: '不合格项', 
                  _style: 'min-width:50px;', 
                  sorter: false, 
                  filter: false
                }
      ],
      software_id:''
    };
  },
  mounted(){
    this.software_id = localStorage.getItem('softwareId')
    this.getVersionNopass();
    this.getTasks('','',this.software_id,'','');
    
  },
  filters:{taskStateFilter},
  computed:{
  },
  watch:{
  },
  methods: {
    getBadge (status) {
      switch (status) {
        case 0: return 'secondary'
        case 1: return 'success'
        case 2: return 'primary'
        default: 'primary'
      }
    },
    getTasks(title,state,software_id,executor_id,sort){
      getTaskList(title,state,software_id,executor_id,sort).then(res=>{
        console.log("获取任务列表",res);
        this.taskList = targetDateFilter(res);
      })
    },
    checkPerm(permission){
      return checkPermission(localStorage.getItem('identity'),permission);
    },
    exportNoPassReport(item,index){
      console.log(item);
    },
    getVersionNopass(){
      getTestNoPass(this.software_id,'').then(res=>{
        this.versionList = res
        console.log(res,"xxxddd");
      })
    },
    exportVersionNopass(item,index){
      console.log(item,"itemddd");
      downloadNopassFile(item.software_id,'2',item.version_number).then(res=>{
        window.open(`/api/v1/software/${item.software_id}/versions?type=${2}&version_number=${item.version_number}`)
        // console.log(res,"导出结果");
      })
    },
    downloadTaskNopa(item){
      console.log(item,'dddd');
      downloadTaskNopassFile(item.id,'2').then(res=>{
        window.open(`/api/v1/test-tasks/${item.id}/case-file?type=2`)
        // console.log(res,"导出任务结果");
      })
    }
  },
};
</script>

<style scoped>

</style>
