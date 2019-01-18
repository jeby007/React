import React, {Component} from 'react'
import {Form, Input, Button, Icon} from 'antd'
import logo from '../../assets/images/logo.png'
import './index.less'
import {reqLogin} from "../../api";
import PropTypes from 'prop-types'
import storageUtils from '../../utils/storageUtils'
import MemoryUtils from "../../utils/MemoryUtils";

const Item = Form.Item
//登陆的路由组件

export default class Login extends Component {
  state = {errorMsg: ''}
  //登录请求
  login = async (username, password) => {
    const result = await reqLogin(username, password)
    if (result.status === 0) {
      const user = result.data
      storageUtils.saveUser(user)
      MemoryUtils.user = user
      this.props.history.replace('/')
    } else {
      this.setState({errorMsg: result.msg})
    }
  }

  render() {
    const {errorMsg} = this.state
    return (
      <div className='login'>
        <div className='login-header'>
          <img src={logo} alt="尚硅谷"/>
          REACT项目：后台管理系统
        </div>
        <div className='login-content'>
          <div className='login-box'>
            <div className="error-msg-wrap">
              <div className={errorMsg ? 'show' : ''}>{errorMsg}</div>
            </div>
            <div className='title'>用户登录</div>
            <NewFormLogin login={this.login}/>
          </div>
        </div>

      </div>
    )
  }
}


//包含Form的组件
class LoginForm extends React.Component {
  static propTypes = {
    login: PropTypes.func.isRequired
  }
  checkPassword = (rule, value, callback) => {
    if (!value) {
      callback('密码不能为空')
    } else if (value.length < 3) {
      callback('密码至少为3位')
    } else {
      callback()
    }
  }
  submitlogin = () => {
    this.props.form.validateFields(
      (error, values) => {
        if (!error) {
          const {username, password} = values
          this.props.login(username, password)
        }
      })
  }

  keypress=(e) => {
    if (e.keyCode===13){
      console.log('131313')
  }
  }

  render() {
    const {getFieldDecorator} = this.props.form
    return (
      <Form className='login-form'>
        <Item>
          {
            getFieldDecorator('username', {
              initialValue: 'admin',
              rules: [
                {type: 'string', required: true, message: '用户名必须输入'},
                {min: 3, message: '用户名至少3位'},
              ]
            })(
              <Input placehlder='请输入用户名' prefix={<Icon type='user'/>}/>
            )
          }
        </Item>
        <Item>
          {
            getFieldDecorator('password', {
                initialValue: 'admin',
                rules: [
                  {validator: this.checkPassword}
                ]
              }
            )(
              <Input type='password' placehlder='请输入密码' prefix={<Icon type='key'/>}/>
            )
          }
        </Item>
        <Item>
          <Button type='primary' className='login-form-button' onKeyUp={this.keypress} onClick={this.submitlogin}>登录</Button>
        </Item>
      </Form>
    )
  }
}

let NewFormLogin = Form.create()(LoginForm)