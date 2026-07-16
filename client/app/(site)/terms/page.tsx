import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms and conditions governing the use of the WasteLink waste collection and recycling platform in Tanzania.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="doc">
      <h1>
        <span data-sw>Sheria na masharti</span>
        <span data-en>Terms &amp; conditions</span>
      </h1>
      <p className="doc-meta">
        <span data-sw>Yalisasishwa mwisho: Januari 2026</span>
        <span data-en>Last updated: January 2026</span>
      </p>

      <p className="lead">
        <span data-sw>
          Kwa kutumia WasteLink, unakubali masharti yafuatayo. Tafadhali yasome kwa makini.
        </span>
        <span data-en>
          By using WasteLink, you agree to the following terms. Please read them carefully.
        </span>
      </p>

      <h2><span data-sw>1. Kuhusu huduma</span><span data-en>1. About the service</span></h2>
      <p>
        <span data-sw>
          WasteLink ni jukwaa linalounganisha wazalishaji wa taka na wakusanyaji, madereva wa malori,
          na wachakataji. Sisi tunawezesha muunganiko; huduma halisi ya ukusanyaji hutolewa na watumiaji wenyewe.
        </span>
        <span data-en>
          WasteLink is a platform that connects waste generators with collectors, truck drivers,
          and recyclers. We facilitate the connection; the actual collection service is provided by the users themselves.
        </span>
      </p>

      <h2><span data-sw>2. Akaunti zako</span><span data-en>2. Your account</span></h2>
      <ul>
        <li><span data-sw>Lazima utoe namba ya simu sahihi na uthibitishe kupitia OTP.</span><span data-en>You must provide a valid phone number and verify it via OTP.</span></li>
        <li><span data-sw>Wewe ndiye unayewajibika kwa usalama wa nenosiri lako.</span><span data-en>You are responsible for keeping your password secure.</span></li>
        <li><span data-sw>Taarifa unazotoa lazima ziwe za kweli na sahihi.</span><span data-en>The information you provide must be true and accurate.</span></li>
      </ul>

      <h2><span data-sw>3. Malipo</span><span data-en>3. Payments</span></h2>
      <p>
        <span data-sw>
          Malipo yanaweza kufanywa kwa taslimu wakati wa ukusanyaji au kwa njia za simu pale zinapopatikana.
          Bei hukubaliwa kabla ya huduma. WasteLink inaweza kutoza ada ndogo ya uendeshaji kwenye kila muamala.
        </span>
        <span data-en>
          Payments may be made in cash on collection, or via mobile money where available.
          Prices are agreed before the service. WasteLink may charge a small operational commission on each transaction.
        </span>
      </p>

      <h2><span data-sw>4. Wajibu wa mtumiaji</span><span data-en>4. User responsibilities</span></h2>
      <ul>
        <li><span data-sw>Wazalishaji lazima waeleze taka kwa usahihi, hasa taka hatari.</span><span data-en>Generators must describe waste accurately, especially hazardous waste.</span></li>
        <li><span data-sw>Wakusanyaji lazima washughulikie na kutupa taka kwa mujibu wa sheria za mazingira.</span><span data-en>Collectors must handle and dispose of waste in line with environmental laws.</span></li>
        <li><span data-sw>Hairuhusiwi kutumia jukwaa kwa shughuli haramu.</span><span data-en>Using the platform for illegal activity is prohibited.</span></li>
      </ul>

      <h2><span data-sw>5. Uwajibikaji</span><span data-en>5. Liability</span></h2>
      <p>
        <span data-sw>
          WasteLink haihusiki moja kwa moja na ubora wa huduma inayotolewa kati ya watumiaji, lakini
          tunafanya kila jitihada kuweka jukwaa salama na la kuaminika. Migogoro inaweza kuripotiwa kupitia jukwaa.
        </span>
        <span data-en>
          WasteLink is not directly responsible for the quality of the service exchanged between users, but
          we make every effort to keep the platform safe and trustworthy. Disputes can be reported through the platform.
        </span>
      </p>

      <h2><span data-sw>6. Mabadiliko</span><span data-en>6. Changes</span></h2>
      <p>
        <span data-sw>
          Tunaweza kubadilisha masharti haya mara kwa mara. Matumizi yako yanayoendelea yanamaanisha unakubali mabadiliko.
        </span>
        <span data-en>
          We may update these terms from time to time. Your continued use means you accept the changes.
        </span>
      </p>

      <h2><span data-sw>7. Wasiliana</span><span data-en>7. Contact</span></h2>
      <p>
        <span data-sw>Kwa maswali kuhusu masharti haya, wasiliana nasi kupitia </span>
        <span data-en>For questions about these terms, contact us at </span>
        <a href="mailto:info@methynix.com">info@methynix.com</a>.
      </p>
    </div>
  );
}
