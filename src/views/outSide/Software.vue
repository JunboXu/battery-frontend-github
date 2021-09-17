<template>
  <div>
    <CCard>
      <CCardHeader>测试项目管理</CCardHeader>
      <CCardBody   v-if="checkPerm('CREATE')">
        <CButton block color="primary" style="width:100px"  @click="darkModal = true">+新建</CButton>
      </CCardBody>
    </CCard>
    <CModal
      :show.sync="darkModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="primary"
    >
      <CInput
        label="名称"
        v-model="newTarget.name"
        placeholder="请输入测试项目名称"
      />
      <CInput 
          label="类型"
          v-model="newTarget.type"
          placeholder="请输入测试项目的类型"
      />
      <CInput
          label="版本"
          v-model="newTarget.version"
          placeholder="请输入测试项目的版本"
      />
      <p style="marginBottom:6px">请上传软件</p>
    <el-upload
      class="upload-demo"
      action=""
      :auto-upload="false"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :limit="1"
      ref="newTargetUploader"
      :on-exceed="handleExceed"
      :file-list="fileList">
      <el-button size="small" style="backgroundColor:rgb(50,31,219);color:white">点击上传</el-button>
      <div slot="tip" class="el-upload__tip">文件大小限制不超过20M</div>
    </el-upload>
      <template #header>
        <h6 class="modal-title">新建测试项目</h6>
        <CButtonClose @click="darkModal = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="darkModal = false" color="danger">取消</CButton>
        <CButton @click="createNewTarget" style="backgroundColor:rgb(50,31,219);color:white">新建</CButton>
      </template>
    </CModal>
    <CCard>
      <CCardBody>
        <CDataTable
          :items="softwareList"
          :fields="fields"
          :sorter="true"
          :tableFilter='{ label:"搜索",placeholder:"输入任意信息检索" }'
          :noItemsView='{ noResults: "无结果", noItems: "无测试项目" }'
          cleaner
          :items-per-page="5"
          hover
          :pagination="{ doubleArrows: true, align: 'center'}"
        >
        <template #opt_details="{item, index,}">
            <td class="py-2"  v-if="checkPerm('CHECK')">
              <CButton
                color="success"
                variant="outline"
                square
                size="sm"
                style="width:50px"
                @click="gotoSoftware(item, index)"
              >
              查看
              </CButton>
            </td>
          </template>
          <template  #opt_copy="{item, index}" >
            <td class="py-2"  v-if="checkPerm('COPY')">
              <CButton
                color="primary"
                variant="outline"
                square
                size="sm"
                
                style="width:50px"
                @click="copySoftware(item, index)"
              >
              复制
              </CButton>
            </td>
          </template>
          <template #opt_delete="{item, index}">
            <td class="py-2"  v-if="checkPerm('DELETE')">
              <CButton
                color="danger"
                variant="outline"
                square
                size="sm"
                style="width:50px"
                @click="deleteFirstStep(item,index)"
              >
              删除
              </CButton>
            </td>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>
    <CModal
      :show.sync="deleteModal"
      :no-close-on-backdrop="true"
      :centered="true"
      title="Modal title 2"
      size="lg"
      color="danger">
             <h5>你确定删除该项目吗？删除后将无法查看任何与该项目的相关信息！</h5> 
      <template #header>
        <h6 class="modal-title">删除测试项目</h6>
        <CButtonClose @click="deleteModal = false" class="text-white"/>
      </template>
      <template #footer>
        <CButton @click="deleteModal = false" color="danger">取消</CButton>
        <CButton @click="deleteTarget()" style="backgroundColor:rgb(50,31,219);color:white">删除</CButton>
      </template>
    </CModal>
 

  </div>
</template>

<script>
import CTableWrapper from '../base/Table.vue'
import {getSoftwareList,deleteSoftware,editSoftware,createSoftware} from '../../api/software'
import {targetDateFilter} from '../../utils/filters'
import { checkPermission } from "../../utils/permission";

