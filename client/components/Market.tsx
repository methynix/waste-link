export default function Market() {
  return (
      <section className="market section">
                <div className="wrap market-grid">
                  <div>
                    <p className="kicker"><span data-sw>Soko</span><span data-en>Market</span></p>
                    <h2 style={{fontFamily: 'var(--display)', fontWeight: '800', color: 'var(--ink)', fontSize: 'clamp(1.9rem,4vw,2.6rem)', letterSpacing: '-.02em', margin: '8px 0 0', lineHeight: '1.05'}}>
                      <span data-sw>Soko la kuchakata</span><span data-en>The recycling market</span>
                    </h2>
                  </div>
                  <div>
                    <p className="lead">
                      <span data-sw>Orodhesha ulivyo navyo. Wanunuzi walio karibu wanatoa bei, mnapatana, na pesa inahifadhiwa salama hadi mthibitishe bidhaa ni nzuri.</span>
                      <span data-en>List what you have. Buyers nearby make offers, you agree a price, and the money is held safely until you both confirm the goods are good.</span>
                    </p>
                    <div className="chips">
                      <span className="chip"><span data-sw>Plastiki</span><span data-en>Plastic</span></span>
                      <span className="chip alt"><span data-sw>Chuma</span><span data-en>Metal</span></span>
                      <span className="chip"><span data-sw>Karatasi</span><span data-en>Paper</span></span>
                      <span className="chip alt"><span data-sw>Chupa za kioo</span><span data-en>Glass</span></span>
                      <span className="chip"><span data-sw>Alumini</span><span data-en>Aluminium</span></span>
                      <span className="chip alt"><span data-sw>Katoni</span><span data-en>Cardboard</span></span>
                    </div>
                    <p className="note"><span data-sw>Bei hupangwa na soko, si na sisi.</span><span data-en>Prices are set by the market, not by us.</span></p>
                  </div>
                </div>
              </section>
  );
}
