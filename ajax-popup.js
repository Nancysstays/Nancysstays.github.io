// ajax-popup.js

class AjaxPopup {
  constructor(options = {}) {
    this.options = {
      message: 'Download our app for a better experience!',
      buttonText: 'Download Now',
      link: '#', // Replace with your app download link
      showDelay: 1000, // Delay in milliseconds before showing the popup (e.g., 1000 = 1 second)
      ...options,
    };
    this.init();
  }

  init() {
    // Check if the popup has already been shown
    if (localStorage.getItem('ajaxPopupShown') === 'true') {
      return;
    }

    // Show the popup after the specified delay
    setTimeout(() => {
      this.createPopup();
      localStorage.setItem('ajaxPopupShown', 'true');
    }, this.options.showDelay);
  }

  createPopup() {
    const popup = document.createElement('div');
    popup.classList.add('ajax-popup');
    popup.innerHTML = `
      <div class="ajax-popup-content">
        <p>${this.options.message}</p>
        <a href="${this.options.link}" class="ajax-popup-button">${this.options.buttonText}</a>
      </div>
    `;

    // Add close button
    const closeButton = document.createElement('span');
    closeButton.classList.add('ajax-popup-close');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
      popup.remove();
    });
    popup.appendChild(closeButton);

    document.body.appendChild(popup);
  }
}
