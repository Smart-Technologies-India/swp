import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { useRef } from "react";
import {
  CilCameraControl,
  Fa6SolidArrowsUpDownLeftRight,
  Fa6SolidBars,
  Fa6SolidCalendarDays,
  Fa6SolidCodeBranch,
  Fa6SolidFile,
  Fa6SolidHouse,
  Fa6SolidMagnifyingGlass,
  Fa6SolidMapLocationDot,
  Fa6SolidObjectUngroup,
  Fa6SolidPersonMilitaryPointing,
  Fa6SolidXmark,
  MaterialSymbolsActivityZone,
  MaterialSymbolsAlignHorizontalRight,
  MaterialSymbolsLogoutRounded,
  MaterialSymbolsOralDisease,
  MdiDesktopMacDashboard,
  StreamlineInterfaceUserEditActionsCloseEditGeometricHumanPencilPersonSingleUpUserWrite,
  EmojioneMonotoneCoupleWithHeart,
  Fa6SolidPeopleGroup,
  FluentPipelineAdd32Filled,
  FluentPipelineArrowCurveDown20Filled,
  HealthiconsDeathAlt2,
  HealthiconsICertificatePaper,
  IcBaselineFileCopy,
  IcBaselineTempleHindu,
  IconParkTwotoneDiamondRing,
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
import sideBarStore, { SideBarTabs } from "~/state/sidebar";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  if (
    cookie == null ||
    cookie == undefined ||
    Object.keys(cookie).length == 0
  ) {
    return redirect("/mobilelogin");
  }

  const userdata = await ApiCall({
    query: `
        query getUserById($id:Int!){
            getUserById(id:$id){
                id,
                role,
                name,
                department
            }   
        }
        `,
    veriables: {
      id: parseInt(cookie.id!),
    },
  });
  return json({
    user: userdata.data.getUserById,
    isAdmin: cookie.role == "ADMIN" ? true : false,
  });
};

