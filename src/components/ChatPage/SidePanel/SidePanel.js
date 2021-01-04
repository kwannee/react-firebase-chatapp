import React from 'react'
import Favorited from './Favorited'
import UserPanel from './UserPanel'
import DirectMessages from './DirectMessages'
import ChatRooms from './ChatRooms'
function SidePanel() {
    return (
        <div
            style={{
                backgroundColor:"#7B83EB",
                padding:'2rem',
                minHeight:'100vh',
                color:'white',
                minWidth:'275px'
            }}
        >
            <UserPanel />
            <Favorited />
            <ChatRooms />
            <DirectMessages />
        </div>
    )
}

export default SidePanel
