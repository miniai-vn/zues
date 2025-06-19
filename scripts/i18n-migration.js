#!/usr/bin/env node

/**
 * i18n Migration Script
 * 
 * This script helps convert existing components to use i18n translations.
 * It searches for hardcoded strings in components and provides guidance on:
 * 1. Adding the useTranslations hook
 * 2. Replacing hardcoded strings with t function calls
 * 3. Adding missing keys to translation files
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const readline = require('readline');

// Configuration
const rootDir = path.resolve(__dirname);
const srcDir = path.join(rootDir, 'src');
const componentsGlob = '**/*.{tsx,jsx}';
const localesDir = path.join(srcDir, 'locales');
const enTranslationsPath = path.join(localesDir, 'en', 'common.json');
const viTranslationsPath = path.join(localesDir, 'vi', 'common.json');

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Load existing translations
let enTranslations, viTranslations;
try {
  enTranslations = JSON.parse(fs.readFileSync(enTranslationsPath, 'utf8'));
  viTranslations = JSON.parse(fs.readFileSync(viTranslationsPath, 'utf8'));
} catch (error) {
  console.error('Error loading translation files:', error);
  process.exit(1);
}

// Regular expressions
const importRegex = /import\s+.*from\s+["'].*["'];?/g;
const useTranslationsImportRegex = /import\s+.*useTranslations.*from\s+["']@\/hooks\/useTranslations["'];?/;
const useTranslationsHookRegex = /const\s+{\s*t\s*}.*=\s*useTranslations\(\);?/;
const stringLiteralRegex = /"([^"\\]*(\\.[^"\\]*)*)"|'([^'\\]*(\\.[^'\\]*)*)'/g;
const jsxTextRegex = />([^<>]+)</g;

// Function to check if a component already uses useTranslations
function checkUseTranslations(fileContent) {
  return {
    hasImport: useTranslationsImportRegex.test(fileContent),
    hasHook: useTranslationsHookRegex.test(fileContent)
  };
}

// Function to extract all string literals
function extractStrings(fileContent) {
  const strings = [];
  
  // Extract string literals
  let match;
  while ((match = stringLiteralRegex.exec(fileContent)) !== null) {
    const string = match[1] || match[3];
    if (string.trim() && string.length > 2 && /[a-zA-Z]/.test(string)) {
      strings.push({
        value: string,
        isJSX: false,
        start: match.index,
        end: match.index + match[0].length
      });
    }
  }
  
  // Extract JSX text
  while ((match = jsxTextRegex.exec(fileContent)) !== null) {
    const string = match[1].trim();
    if (string && string.length > 2 && /[a-zA-Z]/.test(string)) {
      strings.push({
        value: string,
        isJSX: true,
        start: match.index + 1,
        end: match.index + match[0].length - 1
      });
    }
  }
  
  return strings;
}

// Function to generate a key from a string
function generateKey(string) {
  // Clean and normalize the string
  const cleaned = string
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 30);
    
  return cleaned;
}

// Function to add translations
function addTranslation(key, enValue, viValue) {
  // Add to English translations
  if (!enTranslations.common[key]) {
    enTranslations.common[key] = enValue;
  }
  
  // Add to Vietnamese translations
  if (!viTranslations.common[key]) {
    viTranslations.common[key] = viValue || enValue;
  }
}

// Function to save translations
function saveTranslations() {
  fs.writeFileSync(
    enTranslationsPath, 
    JSON.stringify(enTranslations, null, 2),
    'utf8'
  );
  
  fs.writeFileSync(
    viTranslationsPath, 
    JSON.stringify(viTranslations, null, 2),
    'utf8'
  );
  
  console.log('✅ Translations saved successfully!');
}

// Function to process a file
function processFile(filePath) {
  console.log(`\nProcessing: ${filePath}`);
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { hasImport, hasHook } = checkUseTranslations(fileContent);
  
  if (!hasImport || !hasHook) {
    console.log('⚠️  This component doesn\'t use useTranslations hook.');
    console.log('Add the following:');
    
    if (!hasImport) {
      console.log('import { useTranslations } from "@/hooks/useTranslations";');
    }
    
    if (!hasHook) {
      console.log('const { t } = useTranslations();');
    }
  }
  
  const strings = extractStrings(fileContent);
  if (strings.length === 0) {
    console.log('No extractable strings found in this component.');
    return;
  }
  
  console.log(`\nFound ${strings.length} potential strings to translate:`);
  strings.forEach((string, index) => {
    const key = generateKey(string.value);
    console.log(`${index + 1}. "${string.value}" -> t("${key}", "${string.value}")`);
    
    // Add to translations
    addTranslation(key, string.value);
  });
}

// Function to process all files
function processAllFiles() {
  const files = glob.sync(componentsGlob, { cwd: srcDir });
  
  console.log(`Found ${files.length} component files to process.`);
  
  files.forEach((file, index) => {
    const filePath = path.join(srcDir, file);
    console.log(`\nProcessing file ${index + 1}/${files.length}: ${file}`);
    processFile(filePath);
  });
  
  saveTranslations();
  console.log('\n✅ i18n migration completed successfully!');
}

// Function to process a specific component
function processComponent() {
  rl.question('Enter component path (relative to src/): ', (componentPath) => {
    const filePath = path.join(srcDir, componentPath);
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ File not found: ${filePath}`);
      rl.close();
      return;
    }
    
    processFile(filePath);
    
    rl.question('Save translations? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        saveTranslations();
      }
      rl.close();
    });
  });
}

// Main function
function main() {
  console.log('📦 i18n Migration Script');
  console.log('This script helps migrate components to use i18n translations.\n');
  
  rl.question('Choose an option:\n1. Process all components\n2. Process a specific component\n> ', (answer) => {
    if (answer === '1') {
      rl.close();
      processAllFiles();
    } else if (answer === '2') {
      processComponent();
    } else {
      console.log('Invalid option. Exiting.');
      rl.close();
    }
  });
}

// Start the script
main();