const Home: React.FC = (): JSX.Element => {
  const user = useLoaderData().user;
  const isMobile = sideBarStore((state) => state.isOpen);
  const changeMobile = sideBarStore((state) => state.change);
  const asideindex = sideBarStore((state) => state.currentIndex);
  const achangeindex = sideBarStore((state) => state.changeTab);

  const isUser = user.role == "USER";
  const username = user.name;

  const navigator = useNavigate();

  const logoutHandle = () => {
    navigator("/logout");
  };

  const submitRef = useRef<HTMLButtonElement>(null);
  const accesskeyRef = useRef<HTMLInputElement>(null);
  const designpointRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <section className="h-screen w-full relative bg-[#eeeeee]">
        <div className="flex relative flex-nowrap w-full">
          <div
            className={`z-40 w-60 shrink-0 bg-[#182330] md:flex flex-col md:relative fixed top-0 left-0 min-h-screen md:min-h-full md:h-auto shadow-xl transition-all duration-700 md:translate-x-0 ${
              isMobile ? "" : "-translate-x-60"
            }`}
          >
            <div className="md:flex flex-col md:h-full">
              <div className="flex text-xl gap-2 items-center w-full pl-4 mt-6 text-gray-200">
                <Fa6SolidCalendarDays></Fa6SolidCalendarDays>
                <p className="mallanna">{new Date().toDateString()}</p>
              </div>
              <div className="w-[2px] bg-gray-800 h-6"></div>
              <div className="flex flex-col grow">
                {isUser ? (
                  <>
                    <Link
                      to={"/home/files"}
                      onClick={() => {
                        achangeindex(SideBarTabs.Dashborad);
                        changeMobile(false);
                      }}
                    >
                      <SidebarTab
                        icon={MdiDesktopMacDashboard}
                        title="Dashboard"
                        active={asideindex === SideBarTabs.Dashborad}
                      ></SidebarTab>
                    </Link>
                    <Link
                      to={"/home/services"}
                      onClick={() => {
                        achangeindex(SideBarTabs.Services);
                        changeMobile(false);
                      }}
                    >
                      <SidebarTab
                        icon={Fa6SolidCodeBranch}
                        title="Services"
                        active={asideindex === SideBarTabs.Services}
                      ></SidebarTab>
                    </Link>
                  </>
                ) : (
                  <>
                    {[
                      "COLLECTOR",
                      "DYCOLLECTOR",
                      "ATP",
                      "JTP",
                      "SUPERINTENDENT",
                    ].includes(user.role) ? (
                      <Link
                        to={"/home/"}
                        onClick={() => {
                          achangeindex(SideBarTabs.Dashborad);
                          changeMobile(false);
                        }}
                      >
                        <SidebarTab
                          icon={Fa6SolidObjectUngroup}
                          title="Dashboard"
                          active={asideindex === SideBarTabs.Dashborad}
                        ></SidebarTab>
                      </Link>
                    ) : null}
                    <Link
                      to={"/home/files"}
                      onClick={() => {
                        achangeindex(SideBarTabs.Files);
                        changeMobile(false);
                      }}
                    >
                      <SidebarTab
                        icon={Fa6SolidFile}
                        title={isUser ? "All Files" : "Running Files"}
                        active={asideindex === SideBarTabs.Files}
                      ></SidebarTab>
                    </Link>
                    <div className="w-full h-[2px] bg-gray-800 my-3"></div>
                    {["COLLECTOR", "DYCOLLECTOR", "PDA"].includes(
                      user.department
                    ) ? (
                      <>
                        <p className="text-left px-2 font-serif text-sm my-2 text-gray-600 w-full">
                          Citizen Files
                        </p>
                        <Link
                          to={"/home/pda/vzoneinfo"}
                          onClick={() => achangeindex(SideBarTabs.ZoneInfo)}
                        >
                          <SidebarTab
                            icon={MaterialSymbolsActivityZone}
                            title="Zone Info"
                            active={asideindex === SideBarTabs.ZoneInfo}
                          ></SidebarTab>
                        </Link>
                        <Link
                          to={"/home/pda/vrti"}
                          onClick={() => achangeindex(SideBarTabs.Rti)}
                        >
                          <SidebarTab
                            icon={MaterialSymbolsAlignHorizontalRight}
                            title="RTI"
                            active={asideindex === SideBarTabs.Rti}
                          ></SidebarTab>
                        </Link>
                        <Link
                          to={"/home/pda/voldcopy"}
                          onClick={() => achangeindex(SideBarTabs.OldCopy)}
                        >
                          <SidebarTab
                            icon={MaterialSymbolsOralDisease}
                            title="Old Copy"
                            active={asideindex === SideBarTabs.OldCopy}
                          ></SidebarTab>
                        </Link>
                        <div className="w-full h-[2px] bg-gray-800 my-3"></div>
                        <p className="text-left px-2 font-serif text-sm my-2 text-gray-600 w-full">
                          Department Files
                        </p>
                        <Link
                          to={"/home/pda/vpetroleum"}
                          onClick={() => achangeindex(SideBarTabs.Petroleum)}
                        >
                          <SidebarTab
                            icon={Fa6SolidPersonMilitaryPointing}
                            title="Petroleum"
                            active={asideindex === SideBarTabs.Petroleum}
                          ></SidebarTab>
                        </Link>
                        <Link
                          to={"/home/pda/vunauthorised"}
                          onClick={() => achangeindex(SideBarTabs.Unauthorisd)}
                        >
                          <SidebarTab
                            icon={Fa6SolidArrowsUpDownLeftRight}
                            title="Unauthorised"
                            active={asideindex === SideBarTabs.Unauthorisd}
                          ></SidebarTab>
                        </Link>
                        <div className="w-full h-[2px] bg-gray-800 my-3"></div>
                        <p className="text-left px-2 font-serif text-sm my-2 text-gray-600 w-full">
                          Intra Department Files
                        </p>
                        <Link
                          to={"/home/pda/vlandsection"}
                          onClick={() => achangeindex(SideBarTabs.landSection)}
                        >
                          <SidebarTab
                            icon={Fa6SolidMapLocationDot}
                            title="Land Section"
                            active={asideindex === SideBarTabs.landSection}
                          ></SidebarTab>
                        </Link>
                      </>
                    ) : null}

                    {/* crsr start here */}

                    {["COLLECTOR", "DYCOLLECTOR", "CRSR"].includes(
                      user.department
                    ) ? (
                      <>
                        <p className="text-left px-2 font-serif text-sm my-2 text-gray-600 w-full">
                          CRSR
                        </p>
                        <Link
                          to={"/home/crsr/vbirthcert"}
                          onClick={() => achangeindex(SideBarTabs.BirthCert)}
                        >
                          <SidebarTab
                            icon={MingcuteCertificate2Line}
                            title="Birth Cert"
                            active={asideindex === SideBarTabs.BirthCert}
                          ></SidebarTab>
                        </Link>
                        <Link
                          to={"/home/crsr/vbirthteor"}
                          onClick={() => achangeindex(SideBarTabs.BirthTeor)}
                        >
                          <SidebarTab
                            icon={IcBaselineFileCopy}
                            title="Birth Teor"
                            active={asideindex === SideBarTabs.BirthTeor}
                          ></SidebarTab>
                        </Link>
                        <Link
                          to={"/home/crsr/vdeathcert"}
                          onClick={() => achangeindex(SideBarTabs.DeathCert)}
                        >
                          <SidebarTab
                            icon={TablerFileCertificate}
                            title="Death Cert"
                            active={asideindex === SideBarTabs.DeathCert}
                          ></SidebarTab>
                        </Link>
                        <Link
                          to={"/home/crsr/vdeathteor"}
                          onClick={() => achangeindex(SideBarTabs.DeathTeor)}
                        >
                          <SidebarTab
                            icon={HealthiconsICertificatePaper}
                            title="Death Teor"
                            active={asideindex === SideBarTabs.DeathTeor}
                          ></SidebarTab>
                        </Link>
                        <Link
                          to={"/home/crsr/vmarriagecert"}
                          onClick={() => achangeindex(SideBarTabs.MarriageCert)}
                        >
                          <SidebarTab
                            icon={PhCertificateBold}
                            title="Marriage Cert"
                            active={asideindex === SideBarTabs.MarriageCert}
                          ></SidebarTab>
                        </Link>
                        <Link
                          to={"/home/crsr/vmarriageteor"}
                          onClick={() => achangeindex(SideBarTabs.MarriageTeor)}
                        >
                          <SidebarTab
                            icon={PhNewspaperClippingLight}
                            title="Marriage Teor"
                            active={asideindex === SideBarTabs.MarriageTeor}
                          ></SidebarTab>
                        </Link>
                        <Link
                          to={"/home/crsr/vmarriageregister"}
                          onClick={() => achangeindex(SideBarTabs.NewMarriage)}
                        >
                          <SidebarTab
                            icon={EmojioneMonotoneCoupleWithHeart}
                            title="New Marriage Register"
                            active={asideindex === SideBarTabs.NewMarriage}
                          ></SidebarTab>
                        </Link>
                      </>
                    ) : null}

                    {/* crsr end here */}

                    {/* pwd start here */}
                    {["PWD"].includes(user.department) ? (
                      <>
                        <p className="text-left px-2 font-serif text-sm my-2 text-gray-600 w-full">
                          PWD
                        </p>
                        <Link
                          to={"/home/pwd/vnewwaterconnect"}
                          onClick={() =>
                            achangeindex(SideBarTabs.NewWaterConnect)
                          }
                        >
                          <SidebarTab
                            icon={FluentPipelineAdd32Filled}
                            title="New Water Connection"
                            active={asideindex === SideBarTabs.NewWaterConnect}
                          ></SidebarTab>
                        </Link>
                        <Link
                          to={"/home/pwd/vtempwaterconnect"}
                          onClick={() => achangeindex(SideBarTabs.TempConnect)}
                        >
                          <SidebarTab
                            icon={FluentPipelineAdd32Filled}
                            title="Temp Water Connection"
                            active={asideindex === SideBarTabs.TempConnect}
                          ></SidebarTab>
                        </Link>
                        <Link
                          to={"/home/pwd/vtempwaterdisconnect"}
                          onClick={() =>
                            achangeindex(SideBarTabs.TempDisconnect)
                          }
                        >
                          <SidebarTab
                            icon={MdiPipeDisconnected}
                            title="Temp Water Disconnection"
                            active={asideindex === SideBarTabs.TempDisconnect}
                          ></SidebarTab>
                        </Link>
                        <Link
                          to={"/home/pwd/vwatersizechange"}
                          onClick={() => achangeindex(SideBarTabs.SizeChange)}
                        >
                          <SidebarTab
                            icon={FluentPipelineArrowCurveDown20Filled}
                            title="Size Change"
                            active={asideindex === SideBarTabs.SizeChange}
                          ></SidebarTab>
                        </Link>
                        <Link
                          to={"/home/pwd/vwaterreconnect"}
                          onClick={() =>
                            achangeindex(SideBarTabs.WaterReconnect)
                          }
                        >
                          <SidebarTab
                            icon={MdiPipeLeak}
                            title="Water Reconnection"
                            active={asideindex === SideBarTabs.WaterReconnect}
                          ></SidebarTab>
                        </Link>
                        <Link
                          to={"/home/pwd/vpermanentwaterdisconnect"}
                          onClick={() =>
                            achangeindex(SideBarTabs.PermanentDisconnect)
                          }
                        >
                          <SidebarTab
                            icon={MdiPipeDisconnected}
                            title="Permanent Disconnection"
                            active={
                              asideindex === SideBarTabs.PermanentDisconnect
                            }
                          ></SidebarTab>
                        </Link>
                      </>
                    ) : null}
                    {/* pwd end here */}

                    {/* dmc start here */}
                    {["DMC"].includes(user.department) ? (
                      <>
                        <p className="text-left px-2 font-serif text-sm my-2 text-gray-600 w-full">
                          DMC
                        </p>
                        <Link
                          to={"/home/dmc/vnewbirthregister"}
                          onClick={() =>
                            achangeindex(SideBarTabs.NewBirthRegister)
                          }
                        >
                          <SidebarTab
                            icon={PhBabyFill}
                            title="New Birth Register"
                            active={asideindex === SideBarTabs.NewBirthRegister}
                          ></SidebarTab>
                        </Link>
                        <Link
                          to={"/home/dmc/vnewdeathregister"}
                          onClick={() =>
                            achangeindex(SideBarTabs.NewDeathRegister)
                          }
                        >
                          <SidebarTab
                            icon={HealthiconsDeathAlt2}
                            title="Death Register"
                            active={asideindex === SideBarTabs.NewDeathRegister}
                          ></SidebarTab>
                        </Link>
                      </>
                    ) : null}
                    {/* dmc end here */}

                    {/* EST start here */}
                    {["COLLECTOR", "DYCOLLECTOR", "EST"].includes(
                      user.department
                    ) ? (
                      <>
                        <p className="text-left px-2 font-serif text-sm my-2 text-gray-600 w-full">
                          EST
                        </p>
                        <Link
                          to={"/home/est/vmarriage"}
                          onClick={() => achangeindex(SideBarTabs.Marriage)}
                        >
                          <SidebarTab
                            icon={IconParkTwotoneDiamondRing}
                            title="Marriage Permission"
                            active={asideindex === SideBarTabs.Marriage}
                          ></SidebarTab>
                        </Link>
                        <Link
                          to={"/home/est/vroadshow"}
                          onClick={() => achangeindex(SideBarTabs.RoadShow)}
                        >
                          <SidebarTab
                            icon={Fa6SolidPeopleGroup}
                            title="Roadshow Permission"
                            active={asideindex === SideBarTabs.RoadShow}
                          ></SidebarTab>
                        </Link>
                        <Link
                          to={"/home/est/vreligious"}
                          onClick={() => achangeindex(SideBarTabs.Religious)}
                        >
                          <SidebarTab
                            icon={IcBaselineTempleHindu}
                            title="Religious Permission"
                            active={asideindex === SideBarTabs.Religious}
                          ></SidebarTab>
                        </Link>
                      </>
                    ) : null}
                    {/* EST end here */}

                    <div className="w-full h-[2px] bg-gray-800 my-4"></div>
                  </>
                )}
                {user.role == "USER" ? (
                  <Link
                    to={"/home/editprofile"}
                    onClick={() => {
                      achangeindex(SideBarTabs.EditProfile);
                      changeMobile(false);
                    }}
                  >
                    <SidebarTab
                      icon={
                        StreamlineInterfaceUserEditActionsCloseEditGeometricHumanPencilPersonSingleUpUserWrite
                      }
                      title="Edit Profile"
                      active={asideindex === SideBarTabs.EditProfile}
                    ></SidebarTab>
                  </Link>
                ) : null}
                {user.role == "ATP" || user.role == "JTP" ? (
                  <>
                    <Link
                      to={"/home/dealinghand"}
                      onClick={() => {
                        achangeindex(SideBarTabs.DealingHand);
                        changeMobile(false);
                      }}
                    >
                      <SidebarTab
                        icon={CilCameraControl}
                        title="Dealing Hand"
                        active={asideindex === SideBarTabs.DealingHand}
                      ></SidebarTab>
                    </Link>
                  </>
                ) : null}
                <Link
                  to={"/home/search"}
                  onClick={() => {
                    achangeindex(SideBarTabs.Search);
                    changeMobile(false);
                  }}
                >
                  <SidebarTab
                    icon={Fa6SolidMagnifyingGlass}
                    title="Search"
                    active={asideindex === SideBarTabs.Search}
                  ></SidebarTab>
                </Link>
                <button onClick={logoutHandle}>
                  <SidebarTab
                    icon={MaterialSymbolsLogoutRounded}
                    title="LOGOUT"
                    active={false}
                  ></SidebarTab>
                </button>
                <div
                  onClick={() => changeMobile(false)}
                  className={`w-60 md:w-auto font-medium flex gap-2 items-center my-1 b  py-1 px-2 text-left text-lg cursor-pointer text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10 md:hidden`}
                >
                  <Fa6SolidXmark></Fa6SolidXmark>
                  <p className="text-xl">CLOSE</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col min-h-screen relative bg-[#eeeeee] flex-grow overflow-y-auto">
            <div className="pb-14 h-full">
              <TopNavBar name={username}></TopNavBar>
              <div className="px-4">
                <Outlet></Outlet>
              </div>
            </div>
            <Footer></Footer>
          </div>
        </div>
      </section>
      <div className="hidden">
        {/* <form method="POST" action="http://77.75.120.70:8073/Home/AuthenticateFromLandRecord"> */}
        <form
          method="POST"
          action="https://www.svpass.in/wf/Home/AuthenticateFromLandRecord"
        >
          <input type="text" name="UserId" ref={designpointRef} />
          <input type="text" name="AccessKey" ref={accesskeyRef} />
          <button type="submit" ref={submitRef}>
            submit
          </button>
        </form>
      </div>
    </>
  );
};
export default Home;

