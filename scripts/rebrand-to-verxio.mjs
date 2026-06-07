#!/usr/bin/env node
/**
 * Rebrand user-facing Hermes / Nous Research copy to Verxio.
 * Skips technical identifiers (hermesDesktop, @hermes/, env vars, provider ids).
 */
import { readFileSync, writeFileSync } from 'node:fs'

const ROOT = new URL('..', import.meta.url).pathname

const FILES = [
  'src/i18n/en.ts',
  'src/i18n/ja.ts',
  'src/i18n/zh.ts',
  'src/i18n/zh-hant.ts',
  'src/components/chat/intro.tsx',
  'src/components/chat/intro-copy.jsonl',
  'src/components/desktop-onboarding-overlay.tsx',
  'src/components/desktop-install-overlay.tsx',
  'src/components/boot-failure-overlay.tsx',
  'src/components/gateway-connecting-overlay.tsx',
  'src/components/model-picker.tsx',
  'src/store/onboarding.ts',
  'src/platform/install-web-bridge.ts',
  'src/app/settings/constants.ts',
  'src/app/settings/about-settings.tsx',
  'src/lib/desktop-slash-commands.ts',
  'src/lib/provider-setup-errors.ts',
  'src/lib/provider-setup-errors.test.ts',
  'src/themes/context.tsx',
  'src/themes/use-skin-command.ts',
  'README.md',
  'DEPLOY.md',
  'IMPLEMENTATION_PLAN.md',
  'package.json',
  'index.html',
  'vite.config.ts'
]

