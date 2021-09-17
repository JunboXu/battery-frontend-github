<template>
  <div class="mainArea">
      <h1 style="margin-bottom:30px;"><CIcon size="custom" name="cil-user" style="width:40px;height:40px;margin-right:30px;vertical-align:bottom" />账号设置</h1>
      <div>
        <CCard>
            <!-- <CButton
            @click="cardCollapse = !cardCollapse"
            tag="button"
            color="link" 
            block
            class="text-left shadow-none card-header"
            > 
            <h5 class="m-0">Collapsible card</h5>
            </CButton> -->
        
            <CCardBody class="m-1">
                <h3>基本信息</h3> <span style="margin-left:20px；">修改您的用户名、密码、电话等基本信息</span>
                  <el-divider></el-divider>
                <div class="formArea">
                    <h5>展示名称</h5>
                    <p style="color:rgb(153,153,153)">其他成员将会看到您的用户昵称，绝大多数的用户会将昵称设置为自己的姓名，方便团队协作中辨认身份。</p>
                    <CInput
                    v-model="userName"
                    placeholder="用户名"
                    />
                    <h5>修改密码</h5>
                    <p style="color:rgb(153,153,153)">修改您的登录密码，为了保障您的信息安全，我们建议您至少每隔3个月修改一次密码。</p>
                    <CInput
                        v-model="password"
                        placeholder="输入密码"
                        type="password"
                        horizontal
                    />
                    <h5>手机号码</h5>
                    <p style="color:rgb(153,153,153)">如果您没有设置手机号，建议您及时设置。</p>
                    <CInput
                    v-model="telephone"
                    placeholder="手机号码"
                    />        
                    <CButton block color="primary" style="width:80px;margin-top:20px" @click="updateProf">保存</CButton>
           
                </div>
            </CCardBody>         
        </CCard>
      </div>
  </div>
</template>

<script>
import { getProfile,updateProfile } from "../../api/user";

export default {
  name: 'AccountSetting',
  data() {
    return {
        userName:'',
        password:'',
        telephone:'18851111391',
        userId:''
    };
  },
  mounted(){
    this.userId = localStorage.getItem('userId');
    this.userName = localStorage.getItem('userName');
    this.getUserInfo();
  },
  computed:{
  },
  watch:{
  },
  methods: {
      updateProf(){
          if (this.password == '') {
            this.$message.error(`请在密码输入框输入密码进行验证！`);
            return;
          }
          let formdata = new FormData();
          
          formdata.append('username',this.userName);
          formdata.append('tel',this.telephone);
          formdata.append('password',this.password);
          
          updateProfile(this.userId,formdata).then(res=>{
              console.log(res,"获取用户信息");
              this.$message.success('更新成功');
              this.getUserInfo();
          })
      },
      getUserInfo(){
          getProfile(this.userId).then(res=>{
              console.log(res,"获取用户信息");
          })
      }
  },
};
</script>

<style scoped>
.mainArea{
    width: 60%;
    margin: 100px auto;
}
.formArea{
    margin-top: 40px;
}
</style>
