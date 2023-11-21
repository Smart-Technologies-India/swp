import { useLoaderData } from "@remix-run/react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  registerables,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { ApiCall } from "~/services/api";
import { userPrefs } from "~/cookies";
import sideBarStore, { SideBarTabs } from "~/state/sidebar";
import {
  Fa6SolidLandmark,
  LineMdConstruction,
  MdiFileLockOpen,
  MdiSelectionMultipleMarker,
  MingcuteGasStationFill,
  TablerMap2,
  EmojioneMonotoneCoupleWithHeart,
  HealthiconsICertificatePaper,
  IcBaselineFileCopy,
  MingcuteCertificate2Line,
  PhCertificateBold,
  PhNewspaperClippingLight,
  TablerFileCertificate,
  FluentPipelineArrowCurveDown20Filled,
  MdiPipeLeak,
  MdiPipeDisconnected,
  IcBaselineTempleHindu,
  Fa6SolidPeopleGroup,
  IconParkTwotoneDiamondRing,
  HealthiconsDeathAlt2,
  PhBabyFill,
  FluentPipelineAdd32Filled,
} from "~/components/icons/icons";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  ...registerables,
  ChartDataLabels
);

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);

  if (cookie.role == "USER") {
    return redirect("/home/files/");
  }

  const usersshow = [
    "COLLECTOR",
    "DYCOLLECTOR",
    "ATP",
    "JTP",
    "SUPERINTENDENT",
  ];
  if (!usersshow.includes(cookie.role)) {
    return redirect("/home/files");
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

  let filecount: any;
  if (userdata.data.getUserById.department == "PDA") {
    filecount = await ApiCall({
      query: `
        query getFileCount($department:String!){
            getFileCount(department:$department){
              RTI,
              ZONE,
              OLDCOPY,
              PETROLEUM,
              UNAUTHORIZED,
              LANDRECORDS,
              CP,
              OC,
              PLINTH
            }
          }
      `,
      veriables: {
        department: userdata.data.getUserById.department,
      },
    });
  } else if (userdata.data.getUserById.department == "DMC") {
    filecount = await ApiCall({
      query: `
        query getFileCount($department:String!){
            getFileCount(department:$department){
              DEATHREGISTER,
              BIRTHREGISTER
            }
          }
      `,
      veriables: {
        department: userdata.data.getUserById.department,
      },
    });
  } else if (userdata.data.getUserById.department == "CRSR") {
    filecount = await ApiCall({
      query: `
        query getFileCount($department:String!){
            getFileCount(department:$department){
              BIRTHCERT,
              BIRTHTEOR,
              DEATHCERT,
              DEATHTEOR,
              MARRIAGECERT,
              MARRIAGETEOR,
              MARRIAGEREGISTER
            }
          }
      `,
      veriables: {
        department: userdata.data.getUserById.department,
      },
    });
  } else if (userdata.data.getUserById.department == "PWD") {
    filecount = await ApiCall({
      query: `
        query getFileCount($department:String!){
            getFileCount(department:$department){
              TEMPWATERCONNECT,
              TEMPWATERDISCONNECT,
              WATERSIZECHANGE,
              NEWWATERCONNECT,
              WATERRECONNECT,
              PERMANENTWATERDISCONNECT
            }
          }
      `,
      veriables: {
        department: userdata.data.getUserById.department,
      },
    });
  } else if (userdata.data.getUserById.department == "EST") {
    filecount = await ApiCall({
      query: `
        query getFileCount($department:String!){
            getFileCount(department:$department){
              MARRIAGE,
              RELIGIOUS,
              ROADSHOW
            }
          }
      `,
      veriables: {
        department: userdata.data.getUserById.department,
      },
    });
  }

  const villagecount = await ApiCall({
    query: `
        query villageFileCount($department:String!){
            villageFileCount(department:$department){
              count,
              village
            }
          }
      `,
    veriables: {
      department: userdata.data.getUserById.department,
    },
  });

  const officercount = await ApiCall({
    query: `
        query officerFileCount($department:String!){
            officerFileCount(department:$department){
                count,
                auth_user_id
            }
          }
      `,
    veriables: {
      department: userdata.data.getUserById.department,
    },
  });

  let processcount: any;

  if (userdata.data.getUserById.department == "PDA") {
    processcount = await ApiCall({
      query: `
          query officerFileProgress($department:String!){
              officerFileProgress(department:$department){
              RTI{
                pending,
                completed,
                rejected
              },
              ZONE{
                pending,
                completed,
                rejected
              },
              OLDCOPY{
                pending,
                completed,
                rejected
              },
              PETROLEUM{
                pending,
                completed,
                rejected
              },
              UNAUTHORIZED{
                pending,
                completed,
                rejected
              },
              LANDRECORDS{
                pending,
                completed,
                rejected
              },
              MAMLATDAR{
                pending,
                completed,
                rejected
              },
              DEMOLITION{
                pending,
                completed,
                rejected
              },
              CP{
                  pending,
                  completed,
                  rejected
                },
                OC{
                  pending,
                  completed,
                  rejected
                },
                PLINTH{
                  pending,
                  completed,
                  rejected
                }
          }
          }
        `,
      veriables: {
        department: userdata.data.getUserById.department,
      },
    });
  } else if (userdata.data.getUserById.department == "DMC") {
    processcount = await ApiCall({
      query: `
          query officerFileProgress($department:String!){
              officerFileProgress(department:$department){
              BIRTHREGISTER{
                pending,
                completed,
                rejected
              },
              DEATHREGISTER{
                pending,
                completed,
                rejected
              }
          }
          }
        `,
      veriables: {
        department: userdata.data.getUserById.department,
      },
    });
  } else if (userdata.data.getUserById.department == "CRSR") {
    processcount = await ApiCall({
      query: `
          query officerFileProgress($department:String!){
              officerFileProgress(department:$department){
              BIRTHCERT{
                pending,
                completed,
                rejected
              },
              BIRTHTEOR{
                pending,
                completed,
                rejected
              },
              DEATHCERT{
                pending,
                completed,
                rejected
              },
              DEATHTEOR{
                pending,
                completed,
                rejected
              },
              MARRIAGECERT{
                pending,
                completed,
                rejected
              },
              MARRIAGETEOR{
                pending,
                completed,
                rejected
              },
              MARRIAGEREGISTER{
                pending,
                completed,
                rejected
              }
            }
          }
        `,
      veriables: {
        department: userdata.data.getUserById.department,
      },
    });
  } else if (userdata.data.getUserById.department == "PWD") {
    processcount = await ApiCall({
      query: `
          query officerFileProgress($department:String!){
              officerFileProgress(department:$department){
              TEMPWATERCONNECT{
                pending,
                completed,
                rejected
              },
              TEMPWATERDISCONNECT{
                pending,
                completed,
                rejected
              },
              WATERSIZECHANGE{
                pending,
                completed,
                rejected
              },
              NEWWATERCONNECT{
                pending,
                completed,
                rejected
              },
              WATERRECONNECT{
                pending,
                completed,
                rejected
              },
              PERMANENTWATERDISCONNECT{
                pending,
                completed,
                rejected
              }
            }
          }
      `,
      veriables: {
        department: userdata.data.getUserById.department,
      },
    });
  } else if (userdata.data.getUserById.department == "EST") {
    processcount = await ApiCall({
      query: `
          query officerFileProgress($department:String!){
              officerFileProgress(department:$department){
              MARRIAGE{
                pending,
                completed,
                rejected
              },
              RELIGIOUS{
                pending,
                completed,
                rejected
              },
              ROADSHOW{
                pending,
                completed,
                rejected
              }
            }
          }
      `,
      veriables: {
        department: userdata.data.getUserById.department,
      },
    });
  } else if (userdata.data.getUserById.department == "DMC") {
    processcount = await ApiCall({
      query: `
          query officerFileProgress($department:String!){
              officerFileProgress(department:$department){
              BIRTHREGISTER{
                pending,
                completed,
                rejected
              },
              DEATHREGISTER{
                pending,
                completed,
                rejected
              }
            }
          }
      `,
      veriables: {
        department: userdata.data.getUserById.department,
      },
    });
  }

  const villageprocess = await ApiCall({
    query: `
        query villageFileProgress($department:String!){
            villageFileProgress(department:$department){
              village,
              fileCounts{
                formType,
                count
              }
            }
          }
      `,
    veriables: { department: userdata.data.getUserById.department },
  });

  return json({
    userdata: userdata.data.getUserById,
    filecount: filecount.data.getFileCount,
    villagecount: villagecount.data.villageFileCount,
    officercount: officercount.data.officerFileCount,
    processcount: processcount.data.officerFileProgress,
    villageprocess: villageprocess.data.villageFileProgress,
  });
};

