import { Page, Text, View, Document, StyleSheet, Font, PDFViewer, PDFDownloadLink, renderToFile, usePDF, pdf, Image } from '@react-pdf/renderer';
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from "react";
import { symbol } from 'zod';
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

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
            id: parseInt(id!)
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
            id: parseInt(data.data.getPetroleumById.village_id!)
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
                form_type: "PETROLEUM"
            }
        },
    });

    return json({
        id: id,
        user: cookie,
        form: data.data.getPetroleumById,
        village: village.data.getAllVillageById.name,
        common: common.data.searchCommon
    });
}

const PetroleumPdfView = (): JSX.Element => {

    const loader = useLoaderData();
    const form = loader.form;
    const village = loader.village;

    Font.register({
        family: 'Oswald',
        src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
    });

    const styles = StyleSheet.create({
        body: {
            paddingTop: 15,
            paddingBottom: 35,
            paddingHorizontal: 35,
        },
        heading: {
            fontSize: 14,
            textAlign: 'center',
            fontFamily: 'Oswald'
        },
        title: {
            marginTop: "10px",
            marginBottom: "10px",
            fontSize: 10,
            textAlign: 'center',
            color: 'grey',
            width: "100%"
        },
        divider: {
            height: "40px"
        },
        dividertwo: {
            height: "25px"
        },
        subtitle: {
            fontSize: 12,
            textAlign: 'left',
            color: 'grey',
            width: "100%"
        },
        header: {
            marginTop: "15px",
            marginBottom: "10px",
            backgroundColor: "#c1dafe",
            paddingVertical: '8px',
            fontSize: "14px",
            color: "#1f2937",
            textAlign: "center",
            fontWeight: "normal"
        },
        myflex: {
            display: "flex",
            flexDirection: "row",
            width: "100%",
            borderBottom: "1px solid #6b7280",
        },

        text: {
            fontSize: "12px",
            fontWeight: 'normal',
            color: "#374151",
            padding: "4px 0px",
        },

        flexbox: {
            display: "flex",
            flexDirection: "row",
            width: "100%",
            marginTop: "55px"
        },
        flexbox1: {
            flex: 4,
        },
        flexbox2: {
            fontSize: "12px",
            fontWeight: 'normal',
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
            fontWeight: 'normal',
            color: "#374151",
            marginTop: "10px"
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
    }

    const PetroleumPdf = () => (
        <Document>
            <Page style={styles.body} size={'A4'} >
                <View>
                    <Text style={styles.heading}>U.T. Administration of Dadra & Nagar Haveli and Daman & Diu,</Text>
                </View>
                <View>
                    <Text style={styles.heading}>Town & Country Planning Department,</Text>
                </View>
                <View>
                    <Text style={styles.heading}>First Floor, Collectorate, Moti Daman.</Text>
                </View>
                <View style={styles.divider}>
                </View>
                <View>
                    <Text style={styles.subtitle} fixed>
                        To,
                    </Text>
                </View>
                <View>
                    <Text style={styles.subtitle} fixed>
                        The Addl.District Magistrate,Daman,
                    </Text>
                </View>

                <View>
                    <Text style={styles.subtitle} fixed>
                        Collectorate,
                    </Text>
                </View>
                <View>
                    <Text style={styles.subtitle} fixed>
                        Daman.
                    </Text>
                </View>
                <View style={styles.dividertwo}>
                </View>
                <View>
                    <Text style={styles.subtitle} fixed>
                        Sub: Regarding grant of NOC for (capacity) KL petroleum (class A) storage under Rule 144 of petroleum Rules-2002.
                    </Text>
                </View>
                <View style={styles.dividertwo}>
                </View>
                <View>
                    <Text style={styles.subtitle} fixed>
                        Sir,
                    </Text>
                </View>
                <View>
                    <Text style={styles.subtitle} fixed>
                        In Reference to your letter on the above cited subject, the proposal is scrutinized from planning point of view and the following report / comments are hereby forwarded.
                    </Text>
                </View>
                <View style={styles.dividertwo}>
                </View>
                <View>
                    <Text style={styles.text} fixed>
                        {form.condition_to_follow}
                    </Text>
                </View>
                <View style={styles.dividertwo}>
                </View>
                <View>
                    <Text style={styles.text} fixed>
                        {form.comments_dept}
                    </Text>
                </View>

                <View style={styles.flexbox}>
                    <View style={styles.flexbox1}>

                    </View>
                    <View style={styles.flexbox2}>
                        <Text style={styles.signtext}>
                            Yours faithfully
                        </Text>
                        <Image src={"/images/signone.jpg"} style={styles.img}></Image>
                        <Text style={styles.signtext}>
                            Asssociate town planner, Daman
                        </Text>
                    </View>

                </View>
            </Page>
        </Document >
    );

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true);
    }, [])


    return (
        <>
            {isClient ?
                < div className='w-full h-scree'>
                    <PDFViewer style={{ width: '100%', height: '100vh' }}>
                        <PetroleumPdf />
                    </PDFViewer>
                </div >
                :
                <div className='h-screen w-full grid place-items-center bg-blue-500'>
                    <p className='text-white text-6xl'>Loading...</p>
                </div>}
        </>
    );

}

export default PetroleumPdfView;