import { Page, Text, View, Document, StyleSheet, Font, PDFViewer, PDFDownloadLink, renderToFile, usePDF, pdf, Image } from '@react-pdf/renderer';
import { LoaderArgs, LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from "react";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

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
              illegal_sqmt,
              recommend
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
            id: parseInt(data.data.getAllLandById.village_id!)
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
                form_type: "LANDRECORDS"
            }
        },
    });

    return json({
        id: id,
        user: cookie,
        form: data.data.getAllLandById,
        village: village.data.getAllVillageById.name,
        common: common.data.searchCommon
    });
}

const LandSectionPdfView = (): JSX.Element => {

    const loader = useLoaderData();
    const form = loader.form;
    const village = loader.village;
    const common = loader.common;
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
        subtitle: {
            fontSize: 10,
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
        text1: {
            fontSize: "12px",
            fontWeight: 'normal',
            color: "#374151",
            flex: 2,
            padding: "4px 8px",
            backgroundColor: "#f6f7f8",
            borderRight: "1px solid #6b7280",
        },
        text2: {
            fontSize: "12px",
            fontWeight: 'normal',
            color: "#374151",
            flex: 3,
            padding: "4px 8px",
        },
        divider: {
            width: "100%",
            height: "1px",
            backgroundColor: "#6b7280",
            marginVertical: "2px"
        },
        flexbox: {
            display: "flex",
            flexDirection: "row",
            width: "100%",
            marginTop: "55px"
        },
        flexbox1: {
            flex: 1,
            fontSize: "12px",
            fontWeight: 'normal',
            color: "#374151",
        },
        flexbox2: {
            flex: 1,
            fontSize: "12px",
            fontWeight: 'normal',
            color: "#374151",
        },
        flexbox3: {
            flex: 1,
            fontSize: "12px",
            fontWeight: 'normal',
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


    const LandSectionPdf = () => (
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
                <View>
                    <Text style={styles.title} fixed>
                        Report for {getnatype(form.land_stageid)} of land bearing survey No {form.survey_no} of village {village}
                    </Text>
                </View>
                <View>
                    <Text style={styles.subtitle} fixed>
                        With reference to the {form.land_formid}, the proposal of {getnatype(form.land_stageid)} permission for land bearing Survey No. {form.survey_no} of village {village}
                    </Text>
                </View>
                <View>
                    <Text style={styles.subtitle} fixed>
                        for {form.na_type} use is scrutinized from the planning point of view and the following report is hereby submitted.
                    </Text>
                </View>
                <View>
                    <Text style={styles.header}>
                        1. Applicant Details(s)
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        1.1 Applicant Name
                    </Text>
                    <Text style={styles.text2}>
                        {form.name}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        1.2 Applicant Contact Number
                    </Text>
                    <Text style={styles.text2}>
                        {form.mobile}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        1.3 Applicant Survey Number
                    </Text>
                    <Text style={styles.text2}>
                        {form.survey_no}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        1.4 Applicant Village
                    </Text>
                    <Text style={styles.text2}>
                        {village}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        1.5 Applicant Area
                    </Text>
                    <Text style={styles.text2}>
                        {form.area}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        1.6 Purpose
                    </Text>
                    <Text style={styles.text2}>
                        {form.na_type}
                    </Text>
                </View>
                <View>
                    <Text style={styles.header}>
                        2. Site Details
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.1 Zone in which the land falls as per the Regional plan of Daman
                    </Text>
                    <Text style={styles.text2}>
                        {form.zone}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.2 Is there a road from where the land is easily accessible?
                    </Text>
                    <Text style={styles.text2}>
                        {form.road_access}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.3 If there is no road adjoining the land, how is it proposed to provide access to the Site by the applicant?
                    </Text>
                    <Text style={styles.text2}>
                        {form.no_road_access}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.4 Is the width of the road /Proposed road adequate from the planning point of view?
                    </Text>
                    <Text style={styles.text2}>
                        {form.width_adequate}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.5 Whether dimensions & arrangement of the plot adequate?
                    </Text>
                    <Text style={styles.text2}>
                        {form.is_dimension_plot_adequate}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.6 Whether the land /plot falls within C.R.Z give C.R.Z Category and Comments if any Distance from H.T.L of the sea River, creek
                    </Text>
                    <Text style={styles.text2}>
                        {form.is_crz}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.7 Whether the land is Situated near any protected monument of A.S.I? if yes, the distance from the monument? Comments ,If any.
                    </Text>
                    <Text style={styles.text2}>
                        {form.is_crz}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.8 Any other remarks /comments?
                    </Text>
                    <Text style={styles.text2}>
                        {form.other_remark}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.9 Whether the Town & Country Planning Department recommended the case from the planning point of view?
                    </Text>
                    <Text style={styles.text2}>
                        {form.atp_recommendation}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.10  Condition(s) is to be mentioned in N.A. Sanad/order if N.A is granted.
                    </Text>
                    <Text style={styles.text2}>
                        {form.condition_to_follow}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.11 If no, the reason thereof
                    </Text>
                    <Text style={styles.text2}>
                        {form.comments_dept}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.12 Illegal (sqmt)
                    </Text>
                    <Text style={styles.text2}>
                        {form.illegal_sqmt}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.13 Recommend status
                    </Text>
                    <Text style={styles.text2}>
                        {form.recommend ? "YES" : "NO"}
                    </Text>
                </View>
                <View style={styles.flexbox}>
                    <View style={styles.flexbox1}>
                        {
                            common.form_status == 25 || common.form_status == 50 || common.form_status == 75 ?
                                <View>
                                    <Image src={"/images/signtwo.jpg"} style={styles.img} ></Image>
                                    <Text style={styles.signtext}>
                                        Field Inspector Town Planning
                                    </Text>
                                    <Text style={styles.signtext}>
                                        Daman
                                    </Text>
                                </View>
                                : null
                        }
                    </View>
                    <View style={styles.flexbox2}>
                        {
                            common.form_status == 50 || common.form_status == 75 ?
                                <View>
                                    <Image src={"/images/signtwo.jpg"} style={styles.img} ></Image>
                                    <Text style={styles.signtext}>
                                        Junior Town Planner
                                    </Text>
                                    <Text style={styles.signtext}>
                                        Daman
                                    </Text>
                                </View>
                                : null
                        }
                    </View>
                    <View style={styles.flexbox3}>
                        {
                            common.form_status == 75 || common.form_status == 125 ?
                                <View>
                                    <Image src={"/images/signtwo.jpg"} style={styles.img} ></Image>
                                    <Text style={styles.signtext}>
                                        Assosciate Town Planner
                                    </Text>
                                    <Text style={styles.signtext}>
                                        Daman
                                    </Text>
                                </View>
                                : null
                        }
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
                        <LandSectionPdf />
                    </PDFViewer>
                </div >
                :
                <div className='h-screen w-full grid place-items-center bg-blue-500'>
                    <p className='text-white text-6xl'>Loading...</p>
                </div>}
        </>
    );

}

export default LandSectionPdfView;