const REPLACEMENTS = [
  ['Hermes Agent', 'Verxio'],
  ['Hermes Desktop', 'Verxio'],
  ['Hermes 桌面版', 'Verxio'],
  ['Hermes Desktop', 'Verxio'],
  ['Hermes background process', 'Verxio backend'],
  ['Hermes 后台进程', 'Verxio 后端'],
  ['Hermes 背景程序', 'Verxio 後端'],
  ['Hermes inference gateway', 'Verxio gateway'],
  ['Hermes 推理网关', 'Verxio 网关'],
  ['Hermes 推理閘道', 'Verxio 閘道'],
  ['Hermes gateway', 'Verxio gateway'],
  ['Hermes 网关', 'Verxio 网关'],
  ['Hermes 閘道', 'Verxio 閘道'],
  ['Hermes backend', 'Verxio backend'],
  ['Hermes 后端', 'Verxio 后端'],
  ['Hermes 後端', 'Verxio 後端'],
  ['Hermes dashboard', 'Verxio backend'],
  ['Nous Research', 'Verxio'],
  ['Nous Portal', 'Subscription portal'],
  ['Nous 订阅', 'Verxio 订阅'],
  ['Nous 訂閱', 'Verxio 訂閱'],
  ['Nous subscription', 'Verxio subscription'],
  ['Nous サブスクリプション', 'Verxio サブスクリプション'],
  ['paid Nous subscription', 'paid subscription'],
  ['有料 Nous 订阅', '付费订阅'],
  ['HERMES AGENT', 'VERXIO'],
  ['Hermes provider', 'Verxio provider'],
  ['Hermes environments', 'Verxio workspaces'],
  ['Hermes environments', 'Verxio workspaces'],
  ['Hermes environment', 'Verxio workspace'],
  ['Hermes updater', 'Verxio updater'],
  ['Hermes installer', 'Verxio installer'],
  ['Hermes CLI', 'Verxio CLI'],
  ['Hermes instances', 'Verxio instances'],
  ['Hermes instance', 'Verxio instance'],
  ['Hermes runtime', 'Verxio runtime'],
  ['Hermes host', 'Verxio host'],
  ['Hermes settings', 'Verxio settings'],
  ['Hermes 设置', 'Verxio 设置'],
  ['Hermes 設定', 'Verxio 設定'],
  ['Hermes configuration', 'Verxio configuration'],
  ['Hermes 配置', 'Verxio 配置'],
  ['Hermes defaults', 'Verxio defaults'],
  ['Hermes 默认值', 'Verxio 默认值'],
  ['Hermes 預設值', 'Verxio 預設值'],
  ['Update Hermes', 'Update Verxio'],
  ['Hermes is ready', 'Verxio is ready'],
  ['Hermes is', 'Verxio is'],
  ['Hermes will', 'Verxio will'],
  ['Hermes needs', 'Verxio needs'],
  ['Hermes checks', 'Verxio checks'],
  ['Hermes connects', 'Verxio connects'],
  ['Hermes could', 'Verxio could'],
  ['Hermes can', 'Verxio can'],
  ['Hermes may', 'Verxio may'],
  ['Hermes still', 'Verxio still'],
  ['Hermes won', 'Verxio won'],
  ['Hermes look', 'Verxio look'],
  ['Hermes point', 'Verxio point'],
  ['Hermes pick', 'Verxio pick'],
  ['Hermes follow', 'Verxio follow'],
  ['Hermes 跟隨', 'Verxio 跟隨'],
  ['Hermes 跟随', 'Verxio 跟随'],
  ['Starting Hermes', 'Starting Verxio'],
  ['Restarting Hermes', 'Restarting Verxio'],
  ['Reconnecting to Hermes', 'Reconnecting to Verxio'],
  ['Loading Hermes', 'Loading Verxio'],
  ['Setting up Hermes', 'Setting up Verxio'],
  ['Give Hermes', 'Give Verxio'],
  ['Ask Hermes', 'Ask Verxio'],
  ['authorize Hermes', 'authorize Verxio'],
  ['Authorize Hermes', 'Authorize Verxio'],
  ['run Hermes', 'run Verxio'],
  ['the Hermes', 'the Verxio'],
  ['your Hermes', 'your Verxio'],
  ['Your Hermes', 'Your Verxio'],
  ['a Hermes', 'a Verxio'],
  ['A Hermes', 'A Verxio'],
  ['another Hermes', 'another Verxio'],
  ['any Hermes', 'any Verxio'],
  ['this Hermes', 'this Verxio'],
  ['This Hermes', 'This Verxio'],
  [' · Hermes ', ' · Verxio '],
  ['Hermes ${', 'Verxio ${'],
  ['Hermes v', 'Verxio v'],
  ['Hermes V', 'Verxio V'],
  ['Hermes ', 'Verxio '],
  ['Hermes.', 'Verxio.'],
  ['Hermes,', 'Verxio,'],
  ['Hermes:', 'Verxio:'],
  ['Hermes!', 'Verxio!'],
  ['Hermes?', 'Verxio?'],
  ['Hermes"', 'Verxio"'],
  ["Hermes'", "Verxio'"],
  ['Hermes`', 'Verxio`'],
  ['Hermes/', 'Verxio/'],
  ['Hermes\n', 'Verxio\n'],
  ['Hermes）', 'Verxio）'],
  ['Hermes（', 'Verxio（'],
  ['Hermes、', 'Verxio、'],
  ['Hermes。', 'Verxio。'],
  ['Hermes，', 'Verxio，'],
  ['Hermes：', 'Verxio：'],
  ['Hermes！', 'Verxio！'],
  ['Hermes？', 'Verxio？'],
  ['Hermes ·', 'Verxio ·'],
  ['Hermes 会', 'Verxio 会'],
  ['Hermes 将', 'Verxio 将'],
  ['Hermes 需要', 'Verxio 需要'],
  ['Hermes 正在', 'Verxio 正在'],
  ['Hermes 无法', 'Verxio 无法'],
  ['Hermes 不能', 'Verxio 不能'],
  ['Hermes 仍', 'Verxio 仍'],
  ['Hermes 仍', 'Verxio 仍'],
  ['Hermes 对', 'Verxio 对'],
  ['Hermes 从', 'Verxio 从'],
  ['Hermes 在', 'Verxio 在'],
  ['Hermes 的', 'Verxio 的'],
  ['Hermes を', 'Verxio を'],
  ['Hermes が', 'Verxio が'],
  ['Hermes は', 'Verxio は'],
  ['Hermes に', 'Verxio に'],
  ['Hermes の', 'Verxio の'],
  ['Hermes へ', 'Verxio へ'],
  ['Hermes から', 'Verxio から'],
  ['Hermes です', 'Verxio です'],
  ['Hermes 版', 'Verxio'],
  ['about Hermes', 'about Verxio'],
  ['from Hermes', 'from Verxio'],
  ['with Hermes', 'with Verxio'],
  ['for Hermes', 'for Verxio'],
  ['to Hermes', 'to Verxio'],
  ['of Hermes', 'of Verxio'],
  ['over Hermes', 'over Verxio'],
  ['via Hermes', 'via Verxio'],
  ['using Hermes', 'using Verxio'],
  ['ported from Hermes', 'built on the open agent runtime'],
  ['Hermes Agent runtime', 'Verxio runtime'],
  ['Hermes engine', 'Verxio engine'],
  ['Hermes admin', 'backend admin'],
  ['Nous blue', 'Verxio cyan'],
  ['Nous Portal hero', 'Subscription portal hero'],
  ['e.g. Nous Portal', 'e.g. subscription portal'],
]

function rebrand(content) {
  let next = content
  for (const [from, to] of REPLACEMENTS) {
    next = next.split(from).join(to)
  }
  return next
}

let changed = 0
for (const rel of FILES) {
  const path = `${ROOT}/${rel}`
  try {
    const before = readFileSync(path, 'utf8')
    const after = rebrand(before)
    if (after !== before) {
      writeFileSync(path, after, 'utf8')
      changed++
      console.log(`updated ${rel}`)
    }
  } catch (err) {
    console.warn(`skip ${rel}: ${err.message}`)
  }
}

console.log(`done: ${changed} files`)
