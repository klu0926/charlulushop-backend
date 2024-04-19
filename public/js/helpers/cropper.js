
// div = <div id="cropper-container" class="cropper-container">
const cropperHTML = `
<div id="cropper-container" class="cropper-container">
  <div class="cropper-input-div" >
      <img id="cropper-input-image" class="cropper-image" src="" alt="cropper-input">
      <div class="cropper-small-div d-none">
      <img id="cropper-small-image" class="cropper-small-image" src="" alt="cropper-input">
      </div>
    </div>
    <div class="cropper-side-buttons">
          <button id="cropper-close" class="cropper-side-btn close">
          <i class="fa-solid fa-xmark"></i>
          </button>

          <button id="cropper-move-up" class="cropper-side-btn" >
          <i class="fa-solid fa-arrow-up"></i>
          </button>

          <button id="cropper-move-down" class="cropper-side-btn" >
          <i class="fa-solid fa-arrow-down"></i>
          </button>

          <button id="cropper-move-left" class="cropper-side-btn" >
          <i class="fa-solid fa-arrow-left"></i>
          </button>
          <button id="cropper-move-right" class="cropper-side-btn" >
          <i class="fa-solid fa-arrow-right"></i>
          </button>

          <button id="cropper-zoom-in" class="cropper-side-btn" >
          <i class="fa-solid fa-magnifying-glass-plus"></i>
          </button>

          <button id="cropper-zoom-out" class="cropper-side-btn" >
          <i class="fa-solid fa-magnifying-glass-minus"></i>
          </button>

         <button id="cropper-reset" class="cropper-side-btn" >
         <i class="fa-solid fa-arrow-rotate-left"></i>
         </button>

         <button id="crop" class="cropper-side-btn crop" >
          OK
          </button>
    </div>
  </div>
`

export function initCropper(imgUrl, outsideImage, outsideInput, isBackground = false) {
  init(imgUrl, outsideImage, outsideInput, isBackground)
}


// isBackground is for setting div's background Url
// normally it set the image's src
function init(imgUrl, outsideImage, outsideInput, isBackground = false) {
  // create cropper element
  console.log('create cropper wrapper...')
  const cropperWrapper = document.createElement('div')
  cropperWrapper.id = 'cropper-wrapper'
  cropperWrapper.classList.add('cropper-wrapper')
  cropperWrapper.innerHTML = cropperHTML
  document.body.appendChild(cropperWrapper)

  const cropperContainer = document.querySelector('#cropper-container')
  const image = document.querySelector('#cropper-input-image');
  const imageSmall = document.querySelector('#cropper-small-image');
  const cropButton = document.querySelector('#crop');
  const zoomInButton = document.querySelector('#cropper-zoom-in');
  const zoomOutButton = document.querySelector('#cropper-zoom-out');
  const resetButton = document.querySelector('#cropper-reset');
  const closeButton = document.querySelector('#cropper-close')
  const moveUp = document.querySelector('#cropper-move-up')
  const moveDown = document.querySelector('#cropper-move-down')
  const moveLeft = document.querySelector('#cropper-move-left')
  const moveRight = document.querySelector('#cropper-move-right')
  let getCropped = null
  let cropper = null
  let croppedImage = null

  // set image src
  if (!imgUrl) alert('InitCropper 沒有輸入 url')
  if (!outsideImage) alert('InitCropper 沒有輸入 output image')
  if (!outsideInput) alert('InitCropper 沒有輸入 image Input')
  if (!image) alert('Cropper找不到crop-input-image')
  image.src = imgUrl

  // load images
  imageSmall.onload = imageSmall.style.opacity = 1

  cropper = new Cropper(image, {
    aspectRatio: 1 / 1,
    viewMode: 1,
    ready() {
      // Function to get the cropped image
      getCropped = () => {
        croppedImage = cropper.getCroppedCanvas().toDataURL("image/png");
        if (croppedImage) {
          return croppedImage;
        }
      };
      //  Function move and cropped
      function cropperMove(x, y){
        if (!cropper.ready) return;
        cropper.move(x, y)
        getCropped();
      }

      // --- Buttons --- //
      // wrapper
      cropperWrapper.onclick = (e) => {
        if (e.target === cropperWrapper) cropperWrapper.remove()
      }
      // close 
      closeButton.onclick = () => cropperWrapper.remove()
      // move
      moveUp.onclick = () => cropperMove(0, 10)
      moveDown.onclick = () => cropperMove(0, -10)
      moveLeft.onclick = () => cropperMove(10, 0)
      moveRight.onclick = () => cropperMove(-10, 0)
      // zoom
      zoomInButton.onclick = () => cropper.zoom(0.1);
      zoomOutButton.onclick = () => cropper.zoom(-0.1);
      // reset
      resetButton.onclick = () => {
        cropper.reset();
        getCropped();
      };
      // crop
      cropButton.onclick = async () => {
        try {
          const croppedImage = getCropped()
          // get outputImage src
          if (isBackground) {
            // replace output image
            const backgroundUrl = `url(` + croppedImage + ')'
            outsideImage.style.backgroundImage = backgroundUrl
          } else {
            outsideImage.src = croppedImage
          }

          // replace file input
          const response = await fetch(croppedImage)
          const blob = await response.blob()
          const newFile = new File([blob], 'newFile.png', { type: 'image/png' });
          const dataTransfer = new DataTransfer() // to create a fileList
          dataTransfer.items.add(newFile) // add to the fileList
          outsideInput.files = dataTransfer.files // replace the files list

          // (there is not other way to add a local file ot the input, if the user didn't request)

          // close
          cropperWrapper.remove()
          return

        } catch (err) {
          console.error(err)
        }
      }
      // Initial display of cropped image
      getCropped();
    },
    cropend() {
    //...
    },
    zoom() {
    //...
    }
  });
  return cropper
}




