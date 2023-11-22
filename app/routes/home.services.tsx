import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useRef, useState } from "react";
import {
  CibLinuxFoundation,
  EmojioneMonotoneCoupleWithHeart,
  Fa6SolidPeopleGroup,
  FluentBuildingPeople20Filled,
  FluentCloudArchive24Filled,
  FluentEmojiHighContrastBuildingConstruction,
  FluentPipelineAdd32Filled,
  FluentPipelineArrowCurveDown20Filled,
  HealthiconsDeathAlt2,
  HealthiconsICertificatePaper,
  IcBaselineFileCopy,
  IcBaselineTempleHindu,
  IconParkTwotoneDiamondRing,
  MdiFolderInformation,
  MdiMapMarkerPath,
  MdiPipeDisconnected,
  MdiPipeLeak,
  MingcuteCertificate2Line,
  PhBabyFill,
  PhCertificateBold,
  PhNewspaperClippingLight,
  TablerFileCertificate,
} from "~/components/icons/icons";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);

  const userdata = await ApiCall({
    query: `
      query getUserById($id:Int!){
          getUserById(id:$id){
              id,
              role,
              name,
              address,
              contact,
              email,
              user_uid,
              user_uid_four
          }   
      }
      `,
    veriables: {
      id: parseInt(cookie.id!),
    },
  });

  if (
    userdata.data.getUserById.user_uid == null ||
    userdata.data.getUserById.user_uid == undefined ||
    userdata.data.getUserById.user_uid == ""
  ) {
    return redirect("/home/editprofile");
  }

  return null;
};

