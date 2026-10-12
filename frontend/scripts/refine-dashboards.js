import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '../src/components');

function refineAdminContent() {
  const filePath = path.join(srcDir, 'AdminContent.jsx');
  let content = fs.readFileSync(filePath, 'utf8');

  // Indigo button & accent replacements
  content = content.replaceAll('bg-indigo-600 hover:bg-indigo-700', 'bg-[#315C7D] hover:bg-[#284B66]');
  content = content.replaceAll('bg-indigo-600', 'bg-[#315C7D]');
  content = content.replaceAll('hover:bg-indigo-700', 'hover:bg-[#284B66]');
  content = content.replaceAll('text-indigo-600 dark:text-indigo-400', 'text-[#315C7D] dark:text-[#7EB0D5]');
  content = content.replaceAll('text-indigo-500 dark:text-indigo-400', 'text-[#315C7D] dark:text-[#7EB0D5]');
  content = content.replaceAll('text-indigo-600', 'text-[#315C7D]');
  content = content.replaceAll('text-indigo-500', 'text-[#315C7D]');
  content = content.replaceAll('bg-indigo-50 dark:bg-indigo-900/20', 'bg-[#EEF3F7] dark:bg-[#315C7D]/20');
  content = content.replaceAll('bg-indigo-50', 'bg-[#EEF3F7]');
  content = content.replaceAll('hover:bg-indigo-100', 'hover:bg-[#E2EBF2]');
  content = content.replaceAll('dark:hover:bg-indigo-900/30', 'dark:hover:bg-[#315C7D]/30');
  content = content.replaceAll('dark:hover:bg-indigo-900/40', 'dark:hover:bg-[#315C7D]/40');
  content = content.replaceAll('border-indigo-200 dark:border-indigo-900/40', 'border-[#315C7D]/30 dark:border-[#315C7D]/40');
  content = content.replaceAll('border-indigo-200', 'border-[#315C7D]/30');
  content = content.replaceAll('bg-indigo-100 dark:bg-indigo-900/30', 'bg-[#EEF3F7] dark:bg-[#315C7D]/30');
  content = content.replaceAll('bg-indigo-100', 'bg-[#EEF3F7]');
  content = content.replaceAll('focus:border-indigo-400', 'focus:border-[#315C7D]');
  content = content.replaceAll('dark:focus:border-indigo-500', 'dark:focus:border-[#7EB0D5]');
  content = content.replaceAll('focus:ring-indigo-500/10', 'focus:ring-[#315C7D]/15');

  // Neutral surfaces, borders, shadows & radii
  content = content.replaceAll('bg-white/80', 'bg-white');
  content = content.replaceAll('border-gray-100/80 dark:border-gray-800/50', 'border-[#E3E7EB] dark:border-gray-800');
  content = content.replaceAll('border-gray-100 dark:border-gray-800/50', 'border-[#E3E7EB] dark:border-gray-800');
  content = content.replaceAll('border-gray-200 dark:border-gray-800', 'border-[#E3E7EB] dark:border-gray-800');
  content = content.replaceAll('border-gray-200 dark:border-gray-700', 'border-[#E3E7EB] dark:border-gray-700');
  content = content.replaceAll('shadow-soft', 'shadow-subtle');
  content = content.replaceAll('text-gray-800 dark:text-gray-100', 'text-[#202A35] dark:text-gray-100');
  content = content.replaceAll('bg-gray-50/50 dark:bg-[#0c1222]', 'bg-[#F0F2F4] dark:bg-[#0c1222]');
  content = content.replaceAll('bg-gray-50/50', 'bg-[#F0F2F4]');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('AdminContent.jsx refined successfully');
}

function refineHRContent() {
  const filePath = path.join(srcDir, 'HRContent.jsx');
  let content = fs.readFileSync(filePath, 'utf8');

  // HR teal accent replacements
  content = content.replaceAll('bg-indigo-600 hover:bg-indigo-700', 'bg-[#34766F] hover:bg-[#2B615B]');
  content = content.replaceAll('bg-indigo-600', 'bg-[#34766F]');
  content = content.replaceAll('hover:bg-indigo-700', 'hover:bg-[#2B615B]');
  content = content.replaceAll('text-indigo-600 dark:text-indigo-400', 'text-[#34766F] dark:text-[#6EA8A1]');
  content = content.replaceAll('text-indigo-500 dark:text-indigo-400', 'text-[#34766F] dark:text-[#6EA8A1]');
  content = content.replaceAll('text-indigo-600', 'text-[#34766F]');
  content = content.replaceAll('text-indigo-500', 'text-[#34766F]');
  content = content.replaceAll('bg-indigo-50 dark:bg-indigo-900/20', 'bg-[#EEF4F1] dark:bg-[#34766F]/20');
  content = content.replaceAll('bg-indigo-50', 'bg-[#EEF4F1]');
  content = content.replaceAll('hover:bg-indigo-100', 'hover:bg-[#DEEBE5]');
  content = content.replaceAll('dark:hover:bg-indigo-900/30', 'dark:hover:bg-[#34766F]/30');
  content = content.replaceAll('dark:hover:bg-indigo-900/40', 'dark:hover:bg-[#34766F]/40');
  content = content.replaceAll('border-indigo-200 dark:border-indigo-900/40', 'border-[#34766F]/30 dark:border-[#34766F]/40');
  content = content.replaceAll('border-indigo-200', 'border-[#34766F]/30');
  content = content.replaceAll('bg-indigo-100 dark:bg-indigo-900/30', 'bg-[#EEF4F1] dark:bg-[#34766F]/30');
  content = content.replaceAll('bg-indigo-100', 'bg-[#EEF4F1]');
  content = content.replaceAll('focus:border-indigo-400', 'focus:border-[#34766F]');
  content = content.replaceAll('dark:focus:border-indigo-500', 'dark:focus:border-[#6EA8A1]');
  content = content.replaceAll('focus:ring-indigo-500/10', 'focus:ring-[#34766F]/15');

  // Neutral surfaces, borders, shadows & radii
  content = content.replaceAll('bg-white/80', 'bg-white');
  content = content.replaceAll('border-gray-100/80 dark:border-gray-800/50', 'border-[#E3E7EB] dark:border-gray-800');
  content = content.replaceAll('border-gray-100 dark:border-gray-800/50', 'border-[#E3E7EB] dark:border-gray-800');
  content = content.replaceAll('border-gray-200 dark:border-gray-800', 'border-[#E3E7EB] dark:border-gray-800');
  content = content.replaceAll('border-gray-200 dark:border-gray-700', 'border-[#E3E7EB] dark:border-gray-700');
  content = content.replaceAll('shadow-soft', 'shadow-subtle');
  content = content.replaceAll('text-gray-800 dark:text-gray-100', 'text-[#202A35] dark:text-gray-100');
  content = content.replaceAll('bg-gray-50/50 dark:bg-[#0c1222]', 'bg-[#F0F2F4] dark:bg-[#0c1222]');
  content = content.replaceAll('bg-gray-50/50', 'bg-[#F0F2F4]');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('HRContent.jsx refined successfully');
}

