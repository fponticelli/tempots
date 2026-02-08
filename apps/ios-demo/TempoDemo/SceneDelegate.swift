import UIKit

class SceneDelegate: UIResponder, UIWindowSceneDelegate {

    var window: UIWindow?
    var bridge: TempoBridge?

    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        guard let windowScene = scene as? UIWindowScene else { return }

        let window = UIWindow(windowScene: windowScene)
        let rootView = UIView()
        rootView.backgroundColor = .white

        let bridge = TempoBridge(rootView: rootView)
        self.bridge = bridge

        // Load and evaluate the JS bundle
        if let bundlePath = Bundle.main.path(forResource: "bundle", ofType: "js"),
           let jsCode = try? String(contentsOfFile: bundlePath, encoding: .utf8) {
            print("[TempoDemo] Evaluating JS bundle (\(jsCode.count) bytes)")
            bridge.jsContext.evaluateScript(jsCode)
            print("[TempoDemo] JS bundle evaluated")
        } else {
            print("[TempoDemo] WARNING: Could not load dist/bundle.js")
        }

        let vc = UIViewController()
        vc.view = rootView
        window.rootViewController = vc
        window.makeKeyAndVisible()
        self.window = window
    }

    func sceneDidDisconnect(_ scene: UIScene) {}

    func sceneDidBecomeActive(_ scene: UIScene) {
        fireAppStateListeners(state: "active")
    }

    func sceneWillResignActive(_ scene: UIScene) {
        fireAppStateListeners(state: "inactive")
    }

    func sceneDidEnterBackground(_ scene: UIScene) {
        fireAppStateListeners(state: "background")
    }

    func sceneWillEnterForeground(_ scene: UIScene) {
        fireAppStateListeners(state: "active")
    }

    private func fireAppStateListeners(state: String) {
        // Handle 0 is the virtual global event node
        // The bridge would fire appStateChange events here if wired up
        _ = state
    }
}