const DashBoard = (): JSX.Element => {
  const loader = useLoaderData();
  const filecount = loader.filecount;
  const villagecount = loader.villagecount;
  const officercount = loader.officercount;
  const processcount = loader.processcount;
  const villageprocess = loader.villageprocess;
  const userdata = loader.userdata;

  const achangeindex = sideBarStore((state) => state.changeTab);

  villagecount.sort((a: any, b: any) => b.count - a.count);

  // const topItems = villagecount.slice(0, 10);
  // const otherCount = villagecount
  //   .slice(10)
  //   .reduce((sum: any, item: any) => sum + item.count, 0);

  // const otherDataset =
  //   otherCount !== 0
  //     ? {
  //         label: "Other",
  //         data: [otherCount],
  //         backgroundColor: "rgba(192, 192, 192, 0.75)",
  //         borderColor: "rgba(255, 255, 255, 1)",
  //         borderWidth: 1,
  //       }
  //     : null;

  // const dynamicColors = (numColors: any) => {
  //   const colors = [];
  //   for (let i = 0; i < numColors; i++) {
  //     const r = Math.floor(Math.random() * 256);
  //     const g = Math.floor(Math.random() * 256);
  //     const b = Math.floor(Math.random() * 256);
  //     const color = `rgba(${r}, ${g}, ${b}, 0.75)`;
  //     colors.push(color);
  //   }
  //   return colors;
  // };

  // const topItemColors = dynamicColors(topItems.length);

  // const villageData = {
  //   labels: [
  //     ...topItems.map((item: any) => item.village),
  //     ...(otherDataset ? ["Other"] : []),
  //   ],
  //   datasets: [
  //     {
  //       label: "# of Votes",
  //       data: [
  //         ...topItems.map((item: any) => item.count),
  //         ...(otherDataset ? [otherCount] : []),
  //       ],
  //       backgroundColor: [
  //         ...topItemColors,
  //         ...(otherDataset ? ["rgba(192, 192, 192, 0.75)"] : []),
  //       ],
  //       borderColor: [
  //         ...topItemColors.map((color) => color.replace("0.2", "1")),
  //         ...(otherDataset ? ["rgba(255, 255, 255, 1)"] : []),
  //       ],
  //       borderWidth: 1,
  //     },
  //   ],
  // };

  // const villageOptions: any = {
  //   responsive: true,
  //   plugins: {
  //     datalabels: {
  //       anchor: "center",
  //       align: "center",
  //       color: "#1e293b",
  //       font: {
  //         size: 30,
  //       },
  //       formatter: function (value: any) {
  //         return value;
  //       },
  //     },
  //     legend: {
  //       labels: {
  //         font: {
  //           size: 25,
  //         },
  //       },
  //     },
  //   },
  // };

  // const officerDataColors = dynamicColors(officercount.length);

  const officerData = {
    labels: officercount.map((val: any) => val.auth_user_id),
    datasets: [
      {
        data: officercount.map((val: any) => val.count),
        // backgroundColor: officerDataColors,
        // borderColor: officerDataColors,
        // borderWidth: 1,
      },
    ],
  };

  const officerOptions: any = {
    responsive: true,
    plugins: {
      datalabels: {
        anchor: "center",
        align: "center",
        color: "#ffffff",
        font: {
          size: 20,
        },
        formatter: function (value: any) {
          return value;
        },
      },
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            size: 12,
          },
        },
      },
    },
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        barThickness: 10,
        categoryPercentage: 0.8,
        barPercentage: 0.9,
        ticks: {
          font: {
            size: 12,
          },
          precision: 0,
        },
      },
      y: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
    indexAxis: "x",
    elements: {
      bar: {
        borderWidth: 2,
        categorySpacing: 0,
      },
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "end",
        color: "#1e293b",
        font: {
          size: 10,
        },
        formatter: function (value: any) {
          return value;
        },
      },

      labels: {
        color: "white",
      },
      title: {
        display: false,
      },
      legend: {
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  let labels = [];
  if (userdata.department == "PDA") {
    labels = [
      "RTI",
      "Old Copy",
      "Zone",
      "Petroleum",
      "Unauthorized",
      "Land Section",
      // "CP",
      // "OC",
      // "PLINTH",
    ];
  } else if (userdata.department == "CRSR") {
    labels = [
      "Birth Cert",
      "Birth Teor",
      "Death Cert",
      "Death Teor",
      "Marriage Cert",
      "Marriage Teor",
      "New Marriage Register",
    ];
  } else if (userdata.department == "PWD") {
    labels = [
      "New Water Connection",
      "Temp Water Connection",
      "Temp Water Disconnection",
      "Size Change",
      "Water Reconnection",
      "Permanent Disconnection",
    ];
  } else if (userdata.department == "DMC") {
    labels = ["New Birth Register", "Death Register"];
  } else if (userdata.department == "EST") {
    labels = [
      "Marriage Permission",
      "Roadshow Permission",
      "Religious Permission",
    ];
  } else {
    labels = ["NONE"];
  }

  const pendingData: number[] = [];
  const completedData: number[] = [];
  const rejectedData: number[] = [];

  const processlabels: string[] = Object.keys(processcount);

  processlabels.forEach((label: string) => {
    pendingData.push(processcount[label].pending);
    completedData.push(processcount[label].completed);
    rejectedData.push(processcount[label].rejected);
  });

  const data = {
    labels: labels,
    datasets: [
      {
        label: "In Process",
        data: pendingData,
        backgroundColor: "#059bff",
        borderWidth: 0,
      },
      {
        label: "Approved",
        data: completedData,
        backgroundColor: "#22cfcf",
        borderWidth: 0,
      },
      {
        label: "Rejected",
        data: rejectedData,
        backgroundColor: "#ff4069",
        borderWidth: 0,
      },
    ],
  };

  const villageNames = villageprocess.map((data: any) => data.village);

  const fileTypes = villageprocess[0].fileCounts.map(
    (fileCount: any) => fileCount.formType
  );

  const datasets: any = [];
  fileTypes.forEach((fileType: any) => {
    const fileData = villageprocess.map((data: any) => {
      const countObj = data.fileCounts.find(
        (fileCount: any) => fileCount.formType === fileType
      );
      return countObj ? countObj.count : 0;
    });
    const dataset = {
      label: fileType,
      data: fileData,
      borderWidth: 1,
    };
    datasets.push(dataset);
  });

  const villageprocessdata = {
    labels: villageNames.slice(0, 15),
    datasets: datasets,
  };

  const villageprocessoptions = {
    tooltips: {
      enabled: true,
    },
    responsive: true,
    datalabels: {
      display: false,
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 14,
          },
          precision: 0,
        },
        stacked: true,
      },
      y: {
        ticks: {
          font: {
            size: 14,
          },
          precision: 0,
        },
        stacked: true,
      },
    },
  };
  return (
    <>
      <div className="my-4 grid grid-cols-3 gap-4">
        {userdata.department == "PDA" ? (
          <>
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.ZoneInfo)}
              title="Zone Info"
              color="bg-gradient-to-r from-rose-400 to-rose-600"
              textcolor="text-rose-500"
              link="/home/vzoneinfo"
              value={filecount.ZONE}
              icon={MdiSelectionMultipleMarker}
            />
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.OldCopy)}
              title="Old Copy"
              color="bg-gradient-to-r from-cyan-400 to-cyan-600"
              textcolor="text-cyan-500"
              link="/home/voldcopy"
              value={filecount.OLDCOPY}
              icon={TablerMap2}
            />
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.Rti)}
              title="RTI"
              color="bg-gradient-to-r from-blue-400 to-blue-600"
              textcolor="text-blue-500"
              link="/home/vrti"
              value={filecount.RTI}
              icon={MdiFileLockOpen}
            />
            {/* <DashboradCard
          onclick={() => achangeindex(SideBarTabs.Cp)}
          title="CP"
          color="bg-gradient-to-r from-blue-400 to-blue-600"
          textcolor="text-blue-500"
          link="/home/vcp"
          value={filecount.CP}
        />
        <DashboradCard
          onclick={() => achangeindex(SideBarTabs.Oc)}
          title="OC"
          color="bg-gradient-to-r from-blue-400 to-blue-600"
          textcolor="text-blue-500"
          link="/home/voc"
          value={filecount.OC}
        />
        <DashboradCard
          onclick={() => achangeindex(SideBarTabs.Plinth)}
          title="PLINTH"
          color="bg-gradient-to-r from-blue-400 to-blue-600"
          textcolor="text-blue-500"
          link="/home/vplinth"
          value={filecount.PLINTH}
        /> */}
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.Petroleum)}
              title="Petroleum"
              color="bg-gradient-to-r from-green-400 to-green-600"
              textcolor="text-green-500"
              link="/home/vpetroleum"
              value={filecount.PETROLEUM}
              icon={MingcuteGasStationFill}
            />
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.Unauthorisd)}
              title="Unauthorized"
              color="bg-gradient-to-r from-slate-400 to-slate-600"
              textcolor="text-slate-500"
              link="/home/vunauthorised"
              value={filecount.UNAUTHORIZED}
              icon={LineMdConstruction}
            />
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.landSection)}
              title="Land Section"
              color="bg-gradient-to-r from-indigo-400 to-indigo-600"
              textcolor="text-[#0984e3]"
              link="/home/vlandsection"
              value={filecount.LANDRECORDS}
              icon={Fa6SolidLandmark}
            />
          </>
        ) : null}

        {userdata.department == "CRSR" ? (
          <>
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.BirthCert)}
              title="Birth Cert"
              color="bg-gradient-to-r from-green-400 to-green-600"
              textcolor="text-green-500"
              link="/home/vbirthcert"
              value={filecount.BIRTHCERT}
              icon={MingcuteCertificate2Line}
            />
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.BirthTeor)}
              title="Birth Teor"
              color="bg-gradient-to-r from-slate-400 to-slate-600"
              textcolor="text-slate-500"
              link="/home/vbirthteor"
              value={filecount.BIRTHTEOR}
              icon={IcBaselineFileCopy}
            />
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.DeathCert)}
              title="Death Cert"
              color="bg-gradient-to-r from-indigo-400 to-indigo-600"
              textcolor="text-[#0984e3]"
              link="/home/vdeathcert"
              value={filecount.DEATHCERT}
              icon={TablerFileCertificate}
            />
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.DeathTeor)}
              title="Death Teor"
              color="bg-gradient-to-r from-indigo-400 to-indigo-600"
              textcolor="text-[#0984e3]"
              link="/home/vdeathteor"
              value={filecount.DEATHTEOR}
              icon={HealthiconsICertificatePaper}
            />
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.MarriageCert)}
              title="Marriage Cert"
              color="bg-gradient-to-r from-green-400 to-green-600"
              textcolor="text-green-500"
              link="/home/vmarriagecert"
              value={filecount.MARRIAGECERT}
              icon={PhCertificateBold}
            />
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.MarriageTeor)}
              title="Marriage Teor"
              color="bg-gradient-to-r from-slate-400 to-slate-600"
              textcolor="text-slate-500"
              link="/home/vmarriageteor"
              value={filecount.MARRIAGETEOR}
              icon={PhNewspaperClippingLight}
            />

            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.NewMarriage)}
              title="New Marriage Register"
              color="bg-gradient-to-r from-indigo-400 to-indigo-600"
              textcolor="text-[#0984e3]"
              link="/home/vmarriageregister"
              value={filecount.MARRIAGEREGISTER}
              icon={EmojioneMonotoneCoupleWithHeart}
            />
          </>
        ) : null}
        {userdata.department == "PWD" ? (
          <>
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.NewWaterConnect)}
              title="New Water Connection"
              color="bg-gradient-to-r from-green-400 to-green-600"
              textcolor="text-green-500"
              link="/home/vnewwaterconnect"
              value={filecount.NEWWATERCONNECT}
              icon={FluentPipelineAdd32Filled}
            />
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.TempConnect)}
              title="Temp Water Connection"
              color="bg-gradient-to-r from-slate-400 to-slate-600"
              textcolor="text-slate-500"
              link="/home/vtempwaterconnect"
              value={filecount.TEMPWATERCONNECT}
              icon={FluentPipelineAdd32Filled}
            />
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.TempDisconnect)}
              title="Temp Water Disconnection"
              color="bg-gradient-to-r from-indigo-400 to-indigo-600"
              textcolor="text-[#0984e3]"
              link="/home/vtempwaterdisconnect"
              value={filecount.TEMPWATERDISCONNECT}
              icon={MdiPipeDisconnected}
            />
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.SizeChange)}
              title="Size Change"
              color="bg-gradient-to-r from-green-400 to-green-600"
              textcolor="text-green-500"
              link="/home/vwatersizechange"
              value={filecount.WATERSIZECHANGE}
              icon={FluentPipelineArrowCurveDown20Filled}
            />
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.WaterReconnect)}
              title="Water Reconnection"
              color="bg-gradient-to-r from-slate-400 to-slate-600"
              textcolor="text-slate-500"
              link="/home/vwaterreconnect"
              value={filecount.WATERRECONNECT}
              icon={MdiPipeLeak}
            />
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.PermanentDisconnect)}
              title="Permanent Disconnection"
              color="bg-gradient-to-r from-indigo-400 to-indigo-600"
              textcolor="text-[#0984e3]"
              link="/home/vpermanentwaterdisconnect"
              value={filecount.PERMANENTWATERDISCONNECT}
              icon={MdiPipeDisconnected}
            />
          </>
        ) : null}
        {userdata.department == "DMC" ? (
          <>
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.NewBirthRegister)}
              title="New Birth Register"
              color="bg-gradient-to-r from-slate-400 to-slate-600"
              textcolor="text-slate-500"
              link="/home/vnewbirthregister"
              value={filecount.BIRTHREGISTER}
              icon={PhBabyFill}
            />
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.NewDeathRegister)}
              title="Death Register"
              color="bg-gradient-to-r from-indigo-400 to-indigo-600"
              textcolor="text-[#0984e3]"
              link="/home/vnewdeathregister"
              value={filecount.DEATHREGISTER}
              icon={HealthiconsDeathAlt2}
            />
          </>
        ) : null}
        {userdata.department == "EST" ? (
          <>
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.Marriage)}
              title="Marriage Permission"
              color="bg-gradient-to-r from-green-400 to-green-600"
              textcolor="text-green-500"
              link="/home/vmarriage"
              value={filecount.MARRIAGE}
              icon={IconParkTwotoneDiamondRing}
            />
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.RoadShow)}
              title="Roadshow Permission"
              color="bg-gradient-to-r from-slate-400 to-slate-600"
              textcolor="text-slate-500"
              link="/home/vroadshow"
              value={filecount.ROADSHOW}
              icon={Fa6SolidPeopleGroup}
            />
            <DashboradCard
              onclick={() => achangeindex(SideBarTabs.Religious)}
              title="Religious Permission"
              color="bg-gradient-to-r from-indigo-400 to-indigo-600"
              textcolor="text-[#0984e3]"
              link="/home/vreligious"
              value={filecount.RELIGIOUS}
              icon={IcBaselineTempleHindu}
            />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex-1 bg-white p-4">
          <h1 className="text-gray-800 text-sm font-semibold">
            Officer Wise Files
          </h1>
          <div className="mx-auto">
            <Doughnut data={officerData} options={officerOptions} />
          </div>
        </div>
        <div className="h-full bg-white gird place-items-center">
          <div className="p-4 flex flex-col h-full">
            <h1 className="text-gray-800 text-sm font-semibold">File status</h1>
            <div className="grow"></div>
            <div className="w-full h-96">
              <Bar className="" options={options} data={data} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-lg px-8 py-4 my-4 mb-10">
        <h1 className="text-gray-800 text-sm font-semibold">
          Village vs FileType
        </h1>
        <Bar options={villageprocessoptions} data={villageprocessdata} />
      </div>
    </>
  );
};
export default DashBoard;

interface DashboradCardProps {
  title: string;
  link: string;
  value: number;
  color: string;
  textcolor: string;
  onclick: () => void;
  icon: React.FC<{ className?: string }>;
}

const DashboradCard: React.FC<DashboradCardProps> = (
  props: DashboradCardProps
): JSX.Element => {
  return (
    <div
      className="bg-white flex items-start p-10 gap-4 cursor-pointer"
      onClick={props.onclick}
    >
      <div className="grow">
        <p
          className={`grow text-sm leading-[0.75rem] text-gray-800 font-semibold`}
        >
          {props.title}
        </p>
        <p className={`grow text-2xl text-black font-medium`}>{props.value}</p>
      </div>
      <div>
        <props.icon className={`text-3xl ${props.textcolor}`}></props.icon>
      </div>
    </div>
  );
};
