// https://github.com/node-ffi/node-ffi/issues/355
// https://github.com/node-ffi-napi/node-ffi-napi
// yarn add ref-napi ffi-napi
const ref = require('ref-napi')
const ffi = require('ffi-napi')
const webviewPtr = ref.refType('void') // `webview` is an "opaque" type, so we don't know its layout
const ffi_callback = 'pointer' // TODO: use ffi.Callback when #76 is implemented

const webview = new ffi.Library('x64_webview', {
  webview_create: [webviewPtr, ['int', 'void *']],
  webview_set_title: ['void', [webviewPtr, 'string']],
  webview_set_size: ['void', [webviewPtr, 'int', 'int', 'int']],
  webview_bind: ['void', [webviewPtr, 'string', ffi_callback, 'void *']],
  webview_navigate: ['void', [webviewPtr, 'string']],
  webview_run: ['void', [webviewPtr]],
  webview_destroy: ['void', [webviewPtr]],
})

const myFunc = ffi.Callback('void', ['string', 'string', 'void*'], (seq, req, arg) => {
  const args = JSON.parse(req)
  console.log(args)
})

const wv = webview.webview_create(0, null)
webview.webview_set_title(wv, 'Webview example')
webview.webview_set_size(wv, 480, 320, 0)
webview.webview_bind(wv, 'myFunc', myFunc, null)
webview.webview_navigate(wv, `data:text/html, <button onclick='myFunc("Foo bar")'>Click Me</button>`)
webview.webview_run(wv)
webview.webview_destroy(wv)
