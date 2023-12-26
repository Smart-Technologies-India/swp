import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  // Font,
  PDFViewer,
  Image,
  Font,
} from "@react-pdf/renderer";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
// import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { userPrefs } from "~/cookies";
// import { ApiCall } from "~/services/api";
// import { decrypt, encrypt } from "~/utils";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  // const id = parseInt(
  //   decrypt(props.params!.id!, "certificatedata").toString().split("-")[1]
  // );

  const cookieHeader = props.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  // const data = await ApiCall({
  //   query: `
  //       query getMarriageRegisterById($id:Int!){
  //         getMarriageRegisterById(id:$id){
  //               id,
  //               name,
  //               address,
  //               mobile,
  //               email,
  //               user_uid,
  //               userId,
  //               village_id,
  //               iagree,
  //               signature_url,
  //               createdAt
  //           }
  //         }
  //     `,
  //   veriables: {
  //     id: id,
  //   },
  // });

  // const village = await ApiCall({
  //   query: `
  //       query getAllVillageById($id:Int!){
  //           getAllVillageById(id:$id){
  //             id,
  //             name,
  //           }
  //         }
  //     `,
  //   veriables: {
  //     id: parseInt(data.data.getMarriageRegisterById.village_id!),
  //   },
  // });

  // const common = await ApiCall({
  //   query: `
  //       query searchCommon($searchCommonInput:SearchCommonInput!){
  //           searchCommon(searchCommonInput:$searchCommonInput){
  //             id,
  //             village,
  //             name,
  //             form_type,
  //             user_id,
  //             auth_user_id,
  //             focal_user_id,
  //             intra_user_id,
  //             inter_user_id,
  //             number,
  //             form_status,
  //             query_status,
  //           }
  //         }
  //     `,
  //   veriables: {
  //     searchCommonInput: {
  //       form_id: id,
  //       form_type: "MARRIAGEREGISTER",
  //     },
  //   },
  // });

  return json({
    // id: id,
    user: cookie,
    // form: data.data.getMarriageRegisterById,
    // village: village.data.getAllVillageById.name,
    // common: common.data.searchCommon,
  });
};