export default {
  name: 'software',
  components: { CTableWrapper },

  data() {
    return {
      softwareList:[
        { name: 'Samppa Nori', type:'web',create_time: '2012/01/01', update_time: '2012/01/01', id:1},
        { name: 'Samppa Nori', type:'web',create_time: '2012/01/01', update_time: '2012/01/01', id:1},
        { name: 'Samppa Nori', type:'web',create_time: '2012/01/01', update_time: '2012/01/01', id:1},
        { name: 'Samppa Nori', type:'web',create_time: '2012/01/01', update_time: '2012/01/01', id:1},
        { name: 'Samppa Nori', type:'web',create_time: '2012/01/01', update_time: '2012/01/01', id:1},
        { name: 'Samppa Nori', type:'web',create_time: '2012/01/01', update_time: '2012/01/01', id:1},
        { name: 'Samppa Nori', type:'web',create_time: '2012/01/01', update_time: '2012/01/01', id:1},
      ],
      fields : [
                { key: 'name', label: '名称', _style:'min-width:200px;' },
                { key: 'type',label: '类型', _style:'min-width:200px;' },
                { key: 'create_time',label: '创建时间', _style:'min-width:100px;' },
                { key: 'update_time',label: '更新时间', _style:'min-width:100px;' },
                { 
                  key: 'opt_details', 
                  label: '', 
                  _style: 'width:1%', 
                  sorter: false, 
                  filter: false
                },
                { 
                  key: 'opt_copy', 
                  label: '', 
                  _style: 'width:1%', 
                  sorter: false, 
                  filter: false
                },
                { 
                  key: 'opt_delete', 
                  label: '', 
                  _style: 'width:1%;', 
                  sorter: false, 
                  filter: false
                },

      ],
      darkModal: false,
      fileList: [],
      deleteModal: false,
      deleteItem:{},
      newTarget:{},
      dd:false
    };
  },
  computed:{
  },
  mounted(){
    this.getSList();
  },
  watch:{
  },
  methods: {
    shuffleArray (array) {
      for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = array[i]
        array[i] = array[j]
        array[j] = temp
      }
      return array
    },//洗牌

    getShuffledSoftwareData () {
      return this.softwareList.slice(0)
    },

    gotoSoftware(item,index){
      localStorage.setItem('softwareId',item.id)
      this.$router.push('/softwareInside/'+item.id)
    },
    deleteTarget(){
      deleteSoftware(this.deleteItem.id).then(res=>{
        this.deleteModal = false
        this.getSList();
      })


    },
    copySoftware(item,index){
    },
    clickRow(item, index, column, event){
  this.$router.push("/softwareInside/"+item.id);
    },
    handleRemove(file, fileList) {
      },
    handlePreview(file) {
      },
    handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 1 个文件`);
      },
    beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
    getSList(){
      getSoftwareList("","","").then( (res)=>{
        this.softwareList = targetDateFilter(res)
      } )
    },
    deleteFirstStep(item,index){
      this.deleteModal=true;
      this.deleteItem=item;
    },
    createNewTarget(){
      if (this.newTarget.name=="" || this.newTarget.type=="" || this.newTarget.version=="") {
        this.$message.warning("请完整填写任务信息！");
        return;
      }
      if (this.$refs['newTargetUploader'].uploadFiles.length < 1) {
        this.$message.warning("请上传文件！");
        return;
      }
      let file;
      let isLt20M;
      if (this.$refs['newTargetUploader'].uploadFiles.length >= 1) {
        // 检查文件格式和大小
        file = this.$refs['newTargetUploader'].uploadFiles.pop()
        isLt20M = file.size / 1024 / 1024 < 20
        if (!isLt20M) {
          this.$message.info('测试用例集文件大小不能超过20M')
          this.$refs['newTargetUploader'].uploadFiles.pop()
          return false
        }
      }
      let formData = new FormData()
      if (file) {
        formData.append('file', file.raw);
      }
      formData.append('version', this.newTarget.version);
      formData.append('name',this.newTarget.name);
      formData.append('type',this.newTarget.type);

      createSoftware(formData).then(res=>{
        this.$message.success('新建成功')

        this.darkModal = false;
        this.getSList();
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