type SideBarTabProps = {
  title: string;
  icon: React.FC;
  active: boolean;
};
const SidebarTab = (props: SideBarTabProps) => {
  return (
    <div
      className={`w-60 md:w-auto font-medium flex gap-2 items-center my-1 b  py-1 px-2 text-left text-lg cursor-pointer ${
        props.active
          ? "border-r-4 border-[#0984e3] bg-white bg-opacity-10 text-white"
          : "text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10"
      }`}
    >
      <props.icon></props.icon>
      <p className="text-left">{props.title}</p>
    </div>
  );
};

type TopNavBarProps = {
  name: string;
};

const TopNavBar = (props: TopNavBarProps) => {
  const isMobile = sideBarStore((state) => state.isOpen);
  const changeMobile = sideBarStore((state) => state.change);
  return (
    <div className="bg-white text-xl w-full text-center text-white py-2 font-medium flex px-4 gap-4 items-center">
      <div
        className="px md:hidden text-gray-900 text-2xl cursor-pointer"
        onClick={() => changeMobile(!isMobile)}
      >
        {/* on change will be here */}
        <Fa6SolidBars></Fa6SolidBars>
      </div>
      <div className="px hidden md:block text-gray-900 text-2xl cursor-pointer">
        <Fa6SolidHouse></Fa6SolidHouse>
      </div>
      <div className="text-center text-gray-900 text-lg hidden md:block">
        Home
      </div>
      <div className="grow"></div>
      <div className="flex gap-2 relative group items-center">
        <div className="text-gray-900 font-medium text-lg text-center cursor-pointer">
          <span className="font-semibold">Hello, </span> {props.name}
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <div className="absolute bottom-0 w-full h-14 bg-white font-medium text-center grid place-items-center text-gray-800 text-lg shadow-xl mallanna">
      &copy; {year} PLANNING & DEVELOPMENT AUTHORITY - All rights reserved.
    </div>
  );
};
