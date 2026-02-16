import JavaScriptCore
import UIKit

// MARK: - UIColor hex extension

private extension UIColor {
    convenience init?(hex: String) {
        var hexSanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        hexSanitized = hexSanitized.hasPrefix("#") ? String(hexSanitized.dropFirst()) : hexSanitized

        var rgb: UInt64 = 0
        guard Scanner(string: hexSanitized).scanHexInt64(&rgb) else { return nil }

        let length = hexSanitized.count
        switch length {
        case 6:
            self.init(
                red: CGFloat((rgb >> 16) & 0xFF) / 255,
                green: CGFloat((rgb >> 8) & 0xFF) / 255,
                blue: CGFloat(rgb & 0xFF) / 255,
                alpha: 1.0
            )
        case 8:
            self.init(
                red: CGFloat((rgb >> 24) & 0xFF) / 255,
                green: CGFloat((rgb >> 16) & 0xFF) / 255,
                blue: CGFloat((rgb >> 8) & 0xFF) / 255,
                alpha: CGFloat(rgb & 0xFF) / 255
            )
        default:
            return nil
        }
    }
}

// MARK: - Flex layout container

/// A simple UIView subclass that performs basic flexbox-like layout.
/// Supports `flexDirection`, `justifyContent`, `alignItems`, and child sizing.
private class FlexView: UIView {
    var flexDirection: FlexDirection = .column
    var justifyContent: JustifyContent = .flexStart
    var alignItems: AlignItems = .stretch
    var paddingTop: CGFloat = 0
    var paddingRight: CGFloat = 0
    var paddingBottom: CGFloat = 0
    var paddingLeft: CGFloat = 0

    enum FlexDirection { case row, column }
    enum JustifyContent { case flexStart, flexEnd, center, spaceBetween, spaceAround, spaceEvenly }
    enum AlignItems { case flexStart, flexEnd, center, stretch }

    override func layoutSubviews() {
        super.layoutSubviews()

        let visibleChildren = subviews.filter { !$0.isHidden && $0.alpha > 0 }
        guard !visibleChildren.isEmpty else { return }

        // Inside a ScrollView, ignore flex values — all children are sized
        // intrinsically (matches React Native behaviour).
        let isScrollContent = superview is UIScrollView

        let contentRect = CGRect(
            x: paddingLeft,
            y: paddingTop,
            width: bounds.width - paddingLeft - paddingRight,
            height: bounds.height - paddingTop - paddingBottom
        )

        let isRow = flexDirection == .row
        let mainSize = isRow ? contentRect.width : contentRect.height
        let crossSize = isRow ? contentRect.height : contentRect.width

        // Measure children's natural sizes
        struct ChildMeasure {
            var main: CGFloat
            var cross: CGFloat
            var flex: CGFloat
        }

        var measures: [ChildMeasure] = []
        var totalFixedMain: CGFloat = 0
        var totalFlex: CGFloat = 0

        for child in visibleChildren {
            let flexValue = isScrollContent
                ? 0
                : ((child as? FlexView)?.flexValueForParent ?? childFlexValues[child] ?? 0)
            let fitting = child.sizeThatFits(CGSize(
                width: isRow ? CGFloat.greatestFiniteMagnitude : contentRect.width,
                height: isRow ? contentRect.height : CGFloat.greatestFiniteMagnitude
            ))
            let childMain = isRow ? (childWidths[child] ?? fitting.width) : (childHeights[child] ?? fitting.height)
            let childCross = isRow ? (childHeights[child] ?? fitting.height) : (childWidths[child] ?? fitting.width)

            // Include margins in the main-axis space calculation
            let margins = childMargins[child] ?? .zero
            let marginMain = isRow ? (margins.left + margins.right) : (margins.top + margins.bottom)

            if flexValue > 0 {
                totalFlex += flexValue
                measures.append(ChildMeasure(main: 0, cross: childCross, flex: flexValue))
            } else {
                totalFixedMain += childMain + marginMain
                measures.append(ChildMeasure(main: childMain, cross: childCross, flex: 0))
            }
        }

        // Distribute flex space
        let remainingMain = max(0, mainSize - totalFixedMain)
        if totalFlex > 0 {
            for i in measures.indices where measures[i].flex > 0 {
                measures[i].main = remainingMain * (measures[i].flex / totalFlex)
            }
        }

        // Calculate total used main axis space
        let totalUsedMain = measures.reduce(0) { $0 + $1.main }
        let freeSpace = max(0, mainSize - totalUsedMain)

        // Compute starting offset and spacing based on justifyContent
        var mainOffset: CGFloat = 0
        var spacing: CGFloat = 0
        let count = CGFloat(visibleChildren.count)

        switch justifyContent {
        case .flexStart:
            mainOffset = 0; spacing = 0
        case .flexEnd:
            mainOffset = freeSpace; spacing = 0
        case .center:
            mainOffset = freeSpace / 2; spacing = 0
        case .spaceBetween:
            mainOffset = 0; spacing = count > 1 ? freeSpace / (count - 1) : 0
        case .spaceAround:
            let unit = freeSpace / count
            mainOffset = unit / 2; spacing = unit
        case .spaceEvenly:
            let unit = freeSpace / (count + 1)
            mainOffset = unit; spacing = unit
        }

        // Layout children
        var cursor = mainOffset
        for (i, child) in visibleChildren.enumerated() {
            let m = measures[i]
            let childMainSize = m.main
            let childCrossSize: CGFloat

            switch alignItems {
            case .stretch:
                childCrossSize = crossSize
            default:
                childCrossSize = m.cross
            }

            // Cross axis offset
            let crossOffset: CGFloat
            switch alignItems {
            case .flexStart, .stretch:
                crossOffset = 0
            case .flexEnd:
                crossOffset = crossSize - childCrossSize
            case .center:
                crossOffset = (crossSize - childCrossSize) / 2
            }

            // Apply margins: before-margin offsets the child from cursor,
            // cursor then advances by before + size + after.
            let margins = childMargins[child] ?? .zero
            let marginBefore = isRow ? margins.left : margins.top
            let marginAfter = isRow ? margins.right : margins.bottom
            let marginCrossBefore = isRow ? margins.top : margins.left

            let frame: CGRect
            if isRow {
                frame = CGRect(
                    x: contentRect.minX + cursor + marginBefore,
                    y: contentRect.minY + crossOffset + marginCrossBefore,
                    width: childMainSize,
                    height: childCrossSize
                )
            } else {
                frame = CGRect(
                    x: contentRect.minX + crossOffset + marginCrossBefore,
                    y: contentRect.minY + cursor + marginBefore,
                    width: childCrossSize,
                    height: childMainSize
                )
            }

            child.frame = frame
            cursor += marginBefore + childMainSize + marginAfter + spacing
        }

        // If this is a ScrollView's content container, resize self to fit
        // all children and update the scroll view's contentSize.
        // Children are placed at contentRect.minY + cursor, so total height
        // includes paddingTop + content + paddingBottom.
        if let scrollView = superview as? UIScrollView {
            let totalMain = cursor - spacing  // content extent without padding
            let contentWidth: CGFloat
            let contentHeight: CGFloat

            if isRow {
                contentWidth = paddingLeft + totalMain + paddingRight
                contentHeight = crossSize + paddingTop + paddingBottom
            } else {
                contentWidth = max(bounds.width, scrollView.bounds.width)
                contentHeight = paddingTop + totalMain + paddingBottom
            }

            // Resize self so children aren't clipped
            if abs(frame.size.height - contentHeight) > 0.5 {
                frame.size.height = contentHeight
            }
            if abs(frame.size.width - contentWidth) > 0.5 {
                frame.size.width = contentWidth
            }

            let newSize = CGSize(width: contentWidth, height: contentHeight)
            if scrollView.contentSize != newSize {
                scrollView.contentSize = newSize
            }
        }
    }

