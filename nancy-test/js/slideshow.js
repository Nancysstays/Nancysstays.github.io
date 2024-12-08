const images = [
  '../20241203_231605.jpg',
  '../1733558426775.jpg',
  '../1733349677562.jpg'
  // Add more image paths as needed
];

let currentImageIndex = 0;
const slideshow = document.querySelector('.background-slideshow');

function showNextImage() {
    const currentImage = slideshow.querySelector('img.active');
    if (currentImage) {
        currentImage.classList.remove('active');
    }

    currentImageIndex = (currentImageIndex + 1) % images.length;
    const nextImage = document.createElement('img');
    nextImage.src = images[currentImageIndex];
    nextImage.alt = 'Background Image';
    nextImage.classList.add('active');
    
    const randomXOffset = Math.random() * 20 - 10; 
    const randomYOffset = Math.random() * 20 - 10;
    nextImage.style.transform = `translate(${randomXOffset}px, ${randomYOffset}px)`;


    slideshow.appendChild(nextImage);
    
    setTimeout(() => {
      const oldestImage = slideshow.querySelector('img:not(.active)');
        if(oldestImage){
            slideshow.removeChild(oldestImage);
        }
    }, 1000);

}

setInterval(showNextImage, 5000); // Change image every 5 seconds
