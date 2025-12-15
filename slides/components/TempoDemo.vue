<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { render } from '@tempots/dom'
import { counterDemo, counterCode } from '../demos/counter'
import { counterDerivedDemo, counterDerivedCode } from '../demos/counter-derived'
import { todoItemDemo, todoItemCode } from '../demos/todo-item'

const props = defineProps<{
  demo: 'counter' | 'counter-derived' | 'todo-item'
}>()

const container = ref<HTMLElement | null>(null)
let cleanup: (() => void) | null = null

const demos = {
  'counter': { render: counterDemo, code: counterCode },
  'counter-derived': { render: counterDerivedDemo, code: counterDerivedCode },
  'todo-item': { render: todoItemDemo, code: todoItemCode },
}

const code = computed(() => demos[props.demo]?.code ?? '')

onMounted(() => {
  if (container.value) {
    const demo = demos[props.demo]
    if (demo) {
      cleanup = render(demo.render(), container.value)
    }
  }
})

onUnmounted(() => {
  if (cleanup) {
    cleanup()
    cleanup = null
  }
})
</script>

<template>
  <div class="tempo-demo">
    <div class="tempo-code">
      <pre><code class="language-typescript">{{ code }}</code></pre>
    </div>
    <div class="tempo-output" ref="container"></div>
  </div>
</template>

<style scoped>
.tempo-demo {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: start;
}

.tempo-code {
  background: #1a1a2e !important;
  border-radius: 8px;
  padding: 0.75rem;
  overflow: auto;
  font-size: 0.65rem;
  border: 2px solid #4a9eff;
  max-height: 300px;
}

.tempo-code pre {
  margin: 0;
  background: transparent !important;
}

.tempo-code code {
  font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
  white-space: pre;
  color: #f8f8f2 !important;
  line-height: 1.4;
  text-shadow: none;
  background: transparent !important;
}

.tempo-output {
  background: #161b22;
  border-radius: 8px;
  padding: 1.5rem;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #30363d;
  color: #e6edf3;
}

.tempo-output :deep(button) {
  background: #4a9eff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin: 0.25rem;
  transition: background 0.2s;
}

.tempo-output :deep(button:hover) {
  background: #3a8eef;
}

.tempo-output :deep(button:disabled) {
  background: #666;
  cursor: not-allowed;
}

.tempo-output :deep(.count) {
  font-size: 2rem;
  font-weight: bold;
  margin: 1rem 0;
}

.tempo-output :deep(.even) {
  color: #4ade80;
}

.tempo-output :deep(.odd) {
  color: #f472b6;
}

.tempo-output :deep(li) {
  list-style: none;
  padding: 0.5rem 1rem;
  background: #21262d;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #30363d;
}

.tempo-output :deep(li.completed) {
  text-decoration: line-through;
  opacity: 0.6;
}

.tempo-output :deep(input[type="checkbox"]) {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}
</style>
