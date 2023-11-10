import { Link } from "@remix-run/react";
import { SVGProps, useLayoutEffect, useRef, useState } from "react";
import {
  ClarityCertificateSolid,
  Fa6SolidMoon,
  Fa6SolidSun,
  MaterialSymbolsFramePerson,
  MaterialSymbolsLockOpen,
  MdiMessageTextLock,
} from "~/components/icons/icons";
import gsap from "gsap";

const Home: React.FC = (): JSX.Element => {
  const [isDark, setIsDark] = useState<boolean>(false);

  const links = [
    {
      name: "Notification for Town and Planning Board Constitution",
      link: "#",
    },
    {
      name: "Development Control Rules (Amendment) 2016",
      link: "#",
    },
    {
      name: "Order regarding Storage of Construction Material",
      link: "#",
    },
    {
      name: "Order regarding Inspection Based on Risk Assessment",
      link: "#",
    },
    {
      name: "Notification Rates for Landuse development charge",
      link: "#",
    },
    {
      name: "Joint Inspection Order in EODB",
      link: "#",
    },
    {
      name: "Order regarding Construction Permission Validity expiring on or after 25/03/2020 are hereby extended upto 31/03/2021",
      link: "#",
    },
    {
      name: "Regional Plan of Daman 2001",
      link: "#",
    },
    {
      name: "Fee for Various Permissions and Recommendations",
      link: "#",
    },
    {
      name: "Daman Extension of Ribbon Development to National Highways, Rules 2020",
      link: "#",
    },
    {
      name: "Draft Notification for ROWs and road categories for Daman",
      link: "#",
    },
    {
      name: "Checklist For Grant Of Part Occupancy Certificate And Full Occupancy Certificate",
      link: "#",
    },
    {
      name: "Checklist For Grant Of Part Occupancy Certificate And Full Occupancy Certificate",
      link: "#",
    },
    {
      name: "Outline Development Plan - ODP - P1",
      link: "#",
    },
    {
      name: "Outline Development Plan - ODP - P2",
      link: "#",
    },
    {
      name: "Daman Development Control Rules, 2014",
      link: "#",
    },
    {
      name: "Daman Ribbon Development Rules, 2019",
      link: "#",
    },
    {
      name: "Publish Draft Ribbon Development Rules fixing Road Boundary",
      link: "#",
    },
    {
      name: "Report of Construction Permission granted",
      link: "#",
    },
    {
      name: "Qualification required for Registration of Architect and Engineers",
      link: "#",
    },
    {
      name: "Responsibility of Architects & Engineers",
      link: "#",
    },
    {
      name: "Authorization of Architect for Completion Certificate",
      link: "#",
    },
    {
      name: "Inspection Reports to be submitted online within 24 Hrs",
      link: "#",
    },
    {
      name: "Computerized Inspector Allocation",
      link: "#",
    },
    {
      name: "Computerized System for identifying building/ area that needs to be inspected based on risk factor",
      link: "#",
    },
    {
      name: "Risk based classification of all kind of buildings",
      link: "#",
    },
    {
      name: "Conflict resolution mechanism for land and construction permission",
      link: "#",
    },
    {
      name: "Time line for Construction Permission/ during construction/ Occupancy Certificate",
      link: "#",
    },
    {
      name: "Undertaking To Be Submitted By Applicant For Height Relaxation",
      link: "#",
    },
    {
      name: "Site Inspection Report of Construction Permission granted",
      link: "#",
    },
    {
      name: "Site Inspection Report of Occupancy Certificate.",
      link: "#",
    },
    {
      name: "Order regarding Construction Permission under the EoDB.",
      link: "#",
    },
    {
      name: "Checklist for Building Plan Approval (Construction Permission).",
      link: "#",
    },
    {
      name: "Checklist of Layout Approval for Residential and Industrial Purpose.",
      link: "#",
    },
    {
      name: "Performa for Full/Part Occupancy Certificate.",
      link: "#",
    },
    {
      name: "Real Estate Regulation Act.",
      link: "#",
    },
    {
      name: "Planning and Development Authority - Circular regarding EoDB 2017.",
      link: "#",
    },
    {
      name: "PWD Civil Division - Circular regarding EoDB 2017.",
      link: "#",
    },
  ];

  const downloads = [
    {
      name: "DCR for Daman",
      link: "./assets/doc1.pdf",
    },
    {
      name: "DNH & DD TCP ACT 1974 (amm. 2022)",
      link: "./assets/doc2.pdf",
    },
    {
      name: "PDA Daman Rules 2011",
      link: "./assets/doc3.pdf",
    },
    {
      name: "Regional Plan 2005-2021",
      link: "./assets/doc4.pdf",
    },
    {
      name: "Ribbon Development rules for SH, MDR, ODR & VR for DD",
      link: "./assets/doc5.pdf",
    },
  ];

  const pandr = [
    {
      name: "Construction Permission of last two years",
      link: "https://daman.nic.in/construction-permission.aspx",
    },
    {
      name: "Inspection Report For Construction Permission of last two years",
      link: "https://daman.nic.in/inspection-construction.aspx",
    },
    {
      name: "Inspection Report for Occupancy Certificate of last two years",
      link: "https://daman.nic.in/inspection-occupancy.aspx",
    },
  ];

  const easeofdoing = [
    {
      name: "Procedure and check list of documents for obtaining Construction Permission.",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2021/1490.pdf",
    },
    {
      name: "Procedure and check list of documents for obtaining Plinth Level Certificate.",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2021/1491.pdf",
    },
    {
      name: "Procedure and check list of documents for obtaining occupancy Certificate.",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2021/1492.pdf",
    },
    {
      name: "Order Regarding Time line for Construction Permission, Plinth Level inspection and occupancy certificate.",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2021/1402.pdf",
    },
    {
      name: "Order Regarding update details in respect of Construction Permission, Plinth Level inspection and occupancy certificate.",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2021/1403.pdf",
    },
    {
      name: "Order Regarding inspections shell be limited to the check list.",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2021/1404.pdf",
    },
    {
      name: "Order Regarding update online submission of inspection report.",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2021/1405.pdf",
    },
    {
      name: "Order Regarding Citizen Charter.",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2021/1493.pdf",
    },
    {
      name: "Certificate of undertaking of registered Architect/Engineer/Sttuctural Engineer.",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2021/Annexure-4.pdf",
    },
    {
      name: "Scrutiny Fees for building plans Approval.",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2021/TP.pdf",
    },
    {
      name: "Charges for stacking of construction material on public road and within construction site in daman district.",
      link: "https://daman.nic.in/downloads/2021/1522-20-01-2021.pdf",
    },
    {
      name: "Notification Revised Regional Plan of Daman, 2005.",
      link: "https://daman.nic.in/downloads/2021/Notification%20Revised%20Regional%20Plan%20of%20Daman.pdf",
    },
    {
      name: "Legal Basis for Various Services Provided By PDA.",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2021/75-28-01-2021.pdf",
    },
  ];

  const downloadstwo = [
    {
      name: "Order of Town & Country Planning regarding Daman and Diu Town and Country Planning Board Constituted.",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2022/06-18-01-2022.pdf",
    },
    {
      name: "Order regarding Constitution of the PDA, Daman.",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2021/437-26-11-2021.pdf",
    },
    {
      name: "Order of time line of various services.",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2021/355-08-09-2021.pdf",
    },
    {
      name: "Press note regarding Public Hearing.",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2021/50-03-05-2021.pdf",
    },
    {
      name: "Notification regarding the Planning Development Rules.",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2020/43-26-06-2020.pdf",
    },
    {
      name: "Circular regarding Filling up the post of Junior Town Planner under the Administration of Daman & Diu by Transfer on Deputation (including Short term Contract/ Transfer)",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2018/06-03-04-2018.pdf",
    },
    {
      name: "Notification regarding change in constitution of Daman and Diu Town and Country Planning Board",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2018/1110-16-03-2018.pdf",
    },
    {
      name: "Circular regarding Qualification required for Registration of Architects, Engineers and Structural Engineer",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2017/689-31-10-2017.pdf",
    },
    {
      name: "Risk-based classification of all kinds of buildings",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2017/693-24-10-2017.pdf",
    },
    {
      name: "Joint Site inspection by all concerned Departments for granting Construction Permission",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2017/692-24-10-2017.pdf",
    },
    {
      name: "Time line for Construction Permission/during construction/Occupancy Certificate",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2017/691-24-10-2017.pdf",
    },
    {
      name: "Conflict resolution mechanism for land and construction permission",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2017/690-24-10-2017.pdf",
    },
    {
      name: "Qualification of Architect, Engineer, and Structural permission",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2017/689-24-10-2017.pdf",
    },
    {
      name: "Computerized Inspector Allocation",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2017/688-24-10-2017.pdf",
    },
    {
      name: "Inspection Reports to be submitted online within 24 Hrs",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2017/687-24-10-2017.pdf",
    },
    {
      name: "Computerized System for identifying building/area that needs to be inspected based on the risk factor",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2017/686-24-10-2017.pdf",
    },
    {
      name: "List of Services and timelines of the Services Provided by Town and Country Planning Department, Daman",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2017/TCPDD.pdf",
    },
    {
      name: "Order regarding modification of the order pertaining to the composition of PDA",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2017/795-18-01-2017.pdf",
    },
    {
      name: "Order regarding re-constitution of the Planning and Development Authority for Daman District",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2016/749-16-12-2016.pdf",
    },
    {
      name: "Order regarding constitution of the Planning and Development Authority for Diu District",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2016/748-16-12-2016.pdf",
    },
    {
      name: "Order regarding declaring the Planning area of Diu for the purpose of the Act",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2016/747-16-12-2016.pdf",
    },
    {
      name: "Development Control Rules for Daman District",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2016/DD-Development-Control-Rules-2007.pdf",
    },
    {
      name: "Notification - 26/10/2015",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/747-27-10-2015.pdf",
    },
    {
      name: "Notification: The Planning and Development Authority Rules 2011",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/2020/726-03-01-2012.pdf",
    },
    {
      name: "Public Notice - 25/02/2010",
      link: "https://daman.nic.in/notifications/2010/jtp_daman/25-02-2010-695.pdf",
    },
    {
      name: "Advertisement for Driver on Daily Wages",
      link: "https://daman.nic.in/jobs/Driver_ATP.pdf",
    },
    {
      name: "Circular for filling up post of Junior Town Planner",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/224-22-06-2012.pdf",
    },
    {
      name: "Order Regarding ground elevation data",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/Ground%20Elevation%20Data.rar",
    },
    {
      name: "Special Building Regulation",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/Special%20Buildings%20Regulation.rar",
    },
    {
      name: "Prescribed Annexure-2,3,4,5 of DCR",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/Prescribed%20Format%20of%20Annexures.rar",
    },
    {
      name: "Office Memorandum on Vertical Development",
      link: "https://daman.nic.in/websites/town_country_planning_department_daman/documents/Office%20Memorandum%20On%20Vertical%20Development.pdf",
    },
  ];

  const header = useRef<HTMLElement | null>(null);

  const [menu, setMenu] = useState<boolean>(false);
  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".home >  .ele", {
        opacity: 0,
        duration: 1,
        y: 100,
        stagger: {
          from: "start",
          amount: 0.5,
        },
      });

      gsap.from(header.current, {
        opacity: 0,
        duration: 1,
        y: -50,
      });
    });
  }, []);

  return (
    <div className={`${isDark ? "dark" : ""}`}>
      <main className="min-h-screen w-full relative">
        <img
          src="/images/banner.jpeg"
          alt="error"
          className="inline-block w-full h-screen absolute top-0 left-0 object-cover object-bottom"
        />

        <div className="absolute top-0 left-0 h-screen w-full bg-black bg-opacity-20 p-20 grid items-center justify-start">
          <div className="home">
            <h1 className="ele text-white lato font-medium text-4xl mt-20 leading-tight font-sans">
              Shaping Tomorrow,
              <br />
              Building Today
            </h1>
            <p className="ele text-white text-xl mt-4 font-sans">
              Partner with the leading goverment authority for planning and
              <br /> development in Daman and Diu.
            </p>
            <Link
              to={"/mobilelogin/"}
              className="ele bg-blue-500  font-medium text-center text-lg py-1 px-4 text-black rounded-md mallanna tracking-wide mt-4 inline-block"
            >
              Login
            </Link>
          </div>
        </div>

        <header
          ref={header}
          className="fixed top-0 left-0 w-full py-4 gap-4 bg-[#012348] flex flex-col md:flex-row px-8 items-center z-50"
        >
          <p className="font-medium text-xl text-white font-sans">
            PLANNING & DEVELOPMENT AUTHORITY
          </p>
          <div className="hidden md:block grow"></div>
          <div className="shrink-0 flex gap-4">
            <Link
              to={"/mobilelogin/"}
              className="bg-blue-500  font-medium text-center text-lg py-1 px-4 text-white mallanna tracking-wide flex items-center gap-2 rounded-xl"
            >
              <p>Login</p>
              <MaterialSymbolsLockOpen></MaterialSymbolsLockOpen>
            </Link>
            {/* <a
              href={"http://77.75.120.70:8073"}
              className="bg-cyan-500  font-medium text-center text-lg py-1 px-4 text-white mallanna tracking-wide"
            >
              Architect Login
            </a> */}
            {/* <div className="w-16 h-8 bg-white rounded-full p-1">
              <div
                className={`text-xl grid place-items-center h-6 w-6 rounded-full text-yellow-500 dark:text-[#1f1f1f] transition-all duration-500 cursor-pointer ${
                  isDark ? "translate-x-8" : "translate-x-0"
                }`}
                onClick={() => setIsDark((val) => !val)}
              >
                {isDark ? <Fa6SolidMoon /> : <Fa6SolidSun />}
              </div>
            </div> */}
          </div>
        </header>
      </main>

      <section className="py-20 grid place-items-center bg-[#eeeeee] dark:bg-[#1f1f1f]">
        <h1 className="text-3xl text-gray-800 mb-10">About Us</h1>
        <div className="w-4/6">
          <p className="text-gray-800 dark:text-white text-center text-2xl font-sans">
            {" "}
            The Planning and Development Authority Daman (PDA Daman) is a
            statutory body constituted under Section 20 Daman & Diu Town and
            Country Planning (Amendment) Regulation, 1999 (Principal Act- Goa,
            Daman and Diu Town and Country Planning Act, 1974) in the year 2012.
          </p>
          <p className="text-gray-800 dark:text-white text-center text-2xl mt-10 font-sans">
            {" "}
            The whole area of Daman district (except area of designated reserved
            forests and area under the Jurisdiction of Coast Guard Authority)
            has been declared as planning area under section 18 of the Act in
            the year 2011.
          </p>
        </div>
      </section>

      {/* <section className="bg-white dark:bg-[#252525] sm:p-20 p-6">
        <div className="flex justify-between gap-6 flex-col lg:flex-row">

          <div className=" flex-1 mt-8 lg:mt-0">
            <h3 className="text-3xl text-gray-800 dark:text-gray-300 font-medium lato mb-4">Downloads</h3>
            <div className="h-[450px] overflow-y-scroll no-scrollbar">
              {downloads.map((val: any, index: number) => {
                return (
                  <div key={index} className="flex items-center gap-x-2 bg-[#eeeeee] dark:bg-[#191919] rounded-lg my-2 py-1 px-4">
                    <Link target="_blank" to={val.link} className="flex hover:underline text-gray-800 dark:text-gray-300 text-xl font-medium mallanna">	&#x25C7; {val.name}</Link>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex-1  mt-8 lg:mt-0">
            <h3 className="text-3xl text-gray-800 dark:text-gray-300 font-medium lato mb-4">Latest News & Updates
            </h3>
            <div className="h-[450px] overflow-y-scroll">
              {links.map((val: any, index: number) => {
                return (
                  <div key={index} className="flex items-center gap-x-2 bg-[#eeeeee] dark:bg-[#191919] rounded-lg my-2 py-1 px-4">
                    <Link target="_blank" to={val.link} className="flex hover:underline text-gray-800 dark:text-gray-300 text-xl font-medium mallanna">	&#x25C7; {val.name}</Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section> */}

      <section className="bg-[#eeeeee] dark:bg-[#252525] p-10 flex flex-col md:flex-row items-center md:justify-evenly">
        <div className="w-80 md:w-96 p-8">
          <div className="grid place-items-center">
            <MdiMessageTextLock className="text-5xl text-gray-800 dark:text-gray-300 text-center"></MdiMessageTextLock>
          </div>
          <p className="text-gray-800 dark:text-gray-300 text-center text-3xl font-semibold mt-10 font-sans">
            Application
          </p>
        </div>
        <div className="w-80 md:w-96 p-8">
          <div className="grid place-items-center">
            <MaterialSymbolsFramePerson className="text-5xl text-gray-800 dark:text-gray-300 text-center"></MaterialSymbolsFramePerson>
          </div>
          <p className="text-gray-800 dark:text-gray-300 text-center text-3xl font-semibold mt-10 font-sans">
            Verification
          </p>
        </div>
        <div className="w-80 md:w-96 p-8">
          <div className="grid place-items-center">
            <ClarityCertificateSolid className="text-5xl text-gray-800 dark:text-gray-300 text-center"></ClarityCertificateSolid>
          </div>
          <p className="text-gray-800 dark:text-gray-300 text-center text-3xl font-semibold mt-10 font-sans">
            Certificate
          </p>
        </div>
      </section>
      <section className="bg-white dark:bg-[#2e2e2e] p-20">
        <h1 className="text-gray-800 dark:text-gray-300 text-4xl font-semibold mt-10 font-sans text-center lg:text-left">
          Services
        </h1>
        {/* <div className="gap-6 mt-6 flex-col lg:flex-row relative items-center justify-between align-middle place-items-center grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3"> */}
        {/* <div className="gap-4 mt-6 flex-col lg:flex-row relative items-center justify-around flex flex-wrap"> */}
        <div className="gap-4 mt-6  relative items-center justify-around grid grid-cols-6">
          <div className="h-80 rounded-xl relative overflow-hidden group">
            <img
              src="/images/one.jpeg"
              alt="service one"
              className="w-full h-full absolute top-0 left-0 object-cover object-center rounded-xl"
            />
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 p-2 rounded-b-xl h-20 hover:h-full grid place-items-center">
              <div>
                <h1 className="text-gray-300 text-xl font-semibold font-sans text-center">
                  Construction
                  <br /> permission
                </h1>
                <p className="text-gray-300 text-center text-sm font-semibold font-sans mt-4">
                  Secure legal authorization swiftly for your projects through
                  our portal. Hassle-free
                </p>
              </div>
            </div>
          </div>

          <div className="h-80 rounded-lg relative overflow-hidden group">
            <img
              src="/images/forth.jpg"
              alt="service three"
              className="w-full h-full absolute top-0 left-0 object-cover object-center rounded-xl bg-[#e4f3fa]"
            />
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 p-2 rounded-b-xl h-20 hover:h-full grid place-items-center">
              <div>
                <h1 className="text-gray-300 text-xl font-semibold font-sans text-center">
                  Plinth
                  <br /> Inspection
                </h1>
                <p className="text-gray-300 text-center text-sm font-semibold font-sans mt-4">
                  Apply for plinth inspections online. Ensure your project's
                  foundation is stable and secure.{" "}
                </p>
              </div>
            </div>
          </div>
          <div className="h-80 rounded-lg relative overflow-hidden group">
            <img
              src="/images/two.jpeg"
              alt="service two"
              className="w-full h-full absolute top-0 left-0 object-cover object-center rounded-xl"
            />
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 p-2 rounded-b-xl h-20 hover:h-full grid place-items-center">
              <div>
                <h1 className="text-gray-300 text-xl font-semibold font-sans text-center">
                  Occupancy <br />
                  certificate
                </h1>
                <p className="text-gray-300 text-center text-sm font-semibold font-sans mt-4">
                  Obtain your occupancy certificate online. Ensure your property
                  is compliant with regulations for safe and legal occupation.
                </p>
              </div>
            </div>
          </div>
          <div className="h-80 rounded-lg relative overflow-hidden group">
            <img
              src="/images/zone.jpeg"
              alt="service two"
              className="w-full h-full absolute top-0 left-0 object-cover object-center rounded-xl"
            />
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 p-2 rounded-b-xl h-20 hover:h-full grid place-items-center">
              <h1 className="text-gray-300 text-xl font-semibold font-sans text-center">
                Zone
                <br /> Information
              </h1>
              <p className="text-gray-300 text-center text-sm font-semibold font-sans mt-4">
                Get detailed zoning data for informed decisions.{" "}
              </p>
            </div>
          </div>
          <div className="h-80 rounded-lg relative overflow-hidden group">
            <img
              src="/images/three.jpeg"
              alt="service three"
              className="w-full h-full absolute top-0 left-0 object-cover object-center rounded-xl"
            />
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 p-2 rounded-b-xl h-20 hover:h-full grid place-items-center">
              <div>
                <h1 className="text-gray-300 text-xl font-semibold font-sans text-center">
                  Old copy
                  <br /> Service
                </h1>
                <p className="text-gray-300 text-center text-sm font-semibold font-sans mt-4">
                  Access old Maps, OC, and CP easily. Government portal for
                  quick historical document retrieval.
                </p>
              </div>
            </div>
          </div>
          <div className="h-80 rounded-xl relative overflow-hidden group">
            <img
              src="/images/rti.jpeg"
              alt="service one"
              className="w-full h-full absolute top-0 left-0 object-cover object-center rounded-xl"
            />
            <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-70 p-2 rounded-b-xl h-20 hover:h-full grid place-items-center">
              <div>
                <h1 className="text-gray-300 text-xl font-semibold font-sans text-center">
                  RTI <br />
                  Service
                </h1>
                <p className="text-gray-300 text-center text-sm font-semibold font-sans mt-4">
                  Access information through Right to Information Act.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-[#252525] sm:p-20 p-6">
        <h3 className="text-3xl text-gray-800 dark:text-gray-300 font-medium lato mb-4">
          Permissions and Reports
        </h3>
        <div className="overflow-y-scroll no-scrollbar">
          {pandr.map((val: any, index: number) => {
            return (
              <div
                key={index}
                className="flex items-center gap-x-2 bg-[#eeeeee] dark:bg-[#191919] rounded-lg my-2 py-1 px-4"
              >
                <Link
                  target="_blank"
                  to={val.link}
                  className="flex hover:underline text-gray-800 dark:text-gray-300 text-xl font-medium mallanna"
                >
                  {" "}
                  &#x25C7; {val.name}
                </Link>
              </div>
            );
          })}
        </div>
        <h3 className="text-3xl text-gray-800 dark:text-gray-300 font-medium lato mb-4 mt-8">
          Ease of Doing Business(EODB)
        </h3>
        <div className="h-[450px] overflow-y-scroll no-scrollbar">
          {easeofdoing.map((val: any, index: number) => {
            return (
              <div
                key={index}
                className="flex items-center gap-x-2 bg-[#eeeeee] dark:bg-[#191919] rounded-lg my-2 py-1 px-4"
              >
                <Link
                  target="_blank"
                  to={val.link}
                  className="flex hover:underline text-gray-800 dark:text-gray-300 text-xl font-medium mallanna"
                >
                  {" "}
                  &#x25C7; {val.name}
                </Link>
              </div>
            );
          })}
        </div>
        <h3 className="text-3xl text-gray-800 dark:text-gray-300 font-medium lato mb-4 mt-8">
          Downloads
        </h3>
        <div className="h-[450px] overflow-y-scroll no-scrollbar">
          {downloadstwo.map((val: any, index: number) => {
            return (
              <div
                key={index}
                className="flex items-center gap-x-2 bg-[#eeeeee] dark:bg-[#191919] rounded-lg my-2 py-1 px-4"
              >
                <Link
                  target="_blank"
                  to={val.link}
                  className="flex hover:underline text-gray-800 dark:text-gray-300 text-xl font-medium mallanna"
                >
                  {" "}
                  &#x25C7; {val.name}
                </Link>
              </div>
            );
          })}
        </div>
      </section>
      {/* <section className="bg-[#191919] px-20 py-32">
        <div className="flex gap-6 md:flex-row flex-col">
          <div className="md:order-1 order-2">
            <p className="text-white text-left text-2xl mt-10 font-sans"> The whole area of Daman district (except area of designated reserved forests and area I consider this a matter of great pride and priviledge that I have been bestowed with the opportunity to serve as the Administrator of the glorious, abundantly resourceful and strikingly beautiful region of Union Territories of Daman, Diu and Dadra and Nagar Haveli
            </p>
            <p className="text-white font-medium text-left text-3xl font-sans mt-4">Praful K. Patel</p>
          </div>
          <img src="./images/avatar.png" alt="avatar" className="shrink-0 w-60 h-80 object-cover bg-white rounded-xl md:order-2 order-1" />
        </div>
      </section> */}
      <section className="bg-[#fefefe] dark:bg-[#1f1f1f] p-10 sm:p-20">
        <div className="flex xl:items-center items-start justify-between gap-6 flex-col xl:flex-row">
          <div className="shrink-0">
            <h1 className="text-gray-800 dark:text-white font-medium text-left text-2xl font-sans mt-4">
              Location
            </h1>
            <p className="text-gray-800 dark:text-white font-medium text-left text-lg font-sans mt-2">
              Office of the Collector & District Magistrate <br />
              Bhitwadi Road, Municipal Market, Dholar,
              <br /> Moti Daman, Daman,
              <br />
              Daman and Diu and Dadra and Nagar Haveli 396210
            </p>
          </div>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14958.90673931113!2d72.8328819!3d20.394156!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0d094bbefa247%3A0x147da831799ce416!2sOffice%20of%20the%20Collector%20%26%20District%20Magistrate%2C%20Daman!5e0!3m2!1sen!2sin!4v1696066672958!5m2!1sen!2sin"
            width="600"
            height="450"
            className="shrink-0 border-none rounded-xl scale-50 origin-top-left sm:scale-100"
            loading="lazy"
          ></iframe>
        </div>
      </section>
      <footer className="bg-[#141414] p-10 sm:p-20">
        <p className="text-center text-white text-xl font-sans">
          This Website is Designed & Developed by
        </p>
        <p className="text-center text-white text-xl mb-6 font-sans">
          <span className="font-medium lato">Contents Coordinator</span> -
          Planning and Development Authority, Daman
        </p>
        <p className="text-center text-white text-xl ">
          <span className="font-medium font-sans">DISCLAIMER</span> - The
          content is provided by Planning and Development Authority. PDA is
          responsible for correctness, completeness and regularly updating the
          contents. Daman e-Governance Society is not responsible for any
          consequences arising out of this.
        </p>
      </footer>
    </div>
  );
};

export default Home;

function Fa6SolidBars(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="0.88em"
      height="1em"
      viewBox="0 0 448 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M0 96c0-17.7 14.3-32 32-32h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zm0 160c0-17.7 14.3-32 32-32h384c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zm448 160c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32h384c17.7 0 32 14.3 32 32z"
      ></path>
    </svg>
  );
}

function Fa6SolidXmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="0.75em"
      height="1em"
      viewBox="0 0 384 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7L86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256L41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3l105.4 105.3c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256l105.3-105.4z"
      ></path>
    </svg>
  );
}

export function MaterialSymbolsFormatParagraphRounded(
  props: SVGProps<SVGSVGElement>
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      {...props}
    >
      <path
        fill="currentColor"
        d="M10 20q-.425 0-.713-.288T9 19v-5q-2.075 0-3.538-1.463T4 9q0-2.075 1.463-3.538T9 4h8q.425 0 .713.288T18 5q0 .425-.288.713T17 6h-1v13q0 .425-.288.713T15 20q-.425 0-.713-.288T14 19V6h-3v13q0 .425-.288.713T10 20Z"
      ></path>
    </svg>
  );
}