    override func sizeThatFits(_ size: CGSize) -> CGSize {
        let visibleChildren = subviews.filter { !$0.isHidden && $0.alpha > 0 }
        let isRow = flexDirection == .row

        var mainTotal: CGFloat = 0
        var crossMax: CGFloat = 0

        for child in visibleChildren {
            let fitting = child.sizeThatFits(size)
            let w = childWidths[child] ?? fitting.width
            let h = childHeights[child] ?? fitting.height
            let margins = childMargins[child] ?? .zero
            let childMain = isRow ? w : h
            let childCross = isRow ? h : w
            let marginMain = isRow ? (margins.left + margins.right) : (margins.top + margins.bottom)
            let marginCross = isRow ? (margins.top + margins.bottom) : (margins.left + margins.right)
            mainTotal += childMain + marginMain
            crossMax = max(crossMax, childCross + marginCross)
        }

        let totalW = isRow ? mainTotal + paddingLeft + paddingRight : crossMax + paddingLeft + paddingRight
        let totalH = isRow ? crossMax + paddingTop + paddingBottom : mainTotal + paddingTop + paddingBottom

        return CGSize(width: totalW, height: totalH)
    }

    // Storage for child sizing overrides
    var childWidths: [UIView: CGFloat] = [:]
    var childHeights: [UIView: CGFloat] = [:]
    var childFlexValues: [UIView: CGFloat] = [:]
    var childMargins: [UIView: UIEdgeInsets] = [:]

    // This view's own flex value (used by parent)
    var flexValueForParent: CGFloat = 0

}

// MARK: - SafeAreaView (FlexView that applies safe area insets as padding)

private class SafeAreaFlexView: FlexView {
    override func layoutSubviews() {
        let insets = safeAreaInsets
        paddingTop = max(paddingTop, insets.top)
        paddingLeft = max(paddingLeft, insets.left)
        paddingRight = max(paddingRight, insets.right)
        paddingBottom = max(paddingBottom, insets.bottom)
        super.layoutSubviews()
    }
}

// MARK: - ScrollView with auto content sizing

private class FlexScrollView: UIScrollView {
    override func layoutSubviews() {
        // Set content FlexView's width to match our bounds, then force its
        // layout so it computes intrinsic height and updates our contentSize.
        if let content = subviews.first(where: { $0 is FlexView }) {
            let targetWidth = bounds.width
            if abs(content.frame.size.width - targetWidth) > 0.5 {
                content.frame.size.width = targetWidth
            }
            content.layoutIfNeeded()
        }

        super.layoutSubviews()
    }
}

