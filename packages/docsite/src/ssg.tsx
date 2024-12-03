import fs from 'node:fs'
import path from 'node:path'
import { Writable } from 'node:stream'
import { fileURLToPath } from 'node:url'
import { StaticRouter } from 'react-router-dom/server'
import { Route, Routes } from 'react-router-dom'
import ReactDOMServer from 'react-dom/server'
import type { HelmetServerState } from '@firedocs/ui'
import App from './App'
import Docs from './docs'

const extraUrls: string[] = []

const DIRNAME = path.dirname(fileURLToPath(import.meta.url))
const CLIENT_DIR = path.resolve(DIRNAME, '../client')
const TEMPLATE = fs
  .readFileSync(path.resolve(CLIENT_DIR, 'index.html'))
  .toString()

async function renderToString(element: React.ReactElement) {
  return new Promise<string>((resolve, reject) => {
    const { pipe } = ReactDOMServer.renderToPipeableStream(element)
    const readAsString = (chunk: any) => {
      if (Buffer.isBuffer(chunk)) {
        return chunk.toString()
      } else if (typeof chunk === 'string') {
        return chunk
      }
      return null
    }

    const data: string[] = []
    const stream = new Writable({
      write(chunk, _, callback) {
        const value = readAsString(chunk)
        if (value === null) {
          callback(new Error('Unable to process the chunk'))
        } else {
          data.push(value)
          callback()
        }
      },
      writev(chunks, callback) {
        for (let i = 0; i < chunks.length; i += 1) {
          const { chunk } = chunks[i]
          const value = readAsString(chunk)
          if (value === null) {
            callback(new Error('Unable to process the chunk'))
            return
          } else {
            data.push(value)
          }
        }
        callback()
      },
      final(callback) {
        resolve(data.join(''))
        callback()
      }
    })

    stream.on('error', reject)

    pipe(stream)
  })
}

async function getAllUrls() {
  const ssgContext: { urls?: string[] } = {}

  await renderToString(
    <StaticRouter location={'/'}>
      <Routes>
        <Route path="/" element={<Docs ssgContext={ssgContext} />} />
      </Routes>
    </StaticRouter>
  )

  return [...(ssgContext.urls || []), ...extraUrls]
}

async function renderUrl(url: string) {
  const context = { urls: [] }
  const content = await renderToString(
    <StaticRouter location={url}>
      <App ssgContext={context} />
    </StaticRouter>
  )

  const { helmet } = context as unknown as { helmet: HelmetServerState }

  let result = TEMPLATE

  if (helmet) {
    const htmlAttrs = helmet.htmlAttributes.toString()

    if (htmlAttrs) {
      if (/\blang=/i.test(htmlAttrs)) {
        result = result
          .replace(/(<html.*)lang="[^"]+"/i, '$1')
          .replace(/(<html.*)\s+>/i, '$1>')
          .replace('<html', `<html ${htmlAttrs}`)
      } else {
        result = result.replace('<html', `<html ${htmlAttrs}`)
      }
    }

    if (helmet.title.toString()) {
      result = result.replace(/<title>.*?<\/title>/, helmet.title.toString())
    }

    const headTags: string[] = []

    if (helmet.link.toString()) {
      headTags.push(helmet.link.toString())
    }

    if (helmet.priority.toString()) {
      headTags.push(helmet.priority.toString())
    }

    if (helmet.meta.toString()) {
      headTags.push(helmet.meta.toString())
    }

    const headTagsText = headTags.join('\n    ')

    if (headTagsText) {
      result = result.replace('</head>', `  ${headTagsText}\n  </head>`)
    }
  }

  result = result.replace(
    `<div id="root"></div>`,
    `<div id="root">${content}</div>`
  )

  const urlDir = path.resolve(CLIENT_DIR, `./${url}`)
  const filename = path.resolve(urlDir, 'index.html')

  fs.mkdirSync(urlDir, { recursive: true })
  fs.writeFileSync(filename, result)

  let relativePath = url

  if (!url.endsWith('/')) {
    relativePath += '/'
  }

  relativePath += 'index.html'

  console.log(`Generated ${relativePath}`)
}

async function generate() {
  const urls = await getAllUrls()

  let index = 0
  let errorCount = 0

  const renderNext = async () => {
    if (index < urls.length) {
      const url = urls[index]

      index += 1

      if (url) {
        try {
          await renderUrl(url)
        } catch (err) {
          console.error(`Failed to render the url "${url}"`)
          console.error(err)
          errorCount += 1
        }
      }

      await renderNext()
    }
  }

  console.log()

  await renderNext()

  console.log()
  const cwdClientDir = path.relative(process.cwd(), CLIENT_DIR)
  console.log(
    `Finished generating static site (directory: ${cwdClientDir}, total: ${urls.length}, error: ${errorCount}).`
  )
  console.log()
}

generate()

// tslint: react-refresh/only-export-components
export default function Noop() {
  return <></>
}
