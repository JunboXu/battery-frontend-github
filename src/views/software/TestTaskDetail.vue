<template>
  <div style="min-width:1100px">
      <!-- 测试计划详情卡片 -->
      <!-- <button @click="dd">dd</button> -->
    <CCard>
      <CCardHeader>
       <h5 style="display:inline-block">任务名称： {{task.title}}</h5> 
       <br>
        <!-- <span class="infoColor">创建者: {{this.task.creator}}</span> -->
        <span class="infoColor ">创建时间: {{this.pageVO.create_time | singleDateFilter}}</span>
        <span class="infoColor textMarginLeft">最后更新时间: {{this.pageVO.update_time | singleDateFilter}}</span>
        <div class="card-header-actions" v-if="checkPerm('EDIT')">
          <a 
            href="javascript:;"
            @click="editTaskModal=true"
            class="card-header-action" 
            rel="noreferrer noopener" >   
              <CIcon name="cil-pencil" /> 
          </a>
        </div>
      </CCardHeader>
      <CCardBody>
        <!-- <span class=""></span>
        <br> 
        <br> -->
        <span>计划描述: {{task.description}}</span>
        <br>
        <br>
        <span class=" ">状态: {{task.state | taskStateFilter}}</span>

        <span class="textMarginLeft" >所属软件名称: 
          <el-tooltip class="item" effect="dark" content="点击查看测试项目详情" placement="bottom">
            <a @click="jumpToTargetDetail" style="cursor:pointer;text-decoration: underline">
              {{pageVO.software_name}}
            </a>
          </el-tooltip>
        </span>
        <span ></span>
        
        <span class="textMarginLeft">版本: {{pageVO.version}}</span>
        <br>
        <br>
        <span >所属计划: 
          <el-tooltip class="item" effect="dark" content="点击查看计划详情" placement="bottom">
            <a @click="jumpToPlanDetail" style="cursor:pointer;text-decoration: underline">
              {{pageVO.plan.title}}
            </a>
          </el-tooltip>
        </span>
        <br>
        <br>
        <span >负责人: <span v-for="man in pageVO.task.executors" :key=" man.id" style="margin-left:20px"> {{man.name}} ; </span></span>
        <br>
        <br>
        <!-- 测试计划文件列表 -->
        <CCard>
        <CCardHeader>
            <CIcon name="cil-justify-center"/>
            <strong> 测试任务说明文档 </strong>
            <!-- <small></small> -->
            <CButton block color="primary" style="width:100px;float:right"  @click="appendFileModal =true" v-if="checkPerm('CREATE')">+新增</CButton>

        </CCardHeader>
        <CCardBody>
          <CListGroup accent>
              <CListGroupItem v-for="file in this.pageVO.task.statements" :key="file.file_url" href="#" color="secondary" accent="secondary" class="d-flex justify-content-between align-items-center" >
                {{file.file_name}}
                <div>               
                  <CButton
                    color="primary"
                    variant="outline"
                    square
                    size="sm"
                    style="width:50px;margin-right:10px"
                    @click="checkFile(file.file_url)" v-if="checkPerm('CHECK')"
                  >
                  下载
                  </CButton>
                  <CButton
                    color="danger"
                    variant="outline"
                    square
                    size="sm"
                    style="width:50px;"
                    @click='deleteFileFirstStep(file)' 
                    v-if="checkPerm('DELETE')"
                  >
                  删除
                  </CButton>


                  <!-- <CBadge color="primary" shape="pill" class="fileButton" @click="checkFile(file.file_url)" v-if="checkPerm('CHECK')">查看
                  </CBadge>
                  <CBadge color="danger" shape="pill"  class="fileButton" v-if="checkPerm('DELETE')">删除
                  </CBadge> -->
                </div>
                </CListGroupItem>
          </CListGroup>
        </CCardBody>
        </CCard>
      </CCardBody>
    </CCard>
<!-- 确认开始执行modal -->
    <CModal
      :show.sync="beginExceutModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="warning">
             <h5>你确定开始执行测试用例吗？开始执行后将无法修改已上传的测试用例！</h5> 
      <template #header>
        <h6 class="modal-title">确认执行</h6>
        <CButtonClose @click="beginExceutModal = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="beginExceutModal = false" color="danger">取消</CButton>
        <CButton @click="changeTaskState(1)" style="backgroundColor:rgb(50,31,219);color:white">开始执行</CButton>
      </template>
    </CModal>
