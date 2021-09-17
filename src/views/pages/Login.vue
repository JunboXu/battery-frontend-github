<template>
  <div class="c-app mainPage mmm"  v-loading="loading">
    <div class=" loginBox">
      <div class="inputArea">
        <h3 class="inputHeader">用户登录 <span class="logtext">LOGIN</span></h3> 
        <el-input
          placeholder="用户名"
          v-model="userName"
          clearable
          style="margin-bottom:43px">
        </el-input>
        <!-- <span>忘记密码？</span> -->
        <el-input placeholder="密码" v-model="password" show-password style="margin-bottom:66px">

        </el-input>
            <CButton block style="backgroundColor:#44C9D1;color:white;height:46px" @click="loginNow">登录</CButton>
      </div>  
    </div>
  </div>
</template>

<script>
import { login } from "../../api/user";
export default {
  name: 'Login',
  data(){
    return{
      userName:'',
      password:'',
      loading:false
    }
  },
  methods:{
    changeSideBar(){
      this.$router.push('/')
    },
    loginNow(){
      this.loading =true;
      let formdata = new FormData();
      formdata.append('username',this.userName);
      formdata.append('password',this.password);
      localStorage.setItem('userName',this.userName)
      localStorage.setItem('userId',this.password)
      this.loading =false;

      this.$router.push('/dashboard');
      // login(formdata).then(res=>{
      //   console.log(res,"登录res");
      //   if (res.status==40001) {
      //     this.$message.danger('请勿重复登录！');
      //     this.loading = false;
      //     return;
      //   }
      //   localStorage.setItem('identity',res.identify);
      //   // this.$store.commit('set', ['identity',res.identify])

      //   localStorage.setItem('accessToken',res.token)
      //   localStorage.setItem('userName',res.username)
      //   localStorage.setItem('userId',res.userid)

      //   console.log("登录结果",res);
      //   // console.log(this.$store.state);
      //   this.loading =false;
      //   this.$router.push('/dashboard')
      // })
    }
  }
}
</script>

<style scoped>
.mainPage{
    background: url("../../../public/img/avatars/loginPic.png") no-repeat;
    background-attachment: fixed;
    background-size:cover;
    /* margin: 3px; */
}
.loginBox{
    height: 30%;
    width: 30%;
    margin-left: 50%;
    margin-top: 260px;
    min-width: 400px;
    min-height: 400px;
    /* left: 48%;
    top: 30%; */
    /* left: 50%; */
    background-color: rgb(252, 252, 252);
    position: fixed;
}
.mmm{
    min-width: 1200px;
}
.inputArea{
  margin: 50px 50px;
}
.inputHeader{

  font-size: 27px;
  font-family: Source Han Sans CN;
  font-weight: 400;
  color: #444444;
  margin-bottom: 42px;
}
.logtext{
width: 50px;
height: 13px;
font-size: 16px;
font-family: Source Han Sans CN;
font-weight: 400;
color: #A9A9B5;
}
.loginBtn{
  width: 349px;
  height: 46px;
  background: #19A97B;
}
</style>