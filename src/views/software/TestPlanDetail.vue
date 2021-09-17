<template>
  <div style="min-width:1100px">
      <!-- 测试计划详情卡片 -->
      <!-- <button @click="dd">dd</button> -->
    <CCard>
      <CCardHeader>
       <h5 style="display:inline-block">测试计划详情</h5> 
       <br>
       
        <span class="infoColor">创建者: {{plan.creator}}</span>
        <span class="infoColor textMarginLeft">创建时间: {{plan.create_time | singleDateFilter}}</span>
        <span class="infoColor textMarginLeft">最后更新时间: {{plan.update_time | singleDateFilter}}</span>
        <div class="card-header-actions" v-if="checkPerm('EDIT')">
          <a 
            href="javascript:;"
            @click="editPlanModal=true"
            class="card-header-action" 
            rel="noreferrer noopener" >   
              <CIcon name="cil-pencil" /> 
          </a>
        </div>
      </CCardHeader>
      <CCardBody>

        <el-row style="margin-bottom:40px">
          <el-col :span="4"> <strong>计划名称:</strong>   {{this.plan.title}}</el-col>
          <el-col :span="4"> <strong>计划描述:</strong>  {{plan.description}}</el-col>
          <el-col :span="4"> <strong>所属软件名称:</strong>   {{plan.software_name}}</el-col>
          <el-col :span="2"> <strong>所属软件版本:</strong>  {{plan.version}}</el-col>
          <el-col :span="2"> <strong>状态:</strong>  
          <CBadge :color="getPlanBadge(plan.state)" style="fontSize:14px;height:21px;line-height:15px;margin-left:10px">
                {{plan.state | planStateFilter}}
          </CBadge>
          </el-col>
          <!-- <el-col :span="4"> <strong>创建时间:</strong>  {{software.create_time | singleDateFilter}}</el-col> -->
          <!-- <el-col :span="4"><div class="grid-content bg-purple-light">ff</div></el-col> -->
        </el-row>
        <!-- <span class="">计划名称: {{this.plan.title}}</span>
        <br> 
        <br>
        <span>计划描述: {{plan.description}}</span>
        <br>
        <br>
        <span class="">所属软件名称: {{plan.software_name}}</span> -->
        <!-- <br>
        <br> -->
        <!-- <span class=" textMarginLeft">所属软件版本: {{plan.version}}</span>
        <span class=" textMarginLeft">状态: {{plan.state | planStateFilter}}</span> -->
        <!-- 测试计划文件列表 -->
        <CCard>
            <CCardHeader>
                <CIcon name="cil-justify-center"/>
                <strong> 说明文档列表 </strong>
                <small>查阅相关文件</small>
                <CButton block color="primary" style="width:100px;float:right"  @click="appendFileModal =true" v-if="checkPerm('CREATE')">+新增</CButton>
                <!-- <el-button size="mini" style="marginLeft:20px" @click="appendFileModal =true" v-if="checkPerm('CREATE')">+新增</el-button> -->
            </CCardHeader>
            <CCardBody>
                <CListGroup accent>
                  <CListGroupItem v-for="file in this.plan.statements" :key="file.url" href="#" color="secondary" accent="secondary" class="d-flex justify-content-between align-items-center" >{{file.name}}
                    <div>
                      <CButton
                        color="primary"
                        variant="outline"
                        square
                        size="sm"
                        style="width:50px;margin-right:10px"
                        @click="checkFile(file.url)"
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
                      <!-- <CBadge color="primary" shape="pill" @click="checkFile(file.url)" style="margin-right:10px">下载</CBadge>
                      <CBadge color="danger" shape="pill" @click='deleteFileFirstStep(file)' v-if="checkPerm('DELETE')">删除</CBadge> -->

                    </div>
                  </CListGroupItem>
                </CListGroup>
            </CCardBody>
        </CCard>
      </CCardBody>
    </CCard>

    <!-- 测试任务列表卡片 -->
    <CCard>
      <CCardBody>
        <CDataTable
          :items="plan.tasks"
          :fields="taskFields"
          :items-per-page="5"
          :tableFilter='{ label:"搜索",placeholder:"输入任意信息检索" }'
          :noItemsView='{ noResults: "无结果", noItems: "无测试任务" }'
          hover
          :pagination="{ doubleArrows: true, align: 'center'}"
        >
          <template #state="{item}">
            <td>
              <CBadge :color="getBadge(item.state)" style="fontSize:14px;height:21px;line-height:15px">
                {{item.state | taskStateFilter}}
              </CBadge>
            </td>
          </template>
          <template #opt_details="{item, index}">
            <td class="py-2" v-if="checkPerm('CHECK')">
              <CButton
                color="primary"
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

        </CDataTable>
      </CCardBody>
    </CCard>
    <!-- 编辑测试计划modal -->
    <CModal
      :show.sync="editPlanModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="primary">
      <CInput
        label="名称"
        v-model="newPlanTitle"
        placeholder="请输入测试计划名称"
      />
      <CInput 
          label="描述"
          v-model="newPlanDescription"
          placeholder="请输入测试计划描述"
      />
      <div class="stateItem">
        <div>
          <p style="marginBottom:6px">计划状态</p>
          <el-radio v-model="radio" :label="0" > 
              执行中
          </el-radio>
          <el-radio v-model="radio" :label="1">      
              已归档
          </el-radio>       
        </div>
      </div>
      <p style="marginBottom:6px">请上传文件</p>
      <el-upload
        class="upload-demo"
        action=""
        :auto-upload="false"
        :limit="5"
        ref="editPlanUploader"
        :file-list="fileList"
        :multiple="true"
        >
        <el-button size="small" style="backgroundColor:rgb(50,31,219);color:white">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">最多上传5个文件，单一文件大小不超过20M</div>
      </el-upload>
      <template #header>
        <h6 class="modal-title">编辑测试计划</h6>
        <CButtonClose @click="editPlanModal = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="editPlanModal = false" color="danger">取消</CButton>
        <CButton @click="confirmEditPlan" style="backgroundColor:rgb(50,31,219);color:white">确定</CButton>
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

    <!-- 新增文件modal -->
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
        ref="newPlanFileUploader"
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
        <CButton  color="primary" @click="appendPlanFile">新增</CButton>
      </template>
    </CModal>
  
  </div>
