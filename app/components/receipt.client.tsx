import { useEffect, useState } from "react";

import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  usePDF,
  PDFViewer,
} from "@react-pdf/renderer";
import { ClientOnly } from "remix-utils";

export default function PdfView() {
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
      width: "100%",
    },
  });

  const getPdfDoc = () => {
    const Quixote = (
      <Document>
        <Page style={styles.body} size={"A4"}>
          <View>
            <Text style={styles.subtitle}>Form 2</Text>
            <Text style={styles.subtitle}>(Rule 11)</Text>
            <Text style={styles.title}>Dadra and Nagar Haveli</Text>
            <Text style={styles.title}>Planning and development Authority</Text>
            <View
              style={{
                height: "10px",
              }}
            ></View>
            <Text style={styles.titledescription}>
              &quot;A&quot; WING, Second Floor, District Secretariat,
              Silvassa-396230.
            </Text>
            <Text style={styles.titledescription}>
              GSTIN/UIN: 26AAALD0940J1ZE
            </Text>
          </View>
        </Page>
      </Document>
    );

    return Quixote;
  };

  const [isClient, setIsClient] = useState(false);
  const [instance, updateInstance] = usePDF({
    document: getPdfDoc(),
  });

  useEffect(() => {
    setTimeout(() => {
      setIsClient(true);

      updateInstance(getPdfDoc());
    }, 3000);
  }, []);

  return (
    <>
      <ClientOnly>
        {() =>
          isClient ? (
            <div className="w-full h-full" suppressHydrationWarning>
              <h1 className="text-3xl">Welcome to Remix</h1>
              <a download href={instance.url!} className="text-3xl">
                Download
              </a>

              <embed
                src={instance.url!}
                className="w-full h-full"
                type="application/pdf"
              />
            </div>
          ) : null
        }
      </ClientOnly>
    </>
  );
}
