/**
 * DevTools panel UI source code.
 *
 * This is injected into the page when devtools: true.
 * Renders inside Shadow DOM to avoid style conflicts.
 * Uses plain DOM APIs — no framework dependency.
 */
export const DEVTOOLS_PANEL_SOURCE = `
(function() {
  function init() {
    var data = window.__tempo_devtools_data
    if (!data) {
      // Virtual module hasn't loaded yet — retry
      setTimeout(init, 50)
      return
    }
    boot(data)
  }
  function boot(data) {

  var LS_OPEN = '__tempo_devtools_open'
  var LS_POS = '__tempo_devtools_pos'
  var POLL_INTERVAL = 500

  // --- State ---
  var isOpen = sessionStorage.getItem(LS_OPEN) !== 'false'
  var activeTab = 'signals'
  var expandedSignal = null
  var editingSignal = null
  var savedPos = null
  try { savedPos = JSON.parse(sessionStorage.getItem(LS_POS)) } catch(e) {}

  // --- Host element ---
  var host = document.createElement('div')
  host.id = '__tempo-devtools'
  host.style.cssText = 'all:initial;position:fixed;z-index:2147483647;'
  document.body.appendChild(host)

  var shadow = host.attachShadow({ mode: 'open' })

  // --- Styles ---
  var style = document.createElement('style')
  style.textContent = [
    ':host { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #e0e0e0; }',
    '*, *::before, *::after { font-family: inherit; box-sizing: border-box; }',
    '.panel { position: fixed; width: 320px; height: 400px; background: #1a1a2e; border: 1px solid #333; border-radius: 8px; box-shadow: 0 4px 24px rgba(0,0,0,0.5); display: flex; flex-direction: column; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: #e0e0e0; }',
    '.collapsed-btn { position: fixed; width: 32px; height: 32px; border-radius: 50%; background: #1a1a2e; border: 1px solid #555; color: #7ecfff; font-weight: bold; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-family: inherit; box-shadow: 0 2px 8px rgba(0,0,0,0.4); }',
    '.collapsed-btn:hover { background: #252542; border-color: #7ecfff; }',
    '.header { display: flex; align-items: center; background: #16162a; cursor: grab; user-select: none; padding: 0; flex-shrink: 0; border-bottom: 1px solid #333; }',
    '.header:active { cursor: grabbing; }',
    '.tab { flex: 1; padding: 8px 4px; text-align: center; cursor: pointer; font-size: 10px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; color: #888; border-bottom: 2px solid transparent; font-family: inherit; background: none; border-top: none; border-left: none; border-right: none; }',
    '.tab:hover { color: #bbb; }',
    '.tab.active-signals { color: #7ecfff; border-bottom-color: #7ecfff; }',
    '.tab.active-performance { color: #ff9e7e; border-bottom-color: #ff9e7e; }',
    '.minimize-btn { padding: 8px 10px; cursor: pointer; color: #888; font-size: 14px; background: none; border: none; font-family: inherit; flex-shrink: 0; }',
    '.minimize-btn:hover { color: #e0e0e0; }',
    '.body { flex: 1; overflow-y: auto; padding: 8px; }',
    '.body::-webkit-scrollbar { width: 4px; }',
    '.body::-webkit-scrollbar-thumb { background: #444; border-radius: 2px; }',
    '.footer { padding: 6px 8px; border-top: 1px solid #333; font-size: 10px; color: #666; flex-shrink: 0; }',

    // Signals tab
    '.module-group { margin-bottom: 8px; }',
    '.module-label { font-size: 10px; color: #666; padding: 2px 0; margin-bottom: 2px; }',
    '.signal-row { display: flex; align-items: center; padding: 3px 4px; border-radius: 3px; cursor: pointer; gap: 6px; }',
    '.signal-row:hover { background: #252542; }',
    '.badge { font-size: 9px; padding: 1px 4px; border-radius: 3px; background: #2a3a5c; color: #7ecfff; font-weight: 600; flex-shrink: 0; }',
    '.signal-name { color: #ccc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    '.signal-value { margin-left: auto; color: #a0d0a0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px; cursor: pointer; padding: 1px 4px; border-radius: 2px; flex-shrink: 0; }',
    '.signal-value:hover { background: #2a3a5c; }',
    '.signal-detail { padding: 4px 8px; font-size: 10px; color: #888; background: #12122a; border-radius: 3px; margin: 2px 0 4px 0; }',
    '.signal-detail pre { margin: 4px 0; color: #a0d0a0; white-space: pre-wrap; word-break: break-all; max-height: 80px; overflow-y: auto; }',
    '.edit-input { background: #0e0e22; border: 1px solid #7ecfff; color: #e0e0e0; font-family: inherit; font-size: 11px; padding: 2px 4px; border-radius: 2px; width: 100px; outline: none; }',

    // Performance tab
    '.perf-section { margin-bottom: 10px; }',
    '.perf-heading { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 4px; border-bottom: 1px solid #2a2a3e; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between; }',
    '.perf-heading button { font-size: 9px; background: none; border: 1px solid #555; color: #888; border-radius: 3px; padding: 1px 6px; cursor: pointer; font-family: inherit; }',
    '.perf-heading button:hover { color: #e0e0e0; border-color: #888; }',
    '.render-row { display: flex; align-items: center; gap: 6px; padding: 2px 0; }',
    '.render-time { font-size: 10px; width: 40px; text-align: right; flex-shrink: 0; }',
    '.render-time.green { color: #66bb6a; }',
    '.render-time.yellow { color: #ffa726; }',
    '.render-time.red { color: #ef5350; }',
    '.render-bar { height: 4px; border-radius: 2px; flex-shrink: 0; }',
    '.render-name { color: #ccc; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1; }',
    '.render-count { color: #666; font-size: 10px; flex-shrink: 0; }',
    '.update-row { display: flex; align-items: center; gap: 6px; padding: 2px 0; }',
    '.update-count { font-size: 10px; width: 32px; text-align: right; color: #7ecfff; flex-shrink: 0; }',
    '.update-label { color: #ccc; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
    '.hot-badge { font-size: 8px; padding: 0 3px; border-radius: 2px; background: #ef5350; color: #fff; font-weight: 700; flex-shrink: 0; }',
    '.hmr-row { display: flex; align-items: center; gap: 6px; padding: 3px 0; border-left: 2px solid #444; padding-left: 6px; }',
    '.hmr-row.fast { border-left-color: #66bb6a; }',
    '.hmr-row.medium { border-left-color: #ffa726; }',
    '.hmr-row.slow { border-left-color: #ef5350; }',
    '.hmr-time { font-size: 10px; width: 40px; text-align: right; flex-shrink: 0; }',
    '.hmr-module { color: #ccc; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
    '.hmr-count { color: #666; font-size: 10px; flex-shrink: 0; }',
    '.empty-msg { color: #555; font-style: italic; padding: 12px 0; text-align: center; font-size: 11px; }'
  ].join('\\n')
  shadow.appendChild(style)

  // --- Helpers ---
  function el(tag, cls, text) {
    var e = document.createElement(tag)
    if (cls) e.className = cls
    if (text !== undefined) e.textContent = text
    return e
  }

  function formatValue(v) {
    if (v === null) return 'null'
    if (v === undefined) return 'undefined'
    if (typeof v === 'string') return JSON.stringify(v)
    if (typeof v === 'number' || typeof v === 'boolean') return String(v)
    if (Array.isArray(v)) return '[...' + v.length + ']'
    if (typeof v === 'object') {
      var keys = Object.keys(v)
      var display = keys.slice(0, 3).join(', ')
      if (keys.length > 3) display += ', ...'
      return '{ ' + display + ' }'
    }
    return String(v)
  }

  function timeColor(ms) {
    if (ms < 1) return 'green'
    if (ms <= 5) return 'yellow'
    return 'red'
  }

  function shortPath(p) {
    if (!p) return '???'
    var parts = p.replace(/\\\\/g, '/').split('/')
    return parts.length > 1 ? parts.slice(-2).join('/') : parts[parts.length - 1]
  }

  // --- Build panel ---
  var panel = el('div', 'panel')
  var collapsedBtn = el('button', 'collapsed-btn', 'T')

  // Position helpers
  function applyPos() {
    if (savedPos) {
      panel.style.left = savedPos.x + 'px'
      panel.style.top = savedPos.y + 'px'
      panel.style.right = 'auto'
      panel.style.bottom = 'auto'
      collapsedBtn.style.right = '16px'
      collapsedBtn.style.bottom = '16px'
    } else {
      panel.style.right = '16px'
      panel.style.bottom = '16px'
      panel.style.left = 'auto'
      panel.style.top = 'auto'
      collapsedBtn.style.right = '16px'
      collapsedBtn.style.bottom = '16px'
    }
  }

  // Header / tab bar
  var header = el('div', 'header')
  var tabSignals = el('button', 'tab', 'Signals')
  var tabPerf = el('button', 'tab', 'Performance')
  var minimizeBtn = el('button', 'minimize-btn', '_')
  header.appendChild(tabSignals)
  header.appendChild(tabPerf)
  header.appendChild(minimizeBtn)
  panel.appendChild(header)

  // Body
  var body = el('div', 'body')
  panel.appendChild(body)

  // Footer
  var footer = el('div', 'footer')
  panel.appendChild(footer)

  function updateTabs() {
    tabSignals.className = 'tab' + (activeTab === 'signals' ? ' active-signals' : '')
    tabPerf.className = 'tab' + (activeTab === 'performance' ? ' active-performance' : '')
  }

  tabSignals.addEventListener('click', function(e) {
    e.stopPropagation()
    activeTab = 'signals'
    _needsFullRebuild = true
    updateTabs()
    renderBody()
  })

  tabPerf.addEventListener('click', function(e) {
    e.stopPropagation()
    activeTab = 'performance'
    _lastRenderStatsSize = -1
    updateTabs()
    renderBody()
  })

  minimizeBtn.addEventListener('click', function(e) {
    e.stopPropagation()
    isOpen = false
    sessionStorage.setItem(LS_OPEN, 'false')
    showState()
  })

  collapsedBtn.addEventListener('click', function() {
    isOpen = true
    sessionStorage.setItem(LS_OPEN, 'true')
    showState()
  })

  // --- Drag ---
  var dragging = false
  var dragOffX = 0
  var dragOffY = 0

  header.addEventListener('mousedown', function(e) {
    if (e.target === minimizeBtn || e.target === tabSignals || e.target === tabPerf) return
    dragging = true
    var rect = panel.getBoundingClientRect()
    dragOffX = e.clientX - rect.left
    dragOffY = e.clientY - rect.top
    e.preventDefault()
  })

  document.addEventListener('mousemove', function(e) {
    if (!dragging) return
    var x = Math.max(0, Math.min(window.innerWidth - 100, e.clientX - dragOffX))
    var y = Math.max(0, Math.min(window.innerHeight - 50, e.clientY - dragOffY))
    panel.style.left = x + 'px'
    panel.style.top = y + 'px'
    panel.style.right = 'auto'
    panel.style.bottom = 'auto'
    savedPos = { x: x, y: y }
  })

  document.addEventListener('mouseup', function() {
    if (!dragging) return
    dragging = false
    if (savedPos) {
      sessionStorage.setItem(LS_POS, JSON.stringify(savedPos))
    }
  })

  // --- State display ---
  function showState() {
    if (isOpen) {
      if (collapsedBtn.parentNode) shadow.removeChild(collapsedBtn)
      if (!panel.parentNode) shadow.appendChild(panel)
      applyPos()
      updateTabs()
      renderBody()
    } else {
      if (panel.parentNode) shadow.removeChild(panel)
      if (!collapsedBtn.parentNode) shadow.appendChild(collapsedBtn)
      applyPos()
    }
  }

  // --- Render: Signals tab ---
  function renderSignals() {
    body.textContent = ''
    _valueSpans = []
    var signals = data.getSignals()

    if (!signals || signals.length === 0) {
      body.appendChild(el('div', 'empty-msg', 'No signals registered'))
      footer.textContent = '0 signals'
      return
    }

    // Group by module
    var groups = {}
    var order = []
    for (var i = 0; i < signals.length; i++) {
      var s = signals[i]
      var mod = shortPath(s.moduleId)
      if (!groups[mod]) { groups[mod] = []; order.push(mod) }
      groups[mod].push(s)
    }

    for (var g = 0; g < order.length; g++) {
      var mod = order[g]
      var group = el('div', 'module-group')
      group.appendChild(el('div', 'module-label', mod))

      for (var j = 0; j < groups[mod].length; j++) {
        (function(sig) {
          var row = el('div', 'signal-row')
          row.appendChild(el('span', 'badge', 'Prop'))
          row.appendChild(el('span', 'signal-name', sig.label))

          var valSpan = el('span', 'signal-value', formatValue(sig.prop.value))
          row.appendChild(valSpan)
          _valueSpans.push({ sig: sig, span: valSpan })

          var detailEl = null

          row.addEventListener('click', function(e) {
            if (e.target === valSpan) return
            var key = sig.moduleId + ':' + sig.label
            if (expandedSignal === key) {
              expandedSignal = null
              if (detailEl && detailEl.parentNode) detailEl.parentNode.removeChild(detailEl)
              detailEl = null
            } else {
              expandedSignal = key
              detailEl = el('div', 'signal-detail')
              var info = el('div', '', 'Label: ' + sig.label)
              detailEl.appendChild(info)
              if (sig.listeners !== undefined) {
                detailEl.appendChild(el('div', '', 'Listeners: ' + sig.listeners))
              }
              var pre = el('pre', '')
              try {
                pre.textContent = JSON.stringify(sig.prop.value, null, 2)
              } catch(err) {
                pre.textContent = String(sig.prop.value)
              }
              detailEl.appendChild(pre)
              row.parentNode.insertBefore(detailEl, row.nextSibling)
            }
          })

          valSpan.addEventListener('click', function(e) {
            e.stopPropagation()
            var key = sig.moduleId + ':' + sig.label
            if (editingSignal === key) return
            editingSignal = key

            var input = document.createElement('input')
            input.className = 'edit-input'
            try {
              input.value = JSON.stringify(sig.prop.value)
            } catch(err) {
              input.value = String(sig.prop.value)
            }

            valSpan.textContent = ''
            valSpan.appendChild(input)
            input.focus()
            input.select()

            function finish() {
              editingSignal = null
              valSpan.textContent = formatValue(sig.prop.value)
            }

            input.addEventListener('keydown', function(ev) {
              if (ev.key === 'Enter') {
                ev.preventDefault()
                try {
                  var parsed = JSON.parse(input.value)
                  if (sig.prop && typeof sig.prop.set === 'function') {
                    sig.prop.set(parsed)
                  }
                } catch(err) {
                  // Invalid JSON — ignore
                }
                finish()
              } else if (ev.key === 'Escape') {
                finish()
              }
            })

            input.addEventListener('blur', function() {
              setTimeout(finish, 100)
            })
          })

          group.appendChild(row)
        })(groups[mod][j])
      }

      body.appendChild(group)
    }

    footer.textContent = signals.length + ' signal' + (signals.length !== 1 ? 's' : '') + '  \\u00b7  Click value to edit'
  }

  // --- Render: Performance tab ---
  function renderPerformance() {
    body.textContent = ''

    // Component Renders
    var renderStatsMap = data.getRenderStats ? data.getRenderStats() : new Map()
    var renderStats = []
    if (renderStatsMap && typeof renderStatsMap.forEach === 'function') {
      renderStatsMap.forEach(function(v, k) {
        renderStats.push({ key: k, name: k.split(':').pop() || k, avgTime: v.avgTime, maxTime: v.maxTime, renderCount: v.renderCount, totalTime: v.totalTime })
      })
    }
    var section1 = el('div', 'perf-section')
    var heading1 = el('div', 'perf-heading')
    heading1.appendChild(el('span', '', 'Component Renders'))
    var clearBtn = el('button', '', 'Clear')
    clearBtn.addEventListener('click', function() {
      if (data.clearRenderStats) data.clearRenderStats()
      renderPerformance()
    })
    heading1.appendChild(clearBtn)
    section1.appendChild(heading1)

    if (!renderStats || renderStats.length === 0) {
      section1.appendChild(el('div', 'empty-msg', 'No render data'))
    } else {
      renderStats.sort(function(a, b) { return (b.avgTime || 0) - (a.avgTime || 0) })
      var maxAvg = renderStats[0] ? (renderStats[0].avgTime || 1) : 1

      for (var i = 0; i < renderStats.length; i++) {
        var rs = renderStats[i]
        var row = el('div', 'render-row')

        var avg = rs.avgTime || 0
        var timeEl = el('span', 'render-time ' + timeColor(avg), avg.toFixed(1) + 'ms')
        row.appendChild(timeEl)

        var bar = el('div', 'render-bar')
        var barWidth = Math.max(2, Math.round((avg / maxAvg) * 60))
        var barColor = avg < 1 ? '#66bb6a' : avg <= 5 ? '#ffa726' : '#ef5350'
        bar.style.cssText = 'width:' + barWidth + 'px;background:' + barColor + ';'
        row.appendChild(bar)

        row.appendChild(el('span', 'render-name', rs.name || rs.component || '???'))
        row.appendChild(el('span', 'render-count', 'x' + (rs.renderCount || 0)))
        section1.appendChild(row)
      }
    }
    body.appendChild(section1)

    // Signal Updates
    var updatesMap = data.getSignalUpdates ? data.getSignalUpdates() : new Map()
    var updates = []
    if (updatesMap && typeof updatesMap.forEach === 'function') {
      updatesMap.forEach(function(count, key) {
        updates.push({ key: key, label: key.split(':').pop() || key, count: count })
      })
    }
    var section2 = el('div', 'perf-section')
    var heading2 = el('div', 'perf-heading')
    heading2.appendChild(el('span', '', 'Signal Updates'))
    var resetBtn = el('button', '', 'Reset')
    resetBtn.addEventListener('click', function() {
      if (data.clearSignalUpdates) data.clearSignalUpdates()
      renderPerformance()
    })
    heading2.appendChild(resetBtn)
    section2.appendChild(heading2)

    if (!updates || updates.length === 0) {
      section2.appendChild(el('div', 'empty-msg', 'No signal updates'))
    } else {
      updates.sort(function(a, b) { return (b.count || 0) - (a.count || 0) })

      for (var i = 0; i < updates.length; i++) {
        var u = updates[i]
        var row = el('div', 'update-row')
        row.appendChild(el('span', 'update-count', String(u.count || 0)))
        row.appendChild(el('span', 'update-label', u.label || '???'))
        if ((u.count || 0) > 100) {
          row.appendChild(el('span', 'hot-badge', 'HOT'))
        }
        section2.appendChild(row)
      }
    }
    body.appendChild(section2)

    // HMR Log
    var hmrLog = data.getHmrLog ? data.getHmrLog() : []
    var section3 = el('div', 'perf-section')
    var heading3 = el('div', 'perf-heading')
    heading3.appendChild(el('span', '', 'HMR Log'))
    section3.appendChild(heading3)

    if (!hmrLog || hmrLog.length === 0) {
      section3.appendChild(el('div', 'empty-msg', 'No HMR updates'))
    } else {
      for (var i = 0; i < hmrLog.length; i++) {
        var h = hmrLog[i]
        var dur = h.duration || 0
        var speed = dur < 50 ? 'fast' : dur < 200 ? 'medium' : 'slow'
        var row = el('div', 'hmr-row ' + speed)

        var timeEl = el('span', 'hmr-time ' + timeColor(dur / 50), dur.toFixed(0) + 'ms')
        row.appendChild(timeEl)

        row.appendChild(el('span', 'hmr-module', shortPath(h.module)))
        var countText = h.boundaryCount != null
          ? (h.boundaryCount === 0 ? 'full re-render' : h.boundaryCount + ' boundar' + (h.boundaryCount !== 1 ? 'ies' : 'y'))
          : ''
        row.appendChild(el('span', 'hmr-count', countText))
        section3.appendChild(row)
      }
    }
    body.appendChild(section3)

    footer.textContent = (renderStats ? renderStats.length : 0) + ' components tracked'
  }

  // --- Render body dispatcher ---
  function renderBody() {
    if (activeTab === 'signals') {
      renderSignals()
    } else {
      renderPerformance()
    }
  }

  // --- Polling loop ---
  var lastPoll = 0
  var _valueSpans = []
  var _lastSignalCount = -1
  var _lastRenderStatsSize = -1
  var _needsFullRebuild = true

  function updateSignalValues() {
    var signals = data.getSignals()
    if (signals.length !== _lastSignalCount) {
      _needsFullRebuild = true
    }
    if (_needsFullRebuild && activeTab === 'signals') {
      _needsFullRebuild = false
      _lastSignalCount = signals.length
      renderSignals()
      return
    }
    // Just update text content of existing value spans
    for (var i = 0; i < _valueSpans.length; i++) {
      var entry = _valueSpans[i]
      if (entry && entry.sig && entry.span && !editingSignal) {
        entry.span.textContent = formatValue(entry.sig.prop.value)
      }
    }
  }

  function poll(timestamp) {
    if (timestamp - lastPoll >= POLL_INTERVAL) {
      lastPoll = timestamp
      if (isOpen) {
        if (activeTab === 'signals') {
          updateSignalValues()
        } else {
          // Performance tab: only rebuild if data changed
          var renderStats = data.getRenderStats ? data.getRenderStats() : new Map()
          if (renderStats.size !== _lastRenderStatsSize) {
            _lastRenderStatsSize = renderStats.size
            renderPerformance()
          }
        }
      }
    }
    requestAnimationFrame(poll)
  }

  // --- Init ---
  showState()
  requestAnimationFrame(poll)
  } // end boot()
  init()
})()
`
