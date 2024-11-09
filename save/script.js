function saveToFile() {
    const text = document.getElementById('textInput').value;
    const filename = 'mytext.txt'; // You can allow the user to specify the filename

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}
