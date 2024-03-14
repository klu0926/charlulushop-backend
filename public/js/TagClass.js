// tagItemTemplate

// <label class="tagLabel">
// <input class="tagCheckbox" type="checkbox" id="myCheckbox">
// <span class="tagSpan">Tag Name here</span>
// </label>


class TagClass {
  /**
   * @param {HTMLElement} tagsContainer 
   * @param {HTMLElement} tagItemTemplate 
   * @param {HTMLElement} tagsInput 
   * @param {HTMLElement} tagsCount 
   * @param {Function} clickHandler 
   */
  constructor(tagsContainer, tagItemTemplate, tagsInput, tagsCount, clickHandler) {
    this.tagsContainer = tagsContainer
    this.tagItemTemplate = tagItemTemplate
    this.tagsInput = tagsInput
    this.tagCount = tagsCount
    this.clickHandler = clickHandler || this.handleCheckBoxClick
    this.tagsIdArray = []
    this.init()
  }
  init() {
    // check if all params exist
    if (!this.tagsIdArray) throw new Error('Missing tagsIdArray')
    if (!this.tagsContainer) throw new Error('Missing tagsContainer')
    if (!this.tagItemTemplate) throw new Error('Missing tagItemTemplate')
    if (!this.tagsInput) throw new Error('Missing tagsInput')
    if (!this.tagCount) throw new Error('Missing tagCount')
    if (!this.clickHandler) throw new Error('Missing clickHandler')

    // init tagsIdArray from tag input
    if (this.tagsInput.value) {
      const inputArray = JSON.parse(this.tagsInput.value)
      this.tagsIdArray = Array.from(inputArray, (obj) => obj.id.toString())
      // set tagsInput to ['id', 'id'...] as this.tagsIdArray
      this.tagsInput.value = JSON.stringify(this.tagsIdArray)
    }
  }
  async fetchTag() {
    try {
      const url = '/api/tags'
      const response = await fetch(url)
      const json = await response.json()
      return json
    } catch (err) {
      console.error(err)
      throw err
    }
  }
  async findAllTags() {
    try {
      const url = '/api/tags'
      const response = await fetch(url)
      const json = await response.json()
      return json
    } catch (err) {
      console.error(err)
      throw err
    }
  }
  handleCheckBoxClick(e) {
    try {
      if (!e.target.classList.contains('tagCheckbox')) return
      const checkbox = e.target
      if (!checkbox) throw new Error('No checkbox')

      // get tagId from parent label
      const label = checkbox.parentElement
      const tagId = label.dataset.id
      if (tagId === undefined) throw new Error('no tag id')

      // toggle id to array
      if (this.tagsIdArray.some(id => id === tagId)) {
        this.tagsIdArray = this.tagsIdArray.filter(id => id !== tagId)
      } else {
        this.tagsIdArray.push(tagId)
      }
      // update tag count
      if (this.tagCount) {
        this.tagCount.innerText = this.tagsIdArray.length || 0
      }
      // update tags input
      if (this.tagsInput && this.tagsIdArray) {
        this.updateTagsArrayToTagsInput(this.tagsIdArray)
      }
      // toggle label
      this.checkTagSelected(label)

    } catch (err) {
      console.error('Error : Handle tag button click : ' + err.message)
    }
  }
  updateTagsArrayToTagsInput(array) {
    if (array === undefined) {
      console.error('Array for Tags Input is undefined')
      return
    }
    this.tagsInput.value = JSON.stringify(array)
  }
  checkTagSelected(tag) {
    // compare if this tag is in item.tags array (tags input)
    // if true inner checkbox = checked
    const tagId = tag.dataset.id
    const checkbox = tag.querySelector('.tagCheckbox')
    if (!tagId || !checkbox) return
    if (this.tagsIdArray.some(id => id === tagId)) {
      checkbox.checked = true
    } else {
      checkbox.checked = false
    }
  }
  async renderAllTags() {
    try {
      this.tagsContainer.innerHTML = ''
      const response = await this.findAllTags()
      if (!response || !response.ok) throw new Error(response.err)
      const tags = response.data
      for (let i = 0; i < tags.length; i++) {
        const newTagLabel = this.tagItemTemplate.cloneNode(true)
        const newTagSpan = newTagLabel.querySelector('.tagSpan')
        const newTagCheckbox = newTagLabel.querySelector('.tagCheckbox')

        newTagLabel.dataset.id = tags[i].id
        newTagSpan.innerText = tags[i].name
        // onclick
        if (this.clickHandler) {
          newTagCheckbox.onclick = (e) => { this.clickHandler(e) }
        }
        // toggle label
        this.checkTagSelected(newTagLabel)

        // append
        this.tagsContainer.appendChild(newTagLabel)
      }
    } catch (err) {
      console.error('Error : render all tags: ' + err)
    }
  }
  getTagsIdArray() {
    return this.tagsIdArray
  }
}

export default TagClass