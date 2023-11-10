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
        query getAllZoneById($id:Int!){
            getAllZoneById(id:$id){
              id,
              name,
              address,
              mobile,
              email,
              userId,
              user_uid,
              survey_no,
              village_id,
              sub_division,
              iagree,
              nakel_url_1_14,
              condition_to_follow,
              comments_dept
            }
          }
      `,
        veriables: {
            id: parseInt(id!)
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
                form_type: "ZONEINFO"
            }
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
            id: parseInt(data.data.getAllZoneById.village_id)
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
                villageId: parseInt(data.data.getAllZoneById.village_id),
                survey_no: data.data.getAllZoneById.survey_no,
            }
        },
    });

    return json({
        id: id,
        user: cookie,
        form: data.data.getAllZoneById,
        village: village.data.getAllVillageById.name,
        common: common.data.searchCommon,
        villagedata: village.data.getAllVillageById,
        subdivision: subdivision.data.getSubDivision,
    });
}

const ZonePdfView = (): JSX.Element => {

    const loader = useLoaderData();
    const form = loader.form;
    const village = loader.village;
    const division = loader.subdivision;
    const villagedata = loader.villagedata;


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

    interface landDetailsType {
        land: string | null;
        area: string | null;
        zone: string | null;
    }

    const [landDetails, setLandDetails] = useState<landDetailsType>({ area: null, land: null, zone: null });

    const setlanddetails = (value: string) => {
        const selectedSubdivision = division.find((val: any) => val.sub_division === value);
        if (selectedSubdivision) {
            setLandDetails(val => ({ land: selectedSubdivision.owner_name, area: selectedSubdivision.area, zone: selectedSubdivision.zone }))
        }
    };

    useEffect(() => {
        setlanddetails(form.sub_division);
    }, []);

    const ZonePdf = () => (
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
                        Report for Zone Info of land bearing survey No {form.survey_no} of village {village}
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
                        1.2 Applicant Address
                    </Text>
                    <Text style={styles.text2}>
                        {form.address}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        1.3 Applicant Contact Number
                    </Text>
                    <Text style={styles.text2}>
                        {form.mobile}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        1.4 Applicant Email
                    </Text>
                    <Text style={styles.text2}>
                        {form.email}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        1.5 Applicant UID
                    </Text>
                    <Text style={styles.text2}>
                        {form.user_uid}
                    </Text>
                </View>
                <View>
                    <Text style={styles.header}>
                        2. Site Details
                    </Text>
                </View>

                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.1 Land Village
                    </Text>
                    <Text style={styles.text2}>
                        {village}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.2 Land Survey Number
                    </Text>
                    <Text style={styles.text2}>
                        {form.survey_no}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.3 Land Subdivison
                    </Text>
                    <Text style={styles.text2}>
                        {form.sub_division}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.4 Land Owner Details
                    </Text>
                    <Text style={styles.text2}>
                        {landDetails.land}
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.5 Land Area(in Sq.Mtrs)
                    </Text>
                    <Text style={styles.text2}>
                        {landDetails.area}
                    </Text>
                </View>
                <View>
                    <Text style={styles.header}>
                        3. Zone Details
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        3.1 Zone in which the land falls as per the Regional plan of Daman
                    </Text>
                    <Text style={styles.text2}>
                        {landDetails.zone}
                    </Text>
                </View>

                <View style={styles.flexbox}>
                    <View style={styles.flexbox1}>

                    </View>
                    <View style={styles.flexbox2}>
                        <Text style={styles.signtext}>
                            Yours faithfullly,
                        </Text>
                        <Image src={"/images/signtwo.jpg"} style={styles.img} ></Image>
                        <Text style={styles.signtext}>
                            &#123;P.P.Parmar&#125;
                        </Text>
                        <Text style={styles.signtext}>
                            Assosciate Town Planer
                        </Text>
                        <Text style={styles.signtext}>
                            Daman
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
                        <ZonePdf />
                    </PDFViewer>
                </div >
                :
                <div className='h-screen w-full grid place-items-center bg-blue-500'>
                    <p className='text-white text-6xl'>Loading...</p>
                </div>}
        </>
    );

}

export default ZonePdfView;