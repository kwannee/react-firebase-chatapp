import React, { Component } from 'react'
import Message from './Message'
import MessageForm from './MessageForm'
import MessageHeader from './MessageHeader'
import {connect} from 'react-redux'
import firebase from '../../../firebase'
// rfce(함수형)으로 했더니 안되는 부분이 많아서 클래스 컴포넌트(rce)로 만들었다.
export class MainPanel extends Component {

    state = {
        messages:[],
        messagesRef:firebase.database().ref("messages"),
        messagesLoading:true,
        searchTerm:"",
        searchResults:[],
        searchLoading:false
    }
    //클래스 컴포넌트는 리덕스를 하기위해서 connect를 써야함.
    componentDidMount(){
        const {chatRoom} = this.props
        if(chatRoom){
            this.addMessagesListeners(chatRoom.id)
        }
    }
    handleSearchMessages = ()=>{
        const chatRoomMessages =[...this.state.messages]
        const regex = new RegExp(this.state.searchTerm,"gi")
        const searchResults = chatRoomMessages.reduce((acc,message)=>{
            if((message.content && message.content.match(regex)) ||
                message.user.name.match(regex)
            ){
                acc.push(message)
            }
            return acc;
        }, [])
        this.setState({searchResults})
    }
    handleSearchChange = event =>{
        this.setState({
            searchTerm:event.target.value,
            searchLoading:true
        },
        () => this.handleSearchMessages())
    }
    addMessagesListeners = (chatRoomId) =>{
        let messagesArray = [];
        this.state.messagesRef.child(chatRoomId).on("child_added",DataSnapshot =>{
            messagesArray.push(DataSnapshot.val())
            this.setState({
                messages:messagesArray,
                messagesLoading:false
            })
        })
    }
    renderMessages =(messages) =>
        messages.length > 0 &&
        messages.map(message=>(
            <Message
                key={message.timestamp}
                message={message}
                user={this.props.user}
            />)
        )
    render() { 
        const {messages,searchTerm,searchResults} = this.state;
        return (
            <div style={{padding: '2rem 2rem 0 2rem'}}>
                <MessageHeader handleSearchChange={this.handleSearchChange}/>
                <div style={{
                    width:'100%',
                    height:'450px',
                    border:'.2rem solid #ececec',
                    borderRadius:'4px',
                    padding:'1rem',
                    marginBottom:'1rem',
                    overflowY: 'auto'
                }}>
                    {searchTerm ? 
                this.renderMessages(searchResults)
                :
                this.renderMessages(messages)    
                }
                </div>
                <MessageForm/>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return{
        user:state.user.currentUser,
        chatRoom:state.chatRoom.currentChatRoom
    }
}
export default connect(mapStateToProps)(MainPanel) 
