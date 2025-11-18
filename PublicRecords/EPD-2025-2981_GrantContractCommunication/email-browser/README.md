# Email Browser

A Vue.js web application for browsing parsed email JSON files from a TSV export.

## Features

- **Email List View** - Browse all 8,908 parsed emails
- **Search** - Search emails by subject, body, sender, or recipient
- **Filter** - Filter to show only emails with thread conversations
- **Detail View** - View full email content with metadata and thread information
- **Responsive Design** - Works on desktop and mobile devices

## Setup

The application is already set up with all email data copied to the `public/` directory.

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5174/` (or the next available port)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
email-browser/
├── public/
│   ├── emails/           # 8,908 email JSON files
│   └── emails-index.json # Index of all emails for quick loading
├── src/
│   ├── components/
│   │   ├── EmailList.vue   # Email list component
│   │   └── EmailDetail.vue # Email detail view component
│   ├── App.vue             # Main application component
│   └── main.js             # Application entry point
└── package.json
```

## Usage

1. **Browse Emails** - Scroll through the list of emails in the left panel
2. **Search** - Type in the search box to filter emails by content
3. **Filter Threads** - Check the "Threads only" checkbox to show only emails with conversation threads
4. **View Details** - Click on any email to view its full content in the right panel
5. **Close Details** - Click the ✕ button to close the detail view

## Email Data

- **Total Emails**: 8,908 (from properly parsed TSV)
- **Data Size**: ~41 MB
- **Source**: TSV file with quoted multi-line fields
- **Features**:
  - Subject, From, To, CC, BCC fields
  - Full email body with proper formatting
  - Thread detection and extraction
  - Signature and quoted reply detection
  - Body length and content analysis

## About the Data

The source TSV file uses proper quoting for multi-line email bodies. The parser:
- Uses Python's csv.DictReader for correct quote handling
- Extracts clean email bodies without TSV artifacts
- Optionally splits threads by "From:" headers
- Preserves formatting and indentation

## Technologies

- Vue 3 (Composition API)
- Vite (build tool)
- Vanilla CSS (no additional libraries)
