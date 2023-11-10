import { LoaderArgs, LoaderFunction, json, redirect } from "@remix-run/node";
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
} from "~/components/icons/icons";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";
import sideBarStore, { SideBarTabs } from "~/state/sidebar";
import { toast } from "react-toastify";

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
                access_kay,
                design_point_id,
                role,
                name
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

  const switchtodesignpoint = async () => {
    if (
      user.design_point_id == "" ||
      user.design_point_id == undefined ||
      user.design_point_id == null
    ) {
      toast.error("This user does not exist", { theme: "light" });
    } else if (
      user.access_kay == "" ||
      user.access_kay == undefined ||
      user.access_kay == null
    ) {
      toast.error("Something whent wrong, Try again!", { theme: "light" });
    } else {
      accesskeyRef!.current!.value = user.access_kay;
      designpointRef!.current!.value = user.design_point_id;
      achangeindex(SideBarTabs.DesignPoint);
      submitRef!.current!.click();
    }
  };

  // useEffect(() => {
  //     if (isUser) {
  //         navigator("/home/files/");
  //     } else {
  //         navigator("/home/");
  //     }
  // }, []);

  return (
    <>
      <section className="h-screen w-full relative bg-[#eeeeee]">
        {/* <TopNavBar
                    name={username}
                ></TopNavBar> */}

        <div className="flex relative flex-nowrap w-full">
          {/* <div
                        className={`z-40 w-full md:w-60 shrink-0 bg-[#182330] md:flex flex-col md:relative fixed top-0 left-0 min-h-screen md:min-h-full md:h-auto shadow-xl ${isMobile ? "grid place-items-center" : "hidden"
                            }`}
                    > */}
          <div
            className={`z-40 w-60 shrink-0 bg-[#182330] md:flex flex-col md:relative fixed top-0 left-0 min-h-screen md:min-h-full md:h-auto shadow-xl transition-all duration-700 md:translate-x-0 ${
              isMobile ? "" : "-translate-x-60"
            }`}
          >
            <div className="md:flex flex-col md:h-full">
              {/* <div className="text-white text-center mb-4">
                                <img
                                    src="/images/banner.jpg"
                                    alt="logo"
                                    className="w-full h-40 object-cover object-top inline-block"
                                />
                            </div> */}

              <div className="flex text-xl gap-2 items-center w-full pl-4 mt-6 text-gray-200">
                <Fa6SolidCalendarDays></Fa6SolidCalendarDays>
                <p className="mallanna">{new Date().toDateString()}</p>
              </div>
              <div className="w-[2px] bg-gray-800 h-6"></div>
              <div className="flex flex-col grow">
                {/* <Link
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
                                </Link> */}
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
                    {["COLLECTOR", "DYCOLLECTOR", "ATP", "JTP"].includes(
                      user.role
                    ) ? (
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
                    <p className="text-left px-2 font-serif text-sm my-2 text-gray-600 w-full">
                      Citizen Files
                    </p>
                    <Link
                      to={"/home/vzoneinfo"}
                      onClick={() => achangeindex(SideBarTabs.ZoneInfo)}
                    >
                      <SidebarTab
                        icon={MaterialSymbolsActivityZone}
                        title="Zone Info"
                        active={asideindex === SideBarTabs.ZoneInfo}
                      ></SidebarTab>
                    </Link>
                    <Link
                      to={"/home/vrti"}
                      onClick={() => achangeindex(SideBarTabs.Rti)}
                    >
                      <SidebarTab
                        icon={MaterialSymbolsAlignHorizontalRight}
                        title="RTI"
                        active={asideindex === SideBarTabs.Rti}
                      ></SidebarTab>
                    </Link>
                    <Link
                      to={"/home/voldcopy"}
                      onClick={() => achangeindex(SideBarTabs.OldCopy)}
                    >
                      <SidebarTab
                        icon={MaterialSymbolsOralDisease}
                        title="Old Copy"
                        active={asideindex === SideBarTabs.OldCopy}
                      ></SidebarTab>
                    </Link>
                    {/* <Link
                                            to={"/home/voc"}
                                            onClick={() => achangeindex(SideBarTabs.Oc)}
                                        >
                                            <SidebarTab
                                                icon={MaterialSymbolsOralDisease}
                                                title="OC"
                                                active={asideindex === SideBarTabs.Oc}
                                            ></SidebarTab>
                                        </Link>
                                        <Link
                                            to={"/home/vcp"}
                                            onClick={() => achangeindex(SideBarTabs.Cp)}
                                        >
                                            <SidebarTab
                                                icon={MaterialSymbolsOralDisease}
                                                title="CP"
                                                active={asideindex === SideBarTabs.Cp}
                                            ></SidebarTab>
                                        </Link>
                                        <Link
                                            to={"/home/vplinth"}
                                            onClick={() => achangeindex(SideBarTabs.Plinth)}
                                        >
                                            <SidebarTab
                                                icon={MaterialSymbolsOralDisease}
                                                title="Plinth"
                                                active={asideindex === SideBarTabs.Plinth}
                                            ></SidebarTab>
                                        </Link> */}
                    <div className="w-full h-[2px] bg-gray-800 my-3"></div>
                    <p className="text-left px-2 font-serif text-sm my-2 text-gray-600 w-full">
                      Department Files
                    </p>
                    <Link
                      to={"/home/vpetroleum"}
                      onClick={() => achangeindex(SideBarTabs.Petroleum)}
                    >
                      <SidebarTab
                        icon={Fa6SolidPersonMilitaryPointing}
                        title="Petroleum"
                        active={asideindex === SideBarTabs.Petroleum}
                      ></SidebarTab>
                    </Link>
                    <Link
                      to={"/home/vunauthorised"}
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
                      to={"/home/vlandsection"}
                      onClick={() => achangeindex(SideBarTabs.landSection)}
                    >
                      <SidebarTab
                        icon={Fa6SolidMapLocationDot}
                        title="Land Section"
                        active={asideindex === SideBarTabs.landSection}
                      ></SidebarTab>
                    </Link>
                    <div className="w-full h-[2px] bg-gray-800 my-4"></div>
                    <button onClick={switchtodesignpoint}>
                      <SidebarTab
                        icon={Fa6SolidCodeBranch}
                        title="CP/PL/OC Auto Approval System"
                        active={asideindex === SideBarTabs.DesignPoint}
                      ></SidebarTab>
                    </button>
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
                  </>
                ) : null}
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
