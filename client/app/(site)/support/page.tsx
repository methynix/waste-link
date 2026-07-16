import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Us",
  description:
    "Help sustain WasteLink — back the infrastructure, partner with us, or contribute to keeping waste collection accessible across Tanzania.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return (
    <div className="doc">
      <h1>
        <span data-sw>Tuunge mkono</span>
        <span data-en>Support us</span>
      </h1>
      <p className="lead">
        <span data-sw>
          WasteLink ni jukwaa lisilo na faida kubwa linalounganisha wazalishaji wa taka,
          wakusanyaji na wachakataji. Msaada wako unatuwezesha kuendesha jukwaa na kulikuza.
        </span>
        <span data-en>
          WasteLink is a mission-driven platform connecting waste generators, collectors,
          and recyclers. Your support keeps the platform running and growing.
        </span>
      </p>

      <div className="support-cta">
        <h2>
          <span data-sw>Changia uendeshaji wa jukwaa</span>
          <span data-en>Contribute to the platform&apos;s operations</span>
        </h2>
        <p>
          <span data-sw>
            Uendeshaji wa WasteLink una gharama halisi — seva, hifadhidata, ujumbe wa SMS,
            barua pepe na muda wa maendeleo. Kama ungependa kuchangia kifedha, unaweza kufadhili
            gharama hizi za miundombinu na uendeshaji ili huduma ibaki nafuu kwa watumiaji wa Tanzania.
            Wasiliana nasi tukupe njia salama ya kuchangia.
          </span>
          <span data-en>
            Running WasteLink has real costs — servers, the database, SMS and email delivery,
            and development time. If you would like to contribute financially, you can help fund
            this infrastructure and operational overhead so the service stays affordable for
            Tanzanian users. Reach out and we&apos;ll share a secure way to contribute.
          </span>
        </p>
        <p>
          <a href="mailto:info@methynix.com?subject=Supporting%20WasteLink" className="foot-brand">
            info@methynix.com
          </a>
        </p>
      </div>

      <h2>
        <span data-sw>Njia nyingine za kusaidia</span>
        <span data-en>Other ways to help</span>
      </h2>
      <div className="support-grid">
        <div className="support-card">
          <h3><span data-sw>Ushirikiano</span><span data-en>Partnerships</span></h3>
          <p>
            <span data-sw>
              Halmashauri, kampuni za kuchakata na mashirika yanaweza kushirikiana nasi kupanua huduma.
            </span>
            <span data-en>
              Councils, recycling companies, and organisations can partner with us to expand the service.
            </span>
          </p>
        </div>
        <div className="support-card">
          <h3><span data-sw>Eneza habari</span><span data-en>Spread the word</span></h3>
          <p>
            <span data-sw>
              Waambie majirani, wafanyabiashara na wakusanyaji kuhusu WasteLink. Ukuaji unaanzia kwa jamii.
            </span>
            <span data-en>
              Tell neighbours, businesses, and collectors about WasteLink. Growth starts in the community.
            </span>
          </p>
        </div>
        <div className="support-card">
          <h3><span data-sw>Ujuzi na muda</span><span data-en>Skills &amp; time</span></h3>
          <p>
            <span data-sw>
              Wewe ni mtaalamu wa teknolojia, muundo au uendeshaji? Msaada wako wa kujitolea unakaribishwa.
            </span>
            <span data-en>
              Are you skilled in tech, design, or operations? Your volunteer help is welcome.
            </span>
          </p>
        </div>
        <div className="support-card">
          <h3><span data-sw>Maoni</span><span data-en>Feedback</span></h3>
          <p>
            <span data-sw>
              Tuambie kinachofanya kazi na kisichofanya kazi. Maoni yako yanatuboresha.
            </span>
            <span data-en>
              Tell us what works and what doesn&apos;t. Your feedback makes the platform better.
            </span>
          </p>
        </div>
      </div>

      <p>
        <span data-sw>Kwa jambo lolote, wasiliana nasi kupitia </span>
        <span data-en>For anything at all, reach us at </span>
        <a href="mailto:info@methynix.com">info@methynix.com</a>.
      </p>
    </div>
  );
}
