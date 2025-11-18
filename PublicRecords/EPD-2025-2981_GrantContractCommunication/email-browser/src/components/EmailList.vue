<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  emails: Array,
  loading: Boolean,
  selectedEmail: Object
})

const emit = defineEmits(['select'])

const selectEmail = (email) => {
  emit('select', email)
}

const getPreview = (email) => {
  if (email.body_preview) {
    return email.body_preview.substring(0, 150) + '...'
  }
  return '(no content)'
}

const getDisplayName = (email) => {
  if (email.from_name) {
    return email.from_name
  }
  if (email.from_address) {
    return email.from_address
  }
  return '(unknown sender)'
}
</script>

<template>
  <div class="email-list">
    <div v-if="loading" class="loading">
      Loading emails...
    </div>

    <div v-else-if="emails.length === 0" class="empty">
      No emails found
    </div>

    <div
      v-else
      v-for="email in emails"
      :key="email.id"
      class="email-item"
      :class="{ selected: selectedEmail && selectedEmail.id === email.id }"
      @click="selectEmail(email)"
    >
      <div class="email-header">
        <div class="from">{{ getDisplayName(email) }}</div>
        <div class="badges">
          <span v-if="email.has_thread" class="badge thread-badge" :title="`${email.thread_count} messages in thread`">
            {{ email.thread_count }}
          </span>
        </div>
      </div>
      <div class="subject">{{ email.subject || '(no subject)' }}</div>
      <div class="preview">{{ getPreview(email) }}</div>
      <div class="metadata">
        <span v-if="email.to_address" class="to">To: {{ email.to_address }}</span>
        <span class="length">{{ Math.round(email.body_length / 1000) }}k</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.email-list {
  height: 100%;
}

.loading,
.empty {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.email-item {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.email-item:hover {
  background-color: #f9f9f9;
}

.email-item.selected {
  background-color: #e3f2fd;
  border-left: 3px solid #2196f3;
}

.email-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.4rem;
}

.from {
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
}

.badges {
  display: flex;
  gap: 0.3rem;
}

.badge {
  padding: 0.15rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
}

.thread-badge {
  background: #ff9800;
  color: white;
}

.subject {
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 0.4rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.preview {
  font-size: 0.85rem;
  color: #777;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 0.4rem;
}

.metadata {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #999;
}

.to {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.length {
  margin-left: 0.5rem;
  white-space: nowrap;
}
</style>
