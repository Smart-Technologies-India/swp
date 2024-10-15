import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  pdf,
  Image,
} from "@react-pdf/renderer";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { userPrefs } from "~/cookies";
import { ApiCall, UploadFile } from "~/services/api";
import { toast } from "react-toastify";
import { z } from "zod";
import { Fa6SolidFileLines, Fa6SolidLink } from "~/components/icons/icons";
import QueryTabs from "~/components/QueryTabs";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const id = props.params.id;
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  const data = await ApiCall({
    query: `
        query getAllLandById($id:Int!){
            getAllLandById(id:$id){
              id,
              name,
              userId,
              address,
              mobile,
              email,
              survey_no,
              village_id,
              area,
              na_type,
              zone,
              road_access,
              no_road_access,
              width_adequate,
              is_dimension_plot_adequate,
              is_crz,
              is_monument,
              other_remark,
              atp_recommendation,
              comments_dept,
              condition_to_follow,
              status,
              land_stageid,
              land_formid,
              illegal_sqmt,
              attachments,
              recommend
            }
          }
      `,
    veriables: {
      id: parseInt(id!),
    },
  });

  const village = await ApiCall({
    query: `
        query getAllVillageById($id:Int!){
            getAllVillageById(id:$id){
              id,
              name,
            }
          }
      `,
    veriables: {
      id: parseInt(data.data.getAllLandById.village_id!),
    },
  });

  const common = await ApiCall({
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
              query_status,
            }
          }
      `,
    veriables: {
      searchCommonInput: {
        form_id: parseInt(id!),
        form_type: "LANDRECORDS",
      },
    },
  });

  return json({
    id: id,
    user: cookie,
    form: data.data.getAllLandById,
    village: village.data.getAllVillageById.name,
    common: common.data.searchCommon,
  });
};

const LandSection: React.FC = (): JSX.Element => {
  const loader = useLoaderData();
  const form = loader.form;
  const village = loader.village;
  const id = loader.id;
  const user = loader.user;

  const common = loader.common[0];
  const isUser = user.role == "USER";

  const zoneRef = useRef<HTMLInputElement>(null);
  const roadaccessRef = useRef<HTMLTextAreaElement>(null);
  const noroadaccessRef = useRef<HTMLTextAreaElement>(null);
  const widthRef = useRef<HTMLTextAreaElement>(null);
  const dimensionRef = useRef<HTMLTextAreaElement>(null);
  const crzRef = useRef<HTMLTextAreaElement>(null);
  const mounmentRef = useRef<HTMLTextAreaElement>(null);
  const otherremakRef = useRef<HTMLTextAreaElement>(null);
  const atpRef = useRef<HTMLTextAreaElement>(null);
  const conditionRef = useRef<HTMLTextAreaElement>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const illegalRef = useRef<HTMLInputElement>(null);
  const [recommend, setRecommend] = useState("recommend");

  const attachmentsRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<File>();

  const submit = async (): Promise<boolean> => {
    const LandScheme = z
      .object({
        id: z.number({ required_error: "Zone is required." }),
        zone: z.string().nonempty("Zone is required."),
        road_access: z.string().nonempty("Road access is required."),
        no_road_access: z.string().nonempty("width  is required."),
        width_adequate: z.string().nonempty("No Road access is required."),
        is_dimension_plot_adequate: z
          .string()
          .nonempty("Dimension plot is required."),
        is_crz: z.string().nonempty("Crz is required."),
        is_monument: z.string().nonempty("monument is required."),
        other_remark: z.string().nonempty("Other remark is required."),
        atp_recommendation: z
          .string()
          .nonempty("Atp recommendation is required."),
        condition_to_follow: z
          .string()
          .nonempty("Condition to follow is required."),
        comments_dept: z.string().nonempty("Rejection reason is required."),
        illegal_sqmt: z.string().nonempty("Road access is required."),
        recommend: z.boolean({ required_error: "Recommend is reqired." }),
      })
      .strict();

    type LandScheme = z.infer<typeof LandScheme>;

    const landScheme: LandScheme = {
      id: parseInt(id),
      zone: zoneRef!.current!.value,
      road_access: roadaccessRef!.current!.value,
      no_road_access: noroadaccessRef!.current!.value,
      width_adequate: widthRef!.current!.value,
      is_dimension_plot_adequate: dimensionRef!.current!.value,
      is_crz: crzRef!.current!.value,
      is_monument: mounmentRef!.current!.value,
      other_remark: otherremakRef!.current!.value,
      atp_recommendation: atpRef!.current!.value,
      condition_to_follow: conditionRef!.current!.value,
      comments_dept: commentRef!.current!.value,
      illegal_sqmt: illegalRef!.current!.value,
      recommend: recommend === "recommend",
    };

    const parsed = LandScheme.safeParse(landScheme);

    let req: any = landScheme;

    if (attachments != null) {
      const attach = await UploadFile(attachments);
      if (attach.status) {
        req.attachments = attach.data;
      } else {
        toast.error("Unable to upload attachment", { theme: "light" });
        return false;
      }
    }

    if (parsed.success) {
      const data = await ApiCall({
        query: `
                mutation updateLandById($updateLandsectionInput:UpdateLandsectionInput!){
                    updateLandById(updateLandsectionInput:$updateLandsectionInput){
                        id
                    }
                }`,
        veriables: {
          updateLandsectionInput: req,
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
      stage: "LANDRECORDS",
      form_id: form.id,
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
          form_id: form.id,
          stage: "LANDRECORDS",
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

  // pdf section start here

  Font.register({
    family: "Oswald",
    src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
  });

  const styles = StyleSheet.create({
    body: {
      paddingTop: 15,
      paddingBottom: 35,
      paddingHorizontal: 35,
    },
    heading: {
      fontSize: 14,
      textAlign: "center",
      fontFamily: "Oswald",
    },
    title: {
      marginTop: "10px",
      marginBottom: "10px",
      fontSize: 10,
      textAlign: "center",
      color: "grey",
      width: "100%",
    },
    subtitle: {
      fontSize: 10,
      textAlign: "left",
      color: "grey",
      width: "100%",
    },
    header: {
      marginTop: "15px",
      marginBottom: "10px",
      backgroundColor: "#c1dafe",
      paddingVertical: "8px",
      fontSize: "14px",
      color: "#1f2937",
      textAlign: "center",
      fontWeight: "normal",
    },
    myflex: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      borderBottom: "1px solid #6b7280",
    },
    text1: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      flex: 2,
      padding: "4px 8px",
      backgroundColor: "#f6f7f8",
      borderRight: "1px solid #6b7280",
    },
    text2: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      flex: 3,
      padding: "4px 8px",
    },
    divider: {
      width: "100%",
      height: "1px",
      backgroundColor: "#6b7280",
      marginVertical: "2px",
    },
    flexbox: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      marginTop: "55px",
    },
    flexbox1: {
      flex: 4,
    },
    flexbox2: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      flex: 2,
    },
    img: {
      width: "140px",
      height: "60px",
      objectFit: "fill",
      objectPosition: "center",
    },
    signtext: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      marginTop: "10px",
    },
  });

  const getnatype = (id: number): string => {
    if (id == 1) return "Sale Permission";
    if (id == 2) return "N.A. permission";
    if (id == 3) return "Gift Permission";
    if (id == 48) return "Land Mortgage Permission";
    if (id == 49) return "Land Sub Divison Permission";
    if (id == 50) return "Land Amalgamatin";
    if (id == 51) return "Lant Partition Permission";
    return "";
  };

  const LandSectionPdf = () => (
    <Document>
      <Page style={styles.body} size={"A4"}>
        <View>
          <Text style={styles.heading}>
            U.T. Administration of Dadra & Nagar Haveli and Daman & Diu,
          </Text>
        </View>
        <View>
          <Text style={styles.heading}>
            Town & Country Planning Department,
          </Text>
        </View>
        <View>
          <Text style={styles.heading}>
            First Floor, Collectorate, Moti Daman.
          </Text>
        </View>
        <View>
          <Text style={styles.title} fixed>
            <b>Report</b> for {getnatype(form.land_stageid)} of land bearing
            survey No {form.survey_no} of village {village}
          </Text>
        </View>
        <View>
          <Text style={styles.subtitle} fixed>
            With reference to the {form.land_formid}, the proposal of{" "}
            {getnatype(form.land_stageid)} permission for land bearing Survey
            No. {form.survey_no} of village {village}
          </Text>
        </View>
        <View>
          <Text style={styles.subtitle} fixed>
            for {form.na_type} use is scrutinized from the planning point of
            view and the following report is hereby submitted.
          </Text>
        </View>
        <View>
          <Text style={styles.header}>1. Applicant Details(s)</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.text1}>1.1 Applicant Name</Text>
          <Text style={styles.text2}>{form.name}</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.text1}>1.2 Applicant Contact Number</Text>
          <Text style={styles.text2}>{form.mobile}</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.text1}>1.3 Applicant Survey Number</Text>
          <Text style={styles.text2}>{form.survey_no}</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.text1}>1.4 Applicant Village</Text>
          <Text style={styles.text2}>{village}</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.text1}>1.5 Applicant Area</Text>
          <Text style={styles.text2}>{form.area}</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.text1}>1.6 Purpose</Text>
          <Text style={styles.text2}>{form.na_type}</Text>
        </View>
        <View>
          <Text style={styles.header}>2. Site Details</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.text1}>
            2.1 Zone in which the land falls as per the Regional plan of Daman
          </Text>
          <Text style={styles.text2}>{form.zone}</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.text1}>
            2.2 Is there a road from where the land is easily accessible?
          </Text>
          <Text style={styles.text2}>{form.road_access}</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.text1}>
            2.3 If there is no road adjoining the land, how is it proposed to
            provide access to the Site by the applicant?
          </Text>
          <Text style={styles.text2}>{form.no_road_access}</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.text1}>
            2.4 Is the width of the road /Proposed road adequate from the
            planning point of view?
          </Text>
          <Text style={styles.text2}>{form.width_adequate}</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.text1}>
            2.5 Whether dimensions & arrangement of the plot adequate?
          </Text>
          <Text style={styles.text2}>{form.is_dimension_plot_adequate}</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.text1}>
            2.6 Whether the land /plot falls within C.R.Z give C.R.Z Category
            and Comments if any Distance from H.T.L of the sea River, creek
          </Text>
          <Text style={styles.text2}>{form.is_crz}</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.text1}>
            2.7 Whether the land is Situated near any protected monument of
            A.S.I? if yes, the distance from the monument? Comments ,If any.
          </Text>
          <Text style={styles.text2}>{form.is_crz}</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.text1}>2.8 Any other remarks /comments?</Text>
          <Text style={styles.text2}>{form.other_remark}</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.text1}>
            2.9 Whether the Town & Country Planning Department recommended the
            case from the planning point of view?
          </Text>
          <Text style={styles.text2}>{form.atp_recommendation}</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.text1}>
            2.10 Condition(s) is to be mentioned in N.A. Sanad/order if N.A is
            granted.
          </Text>
          <Text style={styles.text2}>{form.condition_to_follow}</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.text1}>2.11 If no, the reason thereof</Text>
          <Text style={styles.text2}>{form.comments_dept}</Text>
        </View>
        <View style={styles.flexbox}>
          <View style={styles.flexbox1}></View>
          <View style={styles.flexbox2}>
            <Text style={styles.signtext}>Yours faithfullly,</Text>
            <Image src={"/images/signtwo.jpg"} style={styles.img}></Image>
            <Text style={styles.signtext}>&#123;P.P.PARMAR&#125;</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
  // pdf section end here

  const sendtoland = async () => {
    const file = await pdf(<LandSectionPdf />).toBlob();
    const mypdffile: File = new File([file], "data.pdf");

    const fileurl = await UploadFile(mypdffile);
    if (fileurl.status) {
      const data = await ApiCall({
        query: `
                    query sendFileOutside($sendFileLandsectionInput:SendFileLandsectionInput!){
                        sendFileOutside(sendFileLandsectionInput:$sendFileLandsectionInput)
                      }
                    `,
        veriables: {
          sendFileLandsectionInput: {
            stageId: form.land_stageid.toString(),
            formRefId: form.land_formid.toString(),
            documentUrl: fileurl.data,
          },
        },
      });
      if (!data.data.sendFileOutside) {
        return toast.error("Unable to send file to Land section.", {
          theme: "light",
        });
      }
    } else {
      return toast.error(fileurl.message, { theme: "light" });
    }
  };

  const sendtolandillegal = async () => {
    const data = await ApiCall({
      query: `
                    query sendFileOutsideillegal($sendFileLandsectionInput:SendFileLandsectionInput!){
                        sendFileOutsideillegal(sendFileLandsectionInput:$sendFileLandsectionInput)
                      }
                    `,
      veriables: {
        sendFileLandsectionInput: {
          stageId: form.land_stageid.toString(),
          formRefId: form.land_formid.toString(),
          documentUrl: form.attachments,
        },
      },
    });
    if (!data.data.sendFileOutsideillegal) {
      return toast.error("Unable to send file to Land section.", {
        theme: "light",
      });
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
                rel="noreferrer"
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
          Land Section
        </h1>
        <div className="w-full flex gap-4 my-4">
          <div className="grow bg-gray-700 h-[2px]"></div>
          <div className="w-10 bg-gray-500 h-[3px]"></div>
          <div className="grow bg-gray-700 h-[2px]"></div>
        </div>
        <p className="text-center font-semibold text-xl text-gray-800">
          {" "}
          SUBJECT : Comments of pda on land related documents.
        </p>

        {/*--------------------- section 1 start here ------------------------- */}
        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            {" "}
            1. Applicant Details(s){" "}
          </p>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">1.1</span> Applicant Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
            {form.name}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">1.2</span> Applicant Contact Number
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
            {form.mobile}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">1.3</span> Applicant Survey Number
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
            {form.survey_no}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">1.4</span> Applicant Village
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
            {village}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">1.5</span> Applicant Area [In Sq.Mtrs]
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
            {form.area}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">1.6</span> Purpose
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal  p-2 bg-gray-200 rounded-md">
            {form.na_type}
          </div>
        </div>
        {/*--------------------- section 1 end here ------------------------- */}

        {!(
          (common.form_status == 1 && user.id == common.auth_user_id) ||
          (common.form_status == 75 &&
            (user.id == 6 || user.id == common.auth_user_id)) ||
          (common.form_status == 100 &&
            (user.id == 5 || user.id == 6 || user.id == common.auth_user_id))
        ) ? (
          <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
            <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
              <span className="mr-2">1.7</span> Recommend status
            </div>
            {form.recommend == undefined ? (
              <div className="flex-none gap-10 lg:flex-1 w-full lg:w-auto flex">
                <label className="flex1">
                  <input
                    type="radio"
                    value="recommend"
                    checked={recommend === "recommend"}
                    onChange={(e) => setRecommend(e.target.value)}
                  />
                  Recommended
                </label>
                <label className="flex1">
                  <input
                    type="radio"
                    value="notrecommend"
                    checked={recommend === "notrecommend"}
                    onChange={(e) => setRecommend(e.target.value)}
                  />
                  Not Recommended
                </label>
              </div>
            ) : (
              <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
                {form.recommend ? "YES" : "NO"}
              </div>
            )}
          </div>
        ) : null}

        {(common.form_status == 1 && user.id == common.auth_user_id) ||
        (common.form_status == 75 &&
          (user.id == 6 || user.id == common.auth_user_id)) ||
        (common.form_status == 100 &&
          (user.id == 5 || user.id == 6 || user.id == common.auth_user_id)) ? (
          <>
            {/*--------------------- section 2 start here ------------------------- */}
            <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
              <p className="text-left font-semibold text-xl text-white">
                {" "}
                2. Site Details{" "}
              </p>
            </div>
            <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
              <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                <span className="mr-2">2.1</span> Zone in which the land falls
                as per the Regional plan of Daman
              </div>
              {form.zone == undefined ? (
                <div className="flex-none lg:flex-1 w-full lg:w-auto">
                  <input
                    ref={zoneRef}
                    placeholder="Your Comment here"
                    className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                  />
                </div>
              ) : (
                <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
                  {form.zone}
                </div>
              )}
            </div>

            <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
              <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                <span className="mr-2">2.2</span> Is there a road from where the
                land is easily accessible?
              </div>
              {form.road_access == undefined ? (
                <div className="flex-none lg:flex-1 w-full lg:w-auto">
                  <textarea
                    ref={roadaccessRef}
                    placeholder="Your Comment here"
                    className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 resize-none h-32"
                  ></textarea>
                </div>
              ) : (
                <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
                  {form.road_access}
                </div>
              )}
            </div>
            <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
              <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                <span className="mr-2">2.3</span> If there is no road adjoining
                the land, how is it proposed to provide access to the Site by
                the applicant?
              </div>
              {form.no_road_access == undefined ? (
                <div className="flex-none lg:flex-1 w-full lg:w-auto">
                  <textarea
                    ref={noroadaccessRef}
                    placeholder="Your Comment here"
                    className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 resize-none h-32"
                  ></textarea>
                </div>
              ) : (
                <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
                  {form.no_road_access}
                </div>
              )}
            </div>
            <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
              <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                <span className="mr-2">2.4</span> Is the width of the road
                /Proposed road adequate from the planning point of view?
              </div>
              {form.width_adequate == undefined ? (
                <div className="flex-none lg:flex-1 w-full lg:w-auto">
                  <textarea
                    ref={widthRef}
                    placeholder="Your Comment here"
                    className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 resize-none h-32"
                  ></textarea>
                </div>
              ) : (
                <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
                  {form.width_adequate}
                </div>
              )}
            </div>

            <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
              <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                <span className="mr-2">2.5</span> Whether dimensions &
                arrangement of the plot adequate?
              </div>
              {form.is_dimension_plot_adequate == undefined ? (
                <div className="flex-none lg:flex-1 w-full lg:w-auto">
                  <textarea
                    ref={dimensionRef}
                    placeholder="Your Comment here"
                    className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 resize-none h-32"
                  ></textarea>
                </div>
              ) : (
                <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
                  {form.is_dimension_plot_adequate}
                </div>
              )}
            </div>

            <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
              <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                <span className="mr-2">2.6</span> Whether the land /plot falls
                within C.R.Z give C.R.Z Category and Comments if any Distance
                from H.T.L of the sea River, creek
              </div>
              {form.is_crz == undefined ? (
                <div className="flex-none lg:flex-1 w-full lg:w-auto">
                  <textarea
                    ref={crzRef}
                    placeholder="Your Comment here"
                    className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 resize-none h-32"
                  ></textarea>
                </div>
              ) : (
                <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
                  {form.is_crz}
                </div>
              )}
            </div>
            <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
              <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                <span className="mr-2">2.7</span> Whether the land is Situated
                near any protected monument of A.S.I? if yes, the distance from
                the monument? Comments ,If any.
              </div>
              {form.is_monument == undefined ? (
                <div className="flex-none lg:flex-1 w-full lg:w-auto">
                  <textarea
                    ref={mounmentRef}
                    placeholder="Your Comment here"
                    className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 resize-none h-32"
                  ></textarea>
                </div>
              ) : (
                <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
                  {form.is_crz}
                </div>
              )}
            </div>
            <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
              <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                <span className="mr-2">2.8</span> Any other remarks /comments?
              </div>
              {form.other_remark == undefined ? (
                <div className="flex-none lg:flex-1 w-full lg:w-auto">
                  <textarea
                    ref={otherremakRef}
                    placeholder="Your Comment here"
                    className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 resize-none h-32"
                  ></textarea>
                </div>
              ) : (
                <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
                  {form.other_remark}
                </div>
              )}
            </div>

            <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
              <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                <span className="mr-2">2.9</span> Whether the Town & Country
                Planning Department recommended the case from the planning point
                of view?
              </div>
              {form.atp_recommendation == undefined ? (
                <div className="flex-none lg:flex-1 w-full lg:w-auto">
                  <textarea
                    ref={atpRef}
                    placeholder="Your Comment here"
                    className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 resize-none h-32"
                  ></textarea>
                </div>
              ) : (
                <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
                  {form.atp_recommendation}
                </div>
              )}
            </div>

            <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
              <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                <span className="mr-2">2.10</span> Condition(s) is to be
                mentioned in N.A. Sanad/ order if N.A is granted.
              </div>
              {form.condition_to_follow == undefined ? (
                <div className="flex-none lg:flex-1 w-full lg:w-auto">
                  <textarea
                    ref={conditionRef}
                    placeholder="Your Comment here"
                    className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 resize-none h-32"
                  ></textarea>
                </div>
              ) : (
                <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
                  {form.condition_to_follow}
                </div>
              )}
            </div>
            <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
              <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                <span className="mr-2">2.11</span> If no, the reason thereof
              </div>
              {form.comments_dept == undefined ? (
                <div className="flex-none lg:flex-1 w-full lg:w-auto">
                  <textarea
                    ref={commentRef}
                    placeholder="Your Comment here"
                    className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 resize-none h-32"
                  ></textarea>
                </div>
              ) : (
                <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
                  {form.comments_dept}
                </div>
              )}
            </div>
            <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
              <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                <span className="mr-2">2.12</span> Illegal (sqmt)
              </div>
              {form.illegal_sqmt == undefined ? (
                <div className="flex-none lg:flex-1 w-full lg:w-auto">
                  <input
                    ref={illegalRef}
                    placeholder="Illegal sqmt."
                    className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2"
                  />
                </div>
              ) : (
                <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
                  {form.illegal_sqmt} (sqmt)
                </div>
              )}
            </div>
            <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
              <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                <span className="mr-2">2.12</span> Photograph attach
              </div>
              {form.attachments == undefined ? (
                <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                  <div className="hidden">
                    <input
                      type="file"
                      ref={attachmentsRef}
                      accept="*/*"
                      onChange={(e) => handleLogoChange(e, setAttachments)}
                    />
                  </div>
                  <button
                    onClick={() => attachmentsRef.current?.click()}
                    className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                  >
                    <div className="flex items-center gap-2">
                      <Fa6SolidLink></Fa6SolidLink>{" "}
                      {attachments == null ? "Attach Doc." : "Update Doc."}
                    </div>
                  </button>
                  {attachments != null ? (
                    <a
                      target="_blank"
                      href={URL.createObjectURL(attachments)}
                      className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                      rel="noreferrer"
                    >
                      <Fa6SolidFileLines></Fa6SolidFileLines>
                      <p>View Doc.</p>
                    </a>
                  ) : null}
                </div>
              ) : (
                <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
                  <a
                    target="_blank"
                    href={form.attachments}
                    className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                    rel="noreferrer"
                  >
                    <div className="flex items-center gap-2">
                      <Fa6SolidLink></Fa6SolidLink> View Doc.
                    </div>
                  </a>
                </div>
              )}
            </div>
            <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
              <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
                <span className="mr-2">2.13</span> Recommend status
              </div>
              {form.recommend == undefined ? (
                <div className="flex-none gap-10 lg:flex-1 w-full lg:w-auto flex">
                  <label className="flex1">
                    <input
                      type="radio"
                      value="recommend"
                      checked={recommend === "recommend"}
                      onChange={(e) => setRecommend(e.target.value)}
                    />
                    Recommended
                  </label>
                  <label className="flex1">
                    <input
                      type="radio"
                      value="notrecommend"
                      checked={recommend === "notrecommend"}
                      onChange={(e) => setRecommend(e.target.value)}
                    />
                    Not Recommended
                  </label>
                </div>
              ) : (
                <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal p-2 bg-gray-200 rounded-md">
                  {form.recommend ? "YES" : "NO"}
                </div>
              )}
            </div>
          </>
        ) : null}
        {user.id == form.userId ? null : (
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
                    const res = await submit();
                    if (res) {
                      setForwardBox((val) => true);
                      setNextData((val) => ({
                        title: "Forward to JTP",
                        formstatus: 25,
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

              {common.form_status == 25 && user.id == 6 ? (
                <button
                  onClick={async () => {
                    setForwardBox((val) => true);
                    setNextData((val) => ({
                      title: "Forward to ATP",
                      formstatus: 50,
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
              {common.form_status == 50 && user.id == 5 ? (
                <button
                  onClick={async () => {
                    setForwardBox((val) => true);
                    setNextData((val) => ({
                      title: "Forward to M.S.",
                      formstatus: 75,
                      querytype: "INTRA",
                      authuserid: "4",
                      foacaluserid: "5",
                      intrauserid: "4,5,6,12",
                      interuserid: "0",
                      touserid: 4,
                      querystatus: "INPROCESS",
                    }));
                  }}
                  className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                >
                  Forward to M.S.
                </button>
              ) : null}
              {common.form_status == 75 && user.id == 4 ? (
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
              {common.form_status == 100 && user.id == 5 ? (
                <button
                  onClick={async () => {
                    if (form.attachments != undefined) {
                      await sendtolandillegal();
                    }
                    await sendtoland();
                    setForwardBox((val) => true);
                    setNextData((val) => ({
                      title: "Submit to Land Suptd",
                      formstatus: 125,
                      querytype: "INTRA",
                      authuserid: "0",
                      foacaluserid: "5",
                      intrauserid: "0",
                      interuserid: "0",
                      touserid: 5,
                      querystatus: "COMPLETED",
                    }));
                  }}
                  className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                >
                  Submit to Land Suptd
                </button>
              ) : null}

              {/* {(common.form_status == 100 || common.form_status == 125) && (user.id == 5 || user.id == 4) ? */}
              {user.id == 5 || user.id == 4 ? (
                <Link
                  to={`/landsectionpdf/${form.id}`}
                  className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                >
                  View PDF
                </Link>
              ) : null}
            </div>
          </>
        )}
      </div>
      <div className="p-6 bg-white rounded-lg shadow-lg my-8">
        <h1 className="text-gray-800 text-2xl font-semibold text-center">
          {user.id == form.userId ? "Department Comment" : "Notings"}
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

export default LandSection;
