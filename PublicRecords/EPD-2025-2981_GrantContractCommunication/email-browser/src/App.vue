<script setup>
import { ref, onMounted, computed } from 'vue'
import EmailList from './components/EmailList.vue'
import EmailDetail from './components/EmailDetail.vue'

const emails = ref([])
const selectedEmail = ref(null)
const selectedEmailData = ref(null)
const searchQuery = ref('')
const loading = ref(true)
const filterThreads = ref(false)

// Load email index on mount
onMounted(async () => {
  try {
    const basePath = import.meta.env.BASE_URL
    const response = await fetch(`${basePath}emails-index.json`)
    emails.value = await response.json()
    loading.value = false
  } catch (error) {
    console.error('Failed to load emails:', error)
    loading.value = false
  }
})

// Filtered emails based on search query
const filteredEmails = computed(() => {
  let result = emails.value

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(email => {
      return (
        (email.subject || '').toLowerCase().includes(query) ||
        (email.body_preview || '').toLowerCase().includes(query) ||
        (email.from_name || '').toLowerCase().includes(query) ||
        (email.from_address || '').toLowerCase().includes(query) ||
        (email.to_name || '').toLowerCase().includes(query) ||
        (email.to_address || '').toLowerCase().includes(query)
      )
    })
  }

  // Filter by threads
  if (filterThreads.value) {
    result = result.filter(email => email.has_thread)
  }

  return result
})

// Load full email data when selected
const selectEmail = async (email) => {
  selectedEmail.value = email
  selectedEmailData.value = null

  try {
    const basePath = import.meta.env.BASE_URL
    const response = await fetch(`${basePath}emails/${email.filename}`)
    selectedEmailData.value = await response.json()
  } catch (error) {
    console.error('Failed to load email:', error)
  }
}

// Clear selection
const clearSelection = () => {
  selectedEmail.value = null
  selectedEmailData.value = null
}
</script>

<template>
  <div class="app">
    <header class="header">
      <h1>Email Browser</h1>
      <div class="stats" v-if="!loading">
        <span>{{ filteredEmails.length }} of {{ emails.length }} emails</span>
      </div>
    </header>

    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search emails by subject, body, sender, or recipient..."
        class="search-input"
      />
      <label class="filter-checkbox">
        <input type="checkbox" v-model="filterThreads" />
        Threads only
      </label>
    </div>

    <div class="content">
      <div class="email-list-panel" :class="{ 'has-selection': selectedEmail }">
        <EmailList
          :emails="filteredEmails"
          :loading="loading"
          :selectedEmail="selectedEmail"
          @select="selectEmail"
        />
      </div>

      <div class="email-detail-panel" v-if="selectedEmail">
        <EmailDetail
          :email="selectedEmailData"
          :loading="!selectedEmailData"
          @close="clearSelection"
        />
      </div>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: #f5f5f5;
}

.app {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.header {
  background: #2c3e50;
  color: white;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.header h1 {
  font-size: 1.5rem;
  font-weight: 600;
}

.stats {
  font-size: 0.9rem;
  opacity: 0.9;
}

.search-bar {
  background: white;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  gap: 1rem;
  align-items: center;
  width: 100%;
}

.search-input {
  flex: 1;
  padding: 0.6rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.95rem;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
}

.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  white-space: nowrap;
  cursor: pointer;
}

.filter-checkbox input {
  cursor: pointer;
}

.content {
  flex: 1;
  display: flex;
  overflow: hidden;
  width: 100%;
}

.email-list-panel {
  width: 100%;
  background: white;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  transition: width 0.3s ease;
}

.email-list-panel.has-selection {
  width: 450px;
  min-width: 450px;
  flex-shrink: 0;
}

.email-detail-panel {
  flex: 1;
  background: white;
  overflow-y: auto;
  width: 100%;
}

@media (max-width: 768px) {
  .email-list-panel.has-selection {
    display: none;
  }

  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
