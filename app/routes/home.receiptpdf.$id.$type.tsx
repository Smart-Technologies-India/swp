import { json, type LoaderArgs, type LoaderFunction } from "@remix-run/node";
import { userPrefs } from "~/cookies";
import { ApiCall } from "~/services/api";

import { useLoaderData } from "@remix-run/react";
// import { useEffect, useState } from "react";

// import { formateDate } from "~/utils";

// import { ClientOnly } from "remix-utils";
// import PdfView from "~/components/receipt.client";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const id = props.params.id;
  const type = props.params.type;

  console.log("------------------------------------------------");

  const cookieHeader = props.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);

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
      id: parseInt(cookie.id!),
    },
  });

  const paymentdata = await ApiCall({
    query: `
            query getPaymentReceipt($id:Int!,$type:String!){
                getPaymentReceipt(id:$id,type:$type){
                    id,
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

  let form;

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
                  comments_dept
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
                  payment_doc
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
                  payment_doc
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
                  recommend
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
                  payment_doc
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
                  payment_doc
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

  return json({
    user: userdata.data.getUserById,
    payment: paymentdata.data.getPaymentReceipt,
    form: form,
    common: common.data.searchCommon,
  });
};

const Receipt: React.FC = (): JSX.Element => {
  const loader = useLoaderData();
  const user = loader.user;
  const payment = loader.payment;

  return (
    <>
      <div className="w-full h-full bg-white p-2 mt-4">
        {/* <embed
            src={instance.url!}
            className="w-full h-full"
            type="application/pdf"
          /> */}
        {/* <ClientOnly>{() => <PdfView></PdfView>}</ClientOnly> */}
        <iframe
          title="pdffile"
          src="/genpdf"
          className="border-none w-full h-[85vh]"
        />
      </div>
    </>
  );
};
export default Receipt;

// const Receipt: React.FC = (): JSX.Element => {
//   const loader = useLoaderData();
//   const user = loader.user;
//   const payment = loader.payment;
//   const form = loader.form;
//   const common = loader.common;

//   // useEffect(() => {
//   //   setTimeout(async () => {
//   //     // const init = async () => {
//   //     //   const file = await pdf(<Quixote />).toBlob();
//   //     //   const mypdffile: File = new File([file], "data.pdf");

//   //     //   const fileurl = await UploadFile(mypdffile);

//   //     //   console.log(fileurl);
//   //     // };
//   //     // init();

//   //     setIsClient(true);
//   //   }, 2000);
//   // }, []);

//   // const downlaodpdf = async () => {
//   //   const file = await pdf(<Quixote />).toBlob();
//   //   const mypdffile: File = new File([file], "data.pdf");

//   //   const fileurl = await UploadFile(mypdffile);

//   //   console.log(fileurl);
//   // };

//   // const [instance, updateInstance] = usePDF({ document: Quixote });

//   // return (
//   //   <>
//   //     {isClient ? (
//   //       <div className="w-full h-full">
//   //         {/* <button onClick={downlaodpdf}>Download</button> */}
//   //         {/* <a download={"data.pdf"} href={pdfUrl}>
//   //           Download
//   //         </a> */}
//   //         {/* <PDFViewer width="100%" height="100%">
//   //           <Quixote />
//   //         </PDFViewer> */}

//   //         <embed
//   //           src={instance.url!}
//   //           className="w-full h-full"
//   //           type="application/pdf"
//   //         />
//   //       </div>
//   //     ) : null}
//   //   </>
//   // );
//   return <InvoiceRepprt payment={payment} user={user} />;
// };

// export default Receipt;
