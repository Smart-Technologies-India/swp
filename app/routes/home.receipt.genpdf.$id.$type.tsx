import type { LoaderFunction } from "@remix-run/node";
// this is your PDF document component created with React PDF
import { ToWords } from "to-words";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  renderToStream,
  Image,
} from "@react-pdf/renderer";
import { ApiCall } from "~/services/api";
// import { userPrefs } from "~/cookies";
import numberWithIndianFormat, { capitalcase, formateDate } from "~/utils";
export let loader: LoaderFunction = async ({ request, params }) => {
  const toWords = new ToWords();

  const id = params.id;
  const type: string = params.type ?? "";

  // const cookieHeader = request.headers.get("Cookie");
  // const cookie: any = await userPrefs.parse(cookieHeader);

  // const userdata = await ApiCall({
  //   query: `
  //           query getUserById($id:Int!){
  //               getUserById(id:$id){
  //                   id,
  //                   name,
  //                   email,
  //                   contact,
  //               }
  //           }
  //         `,
  //   veriables: {
  //     id: parseInt(cookie.id!),
  //   },
  // });

  interface ResponseData {
    one: string;
    two: string;
    three: string;
    four: string;
    five: string;
  }

  const getResponseData = (): ResponseData => {
    if (
      [
        "PETROLEUM",
        "RTI",
        "ZONE",
        "DEMOLITION",
        "OLDCOPY",
        "LANDRECORDS",
        "UNAUTHORISED",
        "CP",
        "OC",
        "PLINTH",
      ].includes(type)
    ) {
      return {
        one: "Planning and Development Authority",
        two: "Office of the Collector & District Magistrate,1st Floor Bhitwadi Road, Municipal Market, Dholar, Moti Daman, Daman,  396210.",
        three: "",
        four: "PDA",
        five: "",
      };
    } else if (
      ["MARRIAGE", "RELIGIOUS", "ROADSHOW", "GENERIC"].includes(type)
    ) {
      return {
        one: "Establishment Section",
        two: "Office of the Collector & District Magistrate,Ground Floor Bhitwadi Road, Municipal Market, Dholar, Moti Daman, Daman,  396210.",
        three: "",
        four: "EST",
        five: "",
      };
    } else if (
      [
        "BIRTHCERT",
        "BIRTHTEOR",
        "DEATHCERT",
        "DEATHTEOR",
        "MARRIAGECERT",
        "MARRIAGETEOR",
        "MARRIAGEREGISTER",
      ].includes(type)
    ) {
      return {
        one: "Civil Registrar cum Sub Registrar",
        two: "Office of the Collector & District Magistrate,1st Floor Bhitwadi Road, Municipal Market, Dholar, Moti Daman, Daman, 396210.",
        three: "",
        four: "CRSR",
        five: "",
      };
    } else if (
      [
        "TEMPWATERCONNECT",
        "TEMPWATERDISCONNECT",
        "WATERSIZECHANGE",
        "NEWWATERCONNECT",
        "WATERRECONNECT",
        "PERMANENTWATERDISCONNECT",
      ].includes(type)
    ) {
      return {
        one: "Public Works Department",
        two: "Near Municipal Market, Dholar, Moti Daman, Daman, 396210.",
        three: "",
        four: "PWD",
        five: "",
      };
    } else if (["DEATHREGISTER", "BIRTHREGISTER"].includes(type)) {
      return {
        one: "Daman Municipal Council",
        two: "Manguerial Rd, Near India Post Office, Municipal Council, Moti Daman, Daman, 396220",
        three: "",
        four: "DMC",
        five: "",
      };
    } else {
      return {
        one: "",
        two: "",
        three: "",
        four: "",
        five: "",
      };
    }
  };

  const paymentdata = await ApiCall({
    query: `
            query getPaymentReceipt($id:Int!,$type:String!){
                getPaymentReceipt(id:$id,type:$type){
                    id,
                    user_id,
                    paymentamout,
                    createdAt,
                    updatedAt
                }
            }
          `,
    veriables: {
      id: parseInt(id ?? "0"),
      type: type,
    },
  });

  console.log(paymentdata);

  const userdata = await ApiCall({
    query: `
            query getUserById($id:Int!){
                getUserById(id:$id){
                    id,
                    name,
                    email,
                    contact,
                }
            }
          `,
    veriables: {
      id: paymentdata.data.getPaymentReceipt.user_id,
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
              query_status
            }
          }
      `,
    veriables: {
      searchCommonInput: {
        form_id: parseInt(id!),
        form_type: type,
      },
    },
  });

  //   DEMOLITION
  //   UNAUTHORISED

  let form: any;

  if (type == "PETROLEUM") {
    const response = await ApiCall({
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
                  comments_dept,
                  createdAt
                }
              }
          `,
      veriables: {
        id: parseInt(id!),
        form_type: "PETROLEUM",
      },
    });

    form = response.data.getPetroleumById;
  } else if (type == "RTI") {
    const response = await ApiCall({
      query: `
            query getAllRtiById($id:Int!){
                getAllRtiById(id:$id){
                  id,
                  name,
                  address,
                  mobile,
                  email,
                  user_uid,
                  userId,
                  subject_info,
                  from_date,
                  to_date,
                  description,
                  information,
                  proverty_line_url,
                  iagree,
                  signature_url,
                  payment_doc,
                  createdAt
                }
              }
          `,
      veriables: {
        id: parseInt(id!),
      },
    });

    form = response.data.getAllRtiById;
  } else if (type == "ZONE") {
    const data = await ApiCall({
      query: `
            query getAllZoneById($id:Int!){
                getAllZoneById(id:$id){
                  id,
                  name,
                  address,
                  mobile,
                  email,
                  user_uid,
                  userId,
                  survey_no,
                  village_id,
                  sub_division,
                  nakel_url_1_14,
                  iagree,
                  signature_url,
                  payment_doc,
                  createdAt
                }
              }
          `,
      veriables: {
        id: parseInt(id!),
      },
    });
    form = data.data.getAllZoneById;
  } else if (type == "OLDCOPY") {
    const data = await ApiCall({
      query: `
            query getOldCopyById($id:Int!){
                getOldCopyById(id:$id){
                  id,
                  name,
                  address,
                  mobile,
                  email,
                  user_uid,
                  userId,
                  survey_no,
                  village_id,
                  sub_division,
                  prev_application_date,
                  prev_application_number,
                  type_of_information,
                  information_needed,
                  aadhar_url,
                  iagree,
                  signature_url,
                  payment_doc,
                  createdAt
                }
              }
          `,
      veriables: {
        id: parseInt(id!),
        form_type: "OLDCOPY",
      },
    });
    form = data.data.getOldCopyById;
  } else if (type == "LANDRECORDS") {
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
                  recommend,
                  createdAt
                }
              }
          `,
      veriables: {
        id: parseInt(id!),
      },
    });
    form = data.data.getAllLandById;
  } else if (type == "PLINTH") {
    const data = await ApiCall({
      query: `
            query getPlinthById($id:Int!){
                getPlinthById(id:$id){
                  id,
                  name,
                  address,
                  mobile,
                  email,
                  user_uid,
                  userId,
                  survey_no,
                  village_id,
                  sub_division,
                  permission_number,
                  permission_date,
                  architect_name,
                  architect_license,
                  valid_upto,
                  architect_address,
                  applicant_uid,
                  annexure_eleven,
                  copy_construcation_license,
                  building_plan,
                  architect_signature,
                  iagree,
                  remarks,
                  signature_url,
                  payment_doc,
                  createdAt
                }
              }
          `,
      veriables: {
        id: parseInt(id!),
        form_type: "PLINTH",
      },
    });
    form = data.data.getPlinthById;
  } else if (type == "OC") {
    const response = await ApiCall({
      query: `
            query getOcById($id:Int!){
                getOcById(id:$id){
                  id,
                  name,
                  address,
                  mobile,
                  email,
                  user_uid,
                  userId,
                  survey_no,
                  village_id,
                  sub_division,
                  permission_number,  
                  permission_date,
                  architect_name,
                  architect_license,
                  valid_upto,
                  completion_date,
                  applicant_uid,
                  completion_certificate,
                  construction_permission,
                  building_plan,
                  annexure_fourteen,
                  coast_guard_noc,
                  fire_noc,
                  rainwater_harvest,
                  deviation_plan,
                  indemnity,
                  valuation_certificate,
                  labour_cess,
                  iagree,
                  signature_url,
                  payment_doc,
                  createdAt
                }
              }
          `,
      veriables: {
        id: parseInt(id!),
        form_type: "OC",
      },
    });

    form = response.data.getOcById;
  } else if (type == "CP") {
    const response = await ApiCall({
      query: `
            query getCpById($id:Int!){
                getCpById(id:$id){
                  id,
                  name,
                  address,
                  mobile,
                  email,
                  user_uid,
                  userId,
                  survey_no,
                  village_id,
                  sub_division,
                  architect_name,
                  architect_license,
                  valid_upto,
                  applicant_uid,
                  annexure_two,
                  annexure_three,
                  annexure_four,
                  annexure_five,
                  na_copoy,
                  map_copy,
                  nakal_1_14,
                  building_plan,
                  scrutiny_fees,
                  coast_guard_noc,
                  fire_noc,
                  crz_noc,
                  layout_plan,
                  revised_plan,
                  fsi,
                  iagree,
                  signature_url,
                  payment_doc,
                  createdAt
                }
              }
          `,
      veriables: {
        id: parseInt(id!),
        form_type: "CP",
      },
    });

    form = response.data.getCpById;
  }

  console.log(userdata.data.getUserById);
  console.log(paymentdata.data.getPaymentReceipt);
  console.log(common.data.searchCommon);
  console.log(form);

  const user = userdata.data.getUserById;
  const payment = paymentdata.data.getPaymentReceipt;
  const commondata = common.data.searchCommon;

  Font.register({
    family: "Oswald",
    src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
  });

  const styles = StyleSheet.create({
    body: {
      paddingTop: 20,
      paddingBottom: 25,
      paddingHorizontal: 20,
    },
    title: {
      fontSize: 20,
      lineHeight: 1,
      textAlign: "center",
      fontFamily: "Oswald",
    },
    subtitle: {
      fontSize: 10,
      textAlign: "center",
      color: "grey",
      width: "100%",
    },
    titledescription: {
      fontSize: 12,
      textAlign: "center",
      color: "grey",
      width: "60%",
      margin: "auto",
    },
    header: {
      marginTop: 10,
      marginBottom: 10,
      fontSize: "16px",
      color: "#1f2937",
      textAlign: "center",
      fontWeight: "normal",
      textDecoration: "underline",
    },
    myflex: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
    },

    ltop: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      width: "60px",
      padding: "4px 8px",
      border: "1px solid #6b7280",
      textAlign: "center",
    },

    lbottom: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      width: "60px",
      padding: "4px 8px",
      textAlign: "center",
      borderBottom: "1px solid #6b7280",
      borderRight: "1px solid #6b7280",
      borderLeft: "1px solid #6b7280",
    },

    mtop: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      flex: 3,
      padding: "4px 8px",
      // border: "1px solid #6b7280",
      textAlign: "center",
      borderTop: "1px solid #6b7280",
      borderBottom: "1px solid #6b7280",
    },

    mbottom: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      flex: 3,
      padding: "4px 8px",
      borderBottom: "1px solid #6b7280",
      // borderRight: "1px solid #6b7280",
      // borderLeft: "1px solid #6b7280",
    },

    rtop: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      flex: 1,
      padding: "4px 8px",
      border: "1px solid #6b7280",
      textAlign: "center",
    },

    rbottom: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      flex: 1,
      padding: "4px 8px",
      borderBottom: "1px solid #6b7280",
      borderRight: "1px solid #6b7280",
      borderLeft: "1px solid #6b7280",
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
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      flex: 4,
    },
    flexbox2: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      flex: 2,
    },
    imagebox: {
      position: "absolute",
      display: "flex",
      width: "100vw",
      top: "40px",
      alignItems: "center",
    },
    image: {
      width: "60%",
      opacity: 0.1,
    },
  });

  const Quixote = () => (
    <Document>
      <Page style={styles.body} size={"A4"}>
        <View style={styles.imagebox}>
          <Image src="/dnhpda_logo.png" style={styles.image} />
        </View>

        <View>
          <View>
            <Text style={styles.title}>{getResponseData().one}</Text>
            <View
              style={{
                height: "10px",
              }}
            ></View>
            <Text style={styles.titledescription}>{getResponseData().two}</Text>
            <Text style={styles.titledescription}>
              GSTIN/UIN: {getResponseData().three}
            </Text>
          </View>

          <View
            style={{
              marginTop: "10px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View>
              <Text
                style={{
                  fontSize: "12px",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                Receipt No. {getResponseData().four}/online/
                {new Date(payment?.createdAt).getFullYear().toString()}/
                {(payment?.id ?? "0").toString().padStart(4, "0")}
              </Text>
            </View>

            <View
              style={{
                flexGrow: 1,
                display: "flex",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <Text
                style={{
                  fontSize: "16px",
                  color: "#1f2937",
                  textAlign: "center",
                  fontWeight: "normal",
                  textDecoration: "underline",
                }}
              >
                RECEIPT
              </Text>
            </View>
            <View
              style={{
                width: "80px",
              }}
            ></View>

            <View
              style={{
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  fontSize: "10px",
                  color: "#6b7280",
                }}
              >
                Date: {formateDate(new Date(payment?.createdAt))}
              </Text>
            </View>
          </View>
          <View
            style={{
              marginTop: "10px",
            }}
          ></View>

          <View>
            <Text
              style={{
                fontSize: 12,
                color: "grey",
                width: "100%",
              }}
              fixed
            >
              Received with thanks from {user?.name}{" "}
              {user?.mobile && `[${user?.mobile}]`} a sum of Rs.{" "}
              {numberWithIndianFormat(parseInt(payment?.paymentamout))} (
              {payment?.paymentamout
                ? capitalcase(
                    toWords.convert(parseInt(payment?.paymentamout) ?? "0")
                  ) + " Only"
                : "-"}
              ) on account as below
            </Text>
            <View
              style={{
                marginTop: "5px",
              }}
            ></View>
          </View>
          <View
            style={{
              marginTop: "5px",
            }}
          ></View>

          <View style={styles.myflex}>
            <Text style={styles.ltop}>Sr. No</Text>
            <Text style={styles.mtop}>Income Heads</Text>
            <Text style={styles.rtop}>Amount</Text>
          </View>

          <View style={styles.myflex}>
            <Text style={styles.lbottom}>1</Text>
            <Text style={styles.mbottom}>{type}</Text>
            <Text style={styles.rbottom}>
              {numberWithIndianFormat(parseInt(payment?.paymentamout))}
            </Text>
          </View>
          {/* {account?.account_category_two &&
          account?.account_category_two.name ? (
            <View style={styles.myflex}>
              <Text style={styles.lbottom}>2</Text>
              <Text style={styles.mbottom}>
                {account?.account_category_two.name}
              </Text>
              <Text style={styles.rbottom}>
                {numberWithIndianFormat(parseInt(account?.amount_two))}
              </Text>
            </View>
          ) : null}

          {account?.account_category_three &&
          account?.account_category_three.name ? (
            <View style={styles.myflex}>
              <Text style={styles.lbottom}>3</Text>
              <Text style={styles.mbottom}>
                {account?.account_category_three.name}
              </Text>
              <Text style={styles.rbottom}>
                {numberWithIndianFormat(parseInt(account?.amount_three))}
              </Text>
            </View>
          ) : null}
          {account?.remarks != null && account?.remarks != "" ? (
            <Text
              style={{
                fontSize: "10px",
                fontWeight: "normal",
                color: "#374151",
                width: "100%",
                padding: "4px 4px",
                borderLeft: "1px solid #6b7280",
                borderBottom: "1px solid #6b7280",
                borderRight: "1px solid #6b7280",
                textAlign: "left",
              }}
            >
              Remark : {account?.remarks}
            </Text>
          ) : null} */}

          <View
            style={{
              marginVertical: "10px",
            }}
          >
            <Text
              style={{
                fontSize: 10,
                color: "grey",
                width: "100%",
              }}
              fixed
            >
              {" "}
              Charges for {type ?? "-"} in the form of{" "}
              {/* {account?.paymentmode ?? "-"} vide Reference No.
              {account?.transactionid ?? "-"} dated */}
              Online vide Reference No. L234234WFEGV23423SDFV234 dated{" "}
              {formateDate(new Date(payment?.createdAt))}
            </Text>
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
                justifyContent: "flex-end",
                paddingBottom: "10px",
              }}
            >
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    fontSize: "16px",
                    fontWeight: "normal",
                    color: "#374151",
                    padding: "5px 8px",
                    border: "1px solid #6b7280",
                    textAlign: "center",
                  }}
                >
                  Rs. {numberWithIndianFormat(parseInt(payment?.paymentamout))}
                  /-
                </Text>
              </View>

              <Text
                style={{
                  fontSize: "10px",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                Cheques/Draft subjects to realization
              </Text>
            </View>

            <View
              style={{
                flexGrow: 1,
              }}
            ></View>

            <View
              style={{
                textAlign: "center",
              }}
            >
              {/* <Image
                src="/signtwo.jpg"
                style={{
                  width: "100%",
                }}
              /> */}
              <View
                style={{
                  height: "60px",
                }}
              ></View>

              <Text
                style={{
                  fontSize: "10px",
                  color: "#6b7280",
                }}
              >
                For
              </Text>
              <Text
                style={{
                  marginTop: "2px",
                  fontSize: "10px",
                  color: "#6b7280",
                }}
              >
                {getResponseData().one}
              </Text>
            </View>
          </View>
          <Text
            style={{
              textAlign: "center",
              fontSize: "8px",
              position: "absolute",
              width: "100%",
              bottom: "-16px",
            }}
          >
            This is a computer generated statement
          </Text>
        </View>
      </Page>
    </Document>
  );
  // render the PDF as a stream so you do it async
  let stream = await renderToStream(<Quixote />);

  // and transform it to a Buffer to send in the Response
  let body: Buffer = await new Promise((resolve, reject) => {
    let buffers: Uint8Array[] = [];
    stream.on("data", (data) => {
      buffers.push(data);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
    stream.on("error", reject);
  });

  // finally create the Response with the correct Content-Type header for
  // a PDF
  let headers = new Headers({ "Content-Type": "application/pdf" });
  return new Response(body, { status: 200, headers });
};
