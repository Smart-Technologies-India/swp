import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Fa6SolidFileLines, Fa6SolidLink } from "~/components/icons/icons";
import { userPrefs } from "~/cookies";
import { ApiCall, UploadFile } from "~/services/api";
// import {
//   Page,
//   Text,
//   View,
//   Document,
//   StyleSheet,
//   Font,
//   PDFViewer,
//   PDFDownloadLink,
//   renderToFile,
//   usePDF,
//   pdf,
//   Image,
// } from "@react-pdf/renderer";
import { z } from "zod";
import QueryTabs from "~/components/QueryTabs";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const id = props.params.id;
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  const data = await ApiCall({
    query: `
        query getPetroleumById($id:Int!){
            getPetroleumById(id:$id){
              id,
              name,
              address,
              mobile,
              email,
              userId,
              company_name,
              company_region,
              designation,
              survey_no,
              village_id,
              sub_division,
              noc_type,
              class_type,
              outlet_type,
              capacity,
              iagree,
              noc_fire_url,
              na_order_url,
              sanad_url,
              coastguard_url,
              plan_url,
              explosive_url,
              condition_to_follow,
              comments_dept
            }
          }
      `,
    veriables: {
      id: parseInt(id!),
      form_type: "PETROLEUM",
    },
  });

  const submit = await ApiCall({
    query: `
        query searchCommon($searchCommonInput:SearchCommonInput!){
            searchCommon(searchCommonInput:$searchCommonInput){
              id,
              village,
              name,
              form_type,
              user_id,
              auth_user_id,
              focal_user_id,
              intra_user_id,
              inter_user_id,
              number,
              form_status,
              query_status
            }
          }
      `,
    veriables: {
      searchCommonInput: {
        form_id: parseInt(id!),
        form_type: "PETROLEUM",
      },
    },
  });

  const village = await ApiCall({
    query: `
        query getAllVillageById($id:Int!){
            getAllVillageById(id:$id){
              id,
              name
            }
          }
      `,
    veriables: {
      id: parseInt(data.data.getPetroleumById.village_id),
    },
  });

  const subdivision = await ApiCall({
    query: `
        query getSubDivision($searchSurveyInput:SearchSurveyInput!){
            getSubDivision(searchSurveyInput:$searchSurveyInput){
              sub_division,
              owner_name,
              area,
              zone
            }
          }
      `,
    veriables: {
      searchSurveyInput: {
        villageId: parseInt(data.data.getPetroleumById.village_id),
        survey_no: data.data.getPetroleumById.survey_no,
      },
    },
  });

  return json({
    id: id,
    user: cookie,
    from_data: data.data.getPetroleumById,
    submit: submit.status,
    village: village.data.getAllVillageById,
    subdivision: subdivision.data.getSubDivision,
    common: submit.data.searchCommon,
  });
};

