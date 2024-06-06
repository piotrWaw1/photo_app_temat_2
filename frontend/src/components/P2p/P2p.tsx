import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Message {
    id: number;
    sender: string;
    content: string;
    timestamp: string;
}

const P2p: React.FC = () => {
    const { conversationId } = useParams<{ conversationId: string }>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = () => {
        fetch(`/api/conversation/${conversationId}/messages`)
            .then(response => response.json())
            .then(data => setMessages(data))
            .catch(error => console.error('Error fetching messages:', error));
    };

    const sendMessage = () => {
        fetch(`/api/conversation/${conversationId}/send_message/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: newMessage })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message_id) {
                setMessages([...messages, { id: data.message_id, sender: 'You', content: newMessage, timestamp: 'now' }]);
                setNewMessage('');
            } else {
                alert('Failed to send message');
            }
        })
        .catch(error => console.error('Error sending message:', error));
    };

    return (
        <div>
            <h1>Conversation</h1>
            <div id="messages">
                {messages.map(message => (
                    <p key={message.id}><strong>{message.sender}:</strong> {message.content} <em>{message.timestamp}</em></p>
                ))}
            </div>
            <textarea value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message here..."></textarea>
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default P2p;
