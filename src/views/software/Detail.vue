<template>
  <div style="min-width:1100px">
    <el-button size="mini" style="margin-bottom:20px;" @click="exportRep">
          <i class="el-icon-download" style="fontSize:20px"></i>    导出测试报告
         </el-button> 
    <CCard >
      <CCardHeader>
       <h5 style="display:inline-block">{{software.name}} </h5> 
        <div class="card-header-actions" v-if="checkPerm('EDIT')">
          <a 
                href="javascript:;"
                @click="editModal=true"
                class="card-header-action" 
                rel="noreferrer noopener" 
              >   
              <CIcon name="cil-pencil" /> 
          </a>
        </div>
      </CCardHeader>
      <CCardBody>
        <el-row>
          <el-col :span="4"> <strong>项目类型:</strong>   {{software.type}}</el-col>
          <el-col :span="4"> <strong>测试任务数量:</strong>  {{software.task_num}}</el-col>
          <el-col :span="4"> <strong>测试用例数量:</strong>   {{software.case_num}}</el-col>
          <el-col :span="4"> <strong>版本数:</strong>  {{software.versions.length}}</el-col>
          <el-col :span="4"> <strong>更新时间:</strong>  {{software.update_time | singleDateFilter}}</el-col>
          <el-col :span="4"> <strong>创建时间:</strong>  {{software.create_time | singleDateFilter}}</el-col>
          <!-- <el-col :span="4"><div class="grid-content bg-purple-light">ff</div></el-col> -->
        </el-row>
        <!-- <span >项目类型: {{software.type}}</span>
        <span class="textInfo">测试任务数量: 0</span>
        <span class="textInfo">更新时间: {{software.update_time | singleDateFilter}}</span>
        <span class="textInfo">创建时间: {{software.create_time | singleDateFilter}}</span>
        <span class="textInfo">测试用例数量: 0</span>
        <span class="textInfo">版本数: {{software.versions.length}}</span> -->
      </CCardBody>
    </CCard>
    <CCard>
      <CCardHeader>
        <h5 style="display:inline-block">版本记录
        </h5> 
        <CButton block color="primary" style="width:100px;float:right"  @click="createVersionModal = true" v-if="checkPerm('CREATE')">+新建</CButton>

        <!--  新建版本的modal -->
        </CCardHeader>
      <CCardBody>
        <CDataTable
          :items="software.versions"
          :fields="iterationfields"
          :items-per-page="5"
          hover
          :pagination="{ doubleArrows: true, align: 'center'}">    
          <template #operation_edit="{item, index}">
            <td class="py-2" v-if="checkPerm('EDIT')">
              <CButton
                color="warning"
                variant="outline"
                square
                size="sm"
                style="width:50px"
                @click="editVersionFirstStep(item, index)"
              >
              编辑
              </CButton>
            </td>
          </template>
          <template #operation_download="{item, index}">
            <td class="py-2" v-if="checkPerm('CHECK')">
              <CButton
                color="primary"
                variant="outline"
                square
                size="sm"
                style="width:50px"
                @click="downloadFile(item, index)"
              >
              下载
              </CButton>
            </td>
          </template>  
          <template #operation_delete="{item, index}">
            <td class="py-2" v-if="checkPerm('DELETE')">
              <CButton
                color="danger"
                variant="outline"
                square
                size="sm"
                style="width:50px"
                @click="deleteVersionFirstStep(item, index)"
              >
              删除
                <!-- {{Boolean(item._toggled) ? 'Hide' : 'Show'}} -->
              </CButton>
            </td>
          </template>  
          
        </CDataTable>
      </CCardBody>
    </CCard>
    <CCard>
      <CCardHeader>
        <h5>测试计划</h5> 
        </CCardHeader>
      <CCardBody>
        <CDataTable
          :items="planList"
          :fields="planFields"
          :items-per-page="8"
          :tableFilter='{ label:"搜索",placeholder:"输入任意信息检索" }'
          :noItemsView='{ noResults: "无结果", noItems: "无测试计划" }'
          cleaner
          hover
          :pagination="{ doubleArrows: true, align: 'center'}"
        >
          <template #state="{item}">
            <td>
              <CBadge :color="getBadge(item.state)" style="fontSize:14px;height:25px;line-height:20px">
                {{item.state | planStateFilter}}
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
                @click="gotoPlan(item, index)"
              >
              查看
                <!-- {{Boolean(item._toggled) ? 'Hide' : 'Show'}} -->
              </CButton>
            </td>
          </template>
          <template #opt_copy="{item, index}">
            <td class="py-2" v-if="checkPerm('COPY')">
              <CButton
                color="primary"
                variant="outline"
                square
                size="sm"
                style="width:50px"
                @click="copyPlan(item, index)"
              >
              复制
                <!-- {{Boolean(item._toggled) ? 'Hide' : 'Show'}} -->
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
                @click="deletePlanFirstStep(item,index)">
              删除
              </CButton>
            </td>
          </template>
        </CDataTable>

      </CCardBody>
    </CCard>
  <!-- 编辑测试项目modal -->
    <CModal
      :show.sync="editModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="primary">
      <CInput
        label="名称"
        v-model="editName"
        placeholder="请输入测试项目名称"
      />
      <CInput 
          label="类型"
          v-model="editType"
          placeholder="请输入测试项目的类型"
      />
      <template #header>
        <h6 class="modal-title">编辑测试项目</h6>
        <CButtonClose @click="editModal = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="editModal = false" color="danger">取消</CButton>
        <CButton @click="editTarget" style="backgroundColor:rgb(50,31,219);color:white">确定</CButton>
      </template> 
    </CModal>
    <!-- //编辑版本modal -->
    <CModal
      :show.sync="editVersionModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="primary">
      <p style="marginBottom:6px">请上传文件</p>
      <el-upload
        class="upload-demo"
        action=""
        :auto-upload="false"
        :limit="1"
        ref="editVersionUploader"
        :file-list="fileList">
        <el-button size="small" style="backgroundColor:rgb(50,31,219);color:white">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">文件大小限制不超过20M</div>
      </el-upload>
      <template #header>
        <h6 class="modal-title">编辑版本</h6>
        <CButtonClose @click="editVersionModal = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="editVersionModal = false" color="danger">取消</CButton>
        <CButton @click="editVersionNow" style="backgroundColor:rgb(50,31,219);color:white">确定</CButton>
      </template> 
    </CModal>
    <!-- 新建版本modal -->
    <CModal
      :show.sync="createVersionModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="primary"
    >
      <CInput
          label="名称"
          v-model="createVersionName"
          placeholder="请输入版本名称"
      />
      <p style="marginBottom:6px">请选择文件</p>
      <el-upload
        class="upload-demo"
        action=""
        :auto-upload="false"
        :limit="1"
        ref="createVersionUploader"
        :file-list="fileList">
        <el-button size="small" style="backgroundColor:rgb(50,31,219);color:white">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">文件大小限制不超过20M</div>
      </el-upload>
      <template #header>
        <h6 class="modal-title">新建版本</h6>
        <CButtonClose @click="createVersionModal = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="createVersionModal = false" color="danger">取消</CButton>
        <CButton @click="createNewVersion" style="backgroundColor:rgb(50,31,219);color:white">新建</CButton>
      </template> 
    </CModal>
    <!-- 删除版本modal -->
    <CModal
      :show.sync="deleteVersionModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="danger">
             <h5>你确定删除该版本目吗？删除后将无法查看该版本的相关信息！删除最后一个版本将会直接删除本项目！</h5> 
      <template #header>
        <h6 class="modal-title">删除版本</h6>
        <CButtonClose @click="deleteVersionModal = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="deleteVersionModal = false" color="danger">取消</CButton>
        <CButton @click="deleteVersionNow()" style="backgroundColor:rgb(50,31,219);color:white">删除</CButton>
      </template>
    </CModal>
  </div>
