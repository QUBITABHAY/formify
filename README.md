# Formify

A powerful, modern form builder that combines the best of Google Forms, Zoho Forms, and Typeform.

## Features

- **Dual-Mode Builder**: Create forms in either "Single Page" or "Flow" (Typeform-style) layouts.
- **Customizable Success Screen**: Personalize the "Thank You" experience with custom titles, descriptions, and emojis.
- **Google Sheets Integration**: Automatically sync form responses to a linked Google Spreadsheet.
- **Rich Field Types**: Support for Text, TextArea, Radio, Checkbox, Select, Date, Time, and File Upload.
- **Advanced Validation**: Real-time validation for required fields, character limits, and file types.
- **Locale-Aware Formatting**: Intelligent date and time formatting across all management pages.
- **Data Export**: Export responses to CSV for easy analysis.

## Development Setup

### Prerequisites

- Node.js (Latest LTS)
- npm or yarn
- [pre-commit](https://pre-commit.com/) (recommended for automated code quality checks)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/QUBITABHAY/formify
   cd formify
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install pre-commit hooks:

   ```bash
   pre-commit install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Code Quality

This project uses ESLint and Prettier (via pre-commit) to maintain high code quality.

- **Run Linting**: `npm run lint`
- **Build Verification**: `npm run build`