const MarriagePdfView = (): JSX.Element => {
  // const loader = useLoaderData();
  // const form = loader.form;
  // const village = loader.village;
  //   const common = loader.common;

  Font.register({
    family: "hindi",
    src: "/font.ttf",
  });
  // family: "Oswald",
  // src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",

  const styles = StyleSheet.create({
    body: {
      paddingTop: 15,
      paddingBottom: 35,
      paddingHorizontal: 35,
    },
    heading: {
      fontSize: 10,
      textAlign: "center",
      // fontWeight: "bold",
      // fontFamily: "Times-Roman",
      fontFamily: "hindi",
      fontWeight: "extrabold",
    },
    subtitle: {
      fontSize: 10,
      textAlign: "left",
      color: "black",
      width: "100%",
      fontFamily: "hindi",
    },
    subtitletwo: {
      fontSize: 8,
      textAlign: "left",
      color: "black",
      width: "100%",
      fontFamily: "hindi",
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
      // borderBottom: "1px solid #6b7280",
    },
    text1: {
      fontSize: "8px",
      fontWeight: "normal",
      flex: 2,
      padding: "4px 8px",
      fontFamily: "hindi",
    },
    text2: {
      fontSize: "8px",
      fontWeight: "normal",
      flex: 2,
      padding: "4px 8px",
      fontFamily: "hindi",
    },
    signtext: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      marginTop: "10px",
    },
    footer: {
      position: "absolute",
      bottom: "10px",
      fontSize: "12px",
      fontWeight: "normal",
      right: "20px",
    },
    img: {
      width: "140px",
      height: "60px",
      objectFit: "fill",
      objectPosition: "center",
    },
    flexbox: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      marginTop: "55px",
    },
    flexbox1: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    flexbox2: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    flexbox3: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const DeathCertificatePdf = () => (
    <Document>
      <Page style={styles.body} size={"A4"}>
        <View>
          <Text style={styles.heading}>
            दादरा और नगर हवेली और दमन और दीव (यू.टी.) का प्रशासन
          </Text>
          <Text style={styles.heading}>
            ADMINISTRATION OF DADRA AND NAGAR HAVELI AND DAMAN AND DIU (U.T)
          </Text>
        </View>
        <View style={{ height: "10px" }}></View>
        <View>
          <Text style={styles.heading}>योजना एवं सांख्यिकी विभाग</Text>
          <Text style={styles.heading}>
            DEPARTMENT OF PLANNING AND STATISTICS
          </Text>
        </View>
        <View style={{ height: "10px" }}></View>
        <View>
          <Text style={styles.heading}>दमन नगर परिषद</Text>
          <Text style={styles.heading}>DAMAN MUNCIPAL COUNCIL</Text>
        </View>
        <View style={{ height: "10px" }}></View>
        <View>
          <Text style={styles.heading}>मृत्यु प्रमाण पत्र </Text>
          <Text style={styles.heading}>DEATH CERTIFICATE</Text>
        </View>
        <View style={{ height: "20px" }}></View>

        <View>
          <Text style={styles.subtitle} fixed>
            जन्म और मृत्यु पंजीकरण अधिनियम, 1969 की धारा 12/17 और दादरा और नगर
            हवेली और दमन और दीव जन्म और मृत्यु पंजीकरण नियम 2000 के नियम 8/13 के
            तहत जारी किया गया।
          </Text>
          <View style={{ height: "6px" }}></View>
          <Text style={styles.subtitletwo} fixed>
            (ISSUED UNDER SECTION 12/17 OF THE REGISTRATION OF BIRTHS & DEATHS
            ACT, 1969 AND RULE 8/13 OF THE DADRA AND NAGAR HAVELI AND DAMAN AND
            DIU REGISTRATION OF BIRTHS & DEATHS RULES 2000.)
          </Text>
        </View>
        <View style={{ height: "15px" }}></View>
        <View>
          <Text style={styles.subtitle} fixed>
            यह प्रमाणित किया जाता है कि निम्नलिखित जानकारी मृत्यु के मूल रिकॉर्ड
            से ली गई है, जो भारत के राज्य/केंद्र शासित प्रदेश दादरा और नगर हवेली
            और दमन और दीव के दमन जिले के दमन नगर परिषद/तहसील के लिए रजिस्टर है।
          </Text>
          <View style={{ height: "6px" }}></View>
          <Text style={styles.subtitletwo} fixed>
            THIS IS TO CERTIFY THAT THE FOLLOWING INFORMATION HAS BEEN TAKEN
            FROM THE ORIGINAL RECORD OF DEATH WHICH IS THE REGISTER FOR DAMAN
            MUNCIPAL COUNCIL OF TAHSIL/BLOCK DAMAN OF DISTRICT DAMAN OF
            STATE/UNION TERRITORY DADRA AND NAGAR HAVELI AND DAMAN AND DIU,
            INDIA.
          </Text>
        </View>

        <View style={{ height: "20px" }}></View>
        {/* <View>
          <Text style={styles.header}>1. Applicant Details(s)</Text>
        </View> */}

        <View style={styles.myflex}>
          <Text style={styles.text1}>
            NAME OF DECEASED : JUBEDA YAKUB NAGORI
          </Text>
          <Text style={styles.text2}>SEX : FEMALE</Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.text1}>AADHAAR NO : xxxx xxxx xxxx xxxx</Text>
          <Text style={styles.text2}>
            PLACE OF DEATH : FLAT NO: 301, 3RD FLOOR, RIVERDALE APT, KHARIWAD,
            NANI DAMAN, DAMAN, DADRA AND NAGAR HAVELI AND DAMAN AND DIU -
            396210.
          </Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.text1}>
            DATE OF DEATH : 21 - 05 - 2022 TWENTY - FIRST - MAY - TWO - THOUSAND
            - TWENTY - TWO{" "}
          </Text>
          <Text style={styles.text2}>NAME OF HUSBAND/WIFE : YAKUB NAGORI</Text>
        </View>
        <View style={styles.myflex}>
          <Text style={styles.text1}>AGE OF DECEASED : 80 YEARS</Text>
          <Text style={styles.text2}>
            HUSBAND/WIFE ADHAAR NO : xxxx xxxx xxxx xxxx
          </Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.text1}>NAME OF MOTHER : KHATIJABAI</Text>
          <Text style={styles.text2}>NAME OF FATHER : NOOR MOHAMED</Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.text1}>
            MOTHER'S ADHAAR NO : xxxx xxxx xxxx xxxx
          </Text>
          <Text style={styles.text2}>
            FATHER'S ADHAAR NO : xxxx xxxx xxxx xxxx
          </Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.text1}>
            ADDRESS OF THE DECEASED AT THE TIME OF DEATH : FLAT NO: 301, 3RD
            FLOOR, RIVERDALE APT, KHARIWAD, NANI DAMAN, DAMAN, DADRA AND NAGAR
            HAVELI AND DAMAN AND DIU - 396210.
          </Text>
          <Text style={styles.text2}>
            PERMANENT ADDRESS OF DECEASED : FLAT NO: 301, 3RD FLOOR, RIVERDALE
            APT, KHARIWAD, NANI DAMAN, DAMAN, DADRA AND NAGAR HAVELI AND DAMAN
            AND DIU - 396210.
          </Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.text1}>
            REGISTRATION NO : D-2022: 25-90003-000114
          </Text>
          <Text style={styles.text2}>
            DATE OF REGISTRATION : 06 - 06 - 2022
          </Text>
        </View>

        <View style={styles.myflex}>
          <Text style={styles.text1}>REMARK IF ANY</Text>
          <Text style={styles.text2}></Text>
        </View>

        {/* <View>
          <Text style={styles.signtext}>
            &nbsp; &nbsp; &nbsp; &nbsp; The Death Certificate pertaining to the
            deceased based in village game is hereby Granted.
          </Text>
        </View> */}
        <View style={styles.flexbox}>
          <View style={styles.flexbox1}></View>
          <View style={styles.flexbox2}></View>
          <View style={styles.flexbox3}>
            <View>
              <Image src={"/images/signtwo.jpg"} style={styles.img}></Image>
              <Text style={styles.signtext}>CEO(DMC)</Text>
              <Text style={styles.signtext}>Daman</Text>
            </View>
          </View>
        </View>
        <View style={styles.footer}>
          <Text>REF. NO:</Text>
        </View>
      </Page>
    </Document>
  );

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      {isClient ? (
        <div className="w-full h-scree">
          <PDFViewer style={{ width: "100%", height: "100vh" }}>
            <DeathCertificatePdf />
          </PDFViewer>
        </div>
      ) : (
        <div className="h-screen w-full grid place-items-center bg-blue-500">
          <p className="text-white text-6xl">Loading...</p>
        </div>
      )}
    </>
  );
};

export default MarriagePdfView;
