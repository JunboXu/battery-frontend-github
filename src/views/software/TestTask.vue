<template>
  <div>
    <CCard>
      <CCardHeader>测试任务管理</CCardHeader>
      <CCardBody v-if="checkPerm('CREATE')">
        <CButton block color="primary" style="width:100px"  @click="createTaskModal = true" >+新建</CButton>
      </CCardBody>
    </CCard>
    <!-- 新建测试任务modal -->
    <CModal
      :show.sync="createTaskModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="primary"
    >
      <CInput
        label="名称"
        v-model="newTask.title"
        placeholder="请输入测试任务名称"
      />
      <CInput 
          label="描述"
          v-model="newTask.description"
          placeholder="输入测试任务描述"
      />
      <!-- <p style="marginBottom:10px;marginTop:10px">所属软件</p>
      <el-select disabled style="width:100%" @change="selectSoftware"  v-model="newTask.softwareId" clearable placeholder="请选择软件">
        <el-option
          v-for="item in softwareList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select> -->
      <p style="marginBottom:10px;marginTop:10px;">所属计划</p>
      <el-select style="width:100%" v-model="newTask.plan" clearable placeholder="请选择版本">
        <el-option
          v-for="item in plans"
          :key="item.id"
          :label="item.title"
          :value="item.id">
        </el-option>
      </el-select>
      <p style="marginBottom:10px;marginTop:10px">负责人</p>
      <el-select multiple :multiple-limit="3" style="width:100%" v-model="newTask.userList" clearable placeholder="请选择负责人">
        <el-option
          v-for="item in userList"
          :key="item.userid"
          :label="item.username"
          :value="item.userid">
        </el-option>
      </el-select>
      <p style="marginBottom:6px;marginTop:10px">请上传测试任务说明文档</p>
      <el-upload
        class="upload-demo"
        action=""
        :auto-upload="false"
        :limit="5"
        :multiple="true"
        ref="newTaskUploader"
        :file-list="fileList">
        <el-button size="small" style="backgroundColor:rgb(50,31,219);color:white">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">文件大小限制不超过20M,最多上传5个文件</div>
      </el-upload>
      <template #header>
        <h6 class="modal-title">新建测试任务</h6>
        <CButtonClose @click="createTaskModal = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="createTaskModal = false" color="danger">取消</CButton>
        <CButton @click="createNewTask" style="backgroundColor:rgb(50,31,219);color:white">新建</CButton>
      </template>
    </CModal>
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
          <template #opt_details="{item, index}">
            <td class="py-2" v-if="checkPerm('CHECK')">
              <CButton
                color="success"
                variant="outline"
                square
                size="sm"
                style="width:50px"
                @click="gotoTask(item, index)"
              >
              查看
              </CButton>
            </td>
          </template>
          <template #opt_delete="{item, index}">
            <td class="py-2" v-if="checkPerm('DELETE')">
              <CButton
                color="danger"
                variant="outline"
                square
                size="sm"
                style="width:50px"
                @click="deleteTaskFirstStep(item,index)">
                删除
              </CButton>
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>
    <!-- 删除测试任务modal -->
    <CModal
      :show.sync="deleteTaskModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="danger">
             <h5>你确定删除该任务吗？删除后将无法查看任何与该任务的相关信息！</h5> 
      <template #header>
        <h6 class="modal-title">删除测试任务</h6>
        <CButtonClose @click="deleteTaskModal = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="deleteTaskModal = false" color="danger">取消</CButton>
        <CButton @click="deleteTaskNow" style="backgroundColor:rgb(50,31,219);color:white">删除</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import { taskStateFilter , targetDateFilter } from '../../utils/filters';
import { getTaskList , checkTask ,deleteTask,createTask} from "../../api/testTask";
import {getSoftwareList} from '../../api/software'
import { getPlanList } from "../../api/testPlan";
import { checkPermission } from "../../utils/permission";
import { getUserList } from "../../api/user";


