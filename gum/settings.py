<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game Settings</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        body, html {
            height: 100%; 
            margin: 0;
            overflow: hidden; 
        }

        body {
            font-family: sans-serif;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background-color: #f4f4f4;
        }

        .container {
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        h1 {
            margin-bottom: 30px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
        }

        input[type="number"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }

        .btn {
            font-size: 2em; 
            padding: 15px 30px; 
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Game Settings</h1>
        <form id="settings-form">
            <div class="form-group">
                <label for="gameDuration">Game Duration (seconds):</label>
                <input type="number" id="gameDuration" min="1" value="60">
            </div>
            <div class="form-group">
                <label for="gamesPerSet">Games per Set:</label>
                <input type="number" id="gamesPerSet" min="1" value="3">
            </div>
            <button type="button" class="btn btn-primary" onclick="saveSettings()">Save Settings</button>
        </form>
    </div>

    <script>
        function saveSettings() {
            const gameDuration = document.getElementById('gameDuration').value;
            const gamesPerSet = document.getElementById('gamesPerSet').value;

            localStorage.setItem('gameDuration', gameDuration);
            localStorage.setItem('gamesPerSet', gamesPerSet);

            alert('Settings saved!');
        }

        // Load default settings
        document.getElementById('gameDuration').value = localStorage.getItem('gameDuration') || 60;
        document.getElementById('gamesPerSet').value = localStorage.getItem('gamesPerSet') || 3;
    </script>
</body>
</html>
