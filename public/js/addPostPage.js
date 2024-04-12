(() => {
  const imageDisplay = document.body.querySelector('#image-display')
  const imageInput = document.body.querySelector('#imageInput')



  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imageDisplay.style.backgroundImage = `url(${e.target.result})`;
      };
      reader.readAsDataURL(file);
    } else {
      console.error('No image file selected');
    }
  }

  imageDisplay.onclick = () => {
    imageInput.click()
  }
  imageInput.onchange = handleImageChange

})()