// MARK: - TempoBridge

class TempoBridge {
    private var nextHandle: Int = 2  // 1 = root
    private var views: [Int: UIView] = [:]
    private var viewTypes: [Int: String] = [:]
    private var gestureTargets: [UIGestureRecognizer: (handle: Int, id: Int)] = [:]
    private var listeners: [Int: [String: [(id: Int, handler: JSValue)]]] = [:]
    private var listenerIdCounter: Int = 0
    private var rafCallbacks: [Int: DispatchWorkItem] = [:]
    private var rafIdCounter: Int = 0
    private var timerCallbacks: [Int: DispatchWorkItem] = [:]
    private var timerIdCounter: Int = 0

    let rootView: UIView
    let jsContext: JSContext

    /// Flush the JSC microtask queue multiple times to ensure all chained
    /// microtasks (e.g. Computed signal notifications via queueMicrotask/Promise.then)
    /// are fully drained.
    func flushMicrotasks() {
        // Each evaluateScript drains the microtask queue, but microtasks queued
        // during that drain need another pass. 4 passes handles typical chains:
        // fetch resolve → await resume → signal.set → Computed.scheduleNotify → render
        for _ in 0..<4 {
            jsContext.evaluateScript("void 0")
        }
    }

    init(rootView: UIView) {
        let rootFlex = FlexView()
        rootFlex.frame = rootView.bounds
        rootFlex.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        rootView.addSubview(rootFlex)

        self.rootView = rootFlex
        self.views[1] = rootFlex
        self.viewTypes[1] = "View"

        self.jsContext = JSContext()!
        jsContext.exceptionHandler = { _, exception in
            guard let exception = exception else { return }
            let stack = exception.objectForKeyedSubscript("stack")?.toString() ?? "no stack"
            print("[TempoBridge JS Error] \(exception)\n  Stack: \(stack)")
        }

        exposePolyfills()
        exposeBridgeMethods()
    }

    // MARK: - JS Polyfills

    private func exposePolyfills() {
        // console.log/warn/error
        let consoleLog: @convention(block) (JSValue) -> Void = { value in
            print("[JS] \(value)")
        }
        let console = JSValue(newObjectIn: jsContext)!
        console.setObject(consoleLog, forKeyedSubscript: "log" as NSString)
        console.setObject(consoleLog, forKeyedSubscript: "warn" as NSString)
        console.setObject(consoleLog, forKeyedSubscript: "error" as NSString)
        jsContext.setObject(console, forKeyedSubscript: "console" as NSString)

        // queueMicrotask polyfill — JSC doesn't provide this Web API
        jsContext.evaluateScript("""
        if (typeof globalThis.queueMicrotask === 'undefined') {
            globalThis.queueMicrotask = function(fn) {
                Promise.resolve().then(fn);
            };
        }
        """)

        // setTimeout / clearTimeout
        let setTimeout: @convention(block) (JSValue, JSValue) -> Int = { [weak self] callback, delayVal in
            guard let self = self else { return -1 }
            let delay = delayVal.isUndefined || delayVal.isNull ? 0.0 : delayVal.toDouble()
            let id = self.timerIdCounter
            self.timerIdCounter += 1
            let workItem = DispatchWorkItem { [weak self] in
                callback.call(withArguments: [])
                self?.flushMicrotasks()
                self?.timerCallbacks.removeValue(forKey: id)
            }
            self.timerCallbacks[id] = workItem
            DispatchQueue.main.asyncAfter(
                deadline: .now() + (delay / 1000.0),
                execute: workItem
            )
            return id
        }
        jsContext.setObject(setTimeout, forKeyedSubscript: "setTimeout" as NSString)

        let clearTimeout: @convention(block) (Int) -> Void = { [weak self] id in
            self?.timerCallbacks[id]?.cancel()
            self?.timerCallbacks.removeValue(forKey: id)
        }
        jsContext.setObject(clearTimeout, forKeyedSubscript: "clearTimeout" as NSString)

        // fetch() polyfill — native side handles HTTP, JS side creates Promises
        let fetchNative: @convention(block) (String, String, JSValue) -> Void = { [weak self] url, method, callback in
            guard let self = self else { return }

            guard let requestUrl = URL(string: url) else {
                callback.call(withArguments: ["Invalid URL: \(url)", 0, ""])
                self.flushMicrotasks()
                return
            }

            var request = URLRequest(url: requestUrl)
            request.httpMethod = method

            URLSession.shared.dataTask(with: request) { data, response, error in
                DispatchQueue.main.async {
                    if let error = error {
                        callback.call(withArguments: [error.localizedDescription, 0, ""])
                        self.flushMicrotasks()
                        return
                    }
                    guard let httpResponse = response as? HTTPURLResponse,
                          let data = data else {
                        callback.call(withArguments: ["No response", 0, ""])
                        self.flushMicrotasks()
                        return
                    }

                    let body = String(data: data, encoding: .utf8) ?? ""
                    callback.call(withArguments: [NSNull(), httpResponse.statusCode, body])
                    self.flushMicrotasks()
                }
            }.resume()
        }
        jsContext.setObject(fetchNative, forKeyedSubscript: "__fetchNative" as NSString)

        // JS-side fetch wrapper creates Promises (reliable in JSC)
        // Key: resolve/reject is deferred via setTimeout(0) so the resolution
        // runs as a fresh macrotask through our polyfill, which properly flushes
        // the microtask queue (JSC doesn't auto-drain microtasks from JSValue.call).
        jsContext.evaluateScript("""
        globalThis.fetch = function(url, options) {
            var method = (options && options.method) ? options.method : 'GET';
            return new Promise(function(resolve, reject) {
                __fetchNative(url, method, function(error, status, body) {
                    setTimeout(function() {
                        if (error) { reject(error); return; }
                        var ok = status >= 200 && status < 300;
                        resolve({
                            status: status,
                            ok: ok,
                            json: function() {
                                return new Promise(function(r, j) {
                                    setTimeout(function() {
                                        try { r(JSON.parse(body)); } catch(e) { j(e); }
                                    }, 0);
                                });
                            },
                            text: function() {
                                return new Promise(function(r) {
                                    setTimeout(function() { r(body); }, 0);
                                });
                            }
                        });
                    }, 0);
                });
            });
        };
        """)

        // AbortController / AbortSignal polyfill (JS-based, simpler than Swift)
        jsContext.evaluateScript("""
        if (typeof globalThis.AbortController === 'undefined') {
            class AbortSignal {
                constructor() {
                    this.aborted = false;
                    this._listeners = [];
                }
                addEventListener(type, listener) {
                    if (type === 'abort') this._listeners.push(listener);
                }
                removeEventListener(type, listener) {
                    if (type === 'abort') {
                        this._listeners = this._listeners.filter(l => l !== listener);
                    }
                }
                _fire() {
                    this.aborted = true;
                    for (var i = 0; i < this._listeners.length; i++) {
                        this._listeners[i]();
                    }
                }
            }
            class AbortController {
                constructor() {
                    this.signal = new AbortSignal();
                }
                abort() {
                    this.signal._fire();
                }
            }
            globalThis.AbortController = AbortController;
            globalThis.AbortSignal = AbortSignal;
        }
        """)

        // DOMException polyfill
        jsContext.evaluateScript("""
        if (typeof globalThis.DOMException === 'undefined') {
            class DOMException extends Error {
                constructor(message, name) {
                    super(message);
                    this.name = name || 'Error';
                }
            }
            globalThis.DOMException = DOMException;
        }
        """)
    }

