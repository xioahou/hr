// 导出靠请路由规则
import Layout from '@/layout'
import salarys from '@/views/salarys'
export default {
  // 路由规则
  path: '/salarys',
  name: 'salarys', // 给模块的二级路由加一一个name 后面做权限的时候需要
  component: Layout,
  children: [{
    path: '', // 二级路由的path什么都不写的时候，此时他表示二级路由的默认路由
    component: salarys,
    // 路由园信息，存储数据地方，可以放任何内容
    meta: {
      title: '工资', // 因为左侧导航栏要用title
      icon: 'money'
    }
  }]
}
