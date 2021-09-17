export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: '返回项目列表',
        to: '/softwares',
        icon: { name: 'cil-chevron-top', class: 'text-white' },
        // badge: {
        //   color: 'primary',
        //   text: 'NEW'
        // }
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['项目']
      },
      {
        _name: 'CSidebarNavItem',
        name: '项目概况',
        //todo 如何写这个to呢？一定要用缓存吗？
        to: '/softwareDetail/'+localStorage.getItem('softwareId'),
        icon: 'cil-drop'
      },
      {
        _name: 'CSidebarNavItem',
        name: '测试计划',
        to: '/softwareTestPlan/'+localStorage.getItem('softwareId'),
        icon: 'cil-pencil'
      },
      {
        _name: 'CSidebarNavItem',
        name: '测试任务',
        to: '/softwareTestTask/'+localStorage.getItem('softwareId'),
        icon: 'cil-bell'
      },
      {
        _name: 'CSidebarNavItem',
        name: '不合格项',
        to: '/softwareTestNoPass/'+localStorage.getItem('softwareId'),
        icon: 'cil-ban'
      },
    ]
  }
]