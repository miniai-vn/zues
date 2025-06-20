# i18n Guide for Mi9 RAG Model Dashboard

## Overview

This guide explains how to add internationalization (i18n) support to new components in the Mi9 RAG Model Dashboard project. The application supports multiple languages (currently Vietnamese and English) using the i18next library and react-i18next integration.

## Quick Start

### 1. Import the useTranslations hook

```tsx
import { useTranslations } from "@/hooks/useTranslations";
```

### 2. Initialize the hook in your component

```tsx
const { t } = useTranslations();
```

### 3. Replace hardcoded strings with t function calls

```tsx
// Before
<Button>Add User</Button>

// After
<Button>{t("addUser", "Add User")}</Button>
```

## Detailed Usage

### Basic Translation

The `t` function takes two parameters:
- **key**: The translation key to look up
- **defaultValue**: The default text to display if no translation is found

```tsx
{t("welcome", "Welcome to the dashboard")}
```

### With Variables

You can include variables in your translations:

```tsx
// In your component
{t("itemCount", "{{count}} items found", { count: items.length })}

// In translation files
// en/common.json
{
  "itemCount": "{{count}} items found"
}
// vi/common.json
{
  "itemCount": "Tìm thấy {{count}} mục"
}
```

### Handling Plurals

```tsx
{t("message", "{{count}} message", { count: 1 })}
{t("message", "{{count}} messages", { count: 5 })}

// In translation files
// en/common.json
{
  "message_one": "{{count}} message",
  "message_other": "{{count}} messages"
}
// vi/common.json
{
  "message": "{{count}} tin nhắn"
}
```

### Best Practices

1. **Use namespaces for organization**:
   ```tsx
   // Group related translations
   {t("dashboard.users.title", "User Management")}
   {t("dashboard.users.add", "Add User")}
   ```

2. **Reuse existing keys** when appropriate:
   ```tsx
   // Check common.json for existing keys like:
   {t("common.save", "Save")}
   {t("common.cancel", "Cancel")}
   ```

3. **Add both languages** when adding new keys:
   - Add to `src/locales/en/common.json`
   - Add to `src/locales/vi/common.json`

4. **Use sensible defaults** that match the Vietnamese text for new keys

5. **Don't concatenate strings** - use variables instead:
   ```tsx
   // Wrong
   {t("hello", "Hello")} + " " + {t("world", "world")}
   
   // Right
   {t("helloWorld", "Hello world")}
   // or
   {t("greeting", "Hello {{name}}", { name: t("world", "world") })}
   ```

## Translation Files

The translation files are located at:
- `src/locales/en/common.json` - English translations
- `src/locales/vi/common.json` - Vietnamese translations

When adding new keys, make sure to add them to both files.

## Language Switching

The app includes a language switcher component. Users can switch languages using:

```tsx
const { changeLanguage, currentLanguage } = useTranslations();

// Switch to English
<button onClick={() => changeLanguage('en')}>English</button>

// Switch to Vietnamese
<button onClick={() => changeLanguage('vi')}>Tiếng Việt</button>

// Check current language
{currentLanguage === 'en' ? 'English is active' : 'Vietnamese is active'}
```

## Automation Script

You can use the i18n migration script to help add i18n support to existing components:

```bash
node scripts/i18n-migration.js
```

This script will:
1. Scan components for hardcoded strings
2. Suggest translation keys and replacements
3. Add new keys to translation files

## Common Issues

### Keys not showing up

- Make sure you've added the key to both language files
- Check for typos in the key name
- Verify the namespace is correct

### Default values not working

- Make sure you're passing the default value as the second parameter
- Check for syntax errors in your JSX

### Language not changing

- Verify that `changeLanguage` is being called correctly
- Check browser localStorage for saved language preference

## Need Help?

If you have questions about i18n implementation, check:
- The existing i18n setup in the project
- The i18next documentation: https://www.i18next.com/
- The react-i18next documentation: https://react.i18next.com/
