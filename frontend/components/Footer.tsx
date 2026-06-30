export default function Footer() {
  return (
      <footer className="site">
              <div className="wrap foot">
                <div>
                  <a className="mark" href="#top" aria-label="WasteLink">
                    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
                      <rect x="1.5" y="1.5" width="37" height="37" rx="9" fill="#0D47A1"/>
                      <path d="M6 27 L24 9" stroke="#C0CA33" strokeWidth="7"/>
                      <circle cx="22" cy="22" r="8.5" fill="none" stroke="#fff" strokeWidth="3.4"/>
                    </svg>
                    <span className="word">WasteLink</span>
                  </a>
                  <p className="tagline"><span data-sw>Taka ni mali.</span><span data-en>Waste is value.</span></p>
                </div>
                <div className="foot-col">
                  <h4><span data-sw>Kwa ajili ya</span><span data-en>For</span></h4>
                  <ul>
                    <li><span data-sw>Wazalishaji wa taka</span><span data-en>Waste generators</span></li>
                    <li><span data-sw>Wakusanyaji na madereva wa malori</span><span data-en>Collectors and truck drivers</span></li>
                    <li><span data-sw>Wachakataji na wanunuzi</span><span data-en>Recyclers and buyers</span></li>
                    <li><span data-sw>Wadhibiti na halmashauri</span><span data-en>Regulators and councils</span></li>
                  </ul>
                </div>
                <div className="foot-col">
                  <h4><span data-sw>Wasiliana</span><span data-en>Contact</span></h4>
                  <ul>
                    <li>Dar es Salaam, Tanzania</li>
                    <li>+255 715 455 422</li>
                    <li>info@methynix.com</li>
                  </ul>
                </div>
              </div>
              <div className="stripe"></div>
              <div className="wrap foot-bottom">
                <span>© {new Date().getFullYear()} WasteLink</span>
                <span><span data-sw>Imejengwa kwa ajili ya miji ya Tanzania na Methynix Software.</span><span data-en>Built for Tanzania's cities by Methynix Software.</span></span>
              </div>
            </footer>
  );
}