<!-- 确认完成执行modal -->
    <CModal
      :show.sync="confirmFinishModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="warning">
             <h5>你确定完成该任务吗？确认完成后将无法修改该测试任务的执行结果！</h5> 
      <template #header>
        <h6 class="modal-title">确认执行</h6>
        <CButtonClose @click="confirmFinishModal = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="confirmFinishModal = false" color="danger">取消</CButton>
        <CButton @click="changeTaskState(2)" style="backgroundColor:rgb(50,31,219);color:white">确认完成</CButton>
      </template>
    </CModal>

<!-- 执行测试任务窗口 -->
    <CCard>
      <CCardHeader>
       <h5 style="display:inline">测试任务执行</h5> 
        <div style="float:right;">
          <div style="margin:0px auto">
            <el-button size="mini" v-if="checkPerm('EXECUTE')&&(this.state==0)&&(pageVO.task.case_file.file_name)&&checkPerm('CONFIRM')" @click="beginExceutModal = true">开始执行</el-button>
            <el-button size="mini" v-if="checkPerm('EXECUTE')&&(this.state==1)&&(pageVO.task.case_file.file_name)" @click="confirmFinishModal =true">确认完成</el-button>
          </div>
        </div>
      </CCardHeader>
      <CCardBody>
        <!-- <h3 >请上传测试用例文件! <el-button size="mini" @click="excuteTaskModal = true"> +上传</el-button> </h3> -->
        <!-- <br> -->
        
        <h5 style="margin-top:40px"></h5>
        <el-steps :active="getTaskExecState(state)"  finish-status="success" style="margin:40px 80px">
          <el-step title="用例评审" description=""></el-step>
          <el-step title="测试执行" description=""></el-step>
          <el-step title="测试完成" description=""></el-step>
        </el-steps>

      <!-- 下载已上传文件链接 -->
      <!-- //todo -->
      <!-- <p v-if="pageVO.task.case_file.file_name" style="margin-left:80px">已上传文件：<a @click="checkFile(pageVO.task.case_file.file_url)" style="color:rgb(50,31,219);cursor:pointer">{{pageVO.task.case_file.file_name}}</a></p> -->
      
      <div v-if="state==0">
        <el-button @click="excuteTaskModal = true" v-if="checkPerm('EXECUTE')"
         style="color:rgb(50,31,219);cursor:pointer;margin-left:80px;margin-top:20px ">上传测试用例
         </el-button> 
              <span style="margin-top:40px;margin-left:40px;fontSize:12px">
                <a @click="checkFile(pageVO.task.case_template)" style="color:rgb(50,31,219);cursor:pointer">测试用例模板文件.xls</a>
                </span>

        <!-- <h5> -->
          <!-- <a @click="excuteTaskModal = true" v-if="checkPerm('EXECUTE')" style="color:rgb(50,31,219);cursor:pointer">点此上传 
          <strong>未执行</strong> 测试用例文件</a>  -->
          <!-- </h5> -->
        
      </div>  
      <!-- 执行结果(未测通过失败结果) -->
      <div v-if="state==1" style="margin-top:40px;margin-bottom:20px"> 
        <!-- <h5><a @click="excuteTaskModal = true" v-if="checkPerm('EXECUTE')" style="color:rgb(50,31,219);cursor:pointer">点此上传 <strong>已执行</strong> 测试用例文件</a></h5>
        <p> 注意,上传后将覆盖已上传文件！</p> -->
        <el-button @click="checkFile(pageVO.task.case_file.file_url)" v-if="checkPerm('EXECUTE')"
         style="color:rgb(50,31,219);cursor:pointer;margin-left:80px;margin-top:20px ">下载测试用例
         </el-button> 
                <el-button @click="excuteTaskModal = true" v-if="checkPerm('EXECUTE')"
         style="color:rgb(50,31,219);cursor:pointer;margin-left:20px;margin-top:20px ">上传执行结果
         </el-button> 
              <!-- <span style="margin-top:40px;margin-left:40px;fontSize:12px">
                <a @click="checkFile(pageVO.task.case_template)" style="color:rgb(50,31,219);cursor:pointer">测试用例模板文件.xls</a>
                </span> -->
      </div>
      <div v-if="state!=0">
        <div>
          <!-- <h5 style="margin-top:40px">执行结果:</h5> -->
          <CProgress class="mt-1"  style="margin:40px 80px 0px 80px" showValue :max="caseAll">
          <CProgressBar
            :value="caseSuccess"
            color="success"
          />
          <CProgressBar
            :value="caseNotExe"
            color="warning"
          />
          <CProgressBar
            :value="caseFail"
            color="danger"
          />
          </CProgress>
          <div style="margin-left:80px;fontSize:12px">
            通过<div class="indexColor" style="backgroundColor:rgb(46,184,92)"></div>
            未测<div class="indexColor" style="backgroundColor:rgb(249,177,21)"></div>
            失败<div class="indexColor" style="backgroundColor:rgb(229,83,83)"></div>
          </div>      
          <div v-if="state==2">
              <p v-if="pageVO.task.case_file.file_name" style="margin-left:80px;margin-top:20px">最终文件：<a @click="checkFile(pageVO.task.case_file.file_url)" style="color:rgb(50,31,219);cursor:pointer">{{pageVO.task.case_file.file_name}}</a></p>
          </div>
        </div>
      </div>
      </CCardBody>
    </CCard>
    <!-- 编辑测试任务modal -->
    <CModal
      :show.sync="editTaskModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="primary">
      <CInput
        label="名称"
        v-model="newTask.title"
        placeholder="请输入测试任务名称"
      />
      <CInput 
          label="描述"
          v-model="newTask.description"
          placeholder="请输入测试任务描述"
      />
      <!-- <div class="stateItem">
        <div>
          <p style="marginBottom:6px">任务状态</p>
          <el-radio v-model="radio" :label="0" > 
              未执行
          </el-radio>
          <el-radio v-model="radio" :label="1">      
              执行中
          </el-radio>   
          <el-radio v-model="radio" :label="2">      
              执行中
          </el-radio>    
        </div>
      </div> -->
      <p style="marginBottom:10px;marginTop:10px">负责人</p>
      <el-select multiple :multiple-limit="3" style="width:100%" v-model="newTask.userList" clearable placeholder="请选择负责人">
        <el-option
          v-for="item in userList"
          :key="item.userid"
          :label="item.username"
          :value="item.userid">
        </el-option>
      </el-select>
      <p style="marginBottom:6px;marginTop:20px">请上传文件</p>
      <el-upload
        class="upload-demo"
        action=""
        :auto-upload="false"
        :limit="5"
        ref="editTaskUploader"
        :file-list="fileList"
        :multiple="true">
        <el-button size="small" style="backgroundColor:rgb(50,31,219);color:white">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">最多上传5个文件，单一文件大小不超过20M</div>
      </el-upload>
      <template #header>
        <h6 class="modal-title">编辑测试任务</h6>
        <CButtonClose @click="editTaskModal = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="editTaskModal = false" color="danger">取消</CButton>
        <CButton @click="confirmEditTask" style="backgroundColor:rgb(50,31,219);color:white">确定</CButton>
      </template> 
    </CModal>
    <!-- 执行测试任务modal -->
    <CModal
      :show.sync="excuteTaskModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="primary">
      <!-- <p style="marginBottom:6px">请上传执行结果文件</p> -->
      <el-upload
          class="upload-demo"
          action=""
          :auto-upload="false"
          :limit="1"
          ref="excuteTaskUploader"
          :file-list="excuteTaskFileList"
          :multiple="true">
          <el-button  class="el-upload__tsip" size="small" style="">点击上传</el-button>
          <!-- <div slot="tip" class="el-upload__tsip">请按照提供的测试用例模板格式上传：<a @click="checkFile(pageVO.task.case_template)" style="color:rgb(50,31,219);cursor:pointer">测试用例模板文件</a></div> -->
      </el-upload>
      <template #header>
        <h6 class="modal-title">请上传执行结果文件</h6>
        <CButtonClose @click="excuteTaskModal = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="excuteTaskModal = false" color="danger">取消</CButton>
        <CButton @click="confirmExcuteTask" style="backgroundColor:rgb(50,31,219);color:white">确定</CButton>
      </template> 
    </CModal>