    // MARK: - Expose bridge to JS

    private func exposeBridgeMethods() {
        let bridge = JSValue(newObjectIn: jsContext)!

        // createView(type: string, parent: number, before?: number) → number
        let createView: @convention(block) (String, Int, JSValue) -> Int = { [weak self] type, parent, beforeVal in
            guard let self = self else { return -1 }
            let before = beforeVal.isUndefined || beforeVal.isNull ? nil : Int(beforeVal.toInt32())
            return self.bridgeCreateView(type: type, parent: parent, before: before)
        }
        bridge.setObject(createView, forKeyedSubscript: "createView" as NSString)

        // createTextView(text: string, parent: number, before?: number) → number
        let createTextView: @convention(block) (String, Int, JSValue) -> Int = { [weak self] text, parent, beforeVal in
            guard let self = self else { return -1 }
            let before = beforeVal.isUndefined || beforeVal.isNull ? nil : Int(beforeVal.toInt32())
            return self.bridgeCreateTextView(text: text, parent: parent, before: before)
        }
        bridge.setObject(createTextView, forKeyedSubscript: "createTextView" as NSString)

        // removeView(handle: number)
        let removeView: @convention(block) (Int) -> Void = { [weak self] handle in
            self?.bridgeRemoveView(handle: handle)
        }
        bridge.setObject(removeView, forKeyedSubscript: "removeView" as NSString)

        // setViewProp(handle: number, name: string, value: any)
        let setViewProp: @convention(block) (Int, String, JSValue) -> Void = { [weak self] handle, name, value in
            self?.bridgeSetViewProp(handle: handle, name: name, value: value)
        }
        bridge.setObject(setViewProp, forKeyedSubscript: "setViewProp" as NSString)

        // setViewProps(handle: number, props: object)
        let setViewProps: @convention(block) (Int, JSValue) -> Void = { [weak self] handle, propsVal in
            guard let self = self, let dict = propsVal.toDictionary() as? [String: Any] else { return }
            for (key, val) in dict {
                self.bridgeSetViewProp(handle: handle, name: key, value: JSValue(object: val, in: self.jsContext))
            }
        }
        bridge.setObject(setViewProps, forKeyedSubscript: "setViewProps" as NSString)

        // setTextContent(handle: number, text: string)
        let setTextContent: @convention(block) (Int, String) -> Void = { [weak self] handle, text in
            self?.bridgeSetTextContent(handle: handle, text: text)
        }
        bridge.setObject(setTextContent, forKeyedSubscript: "setTextContent" as NSString)

        // getTextContent(handle: number) → string
        let getTextContent: @convention(block) (Int) -> String = { [weak self] handle in
            return self?.bridgeGetTextContent(handle: handle) ?? ""
        }
        bridge.setObject(getTextContent, forKeyedSubscript: "getTextContent" as NSString)

        // setStyle(handle: number, styles: object)
        let setStyle: @convention(block) (Int, JSValue) -> Void = { [weak self] handle, stylesVal in
            guard let self = self, let dict = stylesVal.toDictionary() as? [String: Any] else { return }
            self.bridgeSetStyle(handle: handle, styles: dict)
        }
        bridge.setObject(setStyle, forKeyedSubscript: "setStyle" as NSString)

        // addEventListener(handle: number, event: string, handler: function) → function
        let addEventListener: @convention(block) (Int, String, JSValue) -> JSValue = { [weak self] handle, event, handler in
            guard let self = self else { return JSValue(undefinedIn: JSContext.current()) }
            return self.bridgeAddEventListener(handle: handle, event: event, handler: handler)
        }
        bridge.setObject(addEventListener, forKeyedSubscript: "addEventListener" as NSString)

        // measure(handle: number) → Promise<{x, y, width, height}>
        let measure: @convention(block) (Int) -> JSValue = { [weak self] handle in
            guard let self = self else { return JSValue(undefinedIn: JSContext.current()) }
            return self.bridgeMeasure(handle: handle)
        }
        bridge.setObject(measure, forKeyedSubscript: "measure" as NSString)

        // requestAnimationFrame(callback: function) → number
        let requestAnimationFrame: @convention(block) (JSValue) -> Int = { [weak self] callback in
            guard let self = self else { return -1 }
            return self.bridgeRequestAnimationFrame(callback: callback)
        }
        bridge.setObject(requestAnimationFrame, forKeyedSubscript: "requestAnimationFrame" as NSString)

        // cancelAnimationFrame(id: number)
        let cancelAnimationFrame: @convention(block) (Int) -> Void = { [weak self] id in
            self?.bridgeCancelAnimationFrame(id: id)
        }
        bridge.setObject(cancelAnimationFrame, forKeyedSubscript: "cancelAnimationFrame" as NSString)

        // Set bridge on globalThis
        jsContext.setObject(bridge, forKeyedSubscript: "__TEMPO_JSI_BRIDGE" as NSString)
    }

