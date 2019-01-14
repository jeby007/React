import React, {Component} from "react";
import PropTypes from 'prop-types'
import './index.css'

export default class $ extends Component {
    static propTypes = {
        comment: PropTypes.object.isRequired
    }
    removeComment=()=>{
        this.props.removeComment(this.props.index)
    }
    render() {
        const {content,username} = this.props.comment
        return (
            <li className="list-group-item">
                <div className="handle">
                    <a href="javascript:;" onClick={this.removeComment}>删除</a>
                </div>
                <p className="user"><span>{username}</span><span>说:</span></p>
                <p className="centence">{content}</p>
            </li>
        )
    }
}