<!-- 删除文件modal -->
    <CModal
      :show.sync="deleteFileModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="danger">
             <h5>你确定删除该文件吗？</h5> 
      <template #header>
        <h6 class="modal-title">删除测试计划文件</h6>
        <CButtonClose @click="deleteFileModal = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="deleteFileModal = false" >取消</CButton>
        <CButton  color="danger" @click="confirmDeleteFile">删除</CButton>
      </template>
    </CModal>
    <!-- 新建文件modal -->
    <CModal
      :show.sync="appendFileModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="primary">
       <el-upload
        class="upload-demo"
        action=""
        :auto-upload="false"
        :limit="5"
        :multiple="true"
        ref="newTaskFileUploader"
        :file-list="fileList">
        <el-button size="small" style="backgroundColor:rgb(50,31,219);color:white">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">文件大小限制不超过20M,最多上传5个文件</div>
      </el-upload>
      <template #header>
        <h6 class="modal-title">新增测试计划文件</h6>
        <CButtonClose @click="appendFileModal = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="appendFileModal = false" color="danger">取消</CButton>
        <CButton  color="primary" @click="appendTaskFile">新增</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import { singleDateFilter ,targetDateFilter,planStateFilter,taskStateFilter} from "../../utils/filters";
import { checkTask ,deleteTask,excuteTask,editTask} from "../../api/testTask";
import { checkPermission } from "../../utils/permission";
import { getUserList } from "../../api/user";
import { deleteFile,appendFile } from "../../api/file";

