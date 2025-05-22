from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory
from flask_socketio import SocketIO, emit, join_room, leave_room
import subprocess
import os
import uuid
import datetime

from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory
from flask_socketio import SocketIO, emit, join_room, leave_room
import subprocess
import os
import uuid  # For generating unique filenames

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'  # Replace with a strong secret key
socketio = SocketIO(app)

# In-memory room data (replace with a database for persistence)
rooms = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/rooms')
def get_rooms():
    return jsonify(list(rooms.keys()))

@socketio.on('create room')
def create_room(room_name):
    if room_name in rooms:
        emit('error', 'Room name already exists')
    else:
        rooms[room_name] = {
            'broadcaster': request.remote_addr,
            'viewers': 0,
            'recording': False,
            'allow_recording': False,
            'recordings': []  # List to store recordings for this room
        }
        emit('room created', room_name, broadcast=True)

@app.route('/cast/<room_name>')
def room(room_name):
    if room_name not in rooms:
        return "Room not found"
    return render_template('room.html', room_name=room_name)

@socketio.on('join room')
def join_room_event(room_name):
    join_room(room_name)
    rooms[room_name]['viewers'] += 1
    emit('viewer count', rooms[room_name]['viewers'], room=room_name)

@socketio.on('leave room')
def leave_room_event(room_name):
    leave_room(room_name)
    rooms[room_name]['viewers'] -= 1
    emit('viewer count', rooms[room_name]['viewers'], room=room_name)

@socketio.on('broadcast message')
def broadcast_message(data):
    room_name = data['room_name']
    message = data['message']
    emit('receive message', message, room=room_name)

@socketio.on('start recording')
def start_recording(data):
    room_name = data['room_name']
    if room_name in rooms and rooms[room_name]['allow_recording']:
        filename = f"{room_name}_{uuid.uuid4()}.mp4"  # Generate unique filename
        command = [
            'ffmpeg',
            '-f', 'gdigrab',
            '-framerate', '30',
            '-i', 'desktop',
            '-c:v', 'libx264',
            '-preset', 'fast',
            '-pix_fmt', 'yuv420p',
            f'recordings/{filename}'  # Store with unique filename
        ]
        subprocess.Popen(command)
        rooms[room_name]['recording'] = True
        rooms[room_name]['recordings'].append(filename)  # Add to recordings list
        emit('recording status', {'isRecording': True, 'filename': filename}, room=room_name)

@socketio.on('stop recording')
def stop_recording(room_name):
    if room_name in rooms and rooms[room_name]['recording']:
        os.system(f'taskkill /f /im ffmpeg.exe')  # Windows
        # os.system('pkill ffmpeg')  # Linux/macOS
        rooms[room_name]['recording'] = False
        emit('recording status', {'isRecording': False}, room=room_name)

@app.route('/recordings/<filename>')
def serve_recording(filename):
    return send_from_directory('recordings', filename)

if __name__ == '__main__':
    socketio.run(app)


app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app)

# ... (rest of the code is the same as the previous response)

@app.route('/create_room', methods=['POST'])
def create_room():
    room_name = request.form['room_name']
    if room_name in rooms:
        return "Room name already exists"
    rooms[room_name] = {
        'broadcaster': request.remote_addr,
        'viewers': 0,
        'recording': False,
        'allow_recording': request.form.get('allow_recording') == 'on',
        'recordings': [],
        'access_code': None,  # Add access code field
        'access_code_expiry': None  # Add access code expiry field
    }
    return redirect(url_for('room', room_name=room_name))

@app.route('/cast/<room_name>')
def room(room_name):
    if room_name not in rooms:
        return "Room not found"
    room_data = rooms[room_name]
    return render_template('room.html', room_name=room_name, 
                           allow_recording=room_data['allow_recording'],
                           recordings=room_data['recordings'],
                           access_code=room_data['access_code'],
                           access_code_expiry=room_data['access_code_expiry'])

@socketio.on('set access code')
def set_access_code(data):
    room_name = data['room_name']
    access_code = data['access_code']
    duration = data['duration']  # '24h' or 'permanent'

    if room_name in rooms:
        rooms[room_name]['access_code'] = access_code
        if duration == '24h':
            expiry = datetime.datetime.now() + datetime.timedelta(hours=24)
            rooms[room_name]['access_code_expiry'] = expiry
        else:  # 'permanent'
            rooms[room_name]['access_code_expiry'] = None
        emit('access code set', {'access_code': access_code, 'expiry': expiry}, room=room_name)

@app.route('/recordings/<filename>')
def serve_recording(filename):
    room_name = filename.split('_')[0]  # Extract room name from filename
    if room_name in rooms:
        room_data = rooms[room_name]
        if room_data['allow_recording']:
            if room_data['access_code']:
                # Check if access code is required and valid
                if 'access_code' in request.args:
                    entered_code = request.args['access_code']
                    if entered_code == room_data['access_code']:
                        if room_data['access_code_expiry']:
                            # Check if access code has expired
                            if datetime.datetime.now() > room_data['access_code_expiry']:
                                return "Access code has expired"
                        return send_from_directory('recordings', filename)
                    else:
                        return "Incorrect access code"
                else:
                    return "Access code required"
            else:
                # No access code required
                return send_from_directory('recordings', filename)
    return "Recording not found"

if __name__ == '__main__':
    socketio.run(app)
from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory
from flask_socketio import SocketIO, emit, join_room, leave_room
import subprocess
import os
import uuid
import datetime

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app)

# ... (rest of the code is the same as the previous response)

@socketio.on('create room')
def create_room(room_name):
    # ... (rest of the create_room function)
        rooms[room_name] = {
            # ... (other room data)
            'blocked_users': [],  # Add blocked_users list
            'tips': 0  # Add tips counter
        }
        emit('room created', room_name, broadcast=True)

@socketio.on('block user')
def block_user(data):
    room_name = data['room_name']
    user_id = data['user_id']  # Assuming you have a way to identify users
    if room_name in rooms:
        rooms[room_name]['blocked_users'].append(user_id)
        emit('user blocked', user_id, room=room_name)  # Notify the room

@socketio.on('join room')
def join_room_event(room_name, user_id):  # Add user_id to the arguments
    if room_name in rooms:
        if user_id in rooms[room_name]['blocked_users']:
            emit('access denied', 'You are blocked from this room')
        else:
            join_room(room_name)
            rooms[room_name]['viewers'] += 1
            emit('viewer count', rooms[room_name]['viewers'], room=room_name)

@socketio.on('send tip')
def send_tip(data):
    room_name = data['room_name']
    amount = data['amount']
    if room_name in rooms:
        rooms[room_name]['tips'] += amount
        emit('tip received', amount, room=room_name)  # Notify the room

# ... (rest of the app.py file)
# app.py

# ... (rest of the imports and code)

@socketio.on('send chat message')
def send_chat_message(data):
    room_name = data['room_name']
    sender = data['sender']  # 'broadcaster' or 'viewer'
    message = data['message']
    emit('receive chat message', {'sender': sender, 'message': message}, room=room_name)

# ... (rest of the app.py file)