const Services: React.FC = (): JSX.Element => {
  const title = useRef<HTMLHeadingElement | null>(null);

  const Services: string[] = ["PDA", "EST", "CRSR", "PWD", "DMC"];
  const ServicesName: string[] = [
    "Planning & Development Authority ",
    "Establishment Section",
    "Sub Registrar",
    "Public Works Department",
    "Daman Municipal Council",
  ];
  type Services = (typeof Services)[number];
  const [services, setServices] = useState<Services>("PDA");

  // useLayoutEffect(() => {
  //   let ctx = gsap.context(() => {
  //     gsap.from(".services >  div", {
  //       opacity: 0,
  //       duration: 1,
  //       y: 100,
  //       stagger: {
  //         from: "start",
  //         amount: 0.5,
  //       },
  //     });
  //     gsap.from(title.current, {
  //       opacity: 0,
  //       duration: 1,
  //       y: 50,
  //     });
  //   });
  // }, []);

  return (
    <>
      <div className=" p-4 my-4 w-full">
        <h1
          ref={title}
          className="text-gray-800 text-3xl font-semibold text-center"
        >
          Services
        </h1>
        <div className="flex gap-4 justify-center">
          {Services.map((val: string, index: number) => (
            <h4
              key={index}
              onClick={() => setServices(val)}
              role="button"
              className={`cursor-pointer mt-10 px-4 py-2  shadow-lg hover:shadow-2xl grid place-items-center rounded-xl text-sm font-medium lato ${
                val == services
                  ? "text-white bg-blue-500"
                  : "bg-white text-blue-500"
              } `}
            >
              {ServicesName[index]}
            </h4>
          ))}
        </div>

        {services == "PDA" ? (
          <div className="services gap-6 grid grid-cols-3 justify-center mt-4">
            <ServiceCard
              title="Right To Information Applicaton"
              description="File your RTI application online fro the departments. Users have to fill this online applicaton form for availing this service"
              apply="/home/pda/rti/"
              icons={1}
            />
            <ServiceCard
              title="Zone Information"
              description="Land maps are used by planning authorities to advice the zone and usage pattern. You may apply here for getting online zone information."
              apply="/home/pda/zoneinfo/"
              icons={2}
            />
            <ServiceCard
              title="Old Copy Of CP / Maps / OC"
              description="Obtain online a copy of any document with the Planning and Development Authority of the daman goverment through this platform."
              apply="/home/pda/oldcopy"
              icons={3}
            />
            <ServiceCard
              title="Occupancy certificate"
              description="Obtain your occupancy certificate online. Ensure your property is compliant with regulations for safe and legal occupation."
              apply="/home/oc/"
              icons={22}
            />
            <ServiceCard
              title="Construction permission"
              description="Secure legal authorization swiftly for your projects through our portal. Hassle-free"
              apply="/home/cp/"
              icons={23}
            />
            <ServiceCard
              title="Plinth Inspection"
              description="Apply for plinth inspections online. Ensure your project's foundation is stable and secure."
              apply="/home/plinth"
              icons={24}
            />
          </div>
        ) : null}

        {services == "EST" ? (
          <div className="services gap-6 grid grid-cols-3 justify-center mt-4">
            {/* est */}
            <ServiceCard
              icons={4}
              title="Marriage Applicaton"
              description="Users are required to fill out this online application form to avail of the Marriage Permission service from the department."
              apply="/home/est/marriage/"
            />
            <ServiceCard
              icons={5}
              title="RoadShow Applicaton"
              description="Users are required to fill out this online application form to avail of the Roadshow Permission service from the department. "
              apply="/home/est/roadshow/"
            />
            <ServiceCard
              icons={6}
              title="Religious Applicaton"
              description="Users are required to fill out this online application form to avail of the Religious Event Permission service from the department."
              apply="/home/est/religious"
            />
          </div>
        ) : null}

        {services == "DMC" ? (
          <div className="services gap-6 grid grid-cols-3 justify-center mt-4">
            {/* DMC */}
            <ServiceCard
              icons={7}
              title="New Birth Register"
              description="Officially document the birth of a child with the relevant authorities and provide a legal record of the child's birth."
              apply="/home/dmc/newbirthregister"
            />
            <ServiceCard
              icons={8}
              title="Death Register"
              description="Officially register the death of an individual and document the date, time, and place of death."
              apply="/home/dmc/newdeathregister"
            />
          </div>
        ) : null}

        {services == "CRSR" ? (
          <div className="services gap-6 grid grid-cols-3 justify-center mt-4">
            {/* CRSR */}
            <ServiceCard
              icons={9}
              title="New Marriage Register"
              description="Users are required to fill out this online application form to Register your marriage with your partner."
              apply="/home/crsr/newmarriageregister"
            />
            <ServiceCard
              icons={10}
              title="Birth Certificate"
              description="Secure a formal document that confirms the birth of a child and serves as an essential legal document for various purposes."
              apply="/home/crsr/birthcert"
            />
            <ServiceCard
              icons={11}
              title="Birth Teor"
              description="Users are required to fill out this online application form to Request a birth certificate teor by submitting the necessary documents."
              apply="/home/crsr/birthteor"
            />
            <ServiceCard
              icons={12}
              title=" Marriage Certificate"
              description="Users are required to fill out this online application form to request a marriage certificate by providing required documents."
              apply="/home/crsr/marriagecert"
            />
            <ServiceCard
              icons={13}
              title="Marriage Teor"
              description="Users are required to fill out this online application form to request a marriage certificate teor by providing required documents."
              apply="/home/crsr/marriageteor"
            />
            <ServiceCard
              icons={14}
              title="Death Certificate"
              description="Users are required to fill out this online application form to Request a death certificate by submitting the necessary documents."
              apply="/home/crsr/deathcert"
            />
            <ServiceCard
              icons={15}
              title="Death Teor"
              description="Users are required to fill out this online application form to Request a death certificate teor by submitting the necessary documents."
              apply="/home/crsr/deathteor"
            />
          </div>
        ) : null}

        {services == "PWD" ? (
          <div className="services gap-6 grid grid-cols-3 justify-center mt-4">
            {/* PWD */}
            <ServiceCard
              icons={16}
              title="New Water Connection Applicaton"
              description="Apply for a new connection to the municipal water supply system and receive a connection approval."
              apply="/home/pwd/newwaterconnect"
            />
            <ServiceCard
              icons={17}
              title="Temporary Water Connection"
              description="Apply for a temporary connection to the municipal water supply system and receive a connection approval."
              apply="/home/pwd/tempwaterconnect"
            />
            <ServiceCard
              icons={18}
              title="Temporary Water Disconnection"
              description="Apply for a temporary disconnection to the municipal water supply system and receive a disconnection approval."
              apply="/home/pwd/tempwaterdisconnect"
            />
            <ServiceCard
              icons={19}
              title="Water Connection Size Change"
              description="Apply for an increase or decrease in the size of your existing water connection and receive approval for the size change."
              apply="/home/pwd/watersizechange"
            />
            <ServiceCard
              icons={20}
              title="Reconnection"
              description="Apply for a Reconnection to the municipal water supply system and receive a reconnection approval."
              apply="/home/pwd/waterreconnect"
            />
            <ServiceCard
              icons={21}
              title="Permanent Water Disconnection"
              description="Request the termination of your existing water connection and arrange for the final water consumption reading."
              apply="/home/pwd/permanentwaterdisconnect"
            />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Services;

interface ServiceCardProps {
  apply: string;
  title: string;
  description: string;
  icons: number;
}

const ServiceCard: React.FC<ServiceCardProps> = (
  props: ServiceCardProps
): JSX.Element => {
  return (
    <>
      <div className="p-4 bg-white shadow-lg hover:shadow-2xl grid place-items-center h-80 rounded-xl">
        <div className="grid place-items-center gap-2 p-6">
          {props.icons == 1 ? (
            <MdiFolderInformation className="text-3xl text-[#0984e3]"></MdiFolderInformation>
          ) : null}
          {props.icons == 2 ? (
            <MdiMapMarkerPath className="text-3xl text-[#0984e3]"></MdiMapMarkerPath>
          ) : null}
          {props.icons == 3 ? (
            <FluentCloudArchive24Filled className="text-3xl text-[#0984e3]"></FluentCloudArchive24Filled>
          ) : null}
          {props.icons == 4 ? (
            <IconParkTwotoneDiamondRing className="text-3xl text-[#0984e3]"></IconParkTwotoneDiamondRing>
          ) : null}
          {props.icons == 5 ? (
            <Fa6SolidPeopleGroup className="text-3xl text-[#0984e3]"></Fa6SolidPeopleGroup>
          ) : null}
          {props.icons == 6 ? (
            <IcBaselineTempleHindu className="text-3xl text-[#0984e3]"></IcBaselineTempleHindu>
          ) : null}
          {props.icons == 7 ? (
            <PhBabyFill className="text-3xl text-[#0984e3]"></PhBabyFill>
          ) : null}
          {props.icons == 8 ? (
            <HealthiconsDeathAlt2 className="text-3xl text-[#0984e3]"></HealthiconsDeathAlt2>
          ) : null}
          {props.icons == 9 ? (
            <EmojioneMonotoneCoupleWithHeart className="text-3xl text-[#0984e3]"></EmojioneMonotoneCoupleWithHeart>
          ) : null}
          {props.icons == 10 ? (
            <MingcuteCertificate2Line className="text-3xl text-[#0984e3]"></MingcuteCertificate2Line>
          ) : null}
          {props.icons == 11 ? (
            <IcBaselineFileCopy className="text-3xl text-[#0984e3]"></IcBaselineFileCopy>
          ) : null}
          {props.icons == 12 ? (
            <PhCertificateBold className="text-3xl text-[#0984e3]"></PhCertificateBold>
          ) : null}
          {props.icons == 13 ? (
            <PhNewspaperClippingLight className="text-3xl text-[#0984e3]"></PhNewspaperClippingLight>
          ) : null}
          {props.icons == 14 ? (
            <TablerFileCertificate className="text-3xl text-[#0984e3]"></TablerFileCertificate>
          ) : null}
          {props.icons == 15 ? (
            <HealthiconsICertificatePaper className="text-3xl text-[#0984e3]"></HealthiconsICertificatePaper>
          ) : null}
          {props.icons == 16 ? (
            <FluentPipelineAdd32Filled className="text-3xl text-[#0984e3]"></FluentPipelineAdd32Filled>
          ) : null}
          {props.icons == 17 ? (
            <FluentPipelineAdd32Filled className="text-3xl text-[#0984e3]"></FluentPipelineAdd32Filled>
          ) : null}
          {props.icons == 18 ? (
            <MdiPipeDisconnected className="text-3xl text-[#0984e3]"></MdiPipeDisconnected>
          ) : null}
          {props.icons == 19 ? (
            <FluentPipelineArrowCurveDown20Filled className="text-3xl text-[#0984e3]"></FluentPipelineArrowCurveDown20Filled>
          ) : null}
          {props.icons == 20 ? (
            <MdiPipeLeak className="text-3xl text-[#0984e3]"></MdiPipeLeak>
          ) : null}
          {props.icons == 21 ? (
            <MdiPipeDisconnected className="text-3xl text-[#0984e3]"></MdiPipeDisconnected>
          ) : null}
          {props.icons == 22 ? (
            <FluentBuildingPeople20Filled className="text-5xl text-[#0984e3]"></FluentBuildingPeople20Filled>
          ) : null}
          {props.icons == 23 ? (
            <FluentEmojiHighContrastBuildingConstruction className="text-5xl text-[#0984e3]"></FluentEmojiHighContrastBuildingConstruction>
          ) : null}
          {props.icons == 24 ? (
            <CibLinuxFoundation className="text-5xl text-[#0984e3]"></CibLinuxFoundation>
          ) : null}

          <h1 className="text-lg font-medium lato text-center">
            {props.title}
          </h1>
          <p className="text-center text-sm mallanna">{props.description}</p>
          <Link
            to={props.apply}
            className="py-1 text-white text-sm bg-[#0984e3] text-center rounded-full font-medium w-28 inline-block mt-2"
          >
            Apply
          </Link>
        </div>
      </div>
    </>
  );
};
