const sweetAlert = {
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
  }
}

export default sweetAlert
