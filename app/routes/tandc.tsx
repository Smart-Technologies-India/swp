"use client";
import { useNavigate } from "@remix-run/react";
import type { SVGProps } from "react";
const TermAndConditionPage = () => {
  const navigator = useNavigate();

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-4">
      <div className="bg-white shadow rounded-md w-full flex gap-6 px-6 py-2 items-center">
        <Fa6SolidArrowLeftLong
          className="cursor-pointer"
          onClick={() => navigator("/")}
        />
        <h4 className="text-xl font-semibold text-center grow">
          Terms and Conditions
        </h4>
      </div>

      <div className="bg-white p-8 shadow rounded-md w-full mt-3">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Scope of Service</h2>
          <p className="text-lg">
            Sugam, operated by the District Industries Center
            (DIC) of Daman, provides a platform exclusively for
            accessing government-owned rental properties within the territory.
            By using our services, you agree to abide by the terms outlined
            herein.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
          <p className="text-lg">
            Users must be at least 18 years old and legally capable of entering
            into binding contracts to access and use our services. Government
            agencies and authorized personnel are eligible to list and rent
            government-owned properties through our platform.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Application Purpose</h2>
          <p className="text-lg">
          On the basis of recommendation made by the Department of Industrial Policy and Promotion (DIPP), Ministry of Commerce and Industry, Government of India, the UT Administration of DNH & DD has setup Single Window Agency.
          Single Window Agency shall accord deemed approvals / clearances / recommendation (as the case may be), in case the concerned approval would be granted by Single Window Agency to the applicant and Responsibility of the Officer/Official shall be fixed for causing delay in providing services in time bound manner & necessary departmental proceeding may be initiated against the concern.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. User Responsibilities
          </h2>
          <p className="text-lg">
            Users are solely responsible for the accuracy and legality of the
            information provided during registration and property listings. DIC reserves the right to verify user information and take
            appropriate action in case of inaccuracies or violations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Privacy Policy</h2>
          <p className="text-lg">
            By using our services, you consent to the collection, processing,
            and storage of personal data as outlined in our Privacy Policy. We
            are committed to protecting user privacy and complying with data
            protection laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            7. Intellectual Property
          </h2>
          <p className="text-lg">
            All content, including but not limited to logos, trademarks, and
            textual content, displayed on Sugam is the property of DIC
             or its licensors and is protected by intellectual property laws.
            Unauthorized use or reproduction of content is strictly prohibited.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            8. Limitation of Liability
          </h2>
          <p className="text-lg">
            Sugam strives to provide accurate and reliable information
            but does not guarantee the completeness, accuracy, or reliability of
            content on the platform. Users agree to use our services at their
            own risk and acknowledge that PDA DNH shall not be liable for any
            direct, indirect, or consequential damages arising from the use of
            our platform.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
          <p className="text-lg">
            These Terms and Conditions are governed by the laws of the Union
            Territory of Daman. Any disputes
            arising from the use of Sugam shall be subject to the
            exclusive jurisdiction of the courts in Daman.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            10. Updates and Modifications
          </h2>
          <p className="text-lg">
            DIC reserves the right to update or modify these Terms and
            Conditions at any time without prior notice. Users are responsible
            for regularly reviewing the Terms and Conditions to stay informed of
            any changes.
          </p>
          <p className="text-lg my-4">
            By accessing and using PDA DNH RENT, you agree to comply with these
            Terms and Conditions. If you do not agree with any part of these
            terms, please refrain from using our services.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermAndConditionPage;

export function Fa6SolidArrowLeftLong(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 512 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H109.3l73.4-73.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-128 128z"
      ></path>
    </svg>
  );
}
