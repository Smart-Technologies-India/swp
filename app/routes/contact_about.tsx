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
        <h4 className="text-2xl font-bold text-center grow">Contact Us</h4>
      </div>

      <div className="bg-white p-8 shadow rounded-md w-full mt-6">
        <h1 className="text-3xl font-bold">About US</h1>
        <p className="text-lg">
        On the basis of recommendation made by the Department of Industrial Policy and Promotion (DIPP), Ministry of Commerce and Industry, Government of India, the UT Administration of DNH & DD has setup Single Window Agency.
        </p>
        <p className="text-lg mt-2">
          Based at Second Floor, District Secretariat,
          Daman-396191, our platform is dedicated to facilitating transparent
          and efficient citizen services tailored to meet the
          needs of citizens.
        </p>
        <p className="text-lg mt-2">
        Single Window Agency shall accord deemed approvals / clearances / recommendation (as the case may be), in case the concerned approval would be granted by Single Window Agency to the applicant and Responsibility of the Officer/Official shall be fixed for causing delay in providing services in time bound manner & necessary departmental proceeding may be initiated against the concern.
        </p>
        <p className="text-lg mt-2">
          For inquiries or assistance, please don&apos;t hesitate to contact us
          at Second Floor, District Secretariat,
          Daman-396191, or via email at
          dic-dd@nic.in. We&apos;re here to support you in finding the relevant
          government services.
        </p>
        <p className="text-lg mt-2">
          Thank you for choosing Sugam as your trusted partner for
          government citizen services in Daman.
        </p>
        <h1 className="text-3xl font-bold mt-6 mb-4">Contact Us</h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold">
            District Industries Center
          </h2>
          <p className="text-lg">
            Address: Second Floor, District Secretariat,
          Daman-396191.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold">Office Hours:</h2>
          <p className="text-lg">Monday to Friday: 10:00 AM - 5:00 PM</p>
          <p className="text-lg">Saturday and Sunday: Closed</p>
        </section>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold">Email: </h2>
          <p className="text-lg">dic-dd@nic.in</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold">Phone: </h2>
          <p className="text-lg">0260-2260310 / 2260871</p>
          <p className="text-lg">
            For inquiries, assistance , or any other
            concerns, please don&apos;t hesitate to reach out to us via email or
            phone. Our dedicated team at DIC is here to assist you with all
            your government citizen services in Daman.
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
