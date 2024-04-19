import { initCropper } from '/js/helpers/cropper.js'

// read an image file as DataUrl, change display's background
function coverChange(file, display, fileInput, isBackground = false) {
  try {
    if (!file) throw new Error('No file')
    if (!display) throw new Error('No display')
    if (!fileInput) throw new Error('No input')

    const reader = new FileReader();
    reader.onload = function (e) {
      // got the original data url
      const dataUrl = e.target.result;
      // use cropper
      initCropper(dataUrl, display, fileInput, true)
    };
    reader.readAsDataURL(file);

  } catch (err) {
    alert(`coverChange: ${err.message}`)
  }

}

export default coverChange