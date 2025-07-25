import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { messagesAPI } from "../services/api"
import { useSocket } from "../hooks/useSocket"
import socketService from "../services/socketService"



export default function MessagePage() {
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [typingUsers, setTypingUsers] = useState(new Set())
  const messagesEndRef = useRef(null)
  
  // Use the socket hook
  const { onlineUsers } = useSocket()

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Fetch all users for sidebar
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const userData = await messagesAPI.getUsersForSidebar()
        setUsers(userData)
      } catch (err) {
        setError(err.message || 'Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Fetch messages when a conversation is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversation) {
        try {
          const messageData = await messagesAPI.getMessages(selectedConversation._id)
          setMessages(messageData)
        } catch (err) {
          setError(err.message || 'Failed to load messages')
        }
      }
    }

    fetchMessages()
  }, [selectedConversation])

  // Socket event listeners
  useEffect(() => {
    // Listen for new messages
    socketService.onNewMessage((message) => {
      // Get current user to avoid duplicates for sender
      const currentUser = JSON.parse(localStorage.getItem('user'))
      const messageSenderId = typeof message.senderId === 'object' 
        ? message.senderId._id 
        : message.senderId
      const isMessageFromMe = messageSenderId === currentUser?.id
      
      // Only add message if it's NOT from the current user (to avoid duplicates)
      // The sender already sees their message via optimistic update
      if (!isMessageFromMe) {
        setMessages(prev => {
          // Check if message already exists to avoid duplicates
          const messageExists = prev.find(msg => msg._id === message._id)
          if (messageExists) return prev
          return [...prev, message]
        })
      }
    })

    // Listen for typing indicators
    socketService.onUserTyping(({ senderId, isTyping }) => {
      setTypingUsers(prev => {
        const newTypingUsers = new Set(prev)
        if (isTyping) {
          newTypingUsers.add(senderId)
        } else {
          newTypingUsers.delete(senderId)
        }
        return newTypingUsers
      })
      
      // Clear typing indicator after 3 seconds
      if (isTyping) {
        setTimeout(() => {
          setTypingUsers(prev => {
            const newTypingUsers = new Set(prev)
            newTypingUsers.delete(senderId)
            return newTypingUsers
          })
        }, 3000)
      }
    })

    // Cleanup listeners on unmount
    return () => {
      socketService.offNewMessage()
      socketService.offUserTyping()
    }
  }, [])

  // Join/leave conversation rooms
  useEffect(() => {
    if (selectedConversation) {
      socketService.joinConversation(selectedConversation._id)
      
      return () => {
        socketService.leaveConversation(selectedConversation._id)
      }
    }
  }, [selectedConversation])

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      const currentUser = JSON.parse(localStorage.getItem('user'))
      const tempMessage = {
        _id: Date.now().toString(), // Temporary ID
        senderId: currentUser?.id,
        receiverId: selectedConversation._id,
        text: newMessage,
        createdAt: new Date().toISOString(),
        pending: true // Mark as pending
      }
      const messageText = newMessage

      try {
        // Optimistic update - add message to UI immediately
        setMessages(prev => [...prev, tempMessage])
        setNewMessage("")

        // Send message to backend
        const messageData = await messagesAPI.sendMessage(selectedConversation._id, {
          text: messageText
        })

        // Replace temporary message with real message from server
        setMessages(prev => prev.map(msg => 
          msg._id === tempMessage._id ? messageData : msg
        ))
      } catch (err) {
        console.error('Failed to send message:', err)
        // Remove temporary message on error
        setMessages(prev => prev.filter(msg => msg._id !== tempMessage._id))
        setError(err.message || 'Failed to send message')
        setNewMessage(messageText) // Restore message text
      }
    }
  }

  // Handle typing indicators
  let typingTimeout = null
  const handleTyping = (value) => {
    setNewMessage(value)
    
    if (selectedConversation && value.trim()) {
      // Emit typing start
      socketService.emitTyping(selectedConversation._id, true)
      
      // Clear previous timeout
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }
      
      // Set timeout to stop typing indicator
      typingTimeout = setTimeout(() => {
        socketService.emitTyping(selectedConversation._id, false)
      }, 1000)
    } else if (selectedConversation) {
      // Stop typing immediately if input is empty
      socketService.emitTyping(selectedConversation._id, false)
      if (typingTimeout) {
        clearTimeout(typingTimeout)
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="navbar bg-white border-b border-gray-200 px-6">
        <div className="navbar-start">
          <Link to="/home" className="flex items-center space-x-2 text-xl font-semibold">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-gray-900">DevConnect Pro</span>
          </Link>
        </div>
        <div className="navbar-end">
          <Link to="/home" className="text-gray-600 hover:text-gray-900 font-medium">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Conversations List */}
        <div className="w-80 bg-white border-r border-gray-200">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                </svg>
              </button>
            </div>
            
            {/* Search */}
            <div className="relative mb-4">
              <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Conversations */}
            <div className="space-y-1">
              {loading ? (
                <div className="p-4 text-center text-gray-500">Loading users...</div>
              ) : error ? (
                <div className="p-4 text-center text-red-500">{error}</div>
              ) : users.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No users found</div>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedConversation?._id === user._id
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedConversation(user)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="relative">
                        <img 
                          src={user.avatar || "https://via.placeholder.com/40"} 
                          alt={user.name || user.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${
                          onlineUsers.includes(user._id) ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 truncate">{user.name || user.username}</p>
                          <span className={`text-xs ${
                            onlineUsers.includes(user._id) ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">{user.bio || user.title || 'Developer'}</p>
                        <p className="text-sm truncate mt-1 text-gray-500">
                          Click to start conversation
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={selectedConversation.avatar || "https://via.placeholder.com/40"}
                        alt={selectedConversation.name || selectedConversation.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white rounded-full ${
                        onlineUsers.includes(selectedConversation._id) ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedConversation.name || selectedConversation.username}</h3>
                      <p className="text-sm text-gray-600">{selectedConversation.bio || selectedConversation.title || 'Developer'}</p>
                      <p className={`text-xs ${
                        onlineUsers.includes(selectedConversation._id) ? 'text-green-600' : 'text-gray-500'
                      }`}>
                        {typingUsers.has(selectedConversation._id) ? 'Typing...' : 
                         onlineUsers.includes(selectedConversation._id) ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      // Handle both string and object senderId formats
                      const messageSenderId = typeof message.senderId === 'object' 
                        ? message.senderId._id 
                        : message.senderId
                      const currentUser = JSON.parse(localStorage.getItem('user'))
                      const isMyMessage = messageSenderId === currentUser?.id
                      
                      return (
                      <div
                        key={message._id}
                        className={`flex ${isMyMessage ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isMyMessage
                              ? "bg-blue-600 text-white" 
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            isMyMessage
                              ? "text-blue-100" 
                              : "text-gray-500"
                          }`}>
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      )
                    })
                  )}
                </div>
                {/* Scroll reference */}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <button className="p-2 hover:bg-gray-100 rounded-full">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => handleTyping(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      autoComplete="off"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                  <button onClick={handleSendMessage} className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* No Chat Selected */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No chat selected</h3>
                <p className="text-gray-600">Choose a user from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
