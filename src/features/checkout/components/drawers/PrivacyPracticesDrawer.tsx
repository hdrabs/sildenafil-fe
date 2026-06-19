"use client";

import { LegalDrawer } from "./LegalDrawer";

type Props = {
  show: boolean;
  onClose: () => void;
};

export const PrivacyPracticesDrawer = ({ show, onClose }: Props) => {
  return (
    <LegalDrawer show={show} onClose={onClose} title="Notice of Privacy Practices">
      <p className="font-semibold uppercase">
        NOTICE OF PRIVACY PRACTICES – ENJOY HEALTH MEDICAL AFFILIATED COVERED ENTITY
      </p>
      <p className="font-semibold uppercase">
        THIS NOTICE DESCRIBES HOW MEDICAL INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW
        YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.
      </p>
      <p>
        This Notice of Privacy Practices (the "Notice") describes how Enjoy Health Medical, P.A.
        and all members of its Affiliated Covered Entity (collectively, "Enjoy Health Medical," "we"
        or "our") may use and disclose your protected health information to carry out treatment,
        payment or business operations and for other purposes that are permitted or required by law.
        An Affiliated Covered Entity is a group of health care providers under common ownership or
        control that designates itself as a single entity for purposes of compliance with HIPAA.
      </p>
      <p>
        "Protected health information" or "PHI" is information about you, including demographic
        information, that may identify you and that relates to your past, present or future physical
        health or condition, treatment or payment for health care services.
      </p>
      <p>
        <strong className="block mb-1">USES AND DISCLOSURES OF PROTECTED HEALTH INFORMATION:</strong>
        Your protected health information may be used and disclosed by our health care providers,
        our staff, and others outside of our office that are involved in your care and treatment for
        the purpose of providing health care services to you, to support our business operations, to
        obtain payment for your care, and any other use authorized or required by law.
      </p>
      <p>
        <strong className="block mb-1">TREATMENT:</strong>
        We will use and disclose your protected health information to provide, coordinate, or manage
        your health care and any related services. This includes the coordination or management of
        your health care with a third party.
      </p>
      <p>
        <strong className="block mb-1">PAYMENT:</strong>
        Your protected health information may be used to bill or obtain payment for your health care
        services. This may include certain activities that your health insurance plan may undertake
        before it approves or pays for your services, such as: making a determination of eligibility
        or coverage for insurance benefits and reviewing services provided to you for medical
        necessity.
      </p>
      <p>
        <strong className="block mb-1">HEALTH CARE OPERATIONS:</strong>
        We may use or disclose, as needed, your protected health information in order to support the
        business activities of this office. These activities include, but are not limited to,
        improving quality of care, providing information about treatment alternatives or other
        health-related benefits and services, development or maintaining and supporting computer
        systems, legal services, and conducting audits and compliance programs.
      </p>
      <p>
        <strong className="block mb-1">
          USES AND DISCLOSURES THAT DO NOT REQUIRE YOUR AUTHORIZATION:
        </strong>
        We may use or disclose your protected health information in the following situations without
        your authorization: as required by law; for public health purposes; for health care
        oversight purposes; for abuse or neglect reporting; pursuant to Food and Drug Administration
        requirements; in connection with legal proceedings; for law enforcement purposes; to
        coroners, funeral directors and organ donation agencies; for certain research purposes; for
        certain criminal activities; for certain military activity and national security purposes;
        for workers' compensation reporting; and other required uses and disclosures.
      </p>
      <p>
        <strong className="block mb-1">
          USES AND DISCLOSURES THAT REQUIRE YOUR AUTHORIZATION:
        </strong>
        Other permitted and required uses and disclosures will be made only with your consent,
        authorization or opportunity to object unless permitted or required by law. Without your
        authorization, we are expressly prohibited from using or disclosing your protected health
        information for marketing purposes. We may not sell your protected health information
        without your authorization.
      </p>
      <p>
        <strong className="block mb-1">
          YOUR RIGHTS WITH RESPECT TO YOUR PROTECTED HEALTH INFORMATION:
        </strong>
      </p>
      <ul>
        <li>
          You have the right to inspect and copy your protected health information.
        </li>
        <li>
          You may request access to or an amendment of your protected health information.
        </li>
        <li>
          You have the right to request a restriction on the use or disclosure of your protected
          health/personal information.
        </li>
        <li>
          You have the right to request to receive confidential communications from us by
          alternative means or at an alternate location.
        </li>
        <li>
          You have the right to request an amendment of your protected health information.
        </li>
        <li>
          You have the right to receive an accounting of certain disclosures of your protected
          health information.
        </li>
        <li>
          You have the right to obtain a paper copy of this Notice, upon request, even if you have
          previously requested its receipt electronically by e-mail.
        </li>
      </ul>
      <p>
        <strong className="block mb-1">REVISIONS TO THIS NOTICE:</strong>
        We reserve the right to revise this Notice and to make the revised Notice effective for
        protected health information we already have about you as well as any information we receive
        in the future. Any significant changes to this Notice will be posted on our web site.
      </p>
      <p>
        <strong className="block mb-1">BREACH OF HEALTH INFORMATION:</strong>
        We will notify you if a reportable breach of your unsecured protected health information is
        discovered. Notification will be made to you no later than 60 days from the breach discovery
        and will include a brief description of how the breach occurred, the protected health
        information involved and contact information for you to ask questions.
      </p>
      <p>
        <strong className="block mb-1">COMPLAINTS:</strong>
        Complaints about this Notice or how we handle your protected health information should be
        directed to our HIPAA Privacy Officer. If you are not satisfied with the manner in which a
        complaint is handled you may submit a formal complaint to the Department of Health and Human
        Services, Office for Civil Rights by sending a letter to 200 Independence Avenue, S.W.,
        Washington, D.C. 20201, calling 1-877-696-6775, or visiting{" "}
        <a href="https://www.hhs.gov/ocr/privacy/hipaa/complaints/">
          www.hhs.gov/ocr/privacy/hipaa/complaints/
        </a>
        . We will not retaliate against you for filing a complaint.
      </p>
      <p>
        We must follow the duties and privacy practices described in this Notice. We will maintain
        the privacy of your protected health information. If you have any questions about this
        Notice, please contact us at 714-464-7557 and ask to speak with our HIPAA Privacy Officer.
      </p>
    </LegalDrawer>
  );
};
