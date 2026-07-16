import Link from "next/link";

export default function Footer() {
  return (
      <footer className="site">
              <div className="wrap foot">
                <div>
                  <a className="mark" href="#top" aria-label="Ecothynx">
                    <img src="/icons/icon-192.png" alt="" width={34} height={34} className="mark-logo" />
                    <span className="word">Ecothynx</span>
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
                  <h4><span data-sw>Kampuni</span><span data-en>Company</span></h4>
                  <ul>
                    <li><Link href="/support"><span data-sw>Tuunge mkono</span><span data-en>Support us</span></Link></li>
                    <li><Link href="/terms"><span data-sw>Sheria na masharti</span><span data-en>Terms &amp; conditions</span></Link></li>
                    <li><Link href="/privacy"><span data-sw>Sera ya faragha</span><span data-en>Privacy policy</span></Link></li>
                  </ul>
                </div>
                <div className="foot-col">
                  <h4><span data-sw>Wasiliana</span><span data-en>Contact</span></h4>
                  <ul>
                    <li>Dar es Salaam, Tanzania</li>
                    <li><a href="tel:+255715455422">+255 715 455 422</a></li>
                    <li><a href="mailto:info@methynix.com">info@methynix.com</a></li>
                  </ul>
                </div>
              </div>
              <div className="stripe"></div>
              <div className="wrap foot-bottom">
                <span>© {new Date().getFullYear()} Ecothynx</span>
                <span>
                  <span data-sw>Imejengwa na </span><span data-en>Built by </span>
                  <a href="https://methynix.com" target="_blank" rel="noopener noreferrer" className="foot-brand">Methynix Software</a>
                </span>
              </div>
            </footer>
  );
}
