const socket = io();

function App() {
  const [rooms, setRooms] = React.useState();
  const [roomName, setRoomName] = React.useState('');
  const [accessCode, setAccessCode] = React.useState('');
  const [accessCodeDuration, setAccessCodeDuration] = React.useState('24h'); // Default to 24 hours
  const [currentRoom, setCurrentRoom] = React.useState(null);
  const [message, setMessage] = React.useState('');
  const [messages, setMessages] = React.useState();
  const [viewerCount, setViewerCount] = React.useState(0);
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordedFilename, setRecordedFilename] = React.useState(null);
  const [allowRecording, setAllowRecording] = React.useState(false);
  const [chatMessages, setChatMessages] = React.useState();
  const [newChatMessage, setNewChatMessage] = React.useState('');


  React.useEffect(() => {
    // Fetch initial room list
    fetch('/rooms')
      .then(res => res.json())
      .then(data => setRooms(data));

    // Listen for room updates
    socket.on('room created', (newRoomName) => {
      setRooms([...rooms, newRoomName]);
    });

    // Listen for viewer count updates
    socket.on('viewer count', (count) => {
      setViewerCount(count);
    });

    // Listen for recording status updates
    socket.on('recording status', (data) => {
      setIsRecording(data.isRecording);
      if (data.isRecording) {
        setRecordedFilename(data.filename);
      }

function ChatBox({ roomName }) {
  const [message, setMessage] = React.useState('');

  const handleInputChange = (event) => {
    setMessage(event.target.value);
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send chat message', { roomName, sender: 'viewer', message }); // Assuming the user is a viewer
      setMessage('');
    }
  };

  // ... (logic to display received messages)

  return (
    <div className="chat-box">
      {/* ... (display chat messages here) */}
      <input type="text" value={message} onChange={handleInputChange} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