    // MARK: - Bridge method implementations

    private func bridgeCreateView(type: String, parent: Int, before: Int?) -> Int {
        let handle = nextHandle
        nextHandle += 1

        let view: UIView
        switch type {
        case "View", "KeyboardAvoidingView":
            view = FlexView()
        case "SafeAreaView":
            view = SafeAreaFlexView()
        case "Text":
            view = FlexView()
        case "__text__":
            let label = UILabel()
            label.numberOfLines = 0
            view = label
        case "__ref__":
            // Invisible marker with zero size
            let marker = UIView()
            marker.isHidden = true
            marker.frame = .zero
            view = marker
        case "ScrollView":
            let scrollView = FlexScrollView()
            scrollView.alwaysBounceVertical = true
            // Add a FlexView as content container — its width is managed by
            // FlexScrollView.layoutSubviews and its height by FlexView.layoutSubviews
            let content = FlexView()
            content.clipsToBounds = false  // allow children to be visible during resize
            scrollView.addSubview(content)
            view = scrollView
        case "Image":
            view = UIImageView()
        case "TextInput":
            view = UITextField()
        case "ActivityIndicator":
            let indicator = UIActivityIndicatorView(style: .large)
            indicator.startAnimating()
            view = indicator
        default:
            view = FlexView()
        }

        view.clipsToBounds = true
        views[handle] = view
        viewTypes[handle] = type

        guard let parentView = views[parent] else { return handle }

        // For ScrollView, add to the content FlexView child
        let targetParent: UIView
        if let scrollView = parentView as? UIScrollView, !(parentView is FlexView) {
            targetParent = scrollView.subviews.first(where: { $0 is FlexView }) ?? parentView
        } else {
            targetParent = parentView
        }

        if let beforeHandle = before, let beforeView = views[beforeHandle],
           let idx = targetParent.subviews.firstIndex(of: beforeView) {
            targetParent.insertSubview(view, at: idx)
        } else {
            targetParent.addSubview(view)
        }

        // ScrollViews default to flex:1 so they fill available space
        // (matches React Native behavior)
        if type == "ScrollView", let parentFlex = targetParent as? FlexView {
            parentFlex.childFlexValues[view] = 1
        }

        return handle
    }

    private func bridgeCreateTextView(text: String, parent: Int, before: Int?) -> Int {
        let handle = nextHandle
        nextHandle += 1

        let label = UILabel()
        label.text = text
        label.numberOfLines = 0
        label.textColor = .black

        views[handle] = label
        viewTypes[handle] = "__text__"

        guard let parentView = views[parent] else { return handle }

        // For ScrollView, add to the content FlexView child
        let targetParent: UIView
        if let scrollView = parentView as? UIScrollView, !(parentView is FlexView) {
            targetParent = scrollView.subviews.first(where: { $0 is FlexView }) ?? parentView
        } else {
            targetParent = parentView
        }

        if let beforeHandle = before, let beforeView = views[beforeHandle],
           let idx = targetParent.subviews.firstIndex(of: beforeView) {
            targetParent.insertSubview(label, at: idx)
        } else {
            targetParent.addSubview(label)
        }

        return handle
    }

