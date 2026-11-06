/* ==========================================================
   script/markdown.js — 노트용 경량 Markdown 렌더러 (외부 라이브러리 없음)

   안전 원칙
   - 원문 HTML은 쓰지 않는다. 모든 텍스트를 먼저 이스케이프하고,
     아래 문법으로만 정해진 태그(h2~h4, p, ul, ol, li, blockquote, pre, code,
     table, strong, em, a, img, hr)를 만든다. HTML 주석은 지운다.
   - 링크·이미지 주소는 http(s) · mailto · 상대 경로 · #앵커만 허용한다.
     javascript: 같은 다른 스킴은 링크 없이 글자로만 남긴다.
   - 외부 링크는 새 탭 + rel="noopener noreferrer".

   지원 문법: # 제목(h1은 h2로 낮춤) · 문단 · - / * / 1. 목록 · - [ ] 체크 ·
   > 인용 · ``` 코드 블록 · `코드` · **굵게** · *기울임* · [링크](주소) ·
   ![대체 텍스트](주소) · | 표 | · ---
   ========================================================== */
(function (global) {
  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /** 이스케이프된 주소를 검사한다. 허용하지 않으면 null */
  function safeUrl(escapedUrl) {
    var url = escapedUrl.trim();
    var raw = url.replace(/&amp;/g, "&");
    if (/^[a-z][a-z0-9+.-]*:/i.test(raw) && !/^(https?:|mailto:)/i.test(raw)) { return null; }
    if (/^\/\//.test(raw)) { return null; }   // 프로토콜 상대 주소 금지
    return url;
  }

  function isExternal(url) {
    return /^https?:\/\//i.test(url);
  }

  /** 인라인 문법 — 입력은 이스케이프되지 않은 원문 한 줄 */
  function inline(text) {
    var codes = [];
    // 1) 코드 조각을 먼저 빼 둔다 (안의 문법은 해석하지 않음)
    var src = String(text).replace(/(`+)([\s\S]*?[^`])\1(?!`)/g, function (_, ticks, code) {
      codes.push("<code>" + escapeHtml(code.trim()) + "</code>");
      return "\u0000" + (codes.length - 1) + "\u0000";
    });

    var out = escapeHtml(src);

    // 2) 이미지 ![alt](src)
    out = out.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, function (all, alt, url) {
      var safe = safeUrl(url);
      if (!safe || isExternal(safe)) { return alt; }   // 이미지는 저장소 안 파일만
      return '<img src="' + safe + '" alt="' + alt + '" loading="lazy">';
    });

    // 3) 링크 [text](url)
    out = out.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (all, label, url) {
      var safe = safeUrl(url);
      if (!safe) { return label; }
      var attrs = isExternal(safe) ? ' target="_blank" rel="noopener noreferrer"' : "";
      return '<a href="' + safe + '"' + attrs + ">" + label + (isExternal(safe) ? ' <span aria-hidden="true">↗</span>' : "") + "</a>";
    });

    // 4) 굵게 · 기울임
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/(^|[^*\w])\*([^*\s][^*]*?)\*(?!\w)/g, "$1<em>$2</em>");
    out = out.replace(/(^|[^_\w])_([^_\s][^_]*?)_(?!\w)/g, "$1<em>$2</em>");

    // 5) 코드 조각 되돌리기
    return out.replace(/\u0000(\d+)\u0000/g, function (_, i) { return codes[Number(i)]; });
  }

  function slugify(text, used) {
    var base = String(text).toLowerCase().replace(/<[^>]+>/g, "")
      .replace(/[^\w가-힣\s-]/g, "").trim().replace(/\s+/g, "-") || "section";
    var slug = base, n = 2;
    while (used[slug]) { slug = base + "-" + n++; }
    used[slug] = true;
    return slug;
  }

  function splitRow(line) {
    var row = line.trim().replace(/^\|/, "").replace(/\|$/, "");
    // 코드 조각 안의 | 는 나누지 않는다
    // (``Ctrl + ` `` 처럼 여러 개의 백틱으로 연 코드는 같은 개수의 백틱에서만 닫힌다)
    var cells = [], cur = "", open = 0;
    for (var i = 0; i < row.length; i++) {
      var ch = row[i];
      if (ch === "`") {
        var run = 1;
        while (row[i + run] === "`") { run++; }
        if (!open) { open = run; } else if (run === open) { open = 0; }
        cur += row.substr(i, run);
        i += run - 1;
        continue;
      }
      if (ch === "|" && !open) { cells.push(cur.trim()); cur = ""; continue; }
      cur += ch;
    }
    cells.push(cur.trim());
    return cells;
  }

  /**
   * Markdown 문자열 → 안전한 HTML 문자열
   * @param {string} markdown
   * @param {{ idPrefix?: string }} [opts]
   */
  function renderMarkdown(markdown, opts) {
    opts = opts || {};
    var prefix = opts.idPrefix || "";
    var used = {};
    var text = String(markdown)
      .replace(/^﻿/, "")
      .replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "")   // front matter
      .replace(/<!--[\s\S]*?-->/g, "")                  // HTML 주석
      .replace(/\r\n?/g, "\n");
    var lines = text.split("\n");
    var html = [];
    var i = 0;

    function isBlockStart(line) {
      return /^(#{1,6})\s/.test(line) || /^```/.test(line) || /^>\s?/.test(line) ||
             /^\s*([-*]|\d+\.)\s+/.test(line) || /^\s*(-{3,}|\*{3,})\s*$/.test(line) ||
             /^\s*\|.*\|\s*$/.test(line);
    }

    while (i < lines.length) {
      var line = lines[i];

      if (!line.trim()) { i++; continue; }

      // 코드 블록
      var fence = /^```\s*([\w+-]*)\s*$/.exec(line);
      if (fence) {
        var code = [];
        i++;
        while (i < lines.length && !/^```\s*$/.test(lines[i])) { code.push(lines[i]); i++; }
        i++;
        var lang = fence[1] ? ' data-lang="' + escapeHtml(fence[1]) + '"' : "";
        html.push("<pre" + lang + "><code>" + escapeHtml(code.join("\n")) + "</code></pre>");
        continue;
      }

      // 제목 — 페이지 제목이 h1(노트 제목은 h2)이므로 본문은 h3부터
      var heading = /^(#{1,6})\s+(.*?)\s*#*\s*$/.exec(line);
      if (heading) {
        var level = Math.min(4, Math.max(3, heading[1].length + 1));
        var body = inline(heading[2]);
        html.push("<h" + level + ' id="' + prefix + slugify(heading[2], used) + '">' + body + "</h" + level + ">");
        i++;
        continue;
      }

      // 구분선
      if (/^\s*(-{3,}|\*{3,})\s*$/.test(line)) { html.push("<hr>"); i++; continue; }

      // 인용
      if (/^>\s?/.test(line)) {
        var quote = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) { quote.push(lines[i].replace(/^>\s?/, "")); i++; }
        html.push("<blockquote>" + renderMarkdown(quote.join("\n"), { idPrefix: prefix + "q-" }) + "</blockquote>");
        continue;
      }

      // 표 — 머리줄 + 구분줄(|---|) 이 있어야 표로 본다
      if (/^\s*\|.*\|\s*$/.test(line) && i + 1 < lines.length && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) {
        var headCells = splitRow(line);
        i += 2;
        var rows = [];
        while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) { rows.push(splitRow(lines[i])); i++; }
        var t = '<div class="md-table"><table><thead><tr>' +
          headCells.map(function (c) { return '<th scope="col">' + inline(c) + "</th>"; }).join("") +
          "</tr></thead><tbody>" +
          rows.map(function (r) {
            return "<tr>" + r.map(function (c) { return "<td>" + inline(c) + "</td>"; }).join("") + "</tr>";
          }).join("") + "</tbody></table></div>";
        html.push(t);
        continue;
      }

      // 목록
      var listMatch = /^\s*([-*]|\d+\.)\s+/.exec(line);
      if (listMatch) {
        var ordered = /\d/.test(listMatch[1]);
        var items = [];
        while (i < lines.length) {
          var m = /^\s*([-*]|\d+\.)\s+(.*)$/.exec(lines[i]);
          if (m && /\d/.test(m[1]) === ordered) { items.push(m[2]); i++; continue; }
          // 들여쓴 이어지는 줄
          if (items.length && /^\s{2,}\S/.test(lines[i]) && !isBlockStart(lines[i].trim())) {
            items[items.length - 1] += " " + lines[i].trim(); i++; continue;
          }
          break;
        }
        var hasTasks = items.some(function (it) { return /^\[[ xX]\]\s/.test(it); });
        var tag = ordered ? "ol" : "ul";
        html.push("<" + tag + (hasTasks ? ' class="md-tasks"' : "") + ">" + items.map(function (it) {
          var task = /^\[([ xX])\]\s+(.*)$/.exec(it);
          if (task) {
            var done = task[1] !== " ";
            return '<li class="md-task' + (done ? " is-done" : "") + '"><span class="md-task__box" aria-hidden="true">' +
              (done ? "☑" : "☐") + '</span><span class="visually-hidden">' + (done ? "완료: " : "할 일: ") + "</span>" +
              inline(task[2]) + "</li>";
          }
          return "<li>" + inline(it) + "</li>";
        }).join("") + "</" + tag + ">");
        continue;
      }

      // 문단 — 빈 줄이나 다른 블록이 나올 때까지
      var para = [];
      while (i < lines.length && lines[i].trim() && !(para.length && isBlockStart(lines[i]))) {
        para.push(lines[i].trim());
        i++;
      }
      html.push("<p>" + inline(para.join(" ")) + "</p>");
    }

    return html.join("\n");
  }

  global.renderMarkdown = renderMarkdown;
  if (typeof module !== "undefined" && module.exports) { module.exports = { renderMarkdown: renderMarkdown }; }
})(typeof window !== "undefined" ? window : globalThis);
