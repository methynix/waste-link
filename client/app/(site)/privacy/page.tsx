import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Ecothynx collects, uses, and protects your personal data — phone number, email, and location — across Tanzania.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="doc">
      <h1>
        <span data-sw>Sera ya faragha</span>
        <span data-en>Privacy policy</span>
      </h1>
      <p className="doc-meta">
        <span data-sw>Yalisasishwa mwisho: Januari 2026</span>
        <span data-en>Last updated: January 2026</span>
      </p>

      <p className="lead">
        <span data-sw>
          Faragha yako ni muhimu kwetu. Sera hii inaeleza taarifa tunazokusanya na jinsi tunavyozitumia.
        </span>
        <span data-en>
          Your privacy matters to us. This policy explains what information we collect and how we use it.
        </span>
      </p>

      <h2><span data-sw>1. Taarifa tunazokusanya</span><span data-en>1. Information we collect</span></h2>
      <ul>
        <li><span data-sw>Namba ya simu na barua pepe — kwa akaunti na mawasiliano.</span><span data-en>Phone number and email — for your account and communication.</span></li>
        <li><span data-sw>Eneo (mahali) — pale unapoomba kuchukuliwa taka au kuweka tangazo.</span><span data-en>Location — when you request a pickup or post a listing.</span></li>
        <li><span data-sw>Taarifa za miamala — maombi, malipo na historia ya huduma.</span><span data-en>Transaction details — requests, payments, and service history.</span></li>
      </ul>

      <h2><span data-sw>2. Jinsi tunavyotumia taarifa</span><span data-en>2. How we use your information</span></h2>
      <ul>
        <li><span data-sw>Kukuunganisha na wakusanyaji au wachakataji karibu nawe.</span><span data-en>To connect you with nearby collectors or recyclers.</span></li>
        <li><span data-sw>Kutuma ujumbe wa uthibitisho (OTP) kwa SMS na barua pepe.</span><span data-en>To send verification codes (OTP) by SMS and email.</span></li>
        <li><span data-sw>Kuboresha huduma na usalama wa jukwaa.</span><span data-en>To improve the service and platform security.</span></li>
      </ul>

      <h2><span data-sw>3. Eneo lako</span><span data-en>3. Your location</span></h2>
      <p>
        <span data-sw>
          Tunatumia eneo lako pale tu unaporuhusu, ili kurahisisha kupata huduma karibu nawe.
          Unaweza kuandika anwani kwa mkono badala ya kutumia eneo la moja kwa moja.
        </span>
        <span data-en>
          We use your location only when you allow it, to make it easier to find service near you.
          You can type an address manually instead of using live location.
        </span>
      </p>

      <h2><span data-sw>4. Kushiriki taarifa</span><span data-en>4. Sharing your information</span></h2>
      <p>
        <span data-sw>
          Hatuuzi taarifa zako binafsi. Tunashiriki taarifa muhimu tu (kama eneo na aina ya taka)
          na mkusanyaji uliyekubaliana naye ili huduma ikamilike.
        </span>
        <span data-en>
          We do not sell your personal information. We share only the details needed (such as location and waste type)
          with the collector you agreed with, so the service can be completed.
        </span>
      </p>

      <h2><span data-sw>5. Watoa huduma wa nje</span><span data-en>5. Third-party services</span></h2>
      <p>
        <span data-sw>
          Tunatumia watoa huduma wa kuaminika kwa SMS na barua pepe (kwa mfano Meseji na Resend).
          Wao hupokea taarifa muhimu tu ili kufikisha ujumbe.
        </span>
        <span data-en>
          We use trusted providers for SMS and email (for example Meseji and Resend).
          They only receive the minimum information needed to deliver messages.
        </span>
      </p>

      <h2><span data-sw>6. Usalama</span><span data-en>6. Security</span></h2>
      <p>
        <span data-sw>
          Nywila zimefichwa (encrypted) na miunganiko hutumia usimbaji salama. Hakuna mfumo ulio salama kwa asilimia mia,
          lakini tunachukua hatua za kuridhisha kulinda taarifa zako.
        </span>
        <span data-en>
          Passwords are encrypted and connections use secure encryption. No system is 100% secure,
          but we take reasonable steps to protect your data.
        </span>
      </p>

      <h2><span data-sw>7. Haki zako</span><span data-en>7. Your rights</span></h2>
      <p>
        <span data-sw>
          Una haki ya kuona, kusahihisha au kufuta taarifa zako. Wasiliana nasi kufanya hivyo.
        </span>
        <span data-en>
          You have the right to view, correct, or delete your information. Contact us to do so.
        </span>
      </p>

      <h2><span data-sw>8. Wasiliana</span><span data-en>8. Contact</span></h2>
      <p>
        <span data-sw>Kwa maswali kuhusu faragha, wasiliana nasi kupitia </span>
        <span data-en>For privacy questions, contact us at </span>
        <a href="mailto:info@methynix.com">info@methynix.com</a>.
      </p>
    </div>
  );
}
