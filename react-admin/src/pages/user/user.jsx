import React, {Component} from 'react'
import {Card, Button, Table, Modal, message, Form, Input, Select} from "antd";
import {formateDate} from "../../utils/utils";
import {reqUsers, reqAddOrUpdateUser, reqDeleteUser} from "../../api";
import {PropTypes} from 'prop-types'

const Item = Form.Item
const Option=Select.Option
/*
后台管理的用户管理路由组件
 */
export default class User extends Component {
  state = {
    isShow: false,
    users: []
  }
  initColumns = () => {
    this.columns = [
      {
        title: '用户名',
        dataIndex: 'username',
        align: 'center'
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        align: 'center'
      },
      {
        title: '电话',
        dataIndex: 'phone',
        align: 'center'
      },
      {
        title: '注册时间',
        dataIndex: 'create_time',
        align: 'center',
        render: formateDate
      },
      {
        title: '所属角色',
        align: 'center',
        dataIndex: 'role_id',
        render: value => this.roleNames[value]
      },
      {
        title: '操作',
        align: 'center',
        render: (user) => (
          <span>
            <a href="javascript:;" onClick={() => this.showUpdate(user)}>修改</a>
            &nbsp;&nbsp;
            <a href="javascript:;" onClick={() => this.clickDelete(user)}>删除</a>
          </span>
        )
      },

    ]
  }
  //删除用户
  clickDelete = (user) => {
    Modal.confirm({
      content: `确定删除${user.username}吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const result = await reqDeleteUser(user._id)
        if (result.status === 0) {
          message.success('删除用户成功')
          this.getUsers()
        } else {
          message.error('删除用户失败，请重试！')
        }
      }
    })
  }
  //添加/更新用户
  AddorUpdateUser = async () => {
    const user=this.form.getFieldsValue()
    this.form.resetFields()
    if (this.user){
      user._id=this.user._id
    }
    this.setState({
      isShow:false
    })
    const result=await reqAddOrUpdateUser(user)
    if (result.status===0){
      message.success('成功')
      this.getUsers()
    } else {
      message.error('失败，请重试！')
    }
  }

  //初始化显示user对应的角色
  initRoleNames = (roles) => {
    this.roleNames = roles.reduce((pre, role) => {
      pre[role._id] = role.name
      return pre
    }, {})
  }
  //获取用户列表
  getUsers = async () => {
    const result = await reqUsers()
    if (result.status === 0) {
      const {users, roles} = result.data
      this.initRoleNames(roles)
      this.setState({
        users, roles
      })
    }
  }
  //显示创建用户modal
  showAddUser = () => {
    this.user=null
    this.setState({
      isShow: true
    })
  }

  //显示修改用户modal
  showUpdate=(user)=>{
    this.user=user
    this.setState({
      isShow:true
    })
  }

  componentWillMount() {
    this.initColumns()
  }

  componentDidMount() {
    this.getUsers()
  }

  render() {
    const {users, isShow, roles} = this.state
    const user = this.user || {}
    return (
      <div>
        <Card>
          <Button type='primary' onClick={this.showAddUser}>创建用户</Button>
        </Card>
        <Table
          columns={this.columns}
          rowKey='_id'
          dataSource={users}
          bordered
          pagination={{defaultPageSize: 10, showQuickJumper: true}}
        />
        <Modal
          title={user._id ? '修改用户' : '添加用户'}
          visible={isShow}
          onCancel={() => this.setState({isShow: false})}
          onOk={this.AddorUpdateUser}
          okText='确定'
          cancelText='取消'
        >
          <UserForm setForm={form => {
            this.form = form
          }} user={user} roles={roles}/>
        </Modal>
      </div>
    )
  }
}


//添加或更新的Form组件
class UserForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired,
    user: PropTypes.object,
    roles: PropTypes.array
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const {getFieldDecorator} = this.props.form
    const formItemLayout = {
      labelCol: {span: 5},
      wrapperCol: {span: 16}
    }
    const {user, roles} = this.props
    console.log(roles)
    return (
      <Form>
        <Item label='用户名' {...formItemLayout}>
          {
            getFieldDecorator('username', {
              initialValue: user.username
            })(<Input placeholder='请输入用户名'/>)
          }
        </Item>
        {
          !user._id?(

            <Item label='密码' {...formItemLayout}>
              {
                getFieldDecorator('password', {
                  initialValue:''
                })(<Input placeholder='请输入密码'/>)
              }
            </Item>
            ):null
        }
        <Item label='手机号' {...formItemLayout}>
          {
            getFieldDecorator('phone', {
              initialValue: user.phone
            })(<Input placeholder='请输入手机号'/>)
          }
        </Item>
        <Item label='邮箱' {...formItemLayout}>
          {
            getFieldDecorator('email', {
              initialValue: user.email
            })(<Input placeholder='请输入邮箱'/>)
          }
        </Item>
        <Item label='角色' {...formItemLayout}>
          {
            getFieldDecorator('role_id', {
              initialValue: user.role_id
            })(
              <Select>
                {roles.map(role => <Option key={role._id}>{role.name}</Option>)}
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}

UserForm = Form.create()(UserForm)
