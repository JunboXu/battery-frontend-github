<template>
  <CDropdown
    inNav
    class="c-header-nav-items"
    placement="bottom-end"
    add-menu-classes="pt-0"
  >
    <template #toggler>
      <CHeaderNavLink >
        <div class="c-avatar">
          <el-button> <CIcon name="cil-user" />{{userName}}</el-button> 
          <!-- <img
            src="img/avatars/6.jpg"
            class="c-avatar-img "
          /> -->
        </div>
      </CHeaderNavLink>
    </template>
    <!-- <CDropdownHeader tag="div" class="text-center" color="light">
      <strong>账号</strong>
    </CDropdownHeader>
    <CDropdownItem>
      <CIcon name="cil-bell"/> Updates
      <CBadge color="info" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-envelope-open" /> Messages
      <CBadge color="success" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-task" /> Tasks
      <CBadge color="danger" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-comment-square" /> Comments
      <CBadge color="warning" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem> -->
    <CDropdownHeader
      tag="div"
      class="text-center"
      color="light"
    >
      <strong>设置</strong>
    </CDropdownHeader>
    <CDropdownItem @click="jumpToAccountSetting">
      <CIcon name="cil-user" /> 账号设置
    </CDropdownItem>
    <!-- <CDropdownItem>
      <CIcon name="cil-settings" /> Settings
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-dollar" /> Payments
      <CBadge color="secondary" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem>
    <CDropdownItem>
      <CIcon name="cil-file" /> Projects
      <CBadge color="primary" class="mfs-auto">{{ itemsCount }}</CBadge>
    </CDropdownItem> -->
    <CDropdownDivider/>
    <!-- <CDropdownItem>
      <CIcon name="cil-shield-alt" /> Lock Account
    </CDropdownItem> -->
    <CDropdownItem @click="logOut">
      <CIcon name="cil-lock-locked" /> 登出
    </CDropdownItem>
  </CDropdown>
</template>

<script>
export default {
  name: 'TheHeaderDropdownAccnt',
  data () {
    return { 
      itemsCount: 42,
      userName:''
    }
  },
  mounted(){
    this.userName = localStorage.getItem('userName')
  },
  methods:{
    jumpToAccountSetting(){
      this.$router.push('/accountSetting')
    },
    logOut(){
      localStorage.clear();
      this.$router.push('/pages/login')
    }
  }
}
</script>

<style scoped>
  .c-icon {
    margin-right: 0.3rem;
  }
</style>