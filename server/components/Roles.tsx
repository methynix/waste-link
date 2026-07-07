import Link from "next/link";

export default function Roles() {
  return (
    <section className="section" id="roles">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker"><span data-sw>Anza hapa</span><span data-en>Start here</span></p>
          <h2><span data-sw>Wewe ni nani?</span><span data-en>Where do you fit?</span></h2>
        </div>

        <div className="roles-auth-bar">
          <span className="roles-auth-label">
            <span data-sw>Una akaunti tayari?</span><span data-en>Already have an account?</span>
          </span>
          <Link href="/login" className="btn btn-outline btn-sm">
            <span data-sw>Ingia</span><span data-en>Sign in</span>
          </Link>
          <Link href="/register" className="btn btn-blue btn-sm">
            <span data-sw>Jisajili</span><span data-en>Register</span>
          </Link>
        </div>

        <div className="roles">
          <Link className="role" href="/register?role=waste_generator">
            <div className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0D47A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18l-1.5 14a2 2 0 0 1-2 1.8H6.5a2 2 0 0 1-2-1.8L3 6Z"/>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
            </div>
            <span className="tag"><span data-sw>Mzalishaji</span><span data-en>Generator</span></span>
            <h3><span data-sw>Nina taka</span><span data-en>I have waste</span></h3>
            <p className="note"><span data-sw>Omba mtu akuchukulie</span><span data-en>Request a pickup</span></p>
            <span className="go">
              <span data-sw>Endelea</span><span data-en>Continue</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="#0D47A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </span>
          </Link>

          <Link className="role" href="/register?role=collector">
            <div className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0D47A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 16V8h12v8"/><path d="M14 11h4l3 3v2h-7"/>
                <circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
              </svg>
            </div>
            <span className="tag"><span data-sw>Mkusanyaji</span><span data-en>Collector</span></span>
            <h3><span data-sw>Nakusanya taka</span><span data-en>I collect waste</span></h3>
            <p className="note"><span data-sw>Pata kazi karibu nawe</span><span data-en>Find jobs near you</span></p>
            <span className="go">
              <span data-sw>Endelea</span><span data-en>Continue</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="#0D47A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </span>
          </Link>

          <Link className="role" href="/register?role=recycler">
            <div className="ic">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0D47A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 4l-3 6h7L8 4"/><path d="M17 4l3 6h-7l3-6"/>
                <path d="M12 14v6M4 10c0 3 2 5 4 5M20 10c0 3-2 5-4 5"/>
              </svg>
            </div>
            <span className="tag"><span data-sw>Mchakataji</span><span data-en>Recycler</span></span>
            <h3><span data-sw>Nanunua vitu vya kuchakata</span><span data-en>I buy recyclables</span></h3>
            <p className="note"><span data-sw>Fungua soko</span><span data-en>Open the market</span></p>
            <span className="go">
              <span data-sw>Endelea</span><span data-en>Continue</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="#0D47A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