export default {
  name: 'softwareTestTask',
  filters:{
    taskStateFilter
  },
  data() {
    return {
      createTaskModal:false,
      deleteTaskModal:false,
      newTask:{},
      taskList:[],
      taskFields:[
        { key: 'title', label: '任务名称', _style:'min-width:100px' },
        { key: 'description',label: '描述',_style:'min-width:200px'},
        { key: 'software_name',label: '所属软件', _style:'min-width:100px' },
        { key: 'version',label: '所属版本', _style:'min-width:100px' },
        { key: 'plan_name',label: '所属计划', _style:'min-width:200px' },
        { key: 'state',label: '状态',sorter: false,filter: false,_style:'min-width:100px;' },
        // { key: 'creator', label: '创建者', _style:'min-width:100px' },
        { key: 'create_time',label: '创建时间', _style:'min-width:100px;' },
        { key: 'update_time',label: '更新时间', _style:'min-width:100px;' },
        { key: 'opt_details',label: '', _style:'min-width:10px;' },
        // { key: 'opt_copy',label: '', _style:'min-width:10px;' },
        { key: 'opt_delete',label: '', _style:'min-width:10px;' },
      ],
      versions:[],
      softwareId:"",
      plans:[],
      softwareList:[],
      userList:[
        {
          id:'TestLaboratory_V1_User_1',
          name:'xjb'
        },
        {
          id:'TestLaboratory_V1_User_2',
          name:'lf'
        },
        {
          id:'TestLaboratory_V1_User_3',
          name:'lj'
        },
      ],
      fileList:[]
    };
  },
  mounted(){
    this.softwareId = localStorage.getItem("softwareId");
    this.getTasks("","",this.softwareId,"","");
    // this.checkTaskDetail("TestLaboratory_V1_Task_5");
    getSoftwareList("","","").then(res=>{
      this.softwareList = res
      console.log(res,"获取的软件列表");
    })
    this.getPlans();
    getUserList(localStorage.getItem('userId')).then(res=>{
      console.log(res,"负责人ss");
      this.userList = res;
    });
  },
  computed:{
  },
  watch:{
  },
  methods: {
    getTasks(title,state,software_id,executor_id,sort){
      getTaskList(title,state,software_id,executor_id,sort).then(res=>{
        console.log("获取任务列表",res);
        this.taskList = targetDateFilter(res);
      })
    },
    getBadge (status) {
      switch (status) {
        case 0: return 'secondary'
        case 1: return 'success'
        case 2: return 'primary'
        default: 'primary'
      }
    },
    gotoTask(item,index){
      console.log(item,"item");
      localStorage.setItem('softwareId',item.software_id);
      localStorage.setItem('taskId',item.id)
      this.$router.push('/softwareTestTaskDetail/'+item.id);
    },
    deleteTaskFirstStep(item,index){
      this.deleteTaskModal = true;
      this.taskSelected = item;
    },
    deleteTaskNow(){
      console.log("删除任务taskSelected-》",this.taskSelected);
      this.deleteTaskModal = false;
      deleteTask(this.taskSelected.id).then(res=>{
        console.log("删除任务-》",res);
        this.getTasks("","",this.softwareId,"","");
      })
    },
    createNewTask(){
      if (this.newTask.title=="" || this.newTask.description=="" || this.newTask.softwareId=="" || this.newTask.plan == "" ||  this.newTask.userList ==[]) {
        this.$message.warning("请完整填写任务信息！");
        return;
      }
      console.log(this.newTask);
      if (this.$refs['newTaskUploader'].uploadFiles.length < 1) {
        this.$message.warning("文件数量至少为 1 ！");
        return;
      }
      let isLt20M;
      let formData = new FormData()
      let executors="";
      for(let item of this.newTask.userList){
        executors += "&&"+item;
      }
      executors = executors.slice(2);
      formData.append('executors', executors);
      if (this.$refs['newTaskUploader'].uploadFiles.length >= 1) {
        // 检查文件格式和大小
          this.$refs['newTaskUploader'].uploadFiles.forEach((element,index) => {
            isLt20M = element.size / 1024 / 1024 < 20
            if (!isLt20M) {
              this.$message.info('单个文件大小不能超过20M')
              return false
            }
            formData.append('files', element.raw);
          }); 
      }
      formData.append('title',this.newTask.title);
      formData.append('description',this.newTask.description);
      formData.append('plan_id', this.newTask.plan);
      console.log(this.newTask,"qian的this.newTask");

      createTask(formData).then(res=>{
        console.log("创建任务结果",res);
        this.createTaskModal = false;
        console.log(this.$refs.newTaskUploader.clearFiles());
        for(let key in this.newTask){
            delete this.newTask[key];
        }
        console.log(this.$refs['newTaskUploader']);

        console.log(this.newTask,"后的this.newTask");
        this.getTasks("","",this.softwareId,"","");
      })
    },
    checkTaskDetail(taskId){
      checkTask(taskId).then(res=>{
        console.log(res,"获取详情任务res");
      })
    },
    getPlans(){
      console.log(this.softwareId,"获取plan的软件id");
      getPlanList("","","",this.softwareId,"").then(res=>{
        this.plans =res;
        console.log("获取计划列表",res);
      })
    },
    checkPerm(permission){
      return checkPermission(localStorage.getItem('identity'),permission);
    }
  },
};
</script>

<style scoped>

</style>
