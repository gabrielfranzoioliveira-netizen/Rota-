export function MobileDeviceShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mobile-device-stage">
      <div className="mobile-device-frame" aria-label="Rota+ em simulacao de aplicativo mobile">
        <div className="mobile-status-bar" aria-hidden="true">
          <span>9:41</span>
          <span className="mobile-home-indicator-top" />
          <span>5G 100%</span>
        </div>
        <div className="mobile-app-screen">{children}</div>
      </div>
    </div>
  );
}
