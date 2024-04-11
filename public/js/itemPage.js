import TagClass from '/js/TagClass.js'
import sweetAlert from '/js/sweetAlert.js'
import HandleImage from '/js/handleImage.js'

(()=>{
  // handle images
  const handleImage = new HandleImage()
  handleImage.handleAllPictureClick()

  // display
  const imageDisplay = document.body.querySelector('#imageDisplay');
  // picture
  const pictureInputForm = document.body.querySelector('#pictureInputForm');
  const pictureInput = document.body.querySelector('#pictureInput');
  const addPictureBtn = document.body.querySelector('#addPicture');
  // cover
  const coverInputForm = document.body.querySelector('#coverInputForm');
  const coverInput = document.body.querySelector('#coverInput');
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

  function imageDisplayInit() {
    const id = imageDisplay.dataset.id;
    imageDisplay.style.backgroundImage = `url(/images/${id})`;
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
  async function postImage() {
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

  // update cover
  async function putCover(imageId) {
    try {
      const url = `/images/${imageId}`;
      const formData = new FormData(coverInputForm);
      const response = await fetch(url, { method: 'PUT', body: formData });
      const json = await response.json();
      if (!json.ok) throw new Error(json.message);
    } catch (err) {
      alert(err);
    }
    window.location.reload();
  }

  function handlePictureChange(e) {
    postImage()
  }

  function handleCoverChange(e) {
    const coverImageId = imageDisplay.dataset.id;
    if (!coverImageId) return;
    putCover(coverImageId)
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
  imageDisplayInit();

  // Action
  pictureInput.onchange = handlePictureChange;
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