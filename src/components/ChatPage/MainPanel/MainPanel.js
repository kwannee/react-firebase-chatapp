import React, { Component } from 'react'
import Message from './Message'
import MessageForm from './MessageForm'
import MessageHeader from './MessageHeader'
// rfce(함수형)으로 했더니 안되는 부분이 많아서 클래스 컴포넌트(rce)로 만들었다.
export class MainPanel extends Component {
    render() {
        return (
            <div style={{padding: '2rem 2rem 0 2rem'}}>
                <MessageHeader/>
                <div style={{
                    width:'100%',
                    height:'450px',
                    border:'.2rem solid #ececec',
                    borderRadius:'4px',
                    padding:'1rem',
                    marginBottom:'1rem',
                    overflowY: 'auto'
                }}>

                </div>
                <MessageForm/>
            </div>
        )
    }
}

export default MainPanel