export default {
  name: 'TestTaskDetail',
  data() {
    return {
        taskId:"",
        pageVO:{},
        task:{},
        newTask:{},
        editTaskModal:false,
        fileList:[],
        radio:0,
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
        excuteTaskModal:false,
        excuteTaskFileList:[],
        caseAll:0,
        caseFail:0,
        caseSuccess:0,
        caseNotExe:0,
        excutionInfo:[
          {
            operationName:'状态',
            content:'没有提交'
          },
          {
            operationName:'最后修改',
            content:'2020.10.26'
          },
          {
            operationName:'文件名称',
            content:'-'
          }
        ],
        state:0,
        beginExceutModal:false,
        confirmFinishModal:false,
        deleteFileModal:false,
        fileId:'',
        appendFileModal:false

    };
  },
  mounted(){
    // this.planId = this.$route.params.id;
    this.taskId = localStorage.getItem('taskId')
    this.checkTaskDetail(this.taskId);
    getUserList(localStorage.getItem('userId')).then(res=>{
      console.log(res,"负责人ss");
      this.userList = res;
    });
  },
  filters:{
      singleDateFilter,targetDateFilter,planStateFilter,taskStateFilter
  },
  computed:{
  },
  watch:{
  },
  methods: {
    getBadge (status) {
      switch (status) {
        case 0: return 'secondary'
        case 1: return 'primary'
        case 2: return 'success'
        default: 'primary'
      }
    },
    checkFile(url){
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.target = '_blank'
        a.click(); 
    },
    confirmEditTask(){
       if (this.newTask.title=="") {
        this.$message.warning("计划名称不能为空！");
        return;
      }
      if (this.$refs['editTaskUploader'].uploadFiles.length < 1) {
        this.$message.warning("请上传文件！");
        return;
      }
      let isLt20M;
      let formData = new FormData()
      if (this.$refs['editTaskUploader'].uploadFiles.length >= 1) {
        // 检查文件格式和大小
          this.$refs['editTaskUploader'].uploadFiles.forEach((element) => {
            isLt20M = element.size / 1024 / 1024 < 20
            if (!isLt20M) {
              this.$message.info('单个文件大小不能超过20M')
              return false
            }
            formData.append('files', element.raw);
          }); 
      }
      // console.log(this.newTask,"this.newTask");
      formData.append('title', this.newTask.title);
      formData.append('state', "");
      formData.append('description', this.newTask.description);
      let executors="";
      for(let item of this.newTask.userList){
        executors += "&&"+item;
      }
      executors=executors.slice(2)
      console.log(executors);
      formData.append('executors', executors);
      formData.append('edit_state_only', false);
      editTask(this.taskId,formData).then(res=>{
        // console.log("修改惹怒我",res);
        this.checkTaskDetail(this.taskId);
        this.editTaskModal = false;
      })
    },
    checkTaskDetail(taskId){
      checkTask(taskId).then(res=>{
        this.pageVO=res;
        this.task = res.task;
        console.log(this.pageVO,"获取详情任务res");
        this.newTask = Object.assign({},res.task);
        this.state = res.task.state;
        this.caseAll = res.task.case_all;
        this.caseFail = res.task.case_fail;
        this.caseSuccess = res.task.case_success;
        this.caseNotExe = res.task.case_not_execute;
      })
    },
    jumpToPlanDetail(){
      this.$router.push('/softwareTestPlanDetail/'+this.pageVO.plan.id)
    },
    jumpToTargetDetail(){
      this.$router.push('/softwareDetail/'+this.pageVO.software_id)
    },
    confirmExcuteTask(){
      let isLt20M;
      let formData = new FormData()
      if (this.$refs['excuteTaskUploader'].uploadFiles.length >= 1) {
        // 检查文件格式和大小
          this.$refs['excuteTaskUploader'].uploadFiles.forEach((element) => {
            isLt20M = element.size / 1024 / 1024 < 20
            if (!isLt20M) {
              this.$message.info('单个文件大小不能超过20M')
              return false
            }
            formData.append('file', element.raw);
          }); 
      }
      console.log(this.$refs['excuteTaskUploader'].uploadFiles);
      excuteTask(this.taskId,formData).then(res =>{
        console.log(res,"测试用例执行信息");
        if (res.status==50001) {
            this.$message.error({
              message:res.error,
              duration:10000
            });
          return;
        }
        console.log("执行测试任务结果",res);
        this.checkTaskDetail(this.taskId);
        this.$message.success(res)
        this.excuteTaskModal = false;
      })
    },
    downloadExcutionFile(){

    },
    checkPerm(permission){
      return checkPermission(localStorage.getItem('identity'),permission);
    },
    changeTaskState(state){
      let formData = new FormData();
      formData.append('edit_state_only','1');
      formData.append('state',state);
      editTask(this.taskId,formData).then(res=>{
        // console.log("修改惹怒我",res);
        console.log("只改变状态,",res);
        this.checkTaskDetail(this.taskId);
        this.editTaskModal = false;
        this.beginExceutModal =false;
        this.confirmFinishModal =false;
        this.checkTaskDetail(this.taskId);
      })
    },
    deleteFileFirstStep(file){
      this.deleteFileModal = true;
      this.fileId = file.file_id;
      console.log(file,"ddddd");
    },
    confirmDeleteFile(){
      deleteFile('task_statement','',this.taskId,this.fileId).then(res=>{
        console.log('删除fileres',res);
        this.checkTaskDetail(this.taskId);
        this.deleteFileModal = false;
      })
    },
    appendTaskFile(){
      let isLt20M;
      let formData = new FormData()
      if (this.$refs['newTaskFileUploader'].uploadFiles.length >= 1) {
        // 检查文件格式和大小
          this.$refs['newTaskFileUploader'].uploadFiles.forEach((element) => {
            isLt20M = element.size / 1024 / 1024 < 20
            if (!isLt20M) {
              this.$message.info('单个文件大小不能超过20M')
              return false
            }
            //software_id,version_number,title,description,files,creator
            formData.append('files', element.raw);
          }); 
      }
      formData.append('type','task_statement');
      formData.append('plan_id','');
      formData.append('task_id',this.taskId);
      appendFile(formData).then(res=>{
        console.log("新增文件res",res);
        this.checkTaskDetail(this.taskId);
        this.appendFileModal = false;
      })
    },
    getTaskExecState(state){
      if (state==2) {
        return 3
      }else{
        return state
      }
    }
  },
};
</script>

<style scoped>
.textMarginLeft {
  margin-left: 50px;
  /* white-space: nowrap; */
}
.infoColor{
  color: #909399;
}
.fileButton{
  margin-left: 20px;
  font-size: 14px;
  font-weight: 300;
}
.indexColor{
  width: 40px;
  color: white;
  text-align: center;
  font-size: 12px;
  padding: 2px;
  border-radius: 10%;
  margin-top: 10px;
  margin-right: 10px;
  display: inline-block;
}
</style>