    private func bridgeRemoveView(handle: Int) {
        guard let view = views[handle] else { return }
        view.removeFromSuperview()
        views.removeValue(forKey: handle)
        viewTypes.removeValue(forKey: handle)
        listeners.removeValue(forKey: handle)
    }

    private func bridgeSetViewProp(handle: Int, name: String, value: JSValue) {
        guard let view = views[handle] else { return }

        switch name {
        case "numberOfLines":
            (view as? UILabel)?.numberOfLines = Int(value.toInt32())
        case "placeholder":
            (view as? UITextField)?.placeholder = value.toString()
        case "value":
            (view as? UITextField)?.text = value.toString()
        case "disabled":
            if let field = view as? UITextField {
                field.isEnabled = !value.toBool()
            }
            view.isUserInteractionEnabled = !value.toBool()
        case "editable":
            if let field = view as? UITextField {
                field.isEnabled = value.toBool()
            }
        case "secureTextEntry":
            (view as? UITextField)?.isSecureTextEntry = value.toBool()
        case "testID":
            view.accessibilityIdentifier = value.toString()
        case "accessibilityLabel":
            view.accessibilityLabel = value.toString()
        default:
            break
        }
    }

    private func bridgeSetTextContent(handle: Int, text: String) {
        if let label = views[handle] as? UILabel {
            label.text = text
            // Trigger parent layout
            label.superview?.setNeedsLayout()
        }
    }

    private func bridgeGetTextContent(handle: Int) -> String {
        return (views[handle] as? UILabel)?.text ?? ""
    }

    // MARK: - Style mapping

    private func bridgeSetStyle(handle: Int, styles: [String: Any]) {
        guard let view = views[handle] else { return }

        for (key, value) in styles {
            applyStyleProperty(view: view, handle: handle, key: key, value: value)
        }

        view.setNeedsLayout()
        view.superview?.setNeedsLayout()
    }

