<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  email: Object,
  loading: Boolean
})

const emit = defineEmits(['close'])

const formatBody = (body) => {
  if (!body) return ''
  // Preserve line breaks
  return body.replace(/\n/g, '<br>')
}

const getFromDisplay = (email) => {
  if (!email) return ''
  const from = email.from
  if (from.name && from.address) {
    return `${from.name} <${from.address}>`
  }
  if (from.name) return from.name
  if (from.address) return from.address
  return '(unknown)'
}

const getToDisplay = (email) => {
  if (!email) return ''
  const to = email.to
  if (to.name && to.address) {
    return `${to.name} <${to.address}>`
  }
  if (to.name) return to.name
  if (to.address) return to.address
  return '(unknown)'
}

const getCcDisplay = (email) => {
  if (!email) return null
  const cc = email.cc
  if (!cc || (!cc.name && !cc.address)) return null
  if (cc.name && cc.address) {
    return `${cc.name} <${cc.address}>`
  }
  if (cc.name) return cc.name
  if (cc.address) return cc.address
  return null
}
</script>

<template>
  <div class="email-detail">
    <div class="detail-header">
      <button class="close-btn" @click="emit('close')" title="Close">
        ✕
      </button>
    </div>

    <div v-if="loading" class="loading">
      Loading email...
    </div>

    <div v-else-if="email" class="email-content">
      <div class="subject-line">
        {{ email.subject || '(no subject)' }}
      </div>

      <div class="metadata-section">
        <div class="metadata-row">
          <span class="label">From:</span>
          <span class="value">{{ getFromDisplay(email) }}</span>
        </div>
        <div class="metadata-row">
          <span class="label">To:</span>
          <span class="value">{{ getToDisplay(email) }}</span>
        </div>
        <div class="metadata-row" v-if="getCcDisplay(email)">
          <span class="label">CC:</span>
          <span class="value">{{ getCcDisplay(email) }}</span>
        </div>
      </div>

      <div class="analysis-section" v-if="email.analysis">
        <div class="analysis-badges">
          <span class="badge" v-if="email.analysis.has_signature">Has Signature</span>
          <span class="badge" v-if="email.analysis.has_quoted_reply">Has Reply</span>
          <span class="badge thread-badge" v-if="email.analysis.thread_count > 0">
            {{ email.analysis.thread_count }} messages in thread
          </span>
          <span class="badge">{{ Math.round(email.analysis.body_length / 1000) }}k chars</span>
        </div>
      </div>

      <div class="thread-section" v-if="email.thread_messages && email.thread_messages.length > 0">
        <h3>Thread Messages</h3>
        <div class="thread-messages">
          <div v-for="(msg, index) in email.thread_messages" :key="index" class="thread-message">
            <div class="thread-header">
              <strong>From:</strong> {{ msg.from }}
            </div>
            <div class="thread-meta">
              <div v-if="msg.sent"><strong>Sent:</strong> {{ msg.sent }}</div>
              <div v-if="msg.to"><strong>To:</strong> {{ msg.to }}</div>
              <div v-if="msg.cc"><strong>CC:</strong> {{ msg.cc }}</div>
              <div v-if="msg.subject"><strong>Subject:</strong> {{ msg.subject }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="body-section">
        <h3>Email Body</h3>
        <div class="body-content" v-html="formatBody(email.body)"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.email-detail {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.detail-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 0.25rem 0.5rem;
  line-height: 1;
  border-radius: 4px;
  transition: background-color 0.15s ease;
}

.close-btn:hover {
  background-color: #f0f0f0;
}

.loading {
  padding: 2rem;
  text-align: center;
  color: #666;
}

.email-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 2rem;
  width: 100%;
}

.subject-line {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  line-height: 1.3;
  text-align: left;
}

.metadata-section {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.metadata-row {
  display: flex;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.metadata-row:last-child {
  margin-bottom: 0;
}

.label {
  font-weight: 600;
  min-width: 60px;
  color: #555;
}

.value {
  color: #333;
  word-break: break-word;
}

.analysis-section {
  margin-bottom: 1.5rem;
}

.analysis-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.badge {
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  background: #e0e0e0;
  color: #555;
}

.thread-badge {
  background: #ff9800;
  color: white;
}

.thread-section {
  margin-bottom: 1.5rem;
}

.thread-section h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 0.5rem;
}

.thread-messages {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.thread-message {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 6px;
  border-left: 3px solid #ff9800;
}

.thread-header {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: #333;
}

.thread-meta {
  font-size: 0.85rem;
  color: #666;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.body-section {
  margin-bottom: 1.5rem;
}

.body-section h3 {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
  border-bottom: 2px solid #e0e0e0;
  padding-bottom: 0.5rem;
}

.body-content {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #444;
  white-space: pre-wrap;
  word-wrap: break-word;
  background: #fafafa;
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  text-align: left;
  width: 100%;
}
</style>
