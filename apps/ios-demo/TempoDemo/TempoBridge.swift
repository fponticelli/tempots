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
            let flexValue = (child as? FlexView)?.flexValueForParent ?? childFlexValues[child] ?? 0
            let fitting = child.sizeThatFits(CGSize(
                width: isRow ? CGFloat.greatestFiniteMagnitude : contentRect.width,
                height: isRow ? contentRect.height : CGFloat.greatestFiniteMagnitude
            ))
            let childMain = isRow ? (childWidths[child] ?? fitting.width) : (childHeights[child] ?? fitting.height)
            let childCross = isRow ? (childHeights[child] ?? fitting.height) : (childWidths[child] ?? fitting.width)

            if flexValue > 0 {
                totalFlex += flexValue
                measures.append(ChildMeasure(main: 0, cross: childCross, flex: flexValue))
            } else {
                totalFixedMain += childMain
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

            // Apply margin offsets
            let marginTop = childMargins[child]?.top ?? 0
            let marginLeft = childMargins[child]?.left ?? 0

            let frame: CGRect
            if isRow {
                frame = CGRect(
                    x: contentRect.minX + cursor + marginLeft,
                    y: contentRect.minY + crossOffset + marginTop,
                    width: childMainSize,
                    height: childCrossSize
                )
            } else {
                frame = CGRect(
                    x: contentRect.minX + crossOffset + marginLeft,
                    y: contentRect.minY + cursor + marginTop,
                    width: childCrossSize,
                    height: childMainSize
                )
            }

            child.frame = frame
            cursor += childMainSize + spacing
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
            let childMain = isRow ? w : h
            let childCross = isRow ? h : w
            mainTotal += childMain
            crossMax = max(crossMax, childCross)
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

// MARK: - TempoBridge

class TempoBridge {
    private var nextHandle: Int = 2  // 1 = root
    private var views: [Int: UIView] = [:]
    private var viewTypes: [Int: String] = [:]
    private var tapTargets: [UITapGestureRecognizer: (handle: Int, id: Int)] = [:]
    private var listeners: [Int: [String: [(id: Int, handler: JSValue)]]] = [:]
    private var listenerIdCounter: Int = 0
    private var rafCallbacks: [Int: DispatchWorkItem] = [:]
    private var rafIdCounter: Int = 0

    let rootView: UIView
    let jsContext: JSContext

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
            print("[TempoBridge JS Error] \(exception)")
        }

        exposeBridgeMethods()
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
                let jsVal = self.jsContext.objectForKeyedSubscript("JSON")
                    .objectForKeyedSubscript("stringify")
                    .call(withArguments: [val])
                self.bridgeSetViewProp(handle: handle, name: key, value: JSValue(object: val, in: self.jsContext))
                _ = jsVal  // suppress warning
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
            guard let self = self else { return JSValue(undefinedIn: self!.jsContext) }
            return self.bridgeAddEventListener(handle: handle, event: event, handler: handler)
        }
        bridge.setObject(addEventListener, forKeyedSubscript: "addEventListener" as NSString)

        // measure(handle: number) → Promise<{x, y, width, height}>
        let measure: @convention(block) (Int) -> JSValue = { [weak self] handle in
            guard let self = self else { return JSValue(undefinedIn: self!.jsContext) }
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

        // Also provide a console.log for debugging
        let consoleLog: @convention(block) (JSValue) -> Void = { value in
            print("[JS] \(value)")
        }
        let console = JSValue(newObjectIn: jsContext)!
        console.setObject(consoleLog, forKeyedSubscript: "log" as NSString)
        console.setObject(consoleLog, forKeyedSubscript: "warn" as NSString)
        console.setObject(consoleLog, forKeyedSubscript: "error" as NSString)
        jsContext.setObject(console, forKeyedSubscript: "console" as NSString)
    }

    // MARK: - Bridge method implementations

    private func bridgeCreateView(type: String, parent: Int, before: Int?) -> Int {
        let handle = nextHandle
        nextHandle += 1

        let view: UIView
        switch type {
        case "View", "SafeAreaView", "KeyboardAvoidingView":
            view = FlexView()
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
            view = UIScrollView()
        case "Image":
            view = UIImageView()
        case "TextInput":
            view = UITextField()
        default:
            view = FlexView()
        }

        view.clipsToBounds = true
        views[handle] = view
        viewTypes[handle] = type

        guard let parentView = views[parent] else { return handle }

        if let beforeHandle = before, let beforeView = views[beforeHandle],
           let idx = parentView.subviews.firstIndex(of: beforeView) {
            parentView.insertSubview(view, at: idx)
        } else {
            parentView.addSubview(view)
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

        if let beforeHandle = before, let beforeView = views[beforeHandle],
           let idx = parentView.subviews.firstIndex(of: beforeView) {
            parentView.insertSubview(label, at: idx)
        } else {
            parentView.addSubview(label)
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

        // Text styles (applied to UILabel children)
        case "fontSize":
            if let n = toDouble(value) {
                applyToLabels(in: view) { $0.font = UIFont.systemFont(ofSize: CGFloat(n)) }
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
                let tap = UITapGestureRecognizer(target: self, action: #selector(handleTap(_:)))
                tapTargets[tap] = (handle: handle, id: id)
                view.addGestureRecognizer(tap)
            }
        }

        // Return cleanup function
        let cleanup: @convention(block) () -> Void = { [weak self] in
            guard let self = self else { return }
            self.listeners[handle]?[event]?.removeAll { $0.id == id }

            // Remove tap gesture if it was a press event
            if event == "press" || event == "pressIn" || event == "pressOut" {
                if let view = self.views[handle] {
                    for recognizer in view.gestureRecognizers ?? [] {
                        if let tap = recognizer as? UITapGestureRecognizer,
                           self.tapTargets[tap]?.id == id {
                            view.removeGestureRecognizer(tap)
                            self.tapTargets.removeValue(forKey: tap)
                            break
                        }
                    }
                }
            }
        }
        return JSValue(object: cleanup, in: jsContext)
    }

    @objc private func handleTap(_ recognizer: UITapGestureRecognizer) {
        guard let info = tapTargets[recognizer],
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

        // Fire all "press" listeners for this handle
        if let pressListeners = listeners[info.handle]?["press"] {
            for entry in pressListeners {
                entry.handler.call(withArguments: [eventData])
            }
        }
    }

    // MARK: - Measure

    private func bridgeMeasure(handle: Int) -> JSValue {
        // Return a resolved promise with the view's frame
        let promiseConstructor = jsContext.objectForKeyedSubscript("Promise")!
        let result: @convention(block) (JSValue, JSValue) -> Void = { [weak self] resolve, _ in
            guard let self = self, let view = self.views[handle] else {
                resolve.call(withArguments: [["x": 0, "y": 0, "width": 0, "height": 0]])
                return
            }
            let frame = view.frame
            resolve.call(withArguments: [[
                "x": Double(frame.origin.x),
                "y": Double(frame.origin.y),
                "width": Double(frame.size.width),
                "height": Double(frame.size.height),
            ]])
        }
        return promiseConstructor.construct(withArguments: [unsafeBitCast(result, to: AnyObject.self)])
    }

    // MARK: - Animation frame

    private func bridgeRequestAnimationFrame(callback: JSValue) -> Int {
        let id = rafIdCounter
        rafIdCounter += 1

        let workItem = DispatchWorkItem { [weak self] in
            callback.call(withArguments: [Date().timeIntervalSince1970 * 1000])
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
