# Changelog

All notable changes to this project will be documented in this file.

## [Release 0.0.1]

### Added

- **New Form Builder**: Added a new form builder editor with new settings sections, validation utilities, and improved response formatting.
- **Customizable Thank You Screen**: Added customizable "Thank You" screen for the Single Page Builder to match Flow Builder capabilities.
- **Automated Formatting and Linting**: Added automated code formatting and linting via `.pre-commit-config.yaml` hooks.
- **Clear Form Button**: Added "Clear Form" button to the Single Page layout to allow users to reset all form fields.
- **Multipage Feature**: Introduced `Page Break` field type to split forms into multiple pages in the Single Page Form Builder.
- **Navigation and Progress Bar**: Added automated "Next", "Back" navigation and dynamic progress tracking for multipage layouts.

### Fixed

- **React Hook Order**: Fixed React Hook order mismatch error in `PublicFormPage.tsx` by moving the `useMemo` hook before early returns.
- **Layout Rendering**: Fixed empty field rendering in `SinglePage` and `FlowPage` by normalizing layout-level field type aliases.
- **Dropdown Rendering**: Fixed `dropdown` field rendering by mapping it correctly to the `select` component.
- **TextArea Aliases**: Fixed `long text` and its various aliases by mapping them uniformly to the `textarea` component.
- **Multiline Descriptions**: Fixed description rendering to preserve line breaks (`\n`) in both builder and public form views.
- **Validation Logic**: Fixed form save/publish validation to require titles before saving in both Flow and Single builders.
- **Locale-Aware Formatting**: Updated date and time formatting throughout the app to be locale-aware and use consistent double-digit representation.
- **Export Formatting**: Enhanced `formatAnswer` utility to ensure reliable date formatting in both UI displays and CSV exports.
- **Linting Compliance**: Fixed multiple TypeScript and React-specific linting errors across the entire codebase.
- **Input Constraints**: Added a `min="1"` constraint to the `maxLength` input to prevent invalid length values.
- **Per-Page Clear Logic**: Refined the "Clear" button to only reset fields on the current page for multipage forms.
- **Selection Stability**: Stabilized field settings by adding unique editor keys, ensuring the panel correctly re-initializes on selection.
- **Builder Interaction**: Enhanced field clickability by adding `pointer-events-none` to previews, enabling full-surface selection.
- **Long Text Auto-Focus**: Fixed missing auto-focus for "Long Text" fields in Flow mode by updating the `FlowPage` layout and `TextArea` component.
