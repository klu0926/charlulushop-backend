// read am image file as DataUrl, change display's background
function handleImageChange(file, display) {
  try {
    if (!file) throw new Error('No file')
    if (!display) throw new Error('No file')

    const reader = new FileReader();
    reader.onload = function (e) {
      display.style.backgroundImage = `url(${e.target.result})`;
    };
    reader.readAsDataURL(file);

  } catch (err) {
    alert(`handleImageChange: ${err.message}`)
  }

}

export default handleImageChange