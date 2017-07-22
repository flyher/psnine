import { encodeForm } from '../utils'

const loginURL = 'http://psnine.com/sign/in'

export const registURL = `http://psnine.com/psnauth`

export const safeLogin = function (psnid, pass) {
  let signin = ''
  let details = { psnid, pass, signin }
  const formBody = encodeForm(details)
  return new Promise((resolve, reject) => {
    fetch(loginURL, {
      method: 'POST',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    }).then((responseData) => {
      return resolve(responseData.text())
    })
  })
}