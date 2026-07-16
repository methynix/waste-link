import InstallButton from "@/components/InstallButton";
import LanguageToggle from "@/components/LanguageToggle";

export default function Header() {
  return (
      <header className="site">
              <div className="wrap bar">
                <a className="mark" href="#top" aria-label="Ecothynx">
                  <img src="/icons/icon-192.png" alt="" width={34} height={34} className="mark-logo" />
                  <span className="word">Ecothynx</span>
                </a>
                <div className="bar-right">
                  <LanguageToggle />
                  <InstallButton className="btn btn-lime btn-sm">
                    <span data-sw>Pakua programu</span><span data-en>Get the app</span>
                  </InstallButton>
                </div>
              </div>
            </header>
  );
}
