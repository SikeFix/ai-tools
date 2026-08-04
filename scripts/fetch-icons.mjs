// 批量抓取工具图标到 src/icons/{slug}.png（统一转 PNG）
// 数据源：favicon.im（国内可访问，跟随重定向）；转换用 macOS 自带 sips
// 用法：node scripts/fetch-icons.mjs
import { readFileSync, writeFileSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tools = JSON.parse(readFileSync(path.join(root, 'src/data/tools.json'), 'utf8'));
const outDir = path.join(root, 'src/icons');
mkdirSync(outDir, { recursive: true });

const iconFor = (slug) => path.join(outDir, `${slug}.png`);

function toPng(srcPath, destPath) {
  try {
    execFileSync('sips', ['-s', 'format', 'png', srcPath, '--out', destPath], {
      stdio: 'pipe',
    });
    return existsSync(destPath) && readFileSync(destPath).length > 100;
  } catch {
    return false;
  }
}

async function fetchIcon(tool) {
  const dest = iconFor(tool.slug);
  if (existsSync(dest) && readFileSync(dest).length > 100) return 'skip';
  const host = new URL(tool.url).hostname;
  const url = `https://favicon.im/${host}`;
  const tmp = path.join(outDir, `${tool.slug}.tmp`);

  const tryDownload = async (u) => {
    const res = await fetch(u, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return buf.length >= 200 ? buf : null;
  };

  // GitHub 项目回退：用组织/用户头像作为图标
  const githubOwner = tool.url.match(/github\.com\/([^/]+)\//)?.[1];

  try {
    let buf = await tryDownload(url);
    if (buf) {
      writeFileSync(tmp, buf);
      const ok = toPng(tmp, dest);
      rmSync(tmp, { force: true });
      if (ok) return 'ok';
    }
    // 回退：GitHub 头像
    if (githubOwner) {
      buf = await tryDownload(`https://github.com/${githubOwner}.png`);
      if (buf) {
        writeFileSync(dest, buf); // 已是 PNG
        return 'ok(avatar)';
      }
    }
    return 'no-source';
  } catch (e) {
    rmSync(tmp, { force: true });
    return e.message;
  }
}

const results = { ok: [], skip: [], fail: [] };
for (const tool of tools) {
  const r = await fetchIcon(tool);
  if (r === 'ok') results.ok.push(tool.slug);
  else if (r === 'skip') results.skip.push(tool.slug);
  else results.fail.push(`${tool.slug} (${tool.url}): ${r}`);
}

console.log(`✅ 成功 ${results.ok.length} / 已有 ${results.skip.length} / 失败 ${results.fail.length}`);
if (results.fail.length) {
  console.log('— 失败清单:');
  results.fail.forEach((f) => console.log('  ' + f));
}
