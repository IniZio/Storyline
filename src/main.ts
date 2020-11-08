import { createApp } from 'vue'

import App from './App'
import './index.scss'

import 'bulma/css/bulma.css'
import '@creativebulma/bulma-tooltip/dist/bulma-tooltip.min.css'

// const electron:any = require('electron')
// const ipc:any = electron.ipcRenderer
// ipc.send('store:set', { key: 'foo.bar', value: '👩' })
// ipc.invoke('store:get', 'foo').then((res:string) => {
//     console.log(res)
// })
// ipc.send('store:delete', 'foo')
// ipc.invoke('store:get', 'foo').then((res:string) => {
//     console.log(res)
// })

createApp(App)
  .mount('#app')