    private func applyStyleProperty(view: UIView, handle: Int, key: String, value: Any) {
        switch key {
        // Background
        case "backgroundColor":
            if let hex = value as? String {
                view.backgroundColor = UIColor(hex: hex)
            }
        case "opacity":
            if let n = toDouble(value) {
                view.alpha = CGFloat(n)
            }

        // Sizing
        case "width":
            if let n = toDouble(value), let parent = view.superview as? FlexView {
                parent.childWidths[view] = CGFloat(n)
            }
        case "height":
            if let n = toDouble(value), let parent = view.superview as? FlexView {
                parent.childHeights[view] = CGFloat(n)
            }
        case "minHeight":
            if let n = toDouble(value), let parent = view.superview as? FlexView {
                let current = parent.childHeights[view] ?? 0
                if current < CGFloat(n) {
                    parent.childHeights[view] = CGFloat(n)
                }
            }

        // Padding
        case "padding":
            if let n = toDouble(value), let flex = view as? FlexView {
                let p = CGFloat(n)
                flex.paddingTop = p; flex.paddingRight = p; flex.paddingBottom = p; flex.paddingLeft = p
            }
        case "paddingTop":
            if let n = toDouble(value), let flex = view as? FlexView { flex.paddingTop = CGFloat(n) }
        case "paddingRight":
            if let n = toDouble(value), let flex = view as? FlexView { flex.paddingRight = CGFloat(n) }
        case "paddingBottom":
            if let n = toDouble(value), let flex = view as? FlexView { flex.paddingBottom = CGFloat(n) }
        case "paddingLeft":
            if let n = toDouble(value), let flex = view as? FlexView { flex.paddingLeft = CGFloat(n) }
        case "paddingHorizontal":
            if let n = toDouble(value), let flex = view as? FlexView {
                let p = CGFloat(n)
                flex.paddingLeft = p; flex.paddingRight = p
            }
        case "paddingVertical":
            if let n = toDouble(value), let flex = view as? FlexView {
                let p = CGFloat(n)
                flex.paddingTop = p; flex.paddingBottom = p
            }

        // Margins (stored on parent's layout data)
        case "margin":
            if let n = toDouble(value), let parent = view.superview as? FlexView {
                let m = CGFloat(n)
                parent.childMargins[view] = UIEdgeInsets(top: m, left: m, bottom: m, right: m)
            }
        case "marginTop":
            if let n = toDouble(value), let parent = view.superview as? FlexView {
                var insets = parent.childMargins[view] ?? .zero
                insets.top = CGFloat(n)
                parent.childMargins[view] = insets
            }
        case "marginBottom":
            if let n = toDouble(value), let parent = view.superview as? FlexView {
                var insets = parent.childMargins[view] ?? .zero
                insets.bottom = CGFloat(n)
                parent.childMargins[view] = insets
            }
        case "marginLeft":
            if let n = toDouble(value), let parent = view.superview as? FlexView {
                var insets = parent.childMargins[view] ?? .zero
                insets.left = CGFloat(n)
                parent.childMargins[view] = insets
            }
        case "marginRight":
            if let n = toDouble(value), let parent = view.superview as? FlexView {
                var insets = parent.childMargins[view] ?? .zero
                insets.right = CGFloat(n)
                parent.childMargins[view] = insets
            }
        case "marginHorizontal":
            if let n = toDouble(value), let parent = view.superview as? FlexView {
                var insets = parent.childMargins[view] ?? .zero
                let m = CGFloat(n)
                insets.left = m; insets.right = m
                parent.childMargins[view] = insets
            }
        case "marginVertical":
            if let n = toDouble(value), let parent = view.superview as? FlexView {
                var insets = parent.childMargins[view] ?? .zero
                let m = CGFloat(n)
                insets.top = m; insets.bottom = m
                parent.childMargins[view] = insets
            }

        // Borders
        case "borderRadius":
            if let n = toDouble(value) {
                view.layer.cornerRadius = CGFloat(n)
            }
        case "borderWidth":
            if let n = toDouble(value) {
                view.layer.borderWidth = CGFloat(n)
            }
        case "borderColor":
            if let hex = value as? String {
                view.layer.borderColor = UIColor(hex: hex)?.cgColor
            }
        case "borderBottomWidth":
            // Approximate with a bottom border layer
            if let n = toDouble(value) {
                let border = CALayer()
                border.frame = CGRect(x: 0, y: view.bounds.height - CGFloat(n), width: view.bounds.width, height: CGFloat(n))
                border.backgroundColor = view.layer.borderColor ?? UIColor.gray.cgColor
                border.name = "bottomBorder"
                // Remove existing bottom border
                view.layer.sublayers?.removeAll { $0.name == "bottomBorder" }
                view.layer.addSublayer(border)
            }
        case "borderBottomColor":
            if let hex = value as? String {
                if let border = view.layer.sublayers?.first(where: { $0.name == "bottomBorder" }) {
                    border.backgroundColor = UIColor(hex: hex)?.cgColor
                }
            }

        // Flex layout
        case "flex":
            if let n = toDouble(value) {
                if let flex = view as? FlexView {
                    flex.flexValueForParent = CGFloat(n)
                }
                if let parent = view.superview as? FlexView {
                    parent.childFlexValues[view] = CGFloat(n)
                }
            }
        case "flexDirection":
            if let dir = value as? String, let flex = view as? FlexView {
                switch dir {
                case "row", "row-reverse": flex.flexDirection = .row
                default: flex.flexDirection = .column
                }
            }
        case "justifyContent":
            if let jc = value as? String, let flex = view as? FlexView {
                switch jc {
                case "flex-end": flex.justifyContent = .flexEnd
                case "center": flex.justifyContent = .center
                case "space-between": flex.justifyContent = .spaceBetween
                case "space-around": flex.justifyContent = .spaceAround
                case "space-evenly": flex.justifyContent = .spaceEvenly
                default: flex.justifyContent = .flexStart
                }
            }
        case "alignItems":
            if let ai = value as? String, let flex = view as? FlexView {
                switch ai {
                case "flex-start": flex.alignItems = .flexStart
                case "flex-end": flex.alignItems = .flexEnd
                case "center": flex.alignItems = .center
                default: flex.alignItems = .stretch
                }
            }
        case "flexWrap", "alignSelf", "flexGrow", "flexShrink":
            break  // Not supported in prototype

        // Text styles (applied to UILabel children)
        case "fontSize":
            if let n = toDouble(value) {
                let font = UIFont.systemFont(ofSize: CGFloat(n))
                applyToLabels(in: view) { $0.font = font }
            }
        case "fontWeight":
            if let w = value as? String {
                let weight = fontWeight(from: w)
                applyToLabels(in: view) { label in
                    let size = label.font.pointSize
                    label.font = UIFont.systemFont(ofSize: size, weight: weight)
                }
            }
        case "color":
            if let hex = value as? String {
                let color = UIColor(hex: hex)
                applyToLabels(in: view) { $0.textColor = color }
                // Also apply to ActivityIndicator
                if let indicator = view as? UIActivityIndicatorView, let color = color {
                    indicator.color = color
                }
            }
        case "textAlign":
            if let align = value as? String {
                let alignment: NSTextAlignment
                switch align {
                case "center": alignment = .center
                case "right": alignment = .right
                case "justify": alignment = .justified
                default: alignment = .left
                }
                applyToLabels(in: view) { $0.textAlignment = alignment }
            }
        case "lineHeight":
            break  // Not trivially supported on UILabel; skip for prototype

        // Display
        case "display":
            if let d = value as? String {
                view.isHidden = (d == "none")
            }
        case "overflow":
            if let o = value as? String {
                view.clipsToBounds = (o == "hidden")
            }

        // Shadow
        case "shadowColor":
            if let hex = value as? String {
                view.layer.shadowColor = UIColor(hex: hex)?.cgColor
            }
        case "shadowOpacity":
            if let n = toDouble(value) {
                view.layer.shadowOpacity = Float(n)
            }
        case "shadowRadius":
            if let n = toDouble(value) {
                view.layer.shadowRadius = CGFloat(n)
            }
        case "shadowOffset":
            if let dict = value as? [String: Any],
               let w = toDouble(dict["width"]),
               let h = toDouble(dict["height"]) {
                view.layer.shadowOffset = CGSize(width: w, height: h)
            }

        default:
            break
        }
    }

