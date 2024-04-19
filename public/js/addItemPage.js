import TagClass from '/js/TagClass.js'
import sweetAlert from '/js/sweetAlert.js'
import { initCropper } from '/js/helpers/cropper.js'

(() => {
  // cover
  const coverInput = document.body.querySelector('#coverInput');
  const coverDisplay = document.body.querySelector('#coverDisplay');
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

  async function handleCoverChange(e) {
    const file = e.target.files[0];
    console.log('file:', file)

    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        // got the original data url
        const dataUrl = e.target.result;
        // use cropper
        initCropper(dataUrl, coverDisplay, coverInput, true)
      };
      reader.readAsDataURL(file);
    } else {
      sweetAlert.error('找不到檔案')
    }
  }

  // Init
  const fetchTag = new TagClass(tagsContainer, tagLabelTemp, tagsInput, tagsCount)
  fetchTag.renderAllTags()

  // Action
  coverInput.onchange = handleCoverChange;
  addPictureBtn.onclick = handleAddPicture;
  deletePictureBtns.forEach((b) => {
    b.onclick = handleDeletePicture;
  });
})()