</template>

<script>
import { checkSoftware,editSoftware,exportReport} from '../../api/software'
import { singleDateFilter ,targetDateFilter,planStateFilter} from "../../utils/filters";
import {createVersion,deleteVersion,editVersion} from '../../api/version'
import { checkPermission } from "../../utils/permission";
import { getPlanList } from '../../api/testPlan'

export default {
  name: 'softwareDetail',
  data() {
    return {
      software:{
          name:"lims",
          type:"web",
          create_time:"2012/01/01",
          update_time:"2012/01/01",
          versions:[
            {
              version:'1.0',
              create_time:"2012/01/01",
              update_time:"2012/01/01",
              file:"ddddddddd"
            }
          ]
      },
      editModal:false,
      iterationfields: [
                { key: 'version',label:'版本', _style:'min-width:50px' },
                { key: 'create_time',label:'创建时间',  _style:'min-width:200px;' },
                { key: 'update_time',label:'更新时间',  _style:'min-width:200px;' },
                { 
                  key: 'file', 
                  label: '文件', 
                  _style: 'min-width:200px', 
                  sorter: false, 
                  filter: false
                },
                { 
                  key: 'operation_download', 
                  label: '', 
                  _style: 'min-width:2%', 
                  sorter: false, 
                  filter: false
                },
                { 
                  key: 'operation_edit', 
                  label: '', 
                  _style: 'min-width:2%', 
                  sorter: false, 
                  filter: false
                },
                { 
                  key: 'operation_delete', 
                  label: '', 
                  _style: 'min-width:2%', 
                  sorter: false, 
                  filter: false
                },                

      ],
      softwareId:"",
      editType:"",
      editName:"",
      createVersionModal:false,
      editVersionModal:false,
      deleteVersionModal:false,
      createVersionName:"",
      fileList:[],
      versionSelected:{},
      planList:[
        // {
        //   id:'1',
        //   title:'lims测试计划',
        //   creator_username:'xxxxxx',
        //   software_name:'lims实验室管理系统',
        //   software_version:'1.0',
        //   state:0,
        //   description:'针对lims实验室管理系统1.0版本的测试计划',
        //   create_time:'2021-03-01 02:00:00',
        //   update_time:'2021-03-01 02:00:00',
        // }, 
      ],
      planFields:[
        { key: 'title', label: '计划名称', _style:'min-width:100px' },
        { key: 'software_name',label: '所属软件', _style:'min-width:100px' },
        { key: 'version',label: '所属版本', _style:'min-width:100px' },
        { key: 'description',label: '描述',_style:'min-width:200px'},
        { key: 'state',label: '状态',sorter: false,filter: false,_style:'min-width:100px;' },
        { key: 'creator', label: '创建者', _style:'min-width:100px' },
        { key: 'create_time',label: '创建时间', _style:'min-width:100px;' },
        { key: 'update_time',label: '更新时间', _style:'min-width:100px;' },
        { key: 'opt_details',label: '', _style:'min-width:10px;' },
        { key: 'opt_copy',label: '', _style:'min-width:10px;' },
        { key: 'opt_delete',label: '', _style:'min-width:10px;' },
      ],
    };
  },  
  filters :{singleDateFilter,targetDateFilter,planStateFilter},
  mounted(){
    this.softwareId=localStorage.getItem("softwareId");
    this.getSoftwareDetail();
    this.getPlans(this.softwareId)
  },
  computed:{
  },
  watch:{
  },
  methods: {
    editTarget(){
      let formData = new FormData()
      formData.append("name",this.editName);
      formData.append("type",this.editType);
      editSoftware(this.softwareId,formData).then(res =>{
        // console.log(this.editType,"editType",this.editName,"editName");
        this.getSoftwareDetail();
        this.editModal=false

      })
    },
    getSoftwareDetail(){
      checkSoftware(this.softwareId).then(res=>{
        console.log(res);
        this.software=res;
        this.software.versions=targetDateFilter(this.software.versions);
      })
    },
    deleteVersionFirstStep(item, index){
      this.deleteVersionModal=true;
      this.versionSelected=item;
    },
    deleteVersionNow(){
      deleteVersion(this.softwareId,this.versionSelected.version).then(res=>{
        this.getSoftwareDetail();
        this.deleteVersionModal=false;
      })
    },
    createNewVersion(){
      if (this.createVersionName=="") {
        this.$message.warning("请完整填写版本名称！");
        return;
      }
      // console.log(this,"this.$refs['requirementSetUploader']");
      if (this.$refs['createVersionUploader'].uploadFiles.length < 1) {
        this.$message.warning("请上传文件！");
        return;
      }
      let file;
      let isLt20M;
      if (this.$refs['createVersionUploader'].uploadFiles.length >= 1) {
        // 检查文件格式和大小
        file = this.$refs['createVersionUploader'].uploadFiles.pop()
        isLt20M = file.size / 1024 / 1024 < 20
        if (!isLt20M) {
          this.$message.info('文件大小不能超过20M')
          this.$refs['createVersionUploader'].uploadFiles.pop()
          return false
        }
      }
      let formData = new FormData()
      formData.append('file', file.raw);
      formData.append('version', this.createVersionName);

      createVersion(this.softwareId,formData).then(res=>{
        this.$message.success('新建版本成功')
        this.createVersionModal = false;      
        this.createVersionName="";
        // this.fileList=[];
        this.getSoftwareDetail();
      })
    },
    editVersionFirstStep(item,index){
      this.versionSelected=item;
      this.editVersionModal=true;
    },
    editVersionNow(){
       if (this.$refs['editVersionUploader'].uploadFiles.length < 1) {
        this.$message.warning("请上传文件！");
        return;
      }
      let file;
      let isLt20M;
      if (this.$refs['editVersionUploader'].uploadFiles.length >= 1) {
        // 检查文件格式和大小
        file = this.$refs['editVersionUploader'].uploadFiles.pop()
        isLt20M = file.size / 1024 / 1024 < 20
        if (!isLt20M) {
          this.$message.info('测试用例集文件大小不能超过20M')
          this.$refs['editVersionUploader'].uploadFiles.pop()
          return false
        }
      }
      let formData = new FormData()
      formData.append('file', file.raw);
      formData.append('version_number', this.versionSelected.version);

      editVersion(this.softwareId,formData).then(res =>{
        console.log("edit res");
        this.getSoftwareDetail();
        this.createVersionName="";        
        this.editVersionModal = false;      
        this.$message.success("修改成功！");

        // this.fileList=[];
      })
    },
    downloadFile(item){
      console.log(item);
      let hf= item.file_url;
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = hf
      a.target = '_blank'
      a.click() 
    },
    checkPerm(permission){
      return checkPermission(localStorage.getItem('identity'),permission);
    },
    getPlans(){
      getPlanList('','','',this.softwareId,'').then(res =>{
        this.planList=targetDateFilter(res);
      })
    },
    getBadge (status) {
      switch (status) {
        case 0: return 'success'
        case 1: return 'secondary'
        default: 'primary'
      }
    },
    gotoPlan(item,index){
      console.log(item);
      this.$router.push('/softwareTestPlanDetail/'+item.id)
    },
    exportRep(){
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = 'http://localhost:8080/api/v1/software/'+this.softwareId+'/report'
        a.target = '_blank'
        console.log(a.href);
        a.click() 
      // exportReport(this.softwareId).then(res=>{
      //   console.log("导出测试报告",res);
      // })
    }
  },
};
</script>

<style scoped>
.textInfo {
  margin-left: 50px;
  /* color: #909399; */

}
</style>
