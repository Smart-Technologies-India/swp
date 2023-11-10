import { Page, Text, View, Document, StyleSheet, Font, PDFViewer, PDFDownloadLink, renderToFile, usePDF, pdf } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';

const ShowPdf = () => {
    Font.register({
        family: 'Oswald',
        src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
    });

    const styles = StyleSheet.create({
        body: {
            paddingTop: 35,
            paddingBottom: 65,
            paddingHorizontal: 35,
        },
        title: {
            fontSize: 24,
            textAlign: 'center',
            fontFamily: 'Oswald'
        },
        subtitle: {
            marginTop: "10px",
            fontSize: 12,
            textAlign: 'center',
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
            fontSize: "12px",
            fontWeight: 'normal',
            color: "#374151",
            flex: 4,
        },
        flexbox2: {
            fontSize: "12px",
            fontWeight: 'normal',
            color: "#374151",
            flex: 2,
        },
    });


    const Quixote = () => (
        <Document>
            <Page style={styles.body} size={'A4'}>
                <View>
                    <Text style={styles.title}>Land Section</Text>
                </View>
                <View>
                    <Text style={styles.subtitle} fixed>
                        SUBJECT  :  Comments of pda on land related documents.
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
                        sombra
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        1.2 Applicant Contact Number
                    </Text>
                    <Text style={styles.text2}>
                        Applicant details
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        1.3 Applicant Survey Number
                    </Text>
                    <Text style={styles.text2}>
                        Applicant details
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        1.4 Applicant Contact Number
                    </Text>
                    <Text style={styles.text2}>
                        Applicant Village
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        1.5 Applicant Contact Number
                    </Text>
                    <Text style={styles.text2}>
                        Applicant details
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        1.6 Applicant Area
                    </Text>
                    <Text style={styles.text2}>
                        Applicant details
                    </Text>
                </View>
                <View>
                    <Text style={styles.header}>
                        2. Site Details
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.1 Applicant Area
                    </Text>
                    <Text style={styles.text2}>
                        Applicant details
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.2 Applicant Area
                    </Text>
                    <Text style={styles.text2}>
                        Applicant details
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.3 Applicant Area
                    </Text>
                    <Text style={styles.text2}>
                        Applicant details
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.4 Applicant Area
                    </Text>
                    <Text style={styles.text2}>
                        Applicant details
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.5 Applicant Area
                    </Text>
                    <Text style={styles.text2}>
                        Applicant details
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.6 Applicant Area
                    </Text>
                    <Text style={styles.text2}>
                        Applicant details
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.7 Applicant Area
                    </Text>
                    <Text style={styles.text2}>
                        Applicant details
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.8 Applicant Area
                    </Text>
                    <Text style={styles.text2}>
                        Applicant details
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.9 Applicant Area
                    </Text>
                    <Text style={styles.text2}>
                        Applicant details
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.10 Applicant Area
                    </Text>
                    <Text style={styles.text2}>
                        Applicant details
                    </Text>
                </View>
                <View style={styles.myflex}>
                    <Text style={styles.text1}>
                        2.11 Applicant Area
                    </Text>
                    <Text style={styles.text2}>
                        Applicant details
                    </Text>
                </View>
                <View style={styles.flexbox}>
                    <Text style={styles.flexbox1}>
                        AD(SP)
                    </Text>
                    <Text style={styles.flexbox2}>
                        JTP
                    </Text>
                </View>
            </Page>
        </Document >
    );

    const [isClient, setIsClient] = useState(false)

    const init = async () => {

        const file = await pdf(<Quixote />).toBlob();
        const mypdffile: File = new File([file], "data");

    }

    useEffect(() => {
        setIsClient(true);
        init();
    }, [])



    const getfile = async () => {
        const file: NodeJS.ReadableStream = await renderToFile(<Quixote />, "test", (output, filePath) => {
            // Optional callback logic
        });


    }

    // useEffect(() => {
    //     getfile();
    // }, []);

    return (
        <>
            <div className='grid place-items-center'>
                <button className='text-white bg-cyan-500 px-4 py-1 rounded-md my-2' onClick={getfile}>Download</button>
            </div>
            {isClient ? <PDFDownloadLink document={<Quixote />} fileName="somename.pdf">
                {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download now!')}
            </PDFDownloadLink> : null}
            {isClient ?
                < div className='w-full h-scree'>
                    {/* <PDFViewer width={"100%"} height={"100vh"}> */}
                    <PDFViewer style={{ width: '100%', height: '100vh' }}>
                        <Quixote />
                    </PDFViewer>
                </div >
                : null}

        </>
    );
}

export default ShowPdf;