import InstallButton from "@/components/InstallButton";

export default function AppBand() {
  return (
      <section className="appband">
                <div className="wrap app-grid">
                  <div>
                    <h2><span data-sw>Ibebe mfukoni mwako</span><span data-en>Carry it in your pocket</span></h2>
                    <p><span data-sw>Sakinisha programu kwenye simu yako moja kwa moja kutoka kwenye kivinjari. Inafanya kazi hata kwenye mtandao wa polepole.</span><span data-en>Install the app on your phone straight from your browser. It works even on a slow connection.</span></p>
                    <InstallButton className="btn btn-lime">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#1c1d14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '20px', height: '20px'}}><path d="M12 3v12M7 11l5 5 5-5"/><path d="M5 21h14"/></svg>
                      <span data-sw>Sakinisha programu</span><span data-en>Install the app</span>
                    </InstallButton>
                  </div>
                  <div className="howto">
                    <div className="row">
                      <span className="badge">Android</span>
                      <span><b><span data-sw>Gusa menyu</span><span data-en>Tap the menu</span></b> <span data-sw>kisha “Ongeza kwenye Skrini ya Mwanzo”.</span><span data-en>then “Add to Home screen”.</span></span>
                    </div>
                    <div className="row">
                      <span className="badge">iPhone</span>
                      <span><b><span data-sw>Gusa Share</span><span data-en>Tap Share</span></b> <span data-sw>kisha “Add to Home Screen”.</span><span data-en>then “Add to Home Screen”.</span></span>
                    </div>
                  </div>
                </div>
              </section>
  );
}
