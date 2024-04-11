import TagClass from '/js/TagClass.js'

(()=>{
  // cover
  const imageInput = document.body.querySelector('#imageInput');
  const imageDisplay = document.body.querySelector('#imageDisplay');
  // picture
  const pictureInput = document.body.querySelector('.pictureInput');
  const newPictureInput = pictureInput.cloneNode(true);
  const pictureInputGroup = document.body.querySelector('#pictureInputGroup');
  const addPictureBtn = document.body.querySelector('#addPicture');
  const deletePictureBtns = document.body.querySelectorAll('.deleteInput');
  // tags
  const tagsContainer = document.querySelector('#tagsContainer')
  const tagLabelTemp = document.querySelector('.tagLabel')
  const tagsCount = document.querySelector('#tagsCount')
  const tagsInput = document.querySelector('#tagsInput')

  function handleAddPicture() {
    if (newPictureInput || pictureInputGroup) {
      const newInput = newPictureInput.cloneNode(true);
      newInput.querySelector('.deleteInput').onclick = handleDeletePicture;
      pictureInputGroup.appendChild(newInput);
    }
  }

  function handleDeletePicture() {
    this.parentElement.remove();
  }

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

  // Init
  const fetchTag = new TagClass(tagsContainer, tagLabelTemp, tagsInput, tagsCount)
  fetchTag.renderAllTags()

  // Action
  imageInput.onchange = handleImageChange;
  addPictureBtn.onclick = handleAddPicture;
  deletePictureBtns.forEach((b) => {
    b.onclick = handleDeletePicture;
  });
})()