function refineEmployeeContent() {
  const filePath = path.join(srcDir, 'EmployeeContent.jsx');
  let content = fs.readFileSync(filePath, 'utf8');

  // Employee plum accent replacements
  content = content.replaceAll('bg-indigo-600 hover:bg-indigo-700', 'bg-[#715D78] hover:bg-[#5D4C63]');
  content = content.replaceAll('bg-indigo-600', 'bg-[#715D78]');
  content = content.replaceAll('hover:bg-indigo-700', 'hover:bg-[#5D4C63]');
  content = content.replaceAll('text-indigo-600 dark:text-indigo-400', 'text-[#715D78] dark:text-[#B29EB8]');
  content = content.replaceAll('text-indigo-500 dark:text-indigo-400', 'text-[#715D78] dark:text-[#B29EB8]');
  content = content.replaceAll('text-indigo-600', 'text-[#715D78]');
  content = content.replaceAll('text-indigo-500', 'text-[#715D78]');
  content = content.replaceAll('bg-indigo-50 dark:bg-indigo-900/20', 'bg-[#F2EFF3] dark:bg-[#715D78]/20');
  content = content.replaceAll('bg-indigo-50', 'bg-[#F2EFF3]');
  content = content.replaceAll('hover:bg-indigo-100', 'hover:bg-[#E7E2E9]');
  content = content.replaceAll('dark:hover:bg-indigo-900/30', 'dark:hover:bg-[#715D78]/30');
  content = content.replaceAll('dark:hover:bg-indigo-900/40', 'dark:hover:bg-[#715D78]/40');
  content = content.replaceAll('border-indigo-200 dark:border-indigo-900/40', 'border-[#715D78]/30 dark:border-[#715D78]/40');
  content = content.replaceAll('border-indigo-200', 'border-[#715D78]/30');
  content = content.replaceAll('bg-indigo-100 dark:bg-indigo-900/30', 'bg-[#F2EFF3] dark:bg-[#715D78]/30');
  content = content.replaceAll('bg-indigo-100', 'bg-[#F2EFF3]');
  content = content.replaceAll('focus:border-indigo-400', 'focus:border-[#715D78]');
  content = content.replaceAll('dark:focus:border-indigo-500', 'dark:focus:border-[#B29EB8]');
  content = content.replaceAll('focus:ring-indigo-500/10', 'focus:ring-[#715D78]/15');

  // Doughnut chart and indicators
  content = content.replaceAll('"#6366f1"', '"#715D78"');
  content = content.replaceAll('bg-[#6366f1]', 'bg-[#715D78]');

  // Neutral surfaces, borders, shadows & radii
  content = content.replaceAll('bg-white/80', 'bg-white');
  content = content.replaceAll('border-gray-100/80 dark:border-gray-800/50', 'border-[#E3E7EB] dark:border-gray-800');
  content = content.replaceAll('border-gray-100 dark:border-gray-800/50', 'border-[#E3E7EB] dark:border-gray-800');
  content = content.replaceAll('border-gray-200 dark:border-gray-800', 'border-[#E3E7EB] dark:border-gray-800');
  content = content.replaceAll('border-gray-200 dark:border-gray-700', 'border-[#E3E7EB] dark:border-gray-700');
  content = content.replaceAll('shadow-soft', 'shadow-subtle');
  content = content.replaceAll('text-gray-800 dark:text-gray-100', 'text-[#202A35] dark:text-gray-100');
  content = content.replaceAll('bg-gray-50/50 dark:bg-[#0c1222]', 'bg-[#F0F2F4] dark:bg-[#0c1222]');
  content = content.replaceAll('bg-gray-50/50', 'bg-[#F0F2F4]');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('EmployeeContent.jsx refined successfully');
}

refineAdminContent();
refineHRContent();
refineEmployeeContent();
