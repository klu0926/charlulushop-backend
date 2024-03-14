const sweetAlert = {
  notice: (title, icon) => {
    Swal.fire({
      title: title || "成功",
      icon: icon || "info",
      confirmButtonText: '是的',
      confirmButtonColor: '#3894F1',
      customClass: {
        title: 'swal-title',
      }
    });
  },
  confirm: (title) => {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: title,
        showDenyButton: true,
        confirmButtonText: '是的',
        confirmButtonColor: '#3894F1',
        denyButtonText: '不要',
        denyButtonColor: '#F7647D',
        customClass: {
          title: 'swal-title',
        }
      }).then(result => {
        return resolve(result.value)
      })
    })
  },
  error: (title, text) => {
    Swal.fire({
      title: title || '失敗',
      icon: "error",
      text: text || '',
      confirmButtonText: '好吧',
      confirmButtonColor: '#F7647D',
      customClass: {
        title: 'swal-title',
      }
    })
  },
  editTagInput: (title, inputValue, placeholder, inputType) => {
    return new Promise(async (resolve, reject) => {
      const result = await Swal.fire({
        title: title || 'title',
        input: inputType || "text",
        inputPlaceholder: placeholder,
        inputValue,
        confirmButtonText: '修改',
        confirmButtonColor: '#3894F1',
        showDenyButton: true,
        denyButtonText: '刪除',
        denyButtonColor: '#F7647D',
        showCancelButton: true,
        cancelButtonText: '取消',
        inputAttributes: {
          "aria-label": "Type your input here"
        },
        customClass: {
          title: 'swal-title',
        }
      })
      resolve(result)
    })

  }
}

export default sweetAlert
