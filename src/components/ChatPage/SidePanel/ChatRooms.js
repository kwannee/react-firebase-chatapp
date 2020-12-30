import React, { Component } from 'react'
import {FaRegSmileWink} from 'react-icons/fa'
import {FaPlus} from 'react-icons/fa'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
export class ChatRooms extends Component {

    state = {
        show:false
    }

    handleClose = () => this.setState({show:false});
    handleShow = () => this.setState({show:true});

    render() {
        return (
            <div>
                <div style={{
                    position:'relative', width:'100%',
                    display:'flex',alignItems:'center'
                }}>
                    <FaRegSmileWink style={{marginRight:'3px'}}/>
                    CHAT ROOMS {" "}(1)

                    <FaPlus onClick={this.handleShow} style={{
                        position:'absolute',
                        right:0,cursor:'pointer'
                    }}/>
                </div>
                {/*ADD CHAT ROOM MODAL */}
                    {/*클래스컴포넌트이다 보니까 앞에 this를 다 붙여준듯 */}
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={this.handleClose}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default ChatRooms
