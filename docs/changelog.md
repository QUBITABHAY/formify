# Changelog

All notable changes to this project will be documented in this file.

## [Release 0.0.1]

### Added

- Added a new form builder editor with new settings sections, validation utilities, and improved response formatting.
- Added customizable "Thank You" screen for the Single Page Builder to match Flow Builder capabilities.
- Added automated code formatting and linting via `.pre-commit-config.yaml` hooks.

### Fixed

- Fixed React Hook order mismatch error in `PublicFormPage.tsx` by moving the `useMemo` hook before early returns and handling initial `null` form state.
- Fixed empty field rendering in `SinglePage` and `FlowPage` by normalizing layout-level field type aliases.
- Fixed `dropdown` field rendering by mapping it to `select` in layout render switches.
- Fixed `long text` / `longtext` / `long-text` / `long_text` field rendering by mapping these aliases to `textarea` and rendering `TextArea` in both layouts.
- Fixed multiline description rendering by preserving line breaks (`\n`) in Single and Flow builder canvases and public form layouts.
- Fixed form save/publish validation to block empty titles and show a warning message (`Form title is required.`) in both Flow and Single builders.
- Updated date and time formatting across the application (Dashboard, Form Responses, and Individual Response pages) to be locale-aware and use double-digit representation (e.g., `03/03/2026`).
- Enhanced `formatAnswer` utility to properly format date-type form responses in both UI displays and CSV exports.
- Fixed multiple TypeScript and React-specific linting errors (`@typescript-eslint/no-explicit-any`, `react/display-name`, etc.).
- Added `min="1"` to `maxLength` input in `BasicFieldSettings` to prevent invalid length values.
