<template>
  <div id="page-container">
    <div id="sidebar">
      <a href="/" id="logo-container">
        <img src="./logo.svg" height="64" width="64" alt="logo" />
      </a>
      <Link href="/">Welcome</Link>
      <Link href="/about">About</Link>
      <Link href="/star-wars">Data Fetching</Link>
    </div>
    <div id="page-content"><slot /></div>
  </div>
</template>

<script lang="ts" setup>
import Link from './Link.vue'
import './css/index.css'

import { useServerHead, useServerHeadSafe } from '@unhead/vue'
import { getPageTitle } from './getPageTitle'
import logoUrl from './logo.svg'
import { usePageContext } from './usePageContext'
import { unref } from 'vue'

/**
 * title and desc are now site-wide defaults, and are overwritten by any page-specific or 
 * layout-specific updates to useHead({}).
 * 
 * @see pages/star-wars/@id/+Page.vue
 * 
 * Note that the order we render in is important. Only the most recent 
 * <title> and <meta name="description"> will be used, so we intentionally 
 * do this head.push prior to calling renderToString().
 * 
 * @see https://unhead.unjs.io/usage/guides/handling-duplicates#deduping-logic
 * 
 */
const pageContext = unref(usePageContext());

const title = getPageTitle(pageContext)
const desc = pageContext.data?.description || pageContext.config.description || 'Demo of using Vike';

/**
 * useServerHead is used here for the values that don't need to be santized.
 * 
 * For readability, these values could probably be combined with useServerHeadSafe,
 * but currently the 'charset' meta tag is not supported by useServerHeadSafe.
 * That's probably a (very minor) type bug, @see https://github.com/unjs/unhead/issues/372
 */
useServerHead({
  htmlAttrs: {
    lang: 'en'
  },
  link: [
    {
      href: logoUrl,
      rel: "icon"
    }
  ],
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
  ],
})

/**
 * 
 * Since we're not sure whether fetched data content has been sanitized, it is critically
 * important to use useHeadSafe(), useServerHeadSafe(), userSeoMeta(), or useSeoServerSeoMeta() here. 
 * If you are passing hard-coded literal values, or values that are otherwise guaranteed to have
 * been sanitized, you can use useHead() or useServerHead().
 * 
 * @see https://unhead.unjs.io/usage/composables/use-head#xss-safety
 * 
 */
useServerHeadSafe({
  meta: [
    { name: 'description', content: desc }
  ],
  title,
})

</script>

<style>
#sidebar a {
  padding: 2px 10px;
  margin-left: -10px;
}
#sidebar a.is-active {
  background-color: #eee;
}
</style>

<style scoped>
#page-container {
  display: flex;
  max-width: 900px;
  margin: auto;
}
#page-content {
  padding: 20px;
  padding-bottom: 50px;
  min-height: 100vh;
}
#sidebar {
  padding: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  line-height: 1.8em;
  border-right: 2px solid #eee;
}
#logo-container {
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>