    // MARK: - Event handling

    private func bridgeAddEventListener(handle: Int, event: String, handler: JSValue) -> JSValue {
        let id = listenerIdCounter
        listenerIdCounter += 1

        // Store listener
        if listeners[handle] == nil { listeners[handle] = [:] }
        if listeners[handle]?[event] == nil { listeners[handle]?[event] = [] }
        listeners[handle]?[event]?.append((id: id, handler: handler))

        if event == "press" || event == "pressIn" || event == "pressOut" {
            if let view = views[handle] {
                view.isUserInteractionEnabled = true
                let gesture = UITapGestureRecognizer(target: self, action: #selector(handleTapGesture(_:)))
                gestureTargets[gesture] = (handle: handle, id: id)
                view.addGestureRecognizer(gesture)
            }
        }

        // Return cleanup function
        let cleanup: @convention(block) () -> Void = { [weak self] in
            guard let self = self else { return }
            self.listeners[handle]?[event]?.removeAll { $0.id == id }

            // Remove gesture if it was a press event
            if event == "press" || event == "pressIn" || event == "pressOut" {
                if let view = self.views[handle] {
                    for recognizer in view.gestureRecognizers ?? [] {
                        if self.gestureTargets[recognizer]?.id == id {
                            view.removeGestureRecognizer(recognizer)
                            self.gestureTargets.removeValue(forKey: recognizer)
                            break
                        }
                    }
                }
            }
        }
        return JSValue(object: cleanup, in: jsContext)
    }

    @objc private func handleTapGesture(_ recognizer: UITapGestureRecognizer) {
        guard recognizer.state == .ended,
              let info = gestureTargets[recognizer],
              let view = views[info.handle] else { return }

        let location = recognizer.location(in: view)
        let pageLocation = recognizer.location(in: rootView)

        let eventData: [String: Any] = [
            "locationX": Double(location.x),
            "locationY": Double(location.y),
            "pageX": Double(pageLocation.x),
            "pageY": Double(pageLocation.y),
            "timestamp": Date().timeIntervalSince1970 * 1000,
        ]

        // Fire pressIn, press, pressOut in sequence
        for event in ["pressIn", "press", "pressOut"] {
            if let entries = listeners[info.handle]?[event] {
                for entry in entries {
                    entry.handler.call(withArguments: [eventData])
                }
            }
        }

        // Drain the microtask queue so signal propagation (e.g. navigation
        // route change → mapAsync → UI update) is processed immediately.
        flushMicrotasks()
    }

    // MARK: - Measure

    private func bridgeMeasure(handle: Int) -> JSValue {
        guard let view = views[handle] else {
            return jsContext.evaluateScript("Promise.resolve({x:0,y:0,width:0,height:0})")
        }
        let frame = view.frame
        let script = "Promise.resolve({x:\(Double(frame.origin.x)),y:\(Double(frame.origin.y)),width:\(Double(frame.size.width)),height:\(Double(frame.size.height))})"
        return jsContext.evaluateScript(script)
    }

    // MARK: - Animation frame

    private func bridgeRequestAnimationFrame(callback: JSValue) -> Int {
        let id = rafIdCounter
        rafIdCounter += 1

        let workItem = DispatchWorkItem { [weak self] in
            callback.call(withArguments: [Date().timeIntervalSince1970 * 1000])
            self?.flushMicrotasks()
            self?.rafCallbacks.removeValue(forKey: id)
        }
        rafCallbacks[id] = workItem

        // Schedule on next run loop tick (~16ms for 60fps)
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.016, execute: workItem)
        return id
    }

    private func bridgeCancelAnimationFrame(id: Int) {
        rafCallbacks[id]?.cancel()
        rafCallbacks.removeValue(forKey: id)
    }

    // MARK: - Helpers

    private func toDouble(_ value: Any?) -> Double? {
        switch value {
        case let n as NSNumber: return n.doubleValue
        case let n as Int: return Double(n)
        case let n as Double: return n
        case let s as String: return Double(s)
        default: return nil
        }
    }

    private func applyToLabels(in view: UIView, _ block: (UILabel) -> Void) {
        if let label = view as? UILabel {
            block(label)
            return
        }
        for child in view.subviews {
            if let label = child as? UILabel {
                block(label)
            }
        }
    }

    private func fontWeight(from string: String) -> UIFont.Weight {
        switch string {
        case "bold", "700": return .bold
        case "100": return .ultraLight
        case "200": return .thin
        case "300": return .light
        case "400", "normal": return .regular
        case "500": return .medium
        case "600": return .semibold
        case "800": return .heavy
        case "900": return .black
        default: return .regular
        }
    }
}
