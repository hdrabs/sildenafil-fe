"use client";

import { LegalDrawer } from "./LegalDrawer";

type Props = {
  show: boolean;
  onClose: () => void;
  onOpenPrivacyPolicy?: () => void;
};

export const TermsOfUseDrawer = ({ show, onClose, onOpenPrivacyPolicy }: Props) => {
  const openPrivacy = () => {
    onClose();
    onOpenPrivacyPolicy?.();
  };

  return (
    <LegalDrawer show={show} onClose={onClose} title="Terms of Use">
      <p>
        These terms and conditions of use ("<strong>Terms of Use</strong>") govern your use of our
        online interfaces and properties (e.g., websites and mobile applications) owned and
        controlled by Tura Health LLC d/b/a PocketMed ("<strong>PocketMed</strong>," "
        <strong>we</strong>," "<strong>us</strong>," and "<strong>our</strong>"), including the{" "}
        <a href="/">pocketmed.com</a> website ("<strong>Site</strong>"). PocketMed is a telemedicine
        platform facilitating patient connection to licensed clinicians who will diagnose and treat
        various community based diseases states and ailments with prescription strength, over the
        counter, and cognitive based therapies ("<strong>Services</strong>"). The terms "
        <strong>you</strong>" and "<strong>your</strong>" means you, your dependents if any, and any
        other person accessing your PocketMed Account.
      </p>
      <p>
        <strong>
          Your acceptance of, and compliance with, these Terms of Use is a condition to your use of
          the Site and Services. By clicking "accept", you acknowledge that you have read,
          understand, and accept all terms and conditions contained within these Terms of Use, and
          our{" "}
          <button
            type="button"
            onClick={openPrivacy}
            className="text-blue-600 underline"
          >
            Privacy Policy
          </button>
          . If you do not agree to be bound by these terms, you are not authorized to access or use
          this Site or Services; promptly exit this Site.
        </strong>
      </p>
      <p>
        <strong>Binding Arbitration.</strong> These Terms of Use provide that all disputes between
        you and PocketMed that in any way relate to these Terms of Use or your use of the Site will
        be resolved by BINDING ARBITRATION. ACCORDINGLY, YOU AGREE TO GIVE UP YOUR RIGHT TO GO TO
        COURT (INCLUDING IN A CLASS ACTION PROCEEDING) to assert or defend your rights under these
        Terms of Use. Your rights will be determined by a NEUTRAL ARBITRATOR and NOT a judge or jury
        and your claims cannot be brought as a class action.
      </p>
      <p>
        <strong className="block mb-1">1. Privacy Practices</strong>
        You agree that information provided by you in connection with the Services and Site shall be
        governed by the{" "}
        <button type="button" onClick={openPrivacy} className="text-blue-600 underline">
          PocketMed Privacy Policy
        </button>
        , which is hereby incorporated and made a part of this Agreement.
      </p>
      <p>
        <strong className="block mb-1">
          2. Services Provided - No Medical Care or Advice by PocketMed
        </strong>
        The content of the Site and the Services, including without limitation, text, copy, audio,
        video, photographs, illustrations, graphics, and other visuals, is for informational
        purposes only and does not constitute professional medical advice, diagnosis, treatment, or
        recommendations of any kind by PocketMed. You should always seek the advice of your
        qualified health care professionals with any questions or concerns you may have regarding
        your individual needs and any medical conditions.
      </p>
      <p>
        <strong>Not for Emergencies</strong>
      </p>
      <p>
        <strong>
          IF YOU ARE EXPERIENCING A MEDICAL EMERGENCY, YOU SHOULD DIAL "911" IMMEDIATELY.
        </strong>
      </p>
      <p>
        PocketMed's Site and Services are not for medical emergencies or urgent situations. You
        should not disregard or delay to seek medical advice based on anything that appears or does
        not appear on the Site. If you believe you have an emergency, call 9-1-1 immediately.
      </p>
      <p>
        <strong>Not an Insurance Product</strong>
      </p>
      <p>
        PocketMed is not an insurer. The Services are not insurance products, and the amounts you
        pay to PocketMed is not insurance premiums. If you desire any type of health or other
        insurance, you will need to purchase such insurance separately.
      </p>
      <p>
        <strong className="block mb-1">3. Availability of Services</strong>
        You represent that you are not a person barred from enrolling for or receiving the Services
        under the laws of the United States or other applicable jurisdictions in which you may be
        located. Access to and use of the Site or the Services is limited exclusively to users
        located in States within the United States where the Services are available. Services are not
        available to users located outside the United States.
      </p>
      <p>
        <strong className="block mb-1">4. Ordering and Purchasing of Services</strong>
        In the event a Service is listed at an incorrect price due to typographical error or error in
        pricing information received from a third party, we shall have the right to refuse or cancel
        any orders placed for the Services listed at the incorrect price.
      </p>
      <p>
        <strong className="block mb-1">Online Payments</strong>
        You can purchase the Services on the Site. We accept credit and debit cards issued by U.S.
        banks. You authorize and agree that the payment method you submit may be used automatically
        by PocketMed or its payment processors for any of your responsibilities for payment.
      </p>
      <p>
        <strong className="block mb-1">
          5. Eligibility; Site Access, Security and Restrictions; Passwords
        </strong>
        You agree to fully, accurately, and truthfully create your PocketMed Account ("Account"),
        including but not limited to your name, mailing address, phone number, email address, and
        password. The PocketMed ID or credentials are personal to you, and you are solely
        responsible for maintaining the confidentiality of your PocketMed ID or credentials, and for
        all activities that occur under such PocketMed ID or credentials.
      </p>
      <p>
        <strong className="block mb-1">6. Intellectual Property; Limited License</strong>
        The Site and its content are owned by or licensed to PocketMed, and are protected by
        copyright, trademark, patent, trade secret, and other intellectual property or proprietary
        rights laws.
      </p>
      <p>
        <strong className="block mb-1">7. Accuracy of Information</strong>
        We attempt to ensure that information on this Site is complete, accurate, and current.
        Despite our efforts, the information on this Site may occasionally be inaccurate, incomplete,
        or out of date. We make no representation as to the completeness, accuracy, or currency of
        any information on this Site.
      </p>
      <p>
        <strong className="block mb-1">8. Third Party Links</strong>
        From time to time, this Site may contain links to web sites that are not owned, operated, or
        controlled by PocketMed or its affiliates. PocketMed is not responsible for the privacy
        practices or the content of such websites.
      </p>
      <p>
        <strong className="block mb-1">9. Disclaimer of Warranties</strong>
        THE SITE AND ANY INFORMATION OR CONTENT ON THE SITE ARE PROVIDED "AS IS" AND "AS AVAILABLE"
        WITHOUT ANY WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,
        IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
        NON-INFRINGEMENT.
      </p>
      <p>
        <strong className="block mb-1">10. Limitation of Liability</strong>
        IN NO EVENT WILL POCKETMED, ITS AFFILIATES OR THEIR LICENSORS, SERVICE PROVIDERS,
        EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR ANY INDIRECT, SPECIAL, INCIDENTAL,
        CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SITE
        OR SERVICES.
      </p>
      <p>
        <strong className="block mb-1">11. Dispute Resolution; Arbitration Agreement</strong>
        PLEASE READ THIS SECTION CAREFULLY — IT AFFECTS YOUR LEGAL RIGHTS AND GOVERNS HOW YOU AND
        POCKETMED CAN BRING CLAIMS AGAINST EACH OTHER. This section provides that disputes between
        you and PocketMed will be resolved by binding, individual arbitration.
      </p>
      <p>
        <strong className="block mb-1">12. Governing Law and Jurisdiction</strong>
        These Terms of Use and any disputes arising from your use of the Site or Services will be
        governed by the laws of the State of California, without giving effect to any choice or
        conflict of law provision or rule.
      </p>
      <p>
        <strong className="block mb-1">13. Changes to Terms of Use</strong>
        We may revise and update these Terms of Use from time to time in our sole discretion. All
        changes are effective immediately when we post them, and apply to all access to and use of
        the Site thereafter.
      </p>
      <p>
        <strong className="block mb-1">14. Contact Information</strong>
        Questions or comments about the Site or these Terms may be directed to us at: Tura Health
        LLC d/b/a PocketMed, care@pocketmed.com.
      </p>
    </LegalDrawer>
  );
};
