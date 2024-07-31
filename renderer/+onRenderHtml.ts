// https://vike.dev/onRenderHtml
export { onRenderHtml }

import { renderToString as renderToString_ } from '@vue/server-renderer'
import type { App } from 'vue'
import { escapeInject, dangerouslySkipEscape } from 'vike/server'
import { createVueApp } from './createVueApp'
import type { OnRenderHtmlAsync } from 'vike/types'
import { renderSSRHead } from '@unhead/ssr'
import { getActiveHead } from 'unhead'

const onRenderHtml: OnRenderHtmlAsync = async (pageContext): ReturnType<OnRenderHtmlAsync> => {
  // This onRenderHtml() hook only supports SSR, see https://vike.dev/render-modes for how to modify
  // onRenderHtml() to support SPA
  if (!pageContext.Page) throw new Error('My render() hook expects pageContext.Page to be defined')

  const app = createVueApp(pageContext)
    
  const head = getActiveHead();
  if (!head) throw new Error('No active unhead head. Ensure you have installed unhead by calling createHead and app.use(head).')
  
  const appHtml = await renderToString(app)

  const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(head)

  const documentHtml = escapeInject`<!DOCTYPE html>
      <html ${dangerouslySkipEscape(htmlAttrs)}>  
      <head>
        ${dangerouslySkipEscape(headTags)}
      </head>
      <body ${dangerouslySkipEscape(bodyAttrs)}>
        ${dangerouslySkipEscape(bodyTagsOpen)}
        <div id="app">${dangerouslySkipEscape(appHtml)}</div>
        ${dangerouslySkipEscape(bodyTags)}
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      // We can add custom pageContext properties here, see https://vike.dev/pageContext#custom
    }
  }
}

async function renderToString(app: App) {
  let err: unknown
  // Workaround: renderToString_() swallows errors in production, see https://github.com/vuejs/core/issues/7876
  app.config.errorHandler = (err_) => {
    err = err_
  }
  const appHtml = await renderToString_(app)
  if (err) throw err
  return appHtml
}