const Petroleum: React.FC = (): JSX.Element => {
  const loader = useLoaderData();
  const user = loader.user;
  const villagedata = loader.village;
  const from_data = loader.from_data;
  const division = loader.subdivision;
  const id = loader.id;

  const isSubmited = loader.submit;

  const isUser = user.role == "USER";

  const common = isSubmited ? loader.common[0] : null;

  interface landDetailsType {
    land: string | null;
    area: string | null;
    zone: string | null;
  }

  const [landDetails, setLandDetails] = useState<landDetailsType>({
    area: null,
    land: null,
    zone: null,
  });
  const navigator = useNavigate();

  const setlanddetails = (value: string) => {
    const selectedSubdivision = division.find(
      (val: any) => val.sub_division === value
    );
    if (selectedSubdivision) {
      setLandDetails((val) => ({
        land: selectedSubdivision.owner_name,
        area: selectedSubdivision.area,
        zone: selectedSubdivision.zone,
      }));
    }
  };

  useEffect(() => {
    setlanddetails(from_data.sub_division);
  }, []);

  const submit = async () => {
    const authuserid = await ApiCall({
      query: `
            query getuserid($filetype:String!){
                getuserid(filetype:$filetype)
              }
            `,
      veriables: {
        filetype: "PETROLEUM",
      },
    });
    const data = await ApiCall({
      query: `
            mutation createCommon($createCommonInput:CreateCommonInput!){
                createCommon(createCommonInput:$createCommonInput){
                  id,
                }
              }
            `,
      veriables: {
        createCommonInput: {
          form_id: Number(from_data.id),
          user_id: Number(user.id),
          // "auth_user_id": "5",
          // "focal_user_id": "5",
          // "intra_user_id": "3,4",
          // "inter_user_id": "0",
          auth_user_id: authuserid.data.getuserid.toString(),
          focal_user_id: "5",
          intra_user_id: "5,12",
          inter_user_id: "0",
          village: villagedata.name,
          name: from_data.name,
          number: from_data.mobile.toString(),
          // "form_status": 1,
          form_status: 50,
          form_type: "PETROLEUM",
          query_status: "SUBMIT",
        },
      },
    });
    if (!data.status) {
      toast.error(data.message, { theme: "light" });
    } else {
      navigator("/home/");
    }
  };

  const [notings, setNotings] = useState<any[]>([]);

  const getNotings = async () => {
    const data = await ApiCall({
      query: `
                query searchQuery($searchQueryInput:SearchQueryInput!){
                    searchQuery(searchQueryInput:$searchQueryInput){
                        id,
                      from_user_id,
                      to_user_id
                      remark
                      doc_url,
                      createdAt,
                      query_type,
                        from_user{
                        name,
                        role
                      },
                      to_user{
                        name,
                        role
                      }
                    }
                  }
                `,
      veriables: {
        searchQueryInput: {
          form_id: from_data.id,
          stage: "PETROLEUM",
          query_type: isUser ? "PUBLIC" : "INTRA",
        },
      },
    });
    if (data.status) {
      setNotings((val) => data.data.searchQuery);
    }
  };
  useEffect(() => {
    getNotings();
  }, []);

  const [forwardbox, setForwardBox] = useState<boolean>(false);
  const forwardRef = useRef<HTMLTextAreaElement>(null);

  const attachmentRef = useRef<HTMLInputElement>(null);
  const [attachment, setAttachment] = useState<File>();

  interface forwardqueryType {
    title: string;
    formstatus: number;
    querytype: string;
    authuserid: string;
    foacaluserid: string;
    intrauserid: string;
    interuserid: string;
    touserid: number;
    querystatus: string;
  }

  const [nextdata, setNextData] = useState<forwardqueryType>({
    title: "Send to JTP",
    authuserid: "0",
    foacaluserid: "0",
    intrauserid: "0",
    interuserid: "0",
    formstatus: 0,
    querytype: "NONE",
    touserid: 0,
    querystatus: "NONE",
  });

  const handleLogoChange = (
    value: React.ChangeEvent<HTMLInputElement>,
    setvalue: Function
  ) => {
    let file_size = parseInt(
      (value!.target.files![0].size / 1024 / 1024).toString()
    );
    if (file_size < 4) {
      setvalue((val: any) => value!.target.files![0]);
    } else {
      toast.error("Image file size must be less then 4 mb", { theme: "light" });
    }
  };

  const forwardQuery = async (args: forwardqueryType) => {
    if (forwardRef.current?.value == null || forwardRef.current?.value == "")
      return toast.error("Remark is required", { theme: "light" });
    const req: { [key: string]: any } = {
      stage: "PETROLEUM",
      form_id: from_data.id,
      from_user_id: Number(user.id),
      to_user_id: args.touserid,
      form_status: args.formstatus,
      query_type: args.querytype,
      remark: forwardRef.current?.value,
      query_status: "SENT",
    };

    if (attachment != null) {
      const attach = await UploadFile(attachment);
      if (attach.status) {
        req.doc_url = attach.data;
      } else {
        return toast.error("Unable to upload attachment", { theme: "light" });
      }
    }

    const data = await ApiCall({
      query: `
            mutation createQuery($createQueryInput:CreateQueryInput!){
                createQuery(createQueryInput:$createQueryInput){
                  id,
                }
              }
            `,
      veriables: {
        createQueryInput: req,
      },
    });

    if (data.status) {
      const data = await ApiCall({
        query: `
                mutation updateCommonById($updateCommonInput:UpdateCommonInput!){
                    updateCommonById(updateCommonInput:$updateCommonInput){
                      id,
                    }
                  }
              `,
        veriables: {
          updateCommonInput: {
            id: common.id,
            auth_user_id: args.authuserid,
            focal_user_id: args.foacaluserid,
            intra_user_id: args.intrauserid,
            inter_user_id: args.interuserid,
            form_status: args.formstatus,
            query_status: args.querystatus,
          },
        },
      });

      if (!data.status) {
        toast.error(data.message, { theme: "light" });
      } else {
        setForwardBox((val) => false);
        toast.success("Form sent successfully.", { theme: "light" });
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } else {
      return toast.error(data.message, { theme: "light" });
    }
  };

  Font.register({
    family: "Oswald",
    src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
  });

  // const styles = StyleSheet.create({
  //   body: {
  //     paddingTop: 15,
  //     paddingBottom: 35,
  //     paddingHorizontal: 35,
  //   },
  //   heading: {
  //     fontSize: 14,
  //     textAlign: "center",
  //     fontFamily: "Oswald",
  //   },
  //   title: {
  //     marginTop: "10px",
  //     marginBottom: "10px",
  //     fontSize: 10,
  //     textAlign: "center",
  //     color: "grey",
  //     width: "100%",
  //   },
  //   subtitle: {
  //     fontSize: 10,
  //     textAlign: "left",
  //     color: "grey",
  //     width: "100%",
  //   },
  //   header: {
  //     marginTop: "15px",
  //     marginBottom: "10px",
  //     backgroundColor: "#c1dafe",
  //     paddingVertical: "8px",
  //     fontSize: "14px",
  //     color: "#1f2937",
  //     textAlign: "center",
  //     fontWeight: "normal",
  //   },
  //   myflex: {
  //     display: "flex",
  //     flexDirection: "row",
  //     width: "100%",
  //     borderBottom: "1px solid #6b7280",
  //   },
  //   text1: {
  //     fontSize: "12px",
  //     fontWeight: "normal",
  //     color: "#374151",
  //     flex: 2,
  //     padding: "4px 8px",
  //     backgroundColor: "#f6f7f8",
  //     borderRight: "1px solid #6b7280",
  //   },
  //   text2: {
  //     fontSize: "12px",
  //     fontWeight: "normal",
  //     color: "#374151",
  //     flex: 3,
  //     padding: "4px 8px",
  //   },
  //   divider: {
  //     width: "100%",
  //     height: "1px",
  //     backgroundColor: "#6b7280",
  //     marginVertical: "2px",
  //   },
  //   flexbox: {
  //     display: "flex",
  //     flexDirection: "row",
  //     width: "100%",
  //     marginTop: "55px",
  //   },
  //   flexbox1: {
  //     flex: 4,
  //   },
  //   flexbox2: {
  //     fontSize: "12px",
  //     fontWeight: "normal",
  //     color: "#374151",
  //     flex: 2,
  //   },
  //   img: {
  //     width: "140px",
  //     height: "60px",
  //     objectFit: "fill",
  //     objectPosition: "center",
  //   },
  //   signtext: {
  //     fontSize: "12px",
  //     fontWeight: "normal",
  //     color: "#374151",
  //     marginTop: "10px",
  //   },
  // });

  // const PetroleumPdf = () => (
  //   <Document>
  //     <Page style={styles.body} size={"A4"}>
  //       <View>
  //         <Text style={styles.heading}>
  //           U.T. Administration of Dadra & Nagar Haveli and Daman & Diu,
  //         </Text>
  //       </View>
  //       <View>
  //         <Text style={styles.heading}>
  //           Town & Country Planning Department,
  //         </Text>
  //       </View>
  //       <View>
  //         <Text style={styles.heading}>
  //           First Floor, Collectorate, Moti Daman.
  //         </Text>
  //       </View>

  //       <View>
  //         <Text style={styles.subtitle} fixed>
  //           To,
  //         </Text>
  //       </View>
  //       <View>
  //         <Text style={styles.subtitle} fixed>
  //           The Addl.District Magistrate,Daman,
  //         </Text>
  //       </View>

  //       <View>
  //         <Text style={styles.subtitle} fixed>
  //           Collectorate,
  //         </Text>
  //       </View>
  //       <View>
  //         <Text style={styles.subtitle} fixed>
  //           Daman.
  //         </Text>
  //       </View>
  //       <View>
  //         <Text style={styles.subtitle} fixed>
  //           Sub: Regarding grant of NOC for (capacity) KL petroleum (class A)
  //           storage under Rule 144 of petroleum Rules-2002.
  //         </Text>
  //       </View>

  //       <View>
  //         <Text style={styles.subtitle} fixed>
  //           Sir,
  //         </Text>
  //       </View>

  //       <View>
  //         <Text style={styles.subtitle} fixed>
  //           In Reference to your letter on the above cited subject, the proposal
  //           is scrutinized from planning point of view and the following report
  //           / comments are hereby forwarded.
  //         </Text>
  //       </View>

  //       <View style={styles.myflex}>
  //         <Text style={styles.text1}>
  //           2.10 Condition(s) is to be mentioned in N.A. Sanad/order if N.A is
  //           granted.
  //         </Text>
  //         <Text style={styles.text2}>{from_data.condition_to_follow}</Text>
  //       </View>
  //       <View style={styles.myflex}>
  //         <Text style={styles.text1}>2.11 If no, the reason thereof</Text>
  //         <Text style={styles.text2}>{from_data.comments_dept}</Text>
  //       </View>

  //       <View style={styles.flexbox}>
  //         <View style={styles.flexbox1}>
  //           <Image src={"/images/signone.jpg"} style={styles.img}></Image>
  //           <Text style={styles.signtext}>AD(SP)</Text>
  //         </View>
  //         <View style={styles.flexbox2}>
  //           <Image src={"/images/signtwo.jpg"} style={styles.img}></Image>
  //           <Text style={styles.signtext}>JTP</Text>
  //         </View>
  //       </View>
  //     </Page>
  //   </Document>
  // );

  const conditionRef = useRef<HTMLTextAreaElement>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const updatesubmit = async (): Promise<boolean> => {
    const PetroleumScheme = z
      .object({
        id: z.number({ required_error: "Zone is required." }),
        condition_to_follow: z
          .string()
          .nonempty("Condition to follow is required."),
        comments_dept: z.string().nonempty("Rejection reason is required."),
      })
      .strict();

    type PetroleumScheme = z.infer<typeof PetroleumScheme>;

    const petroleumScheme: PetroleumScheme = {
      id: parseInt(id),
      condition_to_follow: conditionRef!.current!.value,
      comments_dept: commentRef!.current!.value,
    };

    const parsed = PetroleumScheme.safeParse(petroleumScheme);

    if (parsed.success) {
      const data = await ApiCall({
        query: `
                mutation updatePetroleumById($updatePetroleumInput:UpdatePetroleumInput!){
                    updatePetroleumById(updatePetroleumInput:$updatePetroleumInput){
                        id
                    }
                }`,
        veriables: {
          updatePetroleumInput: petroleumScheme,
        },
      });
      if (!data.status) {
        toast.error(data.message, { theme: "light" });
        return false;
      } else {
        return true;
      }
    } else {
      toast.error(parsed.error.errors[0].message, { theme: "light" });
      return false;
    }
  };

  return (
    <>
      {/* forward box start here */}
      <div
        className={`fixed top-0 left-0 bg-black bg-opacity-20 min-h-screen w-full  z-50 ${
          forwardbox ? "grid place-items-center" : "hidden"
        }`}
      >
        <div className="bg-white p-4 rounded-md w-80">
          <h3 className="text-2xl text-center font-semibold">
            {nextdata.title}
          </h3>
          <textarea
            ref={forwardRef}
            placeholder="Information Needed"
            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none my-4"
          ></textarea>
          <div className="flex-none flex flex-col gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={attachmentRef}
                accept="*/*"
                onChange={(e) => handleLogoChange(e, setAttachment)}
              />
            </div>
            <button
              onClick={() => attachmentRef.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-[#0984e3] text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {attachment == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {attachment != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(attachment)}
                className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-yellow-500 text-center rounded-md font-medium"
              >
                <Fa6SolidFileLines></Fa6SolidFileLines>
                <p>View Doc.</p>
              </a>
            ) : null}
          </div>
          <div className="w-full h-[2px] bg-gray-800 my-4"></div>
          <div className="flex flex-wrap gap-6 mt-4">
            <button
              onClick={() => forwardQuery(nextdata)}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium grow"
            >
              Proceed
            </button>
            <button
              onClick={() => setForwardBox((val) => false)}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium grow"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      {/* forward box end here */}
      <div className="bg-white rounded-md shadow-lg p-4 my-4 w-full">
        <h1 className="text-gray-800 text-2xl font-semibold text-center">
          Petroleum NOC
        </h1>
        <div className="w-full flex gap-4 my-4">
          <div className="grow bg-gray-700 h-[2px]"></div>
          <div className="w-10 bg-gray-500 h-[3px]"></div>
          <div className="grow bg-gray-700 h-[2px]"></div>
        </div>
        <p className="text-center font-semibold text-xl text-gray-800">
          {" "}
          SUBJECT : Application for issuance of Petroleum NOC{" "}
        </p>

        {/*--------------------- section 1 start here ------------------------- */}
        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            1. Land Details{" "}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">1.1</span> Applicant village
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {villagedata.name}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">1.2</span> Survey No
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.survey_no}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">1.3</span> Sub Division
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.sub_division}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">1.4</span> Land Owner
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {landDetails.land == null ||
            landDetails.land == undefined ||
            landDetails.land == ""
              ? "-"
              : landDetails.land}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.5</span> Area
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {landDetails.area == null ||
            landDetails.area == undefined ||
            landDetails.area == ""
              ? "-"
              : landDetails.area}
          </div>
        </div>

        {/*--------------------- section 1 end here ------------------------- */}

        {/*--------------------- section 2 start here ------------------------- */}
        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            {" "}
            2. Applicant Details(s){" "}
          </p>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.1</span> Applicant Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto">
            <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
              {from_data.name}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.2</span> Applicant Address
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.address}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.3</span> Applicant Contact Number
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.mobile}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.4</span> Applicant Email
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.email}
          </div>
        </div>

        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.5</span> Company Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.company_name}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.6</span> Company Region
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.company_region}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.7</span> Designation
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.designation}
          </div>
        </div>

        {/*--------------------- section 2 end here ------------------------- */}

        {/*--------------------- section 3 start here ------------------------- */}
        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            {" "}
            3. Permission Details{" "}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">3.1</span> NOC Type
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.noc_type}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">3.2</span> Class Type
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.class_type}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">3.3</span> Outlet Type
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.outlet_type}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">3.4</span> Capacity
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.capacity}
          </div>
        </div>

        {/*--------------------- section 3 end here ------------------------- */}

        {/*--------------------- section 4 start here ------------------------- */}

        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            {" "}
            4. Document Attachment{" "}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">4.1</span> NOC Fire
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <a
              target="_blank"
              href={from_data.noc_fire_url}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink> View Doc.
              </div>
            </a>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">4.2</span> NA Order
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <a
              target="_blank"
              href={from_data.na_order_url}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink> View Doc.
              </div>
            </a>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">4.3</span> Sanad Order
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <a
              target="_blank"
              href={from_data.sanad_url}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink> View Doc.
              </div>
            </a>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">4.4</span> Coast Guard NOC
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <a
              target="_blank"
              href={from_data.coastguard_url}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink> View Doc.
              </div>
            </a>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">4.5</span> Site Plan Attachment
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <a
              target="_blank"
              href={from_data.plan_url}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink> View Doc.
              </div>
            </a>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">4.6</span> Explosive Attachment
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <a
              target="_blank"
              href={from_data.explosive_url}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink> View Doc.
              </div>
            </a>
          </div>
        </div>

        {/*--------------------- section 4 end here ------------------------- */}

        {(common.form_status == 50 && user.id == 12) ||
        (common.form_status == 75 && (user.id == 6 || user.id == 12)) ||
        (common.form_status == 100 &&
          (user.id == 5 || user.id == 6 || user.id == 12)) ? (
          <>
            {/*--------------------- section 2 start here ------------------------- */}
            <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
              <p className="text-left font-semibold text-xl text-white">
                {" "}
                5. Department Comments{" "}
              </p>
            </div>

            <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
              <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                <span className="mr-2">5.1</span> Reports/comments
              </div>
              {from_data.condition_to_follow == undefined ? (
                <div className="flex-none lg:flex-1 w-full lg:w-auto">
                  <textarea
                    ref={conditionRef}
                    placeholder="Your Comment here"
                    className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 resize-none h-32"
                  ></textarea>
                </div>
              ) : (
                <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
                  {from_data.condition_to_follow}
                </div>
              )}
            </div>
            <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
              <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                <span className="mr-2">5.2</span> Feedback
              </div>
              {from_data.comments_dept == undefined ? (
                <div className="flex-none lg:flex-1 w-full lg:w-auto">
                  <textarea
                    ref={commentRef}
                    placeholder="Your Comment here"
                    className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 resize-none h-32"
                  ></textarea>
                </div>
              ) : (
                <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
                  {from_data.comments_dept}
                </div>
              )}
            </div>
          </>
        ) : null}

        {user.id == from_data.userId ? null : (
          <>
            <div className="flex flex-wrap gap-6 mt-4">
              <Link
                to={"/home/"}
                className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium"
              >
                Close
              </Link>

              {/* atp button */}
              {/* {common.form_status == 1 && user.id == 5 ?
                                    <button
                                        onClick={() => {
                                            setForwardBox(val => true);
                                            setNextData(val => ({
                                                title: "Forward to JTP",
                                                formstatus: 25,
                                                querytype: "INTRA",
                                                authuserid: "6",
                                                foacaluserid: "5",
                                                intrauserid: "5,6",
                                                interuserid: "0",
                                                touserid: 6,
                                                querystatus: "INPROCESS"

                                            }));
                                        }}
                                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                                    >
                                        Forward to JTP
                                    </button>
                                    :
                                    null
                                } */}
              {/* jtp button */}
              {/* {common.form_status == 25 && user.id == 6 ?
                                    <button
                                        onClick={() => {
                                            setForwardBox(val => true);
                                            setNextData(val => ({
                                                title: "Forward to AD(SP)",
                                                formstatus: 50,
                                                querytype: "INTRA",
                                                authuserid: "12",
                                                foacaluserid: "5",
                                                intrauserid: "5,12",
                                                interuserid: "0",
                                                touserid: 12,
                                                querystatus: "INPROCESS"
                                            }));
                                        }}
                                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                                    >
                                        Forward to AD(SP)
                                    </button>
                                    :
                                    null
                                } */}
              {common.form_status == 1 && user.id == common.auth_user_id ? (
                <button
                  onClick={async () => {
                    const res = await updatesubmit();
                    if (res) {
                      setForwardBox((val) => true);
                      setNextData((val) => ({
                        title: "Forward to JTP",
                        formstatus: 75,
                        querytype: "INTRA",
                        authuserid: "6",
                        foacaluserid: "5",
                        intrauserid: "5,6,12",
                        interuserid: "0",
                        touserid: 6,
                        querystatus: "INPROCESS",
                      }));
                    }
                  }}
                  className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                >
                  Forward to JTP
                </button>
              ) : null}
              {common.form_status == 75 && user.id == 6 ? (
                <button
                  onClick={async () => {
                    setForwardBox((val) => true);
                    setNextData((val) => ({
                      title: "Forward to ATP",
                      formstatus: 100,
                      querytype: "INTRA",
                      authuserid: "5",
                      foacaluserid: "5",
                      intrauserid: "5,6,12",
                      interuserid: "0",
                      touserid: 5,
                      querystatus: "INPROCESS",
                    }));
                  }}
                  className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                >
                  Forward to ATP
                </button>
              ) : null}
              {(common.form_status == 100 || common.form_status == 125) &&
              user.id == 5 ? (
                <Link
                  to={`/petroleumpdf/${from_data.id}`}
                  className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                >
                  View PDF
                </Link>
              ) : null}
            </div>
          </>
        )}

        {isSubmited ? null : 7 == from_data.userId ? (
          <>
            <div className="flex flex-wrap gap-6 mt-4">
              <Link
                to={"/home/"}
                className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium"
              >
                Discard & Close
              </Link>
              <button
                onClick={submit}
                className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
              >
                Preview & Proceed
              </button>
            </div>
          </>
        ) : null}
      </div>
      <div className="p-6 bg-white rounded-lg shadow-lg my-8">
        <h1 className="text-gray-800 text-2xl font-semibold text-center">
          {user.id == from_data.userId ? "Department Comment" : "Notings"}
        </h1>
        <div className="w-full flex gap-4 my-4">
          <div className="grow bg-gray-700 h-[2px]"></div>
          <div className="w-10 bg-gray-500 h-[3px]"></div>
          <div className="grow bg-gray-700 h-[2px]"></div>
        </div>
        {notings.length == 0 ? (
          <h3 className="text-2xl font-semibold text-center bg-rose-500 bg-opacity-25 rounded-md border-l-4 border-rose-500 py-2  text-rose-500">
            No queries pending.
          </h3>
        ) : (
          <>
            {notings.map((val: any, index: number) => {
              return (
                <div key={index}>
                  <QueryTabs
                    isUser={val.from_user_id == user.id}
                    message={val.remark}
                    date={val.createdAt}
                    doc={val.doc_url}
                    from_user={
                      val.from_user.role == "USER" ? "User" : val.from_user.name
                    }
                    to_user={
                      val.to_user.role == "USER" ? "User" : val.to_user.name
                    }
                  />
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

export default Petroleum;
