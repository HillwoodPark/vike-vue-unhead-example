<template>
  <h1>{{ data.movie.title }}</h1>
  Release Date: {{ data.movie.release_date }}
  <br />
  Director: {{ data.movie.director }}
  <br />
  Producer: {{ data.movie.producer }}
</template>

<script lang="ts" setup>
import type { Data } from './+data'
import { useData } from '../../../renderer/useData'
import { useServerSeoMeta } from '@unhead/vue';

const data = useData<Data>()

/**
 * 
 * Since we're not sure whether fetched data content has been sanitized, it is critically
 * important to use useHeadSafe(), useServerHeadSafe(), userSeoMeta(), or useSeoServerSeoMeta() here. 
 * If you are passing hard-coded literal values, or values that are otherwise guaranteed to have
 * been sanitized, you can use useHead().
 * 
 * @see https://unhead.unjs.io/usage/composables/use-head#xss-safety
 * 
 */
useServerSeoMeta({
  title: data.value.movie.title,
  description: data.value.movie.title,
})
</script>
