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
          Refund and Cancellation Policy
        </h4>
      </div>

      <div className="bg-white p-8 shadow rounded-md w-full mt-3">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. Cancellation by Citizen
          </h2>
          <p className="text-lg">
            Citizen may request to cancel their services for Sugam Services
            listed on Sugam Web Portal under certain conditions. Cancellation
            requests must be submitted in writing to relevant Department for
            review and approval.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Refund Eligibility</h2>
          <p className="text-lg">
            Refunds for cancelled services are subject to the terms outlined in
            the rule book and applicable laws and regulations. The relevant
            Department reserves the right to assess each cancellation request on
            a case-by-case basis to determine refund eligibility.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Cancellation Fees</h2>
          <p className="text-lg">
            Depending on the terms of the service, citizen may be subject to
            cancellation fees in the event of a cancelled service agreement.
            Cancellation fees, if applicable, will be deducted from any refund
            issued to the citizen.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Cancellation by Department
          </h2>
          <p className="text-lg">
            In the event that a service becomes unavailable due to unforeseen
            circumstances or other reasons, department reserves the right to
            cancel the Service. In such cases, citizen will be notified
            promptly, and any payments already made will be refunded in full.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Processing Time</h2>
          <p className="text-lg">
            Refunds for cancelled services will be processed within a reasonable
            timeframe, subject to administrative procedures and banking
            processing times. The department will make every effort to expedite
            the refund process and keep tenants informed of the status of their
            refund.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            6. Non-Refundable Fees
          </h2>
          <p className="text-lg">
            Certain fees, such as administrative fees or processing fees, may be
            non-refundable in the event of a cancelled service. These fees will
            be clearly outlined in the service or communicated to the citizen at
            the time of cancellation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Refund Method</h2>
          <p className="text-lg">
            Refunds for cancelled service will be issued using the same payment
            method originally used by the citizen for service payments, unless
            otherwise agreed upon by both parties.
          </p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Contact Us</h2>
          <p className="text-lg">
            For inquiries regarding refunds and cancellations, citizen can
            contact relevant department at the provided contact information. Our
            team is dedicated to assisting tenants and resolving any issues
            related to refunds and cancellations in a timely manner.Contact via
            E-mail:dic-dd@nic.in
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
