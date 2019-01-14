import React, {Component} from 'react'
import {Form, Input, Button, Icon} from 'antd'
import logo from '../../assets/images/logo.png'
import './index.less'

const Item = Form.Item
//登陆的路由组件

export default class Login extends Component {
  render() {
    return (
      <div className='login'>
        <div className='login-header'>
          <img src={logo} alt="尚硅谷"/>
          REACT项目：后台管理系统
        </div>
        <div className='login-content'>
          <div className='login-box'>
            <div className='title'>用户登录</div>
            <NewFormLogin/>
          </div>
        </div>

      </div>
    )
  }
}

class LoginForm extends React.Component {
  checkPassword = (rule, value, callback) => {
    if (!value) {
      callback('密码不能为空')
    } else if (value.length < 3) {
      callback('密码至少为3位')
    } else if (!/^[a-z0-9]+$/.test(value)){
      callback('密码必须为字母和数字组合')
    }
    else {
      callback()
    }
  }
  submitlogin = () => {
    this.props.form.validateFields(
      (error) => {
        if (error) {
          this.props.form.resetFields()
        }
      })
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
          <Button type='primary' className='login-form-button' onClick={this.submitlogin}>登录</Button>
        </Item>
      </Form>
    )
  }
}

let NewFormLogin = Form.create()(LoginForm)