export function codeValidator(code) {
    if (!code) return "Device code can't be empty."
     if (code.length !=6) return 'Device must be 6 characters.'
    return ''
  }
  