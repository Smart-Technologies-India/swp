import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  PDFViewer,
  Image,
  Link,
} from "@react-pdf/renderer";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";
import { decrypt, encrypt } from "~/utils";

import font from "~/Roboto-Bold.ttf";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const id = parseInt(
    decrypt(props.params!.id!, "certificatedata").toString().split("-")[1]
  );

  const cookieHeader = props.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);
  const data = await ApiCall({
    query: `
          query getNewWaterConnectById($id:Int!){
            getNewWaterConnectById(id:$id){
                  id,
                  name,
                  address,
                  mobile,
                  purpose,
                  entity_type,
                  connection_type,
                  email,
                  user_uid,
                  userId,
                  village_id,
                  iagree,
                  signature_url,
                  createdAt
              }
            }
        `,
    veriables: {
      id: id,
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
      id: parseInt(data.data.getNewWaterConnectById.village_id!),
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
        form_id: id,
        form_type: "NEWWATERCONNECT",
      },
    },
  });

  return json({
    id: id,
    user: cookie,
    form: data.data.getNewWaterConnectById,
    village: village.data.getAllVillageById.name,
    common: common.data.searchCommon,
  });
};

const NewWaterConnectPdfView = (): JSX.Element => {
  const loader = useLoaderData();
  const form = loader.form;
  // const village = loader.village;
  // const common = loader.common;

  Font.register({
    family: "Oswald",
    src: "https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf",
  });
  Font.register({
    family: "boldfont",
    src: font,
  });

  const styles = StyleSheet.create({
    body: {
      paddingTop: 15,
      paddingBottom: 10,
      paddingHorizontal: 10,
    },
    page: {
      border: "2px solid red",
      padding: "10px",
      height: "100%",
    },
    heading: {
      fontSize: 14,
      textAlign: "left",
      // fontFamily: "Oswald",
    },
    title: {
      marginTop: "16px",
      marginBottom: "10px",
      fontSize: 14,
      textAlign: "center",
      color: "black",
      width: "100%",
      textDecoration: "underline",
    },
    subtitle: {
      fontSize: 12,
      textAlign: "left",
      color: "black",
      width: "100%",
      padding: "0px 10px",
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
    reddivider: {
      height: "2px",
      backgroundColor: "red",
      width: "100%",
      marginVertical: "5px",
    },
    imgright: {
      width: "60px",
      height: "60px",
      objectFit: "fill",
      objectPosition: "center",
    },
    imgleft: {
      width: "40px",
      height: "60px",
      objectFit: "fill",
      objectPosition: "center",
    },
    myflex: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
    },
    flex1: {
      flex: 1,
    },
    flex2: {
      flex: 6,
    },
    flex3: {
      flex: 1,
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
    },
    flexbox1: {
      flex: 1,
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
    },
    flexbox2: {
      flex: 1,
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
    },
    flexbox3: {
      flex: 1,
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
    },
    img: {
      width: "50px",
      height: "50px",
      objectFit: "fill",
      objectPosition: "center",
    },
    logoimg: {
      width: "80px",
      height: "25px",
      objectFit: "fill",
      objectPosition: "center",
    },
    signtext: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      marginTop: "10px",
      textAlign: "right",
    },
    signtextleft: {
      fontSize: "12px",
      fontWeight: "normal",
      color: "#374151",
      marginTop: "10px",
      textAlign: "left",
    },
    footer: {
      position: "absolute",
      bottom: "10px",
      left: "0px",
      padding: "0px 20px",
      display: "flex",
      flexDirection: "row",
    },
    footerflex1: {
      textAlign: "left",
      width: "300px",
    },
    footerflex2: {
      textAlign: "right",
      marginLeft: "10px",
      marginRight: "10px",
    },
    footerflex3: {
      width: "150px",
      textAlign: "right",
    },
    footertext: {
      fontSize: "4px",
      fontWeight: "normal",
      color: "#374151",
    },
    id: {
      fontSize: "8px",
      fontWeight: "normal",
      color: "#374151",
      textAlign: "left",
    },
    span: {
      fontFamily: "boldfont",
    },
  });

  const NewWaterConectionPdf = () => (
    <Document>
      <Page style={styles.body} size={"A4"}>
        <View style={styles.page}>
          <View style={styles.myflex}>
            <View style={styles.flex1}>
              <Image src={"/emb.jpg"} style={styles.imgleft}></Image>
            </View>
            <View style={styles.flex2}>
              <Text style={styles.heading}>U.T. Administration of</Text>
              <Text style={styles.heading}>
                Dadra & Nagar Haveli and Daman & Diu,
              </Text>
              <Text style={styles.heading}>
                Department of Public Works Department
              </Text>
              <Text style={styles.heading}>Daman and Diu</Text>
            </View>
            <View style={styles.flex3}>
              <Image src={"/logo.png"} style={styles.imgright}></Image>
            </View>
          </View>
          <View style={styles.reddivider}></View>
          <View style={{ height: "20px" }}></View>
          <View>
            <Text style={styles.title}>
              NEW WATER SUPPLY CONNECTION CERTIFICATE
            </Text>
          </View>

          <View style={{ height: "40px" }}></View>
          <View>
            <Text style={styles.subtitle} fixed>
              &nbsp; &nbsp; &nbsp; This is to certify the water supply
              connection has been issued to the consumer Shri/Smt.{" "}
              <Text style={styles.span}>{form.name} </Text>, R/o.{" "}
              <Text style={styles.span}>{form.address} </Text>
              for {form.purpose} purpose, having Connection Type -{" "}
              <Text style={styles.span}>{form.connection_type} </Text> , and
              Entity Type - <Text style={styles.span}>{form.entity_type} </Text>{" "}
              on dated:
              {/* 
              purpose,
                  entity_type,
                  connection_type, */}
              {new Date(form.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
              .
            </Text>
          </View>
          <View style={{ height: "80px" }}></View>

          <View style={styles.flexbox}>
            <View style={styles.flexbox1}></View>
            <View style={styles.flexbox2}></View>
            <View style={styles.flexbox3}>
              <View>
                <Text style={styles.signtext}>Assistant Engineer,</Text>
                <Text style={styles.signtext}>Public Work Department,</Text>
                <Text style={styles.signtext}>Daman and Diu</Text>
              </View>
            </View>
          </View>
          <View style={styles.flexbox}>
            <View style={styles.flexbox1}>
              <Text style={styles.signtextleft}>Place: Daman and Diu</Text>
              <Text style={styles.signtextleft}>
                Date:{" "}
                {new Date(form.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </Text>
            </View>
            <View style={styles.flexbox2}></View>
            <View style={styles.flexbox3}>
              <View></View>
            </View>
          </View>
          <View style={styles.footer}>
            <View style={styles.footerflex1}>
              <Text style={styles.footertext}>
                For authencity verification of this document. Scan QR or Enter
                Barcode at{" "}
                <Link src="https://s2.dddgov.in/search">
                  https://s2.dddgov.in/search
                </Link>{" "}
              </Text>
              <Text style={styles.footertext}>
                or visit{" "}
                <Link src={window.location.href}>{window.location.href}</Link>{" "}
              </Text>
            </View>
            <View style={styles.footerflex2}>
              <Image src={"/searchqrcode.png"} style={styles.img}></Image>
            </View>
            <View style={styles.footerflex3}>
              <Image src={"/nic_logo.png"} style={styles.logoimg}></Image>
              <View style={{ height: "10px" }}></View>
              <Text style={styles.id}>
                {encrypt(
                  `NWC-${("0000" + form.id).slice(-4)}-${
                    form.createdAt.toString().split("-")[0]
                  }`,
                  "certificatedata"
                )}
              </Text>
            </View>
          </View>
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
            <NewWaterConectionPdf />
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

export default NewWaterConnectPdfView;
