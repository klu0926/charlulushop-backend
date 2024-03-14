function responseJSON( ok, action, data = null, message, err ) {
  if (ok !== true) {
    return {
      ok: false,
      action,
      data: null,
      message: message || 'action failed',
      err: null
    }
  } else {
    return {
      ok: true,
      action,
      data,
      message: message || 'action successfully completed',
      err: err || ''
    }
  }
}

module.exports = responseJSON