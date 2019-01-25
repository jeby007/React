import React from 'react'
import {NavLink, withRouter} from "react-router-dom";
import menuList from '../../config/menuConfig'
import {Menu, Icon} from "antd";
import logo from '../../assets/images/logo.png'
import './left-nav.less'
import MemoryUtils from "../../utils/MemoryUtils";


const SubMenu = Menu.SubMenu
const Item = Menu.Item

//左侧导航组件
class LeftNav extends React.Component {

  //判断当前用户是否看到当前item对应菜单项的权限
  hasAuth = (item) => {
    const key = item.key
    const menuSet = this.menuSet
    if (item.isPublic || MemoryUtils.user.username === 'admin' || menuSet.has(key)) {
      return true
    } else if (item.children) {
      return !!item.children.find(child => menuSet.has(child.key))
    }
  }


  //当前用户需要显示的所有menu列表-递归
  getNodes = (list) => {
    return list.reduce((pre, item) => {
      if (this.hasAuth(item)) {
        if (item.children) {
          const subMenu = (
            <SubMenu key={item.key} title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
              {this.getNodes(item.children)}
            </SubMenu>
          )
          pre.push(subMenu)
          const path = this.props.location.pathname
          const cItem = item.children.find((child => path.indexOf(child.key) === 0))
          if (cItem) {
            this.openKey = item.key
            this.selectKey = cItem.key
          }
        } else {
          const menuItem = (
            <Item key={item.key}>
              <NavLink to={item.key}>
                <Icon type={item.icon}/> {item.title}
              </NavLink>
            </Item>
          )
          pre.push(menuItem)
        }

      }
      return pre
    }, [])
  }



  //第一次渲染页面前调用
  componentWillMount() {
    this.menuSet = new Set(MemoryUtils.user.role.menus)
    this.menuNodes = this.getNodes(menuList)
  }

  render() {
    const path = this.selectKey || this.props.location.pathname
    return (
      <div className='left-nav'>
        <NavLink to='/home' className='logo'>
          <img src={logo} alt="logo"/>
          <h1>React后台系统</h1>
        </NavLink>
        <Menu mode='inline' theme='dark'
              defaultSelectedKeys={[path]}
              defaultOpenKeys={[this.openKey]}
        >
          {this.menuNodes}
        </Menu>
      </div>

    )
  }
}

//将非路由组件包装成路由组件，路由组件有非路由组件的3个属性:history/location/match
export default withRouter(LeftNav)