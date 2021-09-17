<template>
  <div class="c-app flex-row  mainPage">
    <CContainer>
      <CRow class="loginBox">
        <CCol md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>Login</h1>
                  <p class="text-muted">Sign In to your account</p>
                  <CInput
                    placeholder="Username"
                    autocomplete="username email"
                  >
                    <template #prepend-content><CIcon name="cil-user"/></template>
                  </CInput>
                  <CInput
                    placeholder="Password"
                    type="password"
                    autocomplete="curent-password"
                  >
                    <template #prepend-content><CIcon name="cil-lock-locked"/></template>
                  </CInput>
                  <CRow>
                    <CCol col="6" class="text-left">
                      <CButton color="primary" class="px-4" @click="changeSideBar">Login</CButton>
                    </CCol>
                    <CCol col="6" class="text-right">
                      <CButton color="link" class="px-0">Forgot password?</CButton>
                      <CButton color="link" class="d-lg-none">Register now!</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard
              color="primary"
              text-color="white"
              class="text-center py-5 d-md-down-none"
              body-wrapper
            >
              <CCardBody>
                <h2>Sign up</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                <CButton
                  color="light"
                  variant="outline"
                  size="lg"
                >
                  Register Now!
                </CButton>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
     

  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
        imgUrl:'../../../public/img/loginPic.png'
    };
  },
  computed:{
  },
  watch:{
  },
  methods: {},
};
</script>

<style scoped>
.mainPage{
    /* height: 100%;
    width: 100%;
    background-color: paleturquoise; */
    background: url("../../../public/img/avatars/loginPic.png") no-repeat;
    background-size:cover;
    min-width: 1000px;
    background-position:  fixed;
;
}
.loginBox{
    height: 454px;
    width: 486px;
    /* left: 48%;
    top: 30%; */
    background-color: rgb(252, 252, 252);
    position: fixed;
}
</style>
