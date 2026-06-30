import InstallButton from "@/components/InstallButton";

export default function Hero() {
  return (
      <section className="hero">
                <div className="wrap hero-grid">
                  <div className="hero-copy">
                    <p className="eyebrow">
                      <span data-sw>Kwa wazalishaji, wakusanyaji na wachakataji wa taka</span>
                      <span data-en>For waste generators, collectors and recyclers</span>
                    </p>
                    <h1>
                      <span data-sw>Taka ni <span className="accent">mali</span>.</span>
                      <span data-en>Waste is <span className="accent">value</span>.</span>
                    </h1>
                    <p className="sub">
                      <span data-sw>Omba mtu akuchukulie taka, uza vitu vya kuchakata, na ulipwe kwa simu yako  popote ulipo Tanzania.</span>
                      <span data-en>Request a pickup, sell your recyclables, and get paid on your phone  anywhere in Tanzania.</span>
                    </p>
                    <div className="hero-cta">
                      <a className="btn btn-blue" href="#roles">
                        <span data-sw>Omba kuchukuliwa</span><span data-en>Request a pickup</span>
                      </a>
                      <InstallButton className="btn btn-ghost">
                        <span data-sw>Pakua programu</span><span data-en>Get the app</span>
                      </InstallButton>
                    </div>
                    <p className="microline">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#5d6470" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg>
                      <span data-sw>Hakuna duka la programu linahitajika. Inafanya kazi kwenye simu yoyote.</span>
                      <span data-en>No app store needed. Works on any phone.</span>
                    </p>
                  </div>

                  <div className="hero-art" aria-hidden="true">
                    <svg viewBox="0 0 520 440" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="20" y="24" width="480" height="392" rx="22" fill="#ffffff" stroke="#e3e4e0"/>
                      <path d="M44 372 H476" stroke="#dfe1da" strokeWidth="3" strokeLinecap="round"/>
                      <path d="M120 372 C 150 250, 250 250, 300 168" stroke="#1E88E5" strokeWidth="4" strokeDasharray="3 12" strokeLinecap="round"/>
                      <g>
                        <rect x="92" y="250" width="150" height="86" rx="12" fill="#C0CA33"/>
                        <rect x="104" y="232" width="60" height="40" rx="8" fill="#0D47A1"/>
                        <rect x="170" y="222" width="58" height="50" rx="8" fill="#10243f"/>
                        <path d="M242 262 L300 262" stroke="#1c1d14" strokeWidth="9" strokeLinecap="round"/>
                        <circle cx="120" cy="350" r="20" fill="#2C2C2C"/><circle cx="120" cy="350" r="7" fill="#F9F9F9"/>
                        <circle cx="214" cy="350" r="20" fill="#2C2C2C"/><circle cx="214" cy="350" r="7" fill="#F9F9F9"/>
                      </g>
                      <g>
                        <rect x="300" y="96" width="118" height="150" rx="16" fill="#10243f"/>
                        <rect x="312" y="110" width="94" height="122" rx="8" fill="#F9F9F9"/>
                        <circle cx="359" cy="171" r="30" fill="#0D47A1"/>
                        <path d="M359 156 v30 M349 166 h20" stroke="#fff" strokeWidth="5" strokeLinecap="round"/>
                        <rect x="330" y="206" width="58" height="9" rx="4" fill="#C0CA33"/>
                      </g>
                      <path d="M300 168 l-9 -4 l5 9 Z" fill="#1E88E5"/>
                    </svg>
                  </div>
                </div>
              </section>
  );
}
