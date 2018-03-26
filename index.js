const chromeLauncher = require('chrome-launcher')
const CDP = require('chrome-remote-interface')
const fs = require('fs')

let start = async function () {
  let frame = 0
  async function launchChrome () {
    return await chromeLauncher.launch({
      chromeFlags: [
        '--disable-gpu',
        '--headless'
      ]
    })
  }
  const chrome = await launchChrome()
  const protocol = await CDP({
    port: chrome.port
  })

  const {
    DOM,
    Page,
    Emulation,
    Runtime } = protocol
  await Promise.all([Page.enable(), Runtime.enable(), DOM.enable()])

  Page.navigate({
    url: 'https://kurokawawonderland.jp/'
  })
  await Page.loadEventFired(async() => {
    const script1 = "document.querySelector('p').textContent"

    const result = await Runtime.evaluate({
      expression: script1
    })
    console.log(result.result.value)
    // Page.screencastFrame()
    // Page.captureScreenshot({format: 'png', fromSurface: true})
    // const ss = await Page.captureScreenshot({format: 'png', fromSurface: true})
    // fs.writeFile('screenshot.png', ss.data, 'base64')

    // await Page.startScreencast({format: 'png', everyNthFrame: 1});
  })
  // await Page.startScreencast({
  //   format: 'png',
  //   quality: 100,
  //   maxWidth: 400,
  //   maxHeight: 720,
  //   everyNthFrame: 1
  // })
  // Page.screencastFrame(image => {
  //   frame++
  //   const {data, metadata} = image
  //   fs.writeFile('results/out' + frame + '.png', data, 'base64')
  //   if (frame >= 50) {
  //     console.log('Finish')
  //     protocol.close()
  //     chrome.kill()
  //     return Page.stopScreencast()
  //   }
  //   console.log(metadata)
  // })
  setTimeout(async () => {
    for (var i = 0; i < 100; i++) {
      console.log(i)
      const ss = await Page.captureScreenshot({
        format: 'png',
        quality: 100,
        maxWidth: 400,
        maxHeight: 720,
        everyNthFrame: 1
      })
      fs.writeFile('results/out' + i + '.png', ss.data, 'base64')
    }
  }, 1500)
}

start()
