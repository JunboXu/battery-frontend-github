<template>
    <div>
    <CCard>
      <CCardHeader>测试计划管理</CCardHeader>
      <CCardBody v-if="checkPerm('CREATE')">
        <CButton block color="primary" style="width:100px"  @click="createPlanModal = true"  >+新建</CButton>
      </CCardBody>
    </CCard>
    <CModal
      :show.sync="createPlanModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="primary"
    >
      <CInput
        label="名称"
        v-model="newPlan.title"
        placeholder="请输入测试计划名称"
      />
      <CInput 
          label="描述"
          v-model="newPlan.description"
          placeholder="输入测试计划描述"
      />
      <p style="marginBottom:6px">测试目标</p>

      <el-select v-model="newPlan.softwareId" clearable placeholder="请选择所属测试目标" @change="selectTarget" @clear="newPlan.version = ''">
        <el-option
          v-for="item in softwareList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
       <p style="marginBottom:10px;marginTop:10px">所属版本</p>
      <el-select v-model="newPlan.version" clearable placeholder="请选择版本">
        <el-option
          v-for="item in versions"
          :key="item.version"
          :label="item.version"
          :value="item.version">
        </el-option>
      </el-select>
      <!-- //todo coreui CMultiSelect没法使用？？为什么显示我注册不成功 -->
      <!-- <CMultiSelect
          :options="softwareList"
          :search="true"
          :selected="[]"
          :selection="true"
          inline
          optionsEmptyPlaceholder="无可选测试目标"
          searchPlaceholder="搜索"
          selectionType="tags"
      >
      </CMultiSelect> -->
      <p style="marginBottom:6px;marginTop:10px">请上传测试计划说明文档</p>
      <el-upload
        class="upload-demo"
        action=""
        :auto-upload="false"
        :limit="5"
        ref="newPlanUploader"
        :file-list="fileList">
        <el-button size="small" style="backgroundColor:rgb(50,31,219);color:white">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">文件大小限制不超过20M,最多上传5个文件</div>
      </el-upload>
      <template #header>
        <h6 class="modal-title">新建测试计划</h6>
        <CButtonClose @click="createPlanModal = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="createPlanModal = false" color="danger">取消</CButton>
        <CButton @click="createNewPlan" style="backgroundColor:rgb(50,31,219);color:white">新建</CButton>
      </template>
    </CModal>
    <CCard>
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
            <td class="py-2"  v-if="checkPerm('CHECK')">
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
            <td class="py-2"  v-if="checkPerm('COPY')">
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
            <td class="py-2">
              <CButton
                color="danger"
                variant="outline"
                square
                size="sm"
                style="width:50px"
                @click="deletePlanFirstStep(item,index)" v-if="checkPerm('DELETE')">
              删除
              </CButton>
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>
    <CModal
      :show.sync="deletePlanModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="danger">
             <h5>你确定删除该计划吗？删除后将无法查看任何与该计划的相关信息！</h5> 
      <template #header>
        <h6 class="modal-title">删除测试计划</h6>
        <CButtonClose @click="deletePlanModal = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="deletePlanModal = false" color="danger">取消</CButton>
        <CButton @click="deletePlanNow" style="backgroundColor:rgb(50,31,219);color:white">删除</CButton>
      </template>
    </CModal>
 

  </div>
</template>

<script>
import { planStateFilter , targetDateFilter } from '../../utils/filters';
import { getSoftwareList , checkSoftware } from '../../api/software'
import { createPlan,getPlanList, deletePlan } from '../../api/testPlan'
import { checkPermission } from "../../utils/permission";

export default {
  name: 'testPlan',
  // components:{CMultiSelect},
  data() {
    return {
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
      fileList:[],
      softwareList:[
      ],
      createPlanModal:false,
      newPlan:{},
      versions:[],
      deletePlanModal:false,
      planSelected:{}
    };
  },
  computed:{
  },
  watch:{
  },
  mounted(){
    getSoftwareList("","","").then(res=>{
      this.softwareList=res;
    })
    this.getPlans();
  },
  filters:{planStateFilter},
  methods: {
    getBadge (status) {
      switch (status) {
        case 0: return 'success'
        case 1: return 'secondary'
        default: 'primary'
      }
    },
    createNewPlan(){
      // if (this.newPlan.name=="" || this.newTarget.type=="" || this.newTarget.version=="") {
      //   this.$message.warning("请完整填写任务信息！");
      //   return;
      // }
      if (this.$refs['newPlanUploader'].uploadFiles.length < 1) {
        this.$message.warning("文件数量至少为 1 ！");
        return;
      }
      // else if (this.$refs['newPlanUploader'].uploadFiles.length > 5) {
      //   this.$message.warning("请上传文件！");
      //   return;
      // }
      let isLt20M;
      let formData = new FormData()
      if (this.$refs['newPlanUploader'].uploadFiles.length >= 1) {
        // 检查文件格式和大小
          this.$refs['newPlanUploader'].uploadFiles.forEach((element,index) => {
            isLt20M = element.size / 1024 / 1024 < 20
            if (!isLt20M) {
              this.$message.info('单个文件大小不能超过20M')
              return false
            }
            //software_id,version_number,title,description,files,creator
            formData.append('files', element.raw);
          }); 
      }
      formData.append('software_id', this.newPlan.softwareId);
      formData.append('version_number',this.newPlan.version);
      formData.append('description',this.newPlan.description);
      formData.append('title',this.newPlan.title);
      formData.append('creator','TestLaboratory_V1_User_1');
      //todo写csdn  formdata传数组
      createPlan(formData).then(res=>{
        this.getPlans();
      })
        this.createPlanModal = false

    },
    getPlans(){
      getPlanList().then(res =>{

        this.planList=targetDateFilter(res);
      })
    },
    gotoPlan(item){
      this.$router.push('/softwareTestPlanDetail/'+item.id);
    },
    copyPlan(){},
    deletePlanFirstStep(item){
      this.deletePlanModal =  true;
      this.planSelected = item;
    },
    deletePlanNow(){
      deletePlan(this.planSelected.id).then(res =>{
        this.getPlans();
        this.deletePlanModal=false;
      })
    },
    selectTarget(){
      //选中目标时更新版本内容
      checkSoftware(this.newPlan.softwareId).then(res=>{
        this.versions=res.versions;
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
