import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Font,
    PDFViewer,
    Image,
  } from "@react-pdf/renderer";
  import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
  import { json } from "@remix-run/node";
  import { useLoaderData } from "@remix-run/react";
  import { useEffect, useState } from "react";
  import { userPrefs } from "~/cookies";
  import { ApiCall } from "~/services/api";
  import { decrypt, encrypt } from "~/utils";
  
  export const loader: LoaderFunction = async (props: LoaderArgs) => {
    const id = parseInt(
      decrypt(props.params!.id!, "certificatedata").toString().split("-")[1]
    );
  
    const cookieHeader = props.request.headers.get("Cookie");
    const cookie: any = await userPrefs.parse(cookieHeader);
    const data = await ApiCall({
      query: `
          query getDeathById($id:Int!){
            getDeathById(id:$id){
                  id,
                  name,
                  address,
                  mobile,
                  email,
                  user_uid,
                  userId,
                  survey_no,
                  village_id,
                  iagree,
                  signature_url,
                  payment_doc,
                  createdAt
              }
            }
        `,
      veriables: {
        id: id,
      },
    });
    console.log(data);
  
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
        id: parseInt(data.data.getDeathById.village_id!),
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
          form_type: "OC",
        },
      },
    });
  
    return json({
      id: id,
      user: cookie,
      form: data.data.getDeathById,
      village: village.data.getAllVillageById.name,
      common: common.data.searchCommon,
    });
  };
  
  const DeathPdfView = (): JSX.Element => {
    const loader = useLoaderData();
    const form = loader.form;
    const village = loader.village;
    //   const common = loader.common;
  
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
      footer: {
        position: "absolute",
        bottom: "10px",
        fontSize: "12px",
        fontWeight: "normal",
        right: "20px",
      },
    });
  
    const DeathPdf = () => (
      <Document>
        <Page style={styles.body} size={"A4"}>
          <View>
            <Text style={styles.heading}>
              U.T. Administration of Dadra & Nagar Haveli and Daman & Diu,
            </Text>
          </View>
          <View>
            <Text style={styles.heading}>
              Daman Municipal COuncil,
            </Text>
          </View>
          <View>
            <Text style={styles.heading}>
              First Floor, DMC, Moti Daman.
            </Text>
          </View>
          <View>
            <Text style={styles.heading}>Death Registration</Text>
          </View>
          <View>
            <Text style={styles.subtitle} fixed>
              With reference to the {form.id}, the Death Certificate
              for deceased living in village{" "}
              {village}
            </Text>
          </View>
          <View>
            <Text style={styles.subtitle} fixed>
              is hereby Granted.
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
            <Text style={styles.text1}>1.2 Applicant address</Text>
            <Text style={styles.text2}>{form.address}</Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>1.3 Applicant Contact Number</Text>
            <Text style={styles.text2}>{form.mobile}</Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>1.4 Applicant Email</Text>
            <Text style={styles.text2}>{form.email}</Text>
          </View>
          <View style={styles.myflex}>
            <Text style={styles.text1}>1.5 Applicant UID</Text>
            <Text style={styles.text2}>{form.user_uid}</Text>
          </View>
  
          <View>
            <Text style={styles.signtext}>
              &nbsp; &nbsp; &nbsp; &nbsp; The Death Certificate             pertaining to deceased living in village {village.name} is hereby Granted.
            </Text>
          </View>
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
            <Text>
              REF. NO:
              {encrypt(
                `DEATH-${("0000" + form.id).slice(-4)}-${
                  form.createdAt.toString().split("-")[0]
                }`,
                "certificatedata"
              )}
            </Text>
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
              <DeathPdf />
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
  
  export default DeathPdfView;
  