const svgFile = document.getElementById('svgFile');
const svgContainer = document.getElementById('svgContainer');

svgFile.addEventListener('change', (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        svgContainer.innerHTML = e.target.result;
    }

    reader.readAsText(file);
});
