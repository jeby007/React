import React, {Component, PureComponent} from 'react'
import PropTypes from 'prop-types'
import {Card, Button, Table, Form, Input, Modal, message, Tree} from "antd";
import {reqRoles, reqAddRole, reqUpdateRoles} from "../../api";
import {formateDate} from "../../utils/utils";
import menuList from "../../config/menuConfig";
import MemoryUtils from '../../utils/MemoryUtils'
import storageUtils from '../../utils/storageUtils'

const FormItem = Form.Item
const {TreeNode} = Tree
/*
后台管理的角色管理路由组件
 */
export default class Role extends Component {
  state = {
    isShowAdd: false,
    isShowRoleTree: false,
    roles: [],
    role: {},
    menus: []
  }

  //获取角色列表
  getRoles = async () => {
    const result = await reqRoles()
    if (result.status === 0) {
      const roles = result.data
      this.setState({roles})
    }
  }

  //显示创建角色modal
  showRole = () => {
    this.setState({
      isShowAdd: true
    })
  }

  //创建/添加角色
  addRole = async () => {
    const roleName = this.form.getFieldValue('roleName')
    this.form.resetFields()   //重置Form
    this.setState({
      isShowAdd: false
    })
    const result = await reqAddRole(roleName)
    if (result.status === 0) {
      message.success('添加角色成功')
      const role = result.data
      const roles = [...this.state.roles]
      roles.push(role)
      this.setState({
        roles: roles
      })
    } else {
      message.error('添加角色失败')
    }
  }


  //初始化Table数据
  initColumns = () => {
    this.columns = [
      {title: '角色名称', dataIndex: 'name', align: 'center'},
      {title: '创建时间', dataIndex: 'create_time', align: 'center', render: formateDate},
      {title: '授权时间', dataIndex: 'auth_time', align: 'center', render: formateDate},
      {title: '授权人', align: 'center', dataIndex: 'auth_name'}
    ];
  }

  //radio行点击监听
  onRow = (role) => {
    return {
      onClick: (e) => {
        this.setState({
          role,
          menus: role.menus
        })
      }
    }
  }

  //权限管理Modal显示
  showRoleTree = () => {
    this.setState({
      isShowRoleTree: true
    })
  }

  //更新角色权限
  updateRole = async () => {
    this.setState({isShowRoleTree: false})
    const {role, menus} = this.state
    role.menus = menus
    const result = await reqUpdateRoles(role)
    if (result.status === 0) {
      if (MemoryUtils.user.role_id === role._id) {
        storageUtils.removeUser()
        MemoryUtils.user = {}
        this.props.history.replace('/login')
        message.info('当前用户的权限已更新，请重新登录')
      } else {
        message.success('授权成功')
        this.getRoles()
      }
    }
  }

  //更新角色的menus
  setRoleMenus = (menus) => {
    this.setState({
      menus
    })
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getRoles()
  }

  render() {
    const {roles, isShowAdd, role, isShowRoleTree, menus} = this.state

    //单选radio按钮
    const rowSelection = {
      type: 'radio',
      selectedRowKeys: [role._id],
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          role: selectedRows[0]
        })
      },
    }


    return (
      <div>
        <Card>
          <Button type='primary' style={{marginRight: 20}} onClick={this.showRole}>创建角色</Button>
          <Button type='primary' onClick={this.showRoleTree} disabled={!role._id}>设置角色权限</Button>
        </Card>

        <Table
          columns={this.columns}
          rowKey='_id'
          dataSource={roles}
          bordered
          onRow={this.onRow}
          rowSelection={rowSelection}
          pagination={{defaultPageSize: 10, showQuickJumper: true}}
        />
        <Modal
          title='创建角色'
          visible={isShowAdd}
          onCancel={() => {
            this.setState({isShowAdd: false})
          }}
          onOk={this.addRole}
          okText='确定'
          cancelText='取消'
        >
          <AddRole setForm={form => this.form = form}/>
        </Modal>


        <Modal
          title='权限管理'
          visible={isShowRoleTree}
          onCancel={() => {
            this.setState({isShowRoleTree: false})
          }}
          onOk={this.updateRole}
          okText='确定'
          cancelText='取消'
        >
          <RoleTreeForm
            roleName={role.name}
            menus={menus}
            setRoleMenus={this.setRoleMenus}
          />
        </Modal>
      </div>
    )
  }
}


//添加角色的Form组件
class AddRole extends PureComponent {
  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    }
    return (
      <Form>
        <FormItem label='角色名称'{...formItemLayout}>
          {
            getFieldDecorator('roleName', {
              initialValue: ''
            })(<Input placeholder='请输入角色名称'/>)
          }
        </FormItem>
      </Form>
    )
  }
}

AddRole = Form.create()(AddRole)


//更新权限的Form组件
class RoleTreeForm extends PureComponent {
  static propTypes = {
    roleName: PropTypes.string,
    menus: PropTypes.array,
    setRoleMenus: PropTypes.func
  }
  onCheck = (checkedKeys, info) => {
    this.props.setRoleMenus(checkedKeys)
  }
  renderTreeNodes = (menuList) => {
    return menuList.reduce((pre, menu) => {
      const node = (
        <TreeNode title={menu.title} key={menu.key}>
          {
            menu.children ? this.renderTreeNodes(menu.children) : null
          }
        </TreeNode>
      )
      pre.push(node)
      return pre
    }, [])
  }

  render() {
    const {roleName, menus} = this.props
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    }
    return (
      <Form>
        <FormItem label='角色名称'{...formItemLayout}>
          <Input value={roleName} disabled/>
        </FormItem>
        <Tree
          checkable
          defaultExpandAll
          onCheck={this.onCheck}
          checkedKeys={menus}
        >
          <TreeNode title='权限管理' key='haha'>
            {
              this.renderTreeNodes(menuList)
            }
          </TreeNode>
        </Tree>
      </Form>
    )
  }
}

