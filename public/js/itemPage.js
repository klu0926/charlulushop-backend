import TagClass from '/js/TagClass.js'
import sweetAlert from '/js/sweetAlert.js'
import HandleImage from '/js/handleImage.js'
import { initCropper } from '/js/helpers/cropper.js'

(() => {
  // handle images
  const handleImage = new HandleImage()
  handleImage.handleAllPictureClick()

  // cover
  const coverDisplay = document.body.querySelector('#coverDisplay');
  const coverInputForm = document.body.querySelector('#coverInputForm');
  const coverInput = document.body.querySelector('#coverInput');
  // picture
  const pictureInputForm = document.body.querySelector('#pictureInputForm');
  const pictureInput = document.body.querySelector('#pictureInput');
  const addPictureBtn = document.body.querySelector('#addPicture');

  // buttons
  const deletePictureInputBtns = document.body.querySelectorAll('.deleteInput');
  const deletePictureBtns = document.querySelectorAll('.deleteImage');
  const deleteItemBtn = document.querySelector('#delete');
  // body from
  const itemPutForm = document.body.querySelector('#itemPutForm');
  const itemPutSubmit = document.querySelector('#itemSubmit');
  // tags
  const tagsContainer = document.querySelector('#tagsContainer')
  const tagLabelTemp = document.querySelector('.tagLabel')
  const tagsCount = document.querySelector('#tagsCount')
  const tagsInput = document.querySelector('#tagsInput')

  function coverDisplayInit() {
    const id = coverDisplay.dataset.id;
    coverDisplay.style.backgroundImage = `url(/images/${id})`;
  }

  function handleDeletePictureInput() {
    this.parentElement.remove();
  }

  async function handleDeletePicture(e) {
    try {
      const imageId = e.target.parentElement.dataset.id;
      if (!imageId) return;

      const result = await sweetAlert.confirm(`你要刪除照片嗎?`)
      if (!result.isConfirmed) return;

      const response = await fetch(`/images/${imageId}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Response Fail' + response.status)

      const json = await response.json()
      if (!json.ok) throw new Error(json.err)
      await sweetAlert.success('照片刪除成功')
      window.location.reload();
    } catch (err) {
      await sweetAlert.error('刪除照片失敗', err)
    }
  }

  // post picture
  async function handleAddPicture() {
    try {
      const url = '/images';
      const formData = new FormData(pictureInputForm);
      const response = await fetch(url, { method: 'POST', body: formData });
      const json = await response.json();
      if (!json.ok) throw new Error(json.message);
    } catch (err) {
      alert(err);
    }
    window.location.reload();
  }

  function handleCoverChange(e) {
    const file = coverInput.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target.result
        initCropper(dataUrl, coverDisplay, coverInput, true)
      }
      reader.readAsDataURL(file)
    } else {
      sweetAlert.error('找不到檔案')
    }
  }

  async function handleDeleteItem(e) {
    const itemId = e.target.dataset.id;
    const result = await sweetAlert.confirm(`你要刪除掉物件:『${e.target.dataset.name}』?`);
    if (!result.isConfirmed || !itemId) return;

    try {
      const url = `/items/${itemId}`;
      const response = await fetch(url, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, Text: ${response.statusText}`);
      }
      const json = await response.json()
      if (!json.ok) throw new Error(json.message);

      await sweetAlert.success('刪除成功', '將會跳轉回商品頁面', 2000);
      window.location.href = '/items';
    } catch (err) {
      await sweetAlert.error('刪除失敗', err.message || err);
    }
  }

  // Init
  const tagClass = new TagClass(tagsContainer, tagLabelTemp, tagsInput, tagsCount)
  tagClass.renderAllTags()
  coverDisplayInit();

  // Action
  pictureInput.onchange = handleAddPicture;
  coverInput.onchange = handleCoverChange;
  addPictureBtn.onclick = () => {
    pictureInput.click();
  };
  deletePictureInputBtns.forEach((b) => {
    b.onclick = handleDeletePictureInput;
  });
  deletePictureBtns.forEach((b) => {
    b.onclick = handleDeletePicture;
  });
  itemPutSubmit.onclick = (e) => {
    itemPutForm.submit();
  };
  deleteItemBtn.onclick = handleDeleteItem;
})()