"use client";

import { LegalDrawer } from "@/components/legal/LegalDrawer";

type Props = {
  show: boolean;
  onClose: () => void;
};

export const TelehealthDrawer = ({ show, onClose }: Props) => {
  return (
    <LegalDrawer show={show} onClose={onClose} title="Telehealth Informed Consent">
      <p>
        Telehealth involves the use of secure electronic communications, information technology, or
        other means to enable a healthcare provider and a patient at different locations to
        communicate and share individual patient health information for the purpose of rendering
        clinical care. This "<strong>Telehealth Informed Consent</strong>" informs the patient ("
        <strong>patient</strong>," "<strong>you</strong>," or "<strong>your</strong>") concerning
        the treatment methods, risks, and limitations of using a telehealth platform.
      </p>
      <p>
        <strong className="block mb-1">Services Provided:</strong>
        Telehealth services offered by Enjoy Health Medical P.A. ("<strong>Group</strong>"), and the
        Group's engaged providers (our "<strong>Providers</strong>" or your "
        <strong>Provider</strong>") may include a patient consultation, diagnosis, treatment
        recommendation, prescription, and/or a referral to in-person care, as determined clinically
        appropriate (the "<strong>Services</strong>").
      </p>
      <p>
        Tura Health LLC does not provide the Services; it performs administrative, payment, and
        other supportive activities for Group and our Providers.
      </p>
      <p>
        <strong className="block mb-1">Electronic Transmissions:</strong>
        The types of electronic transmissions that may occur using the telehealth platform include,
        but are not limited to:
      </p>
      <ul>
        <li>Appointment scheduling;</li>
        <li>
          Completion, exchange, and review of medical intake forms and other clinically relevant
          information between you and your Provider via asynchronous communications, two-way
          interactive audio in combination with store-and-forward communications, and/or two-way
          interactive audio and video interaction;
        </li>
        <li>
          Treatment recommendations by your Provider based upon such review and exchange of clinical
          information;
        </li>
        <li>
          Delivery of a consultation report with a diagnosis, treatment and/or prescription
          recommendations, as deemed clinically relevant;
        </li>
        <li>Prescription refill reminders (if applicable); and/or</li>
        <li>Other electronic transmissions for the purpose of rendering clinical care to you.</li>
      </ul>
      <p>
        <strong className="block mb-1">Expected Benefits:</strong>
      </p>
      <ul>
        <li>
          Improved access to care by enabling you to remain in your preferred location while your
          Provider consults with you. Our telehealth services are available 9am to 6pm hours a day,
          5 days a week.
        </li>
        <li>
          Convenient access to follow-up care. If you need to receive non-emergent follow-up care
          related to your treatment, please contact your Provider by directly sending a message
          through the patient's user account.
        </li>
        <li>More efficient care evaluation and management.</li>
      </ul>
      <p>
        <strong className="block mb-1">Service Limitations:</strong>
      </p>
      <ul>
        <li>
          The primary difference between telehealth and direct in-person service delivery is the
          inability to have direct, physical contact with the patient. Accordingly, some clinical
          needs may not be appropriate for a telehealth visit and your Provider will make that
          determination.
        </li>
        <li>
          <strong>
            OUR PROVIDERS DO NOT ADDRESS MEDICAL EMERGENCIES. IF YOU BELIEVE YOU ARE EXPERIENCING A
            MEDICAL EMERGENCY, YOU SHOULD DIAL 9-1-1 AND/OR GO TO THE NEAREST EMERGENCY ROOM.
            PLEASE DO NOT ATTEMPT TO CONTACT TURA HEALTH LLC, GROUP, OR YOUR PROVIDER. AFTER
            RECEIVING EMERGENCY HEALTHCARE TREATMENT, YOU SHOULD VISIT YOUR LOCAL PRIMARY CARE
            PROVIDER.
          </strong>
        </li>
        <li>
          Our Providers are an addition to, and not a replacement for, your local primary care
          provider. Responsibility for your overall medical care should remain with your local
          primary care provider, if you have one, and we strongly encourage you to locate one if you
          do not.
        </li>
        <li>Group does not have any in-person clinic locations.</li>
      </ul>
      <p>
        <strong className="block mb-1">Security Measures:</strong>
        The electronic communication systems we use will incorporate network and software security
        protocols to protect the confidentiality of patient identification and imaging data and will
        include measures to safeguard the data and to ensure its integrity against intentional or
        unintentional corruption. All the Services delivered to the patient through telehealth will
        be delivered over a secure connection that complies with the requirements of HIPAA.
      </p>
      <p>
        <strong className="block mb-1">Possible Risks:</strong>
      </p>
      <ul>
        <li>
          Delays in evaluation and treatment could occur due to deficiencies or failures of the
          equipment and technologies, or provider availability.
        </li>
        <li>
          In the event of an inability to communicate as a result of a technological or equipment
          failure, please contact the Group at (714) 464-7557 or care@pocketmed.com.
        </li>
        <li>
          In rare events, your Provider may determine that the transmitted information is of
          inadequate quality, thus necessitating a rescheduled telehealth consult or an in-person
          meeting with your local primary care doctor.
        </li>
        <li>
          In very rare events, security protocols could fail, causing a breach of privacy of
          personal medical information.
        </li>
      </ul>
      <p>
        <strong className="block mb-1">Patient Acknowledgments:</strong>
        I further acknowledge and understand the following:
      </p>
      <ol>
        <li>
          Prior to the telehealth visit, I will be given an opportunity to select a provider as
          appropriate, including a review of the provider's credentials.
        </li>
        <li>
          If I am experiencing a medical emergency, I will be directed to dial 9-1-1 immediately
          and my Provider is not able to connect me directly to any local emergency services.
        </li>
        <li>
          I may elect to seek services from a medical group with in-person clinics as an alternative
          to receiving telehealth services.
        </li>
        <li>
          I have the right to withhold or withdraw my consent to the use of telehealth in the course
          of my care at any time without affecting my right to future care or treatment.
        </li>
        <li>
          Federal and state law requires health care providers to protect the privacy and the
          security of health information. I am entitled to all confidentiality protections under
          applicable federal and state laws.
        </li>
        <li>
          Group will take steps to make sure that my health information is not seen by anyone who
          should not see it.
        </li>
        <li>
          Dissemination of any patient identifiable images or information from the telehealth visit
          to researchers or other educational entities will not occur without my affirmative consent.
        </li>
        <li>
          There is a risk of technical failures during the telehealth visit beyond the control of
          Group. I AGREE TO HOLD HARMLESS GROUP AND ITS EMPLOYEES, CONTRACTORS, AGENTS, DIRECTORS,
          MEMBERS, MANAGERS, SHAREHOLDERS, OFFICERS, REPRESENTATIVES, ASSIGNS, PARENTS,
          PREDECESSORS, AND SUCCESSORS FOR DELAYS IN EVALUATION OR FOR INFORMATION LOST DUE TO SUCH
          TECHNICAL FAILURES.
        </li>
        <li>
          In choosing to participate in a telehealth visit, I understand that some parts of the
          Services involving tests (e.g., labs or bloodwork) may be conducted at another location
          such as a testing facility, at the direction of my Provider.
        </li>
        <li>
          Persons may be present during the telehealth visit other than my Provider in order to
          operate the telehealth technologies.
        </li>
        <li>My Provider will explain my diagnosis and its evidentiary basis.</li>
        <li>
          I have the right to request a copy of my medical records by contacting Group at: (714)
          464-7557 or care@pocketmed.com.
        </li>
        <li>
          It is necessary to provide my Provider a complete, accurate, and current medical history.
        </li>
        <li>
          There is no guarantee that I will be issued a prescription and that the decision of
          whether a prescription is appropriate will be made in the professional judgement of my
          Provider.
        </li>
        <li>
          There is no guarantee that I will be treated by a Group provider. My Provider reserves
          the right to deny care for potential misuse of the Services or for any other reason if, in
          the professional judgment of my Provider, the provision of the Services is not medically
          or ethically appropriate.
        </li>
      </ol>
      <p>
        <strong>
          <u>Additional State-Specific Consents:</u>
        </strong>{" "}
        The following consents apply to patients accessing Group's website for the purposes of
        participating in a telehealth consultation as required by the states listed below:
      </p>
      <p>
        <strong>
          <u>Iowa:</u>
        </strong>{" "}
        I have been informed that if I want to register a formal complaint about a provider, I
        should visit the medical board's website,{" "}
        <a href="https://medicalboard.iowa.gov/consumers/filing-complaint">here</a>.
      </p>
      <p>
        <strong>
          <u>Idaho:</u>
        </strong>{" "}
        I have been informed that if I want to register a formal complaint about a provider, I
        should visit the medical board's website,{" "}
        <a href="https://bom.idaho.gov/BOMPortal/AgencyAdditional.aspx?Agency=425&AgencyLinkID=650">
          here
        </a>
        .
      </p>
      <p>
        <strong>
          <u>Indiana:</u>
        </strong>{" "}
        I have been informed that if I want to register a formal complaint about a provider, I
        should visit the medical board's website,{" "}
        <a href="https://www.in.gov/attorneygeneral/consumer-protection-division/file-a-complaint/consumer-complaint/">
          here
        </a>
        .
      </p>
      <p>
        <strong>
          <u>Kentucky:</u>
        </strong>{" "}
        I have been informed that if I want to register a formal complaint about a provider, I
        should visit the medical board's website,{" "}
        <a href="https://kbml.ky.gov/grievances/Pages/default.aspx">here</a>.
      </p>
      <p>
        <strong>
          <u>Maine:</u>
        </strong>{" "}
        I have been informed that if I want to register a formal complaint about a provider, I
        should visit the medical board's website,{" "}
        <a href="https://www.maine.gov/md/discipline/file-complaint.html">here</a>.
      </p>
      <p>
        <strong>
          <u>Oklahoma:</u>
        </strong>{" "}
        I have been informed that if I want to register a formal complaint about a provider, I
        should visit the medical board's website,{" "}
        <a href="https://www.okmedicalboard.org/complaint">here</a>; Or, the Oklahoma Board of
        Osteopathic Examiners' website, <a href="https://www.ok.gov/osboe/faqs.html">here</a>.
      </p>
      <p>
        <strong>
          <u>Texas:</u>
        </strong>{" "}
        I have been informed of the following notice: NOTICE CONCERNING COMPLAINTS — Complaints
        about physicians, as well as other licensees and registrants of the Texas Medical Board may
        be reported for investigation at: Texas Medical Board, Attention: Investigations, 333
        Guadalupe, Tower 3, Suite 610, P.O. Box 2018, MC-263, Austin, Texas 78768-2018. Telephone:
        1-800-201-9353.{" "}
        <a href="https://www.tmb.state.tx.us">www.tmb.state.tx.us</a>.
      </p>
      <p>
        <strong>
          <u>Vermont:</u>
        </strong>{" "}
        I have been informed that if I want to register a formal complaint about a provider, I
        should visit the medical board's website,{" "}
        <a href="https://www.healthvermont.gov/health-professionals-systems/board-medical-practice/file-complaint">
          here
        </a>
        ; Or, the Vermont Board of Osteopathic Examiners' website,{" "}
        <a href="https://www.sec.state.vt.us/professional-regulation/file-a-complaint-employer-mandatory-reporting.aspx">
          here
        </a>
        .
      </p>
    </LegalDrawer>
  );
};
