import React, {Component} from "react";
import Add from './add/add'
import List from './list/list'

export default class App extends Component {
    state = {
        comments: [
            {username: 'Tom', content: 'OK'},
            {username: 'Jim', content: 'So easy'},

        ]
    }
    addComment = (comment) => {
        const {comments} = this.state
        comments.unshift(comment)
        this.setState({
            comments
        })
    }
    removeComment = (index) => {
        const {comments}=this.state
        comments.splice(index,1)
        this.setState({
           comments
        })

    }

    render() {
        const {comments} = this.state
        return (
            <div>
                <header className="site-header jumbotron">
                    <div className="container">
                        <div className="row">
                            <div className="col-xs-12">
                                <h1>请发表对React的评论</h1>
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container">
                    <Add addComment={this.addComment}/>
                    <List comments={comments} removeComment={this.removeComment}/>
                </div>
            </div>
        )
    }
}