</template>

<script>
import { checkPlan,editPlan } from '../../api/testPlan'
import { singleDateFilter ,targetDateFilter,planStateFilter,taskStateFilter} from "../../utils/filters";
import { checkPermission } from "../../utils/permission";
import { deleteFile,appendFile } from "../../api/file";

export default {
  name: 'planDetail',
  data() {
    return {
        planId:"",
        plan:{},
        newPlan:{},
        taskList:[
            {
                title:'xxx',
                executors:[
                    {
                        id:'1',
                        name:'xxx'
                    },
                    {
                        id:'2',
                        name:'xxx'
                    },
                    {
                        id:'3',
                        name:'xxx'
                    },
                ],
                description:"xxxxxxx",
                files:[
                    {
                        name:'xxx',
                        url:'xxxxxx'
                    }
                ]
            }
        ],
        taskFields:[
            { key: 'title', label: '任务名称', _style:'min-width:100px' },
            { key: 'description',label: '描述',_style:'min-width:200px'},
            { key: 'state',label: '状态',sorter: false,filter: false,_style:'min-width:100px;' },
            { key: 'create_time',label: '创建时间', _style:'min-width:100px;' },
            { key: 'update_time',label: '更新时间', _style:'min-width:100px;' },
            { key: 'opt_details',label: '', _style:'min-width:10px;' },
        ],
        editPlanModal:false,
        fileList:[],
        radio:0,
        newPlanDescription:"",
        newPlanTitle:"",
        deleteFileModal:false,
        fileId:'',
        appendFileModal:false
    };
  },
  mounted(){
    this.planId = this.$route.params.id;
    this.getPlanDetail(this.planId);  
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
        case 1: return 'success'
        case 2: return 'primary'
        default: 'primary'
      }
    },
    getPlanBadge(status){
      switch (status) {
        case 0: return 'success'
        case 1: return 'secondary'
        case 2: return 'primary'
        default: 'primary'
      }
    },
    getPlanDetail(id){
          checkPlan(id).then(res=>{
            //todo 为什么我改了newplan的值会直接改掉plan的值？
            this.plan = res;
            this.plan.tasks=targetDateFilter(this.plan.tasks)
            this.newPlan = res;
            this.radio = res.state;
            localStorage.setItem('softwareId',this.plan.software_id);
            console.log("获得plandetail",this.plan);
          })

    },
    gotoTask(item){
      // console.log(item,"item");
      console.log(item);
      localStorage.setItem('softwareId',this.plan.software_id);
      localStorage.setItem('taskId',item.id);
      this.$router.push('/softwareTestTaskDetail/'+item.id);
      // console.log("goto ",item);
    },
    checkFile(url){
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = url
        a.target = '_blank'
        a.click() 
    },
    confirmEditPlan(){
       if (this.newPlan.title=="") {
        this.$message.warning("计划名称不能为空！");
        return;
      }
      if (this.$refs['editPlanUploader'].uploadFiles.length < 1) {
        this.$message.warning("请上传文件！");
        return;
      }
      let isLt20M;
      let formData = new FormData()
      if (this.$refs['editPlanUploader'].uploadFiles.length >= 1) {
        // 检查文件格式和大小
          this.$refs['editPlanUploader'].uploadFiles.forEach((element) => {
            isLt20M = element.size / 1024 / 1024 < 20
            if (!isLt20M) {
              this.$message.info('单个文件大小不能超过20M')
              return false
            }
            //software_id,version_number,title,description,files,creator
            formData.append('files', element.raw);
          }); 
      }
      this.newPlan.title = this.newPlanTitle;
      this.newPlan.description = this.newPlanDescription;
      this.newPlan.state = this.radio;
      formData.append('title', this.newPlan.title);
      formData.append('state', this.newPlan.state);
      formData.append('description', this.newPlan.description);
      editPlan(this.planId,formData).then(res=>{
        console.log(res,"修改计划res");
        this.getPlanDetail(this.planId);
        this.editPlanModal = false
      })
    },
    checkPerm(permission){
      return checkPermission(localStorage.getItem('identity'),permission);
    },
    deleteFileFirstStep(file){
      this.deleteFileModal = true;
      this.fileId = file.file_id;
      console.log(file,"ddddd");
    },
    confirmDeleteFile(){
      // let formData = new FormData;
      // formData.append('type','plan_statement');
      // formData.append('plan_id',this.planId);
      // formData.append('task_id','');
      // formData.append('file_id',this.fileId);
      deleteFile('plan_statement',this.planId,'',this.fileId).then(res=>{
        console.log('删除fileres',res);
        this.getPlanDetail(this.planId);
        this.deleteFileModal = false;
      })
    },
    appendPlanFile(){
      let isLt20M;
      let formData = new FormData()
      if (this.$refs['newPlanFileUploader'].uploadFiles.length >= 1) {
        // 检查文件格式和大小
          this.$refs['newPlanFileUploader'].uploadFiles.forEach((element) => {
            isLt20M = element.size / 1024 / 1024 < 20
            if (!isLt20M) {
              this.$message.info('单个文件大小不能超过20M')
              return false
            }
            //software_id,version_number,title,description,files,creator
            formData.append('files', element.raw);
          }); 
      }
      formData.append('type','plan_statement');
      formData.append('plan_id',this.planId);
      formData.append('task_id','');
      appendFile(formData).then(res=>{
        console.log("新增文件res",res);
        this.getPlanDetail(this.planId);
        this.appendFileModal = false;
      })
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
</style>
