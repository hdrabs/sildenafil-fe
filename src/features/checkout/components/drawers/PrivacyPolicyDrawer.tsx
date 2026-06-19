"use client";

import { LegalDrawer } from "./LegalDrawer";

type Props = {
  show: boolean;
  onClose: () => void;
};

export const PrivacyPolicyDrawer = ({ show, onClose }: Props) => {
  return (
    <LegalDrawer show={show} onClose={onClose} title="Privacy Policy">
      <p>
        <strong className="block mb-1">1. Introduction</strong>
        This Privacy Policy describes how PocketMed collects and uses Personal Data about you
        through the use of our Website, and through email, text, and other electronic communications
        between you and PocketMed.
      </p>
      <p>
        Tura Health LLC d/b/a PocketMed ("<strong>PocketMed," "we," "our," or "us</strong>")
        respects your privacy, and we are committed to protecting it through our compliance with this
        policy.
      </p>
      <p>
        This Privacy Policy describes the types of information we may collect from you or that you
        may provide when you visit the <a href="https://pocketmed.com/">pocketmed.com</a> website
        and its subdomains (collectively, our "<strong>Website</strong>") and our practices for
        collecting, using, maintaining, protecting, and disclosing that information.
      </p>
      <p>This policy applies to information we collect:</p>
      <ul>
        <li>on our Website;</li>
        <li>by telephone, email, text, and other electronic messages between you and us; and</li>
        <li>
          when you interact with our advertising and applications on third party websites and
          services, if those applications or advertising include links to this policy.
        </li>
      </ul>
      <p>
        <strong>
          Note, PocketMed is not a medical group. Any telemedicine consults obtained through our
          Website are provided by independent medical practitioners including, but not limited to,
          Enjoy Health Medical P.A. and Enjoy Health Medical Group of California P.C. (collectively,
          "Enjoy Health Medical"), independent medical groups with a network of United States based
          health care providers (each, a "Provider"). Enjoy Health Medical is responsible for
          providing you with a Notice of Privacy Practices describing its collection and use of your
          health information, not PocketMed.
        </strong>
      </p>
      <p>
        <strong className="block mb-1">2. Information We Collect About You</strong>
        We collect several types of information from and about users of our Website, including:
      </p>
      <ul>
        <li>
          Information by which you may be personally identified, such as name, postal address, email
          address, telephone number, date of birth, or any other identifier by which you may be
          contacted online or offline ("<strong>personal information</strong>");
        </li>
        <li>
          Information that is about you but individually does not identify you, such as your
          internet connection, the equipment you use to access our Website, and usage details; and
        </li>
        <li>Health information you provide when seeking medical services through our platform.</li>
      </ul>
      <p>
        <strong className="block mb-1">3. How We Collect Your Information</strong>
        We collect this information:
      </p>
      <ul>
        <li>Directly from you when you provide it to us;</li>
        <li>
          Automatically as you navigate through the site (usage details, IP addresses, and
          information collected through cookies, web beacons, and other tracking technologies); and
        </li>
        <li>From third parties, for example, our business partners.</li>
      </ul>
      <p>
        <strong className="block mb-1">4. How We Use Your Information</strong>
        We use information that we collect about you or that you provide to us, including any
        personal information:
      </p>
      <ul>
        <li>To present our Website and its contents to you;</li>
        <li>To provide you with information, products, or services that you request from us;</li>
        <li>To fulfill the purposes for which you provided it;</li>
        <li>
          To carry out our obligations and enforce our rights arising from any contracts entered into
          between you and us;
        </li>
        <li>To notify you about changes to our Website or any products or services we offer;</li>
        <li>
          To allow you to participate in interactive features on our Website; and in any other way
          we may describe when you provide the information.
        </li>
      </ul>
      <p>
        <strong className="block mb-1">5. Disclosure of Your Information</strong>
        We may disclose aggregated information about our users, and information that does not
        identify any individual, without restriction. We may disclose personal information that we
        collect or you provide as described in this privacy policy:
      </p>
      <ul>
        <li>To our subsidiaries and affiliates;</li>
        <li>
          To contractors, service providers, and other third parties we use to support our business;
        </li>
        <li>
          To a buyer or other successor in the event of a merger, divestiture, restructuring,
          reorganization, dissolution, or other sale or transfer of some or all of PocketMed's
          assets;
        </li>
        <li>To fulfill the purpose for which you provide it;</li>
        <li>To comply with any court order, law, or legal process;</li>
        <li>
          To enforce or apply our Terms of Use and other agreements; and if we believe disclosure is
          necessary or appropriate to protect the rights, property, or safety of PocketMed, our
          customers, or others.
        </li>
      </ul>
      <p>
        <strong className="block mb-1">6. Choices About How We Use and Disclose Your Information</strong>
        We strive to provide you with choices regarding the personal information you provide to us.
        You can set your browser to refuse all or some browser cookies, or to alert you when cookies
        are being sent.
      </p>
      <p>
        <strong className="block mb-1">7. Accessing and Correcting Your Information</strong>
        You can review and change your personal information by logging into the Website and visiting
        your account profile page. You may also send us an email at care@pocketmed.com to request
        access to, correct, or delete any personal information that you have provided to us.
      </p>
      <p>
        <strong className="block mb-1">8. Data Security</strong>
        We have implemented measures designed to secure your personal information from accidental
        loss and from unauthorized access, use, alteration, and disclosure. The safety and security
        of your information also depends on you.
      </p>
      <p>
        <strong className="block mb-1">9. Changes to Our Privacy Policy</strong>
        It is our policy to post any changes we make to our privacy policy on this page. If we make
        material changes to how we treat our users' personal information, we will notify you by
        email to the email address specified in your account.
      </p>
      <p>
        <strong className="block mb-1">10. Contact Information</strong>
        To ask questions or comment about this privacy policy and our privacy practices, contact us
        at: care@pocketmed.com or Tura Health LLC d/b/a PocketMed, Attn: Privacy Officer.
      </p>
    </LegalDrawer>
  );
};
