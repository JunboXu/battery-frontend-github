export function checkPermission(identity,permission) {
    // console.log('身份：',identity);
    let myPermission = permissionMapper[identity];
    return myPermission.includes(permission)
}

export const  permissionMapper = [
    [//超级管理员
        'CHECK','EDIT','DELETE','CREATE','EXECUTE','DELETE','CONFIRM','EXPORT'
    ],
    [//管理员
        'CHECK','EDIT','DELETE','CREATE','EXECUTE','DELETE','CONFIRM','EXPORT'
    ],
    [//工程师
        'CHECK','EXECUTE'
    ]
]

//权限验证思路：组件显示与否与操作绑定，所以组件vif 这个人是否有这个操作的权限，（变更点权限可能增加 -->用二维数组表示，这样给后台可增加的空间
//这个人操作的权限根据identity识别并赋值，(变更点identity可能增加-->一个identity对应一组权限，所以用他来做下标即可
//所以实现就是：组件checkPermission(身份，组件需要的权限) return boolean

//修改意见：no-surprising 搞成一个表或者键值对