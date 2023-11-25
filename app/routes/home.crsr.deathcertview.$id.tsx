import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Fa6SolidFileLines, Fa6SolidLink } from "~/components/icons/icons";
import { toast } from "react-toastify";

import { ApiCall, UploadFile } from "~/services/api";
import { Link, useLoaderData, useNavigate } from "@remix-run/react";
import type { LoaderArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { userPrefs } from "~/cookies";
import QueryTabs from "~/components/QueryTabs";

export const loader: LoaderFunction = async (props: LoaderArgs) => {
  const id = props.params.id;
  const cookieHeader = props.request.headers.get("Cookie");
  const cookie: any = await userPrefs.parse(cookieHeader);

  const data = await ApiCall({
    query: `
        query getDeathCertificateById($id:Int!){
            getDeathCertificateById(id:$id){
              id,
              name,
              address,
              mobile,
              email,
              user_uid,
              userId,
              village_id,
              date_of_birth,
              date_of_death,
              place_of_death,
              gender,
              date_of_registration,
              father_name,
              mother_name,
              husband_name,
              registration_number,
              applicant_uid_url,
              father_uid_url,
              mother_uid_url,
              undertaking_url,
              iagree,
              signature_url,
            }
          }
      `,
    veriables: {
      id: parseInt(id!),
    },
  });
  const submit = await ApiCall({
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
        form_type: "DEATHCERT",
      },
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
      id: parseInt(data.data.getDeathCertificateById.village_id),
    },
  });

  const searchpayment = await ApiCall({
    query: `
        query searchPayment($searchPaymentInput:SearchPaymentInput!){
            searchPayment(searchPaymentInput:$searchPaymentInput){
            id,
            form_id,
            deptuser_id,
            user_id,
            type1,
            amount1,
            type2,
            amount2,
            type3,
            amount3,
            daycount,
            paymentamout,
            form_type,
            paymentstatus
            }
          }
      `,
    veriables: {
      searchPaymentInput: {
        form_id: parseInt(data.data.getDeathCertificateById.id),
        form_type: "DEATHCERT",
      },
    },
  });
  return json({
    user: cookie,
    formid: id,
    from_data: data.data.getDeathCertificateById,
    submit: submit.status,
    common: submit.data.searchCommon,
    payment: searchpayment.status,
    village: village.data.getAllVillageById,
    paymentinfo: searchpayment.status
      ? searchpayment.data.searchPayment[0]
      : "",
  });
};

const DeathCertificateView = (): JSX.Element => {
  const loader = useLoaderData();

  const user = loader.user;
  const isUser = user.role == "USER";
  const from_data = loader.from_data;
  const villagedata = loader.village;

  const navigator = useNavigate();

  const isSubmited = loader.submit;
  const common = isSubmited ? loader.common[0] : null;
  const submit = async () => {
    const data = await ApiCall({
      query: `
            mutation createCommon($createCommonInput:CreateCommonInput!){
                createCommon(createCommonInput:$createCommonInput){
                  id,
                }
              }
            `,
      veriables: {
        createCommonInput: {
          form_id: Number(from_data.id),
          user_id: Number(user.id),
          auth_user_id: "53",
          focal_user_id: "51",
          intra_user_id: "51",
          inter_user_id: "0",
          village: villagedata.name,
          name: from_data.name,
          number: from_data.mobile.toString(),
          form_status: 1,
          form_type: "DEATHCERT",
          query_status: "SUBMIT",
        },
      },
    });
    if (!data.status) {
      toast.error(data.message, { theme: "light" });
    } else {
      navigator("/home/");
    }
  };

  const handleLogoChange = (
    value: React.ChangeEvent<HTMLInputElement>,
    setvalue: Function
  ) => {
    let file_size = parseInt(
      (value!.target.files![0].size / 1024 / 1024).toString()
    );
    if (file_size < 4) {
      setvalue((val: any) => value!.target.files![0]);
    } else {
      toast.error("Image file size must be less then 4 mb", { theme: "light" });
    }
  };

  const [querybox, setQueryBox] = useState<boolean>(false);
  const [paymentbox, setPaymentBox] = useState<boolean>(false);
  const queryRef = useRef<HTMLTextAreaElement>(null);
  const [replyquerybox, setReplyQueryBox] = useState<boolean>(false);
  const replyQueryRef = useRef<HTMLTextAreaElement>(null);
  const attachmentRef = useRef<HTMLInputElement>(null);
  const [attachment, setAttachment] = useState<File>();

  const submitQuery = async () => {
    if (queryRef.current?.value == null || queryRef.current?.value == "")
      return toast.error("Remark is required", { theme: "light" });
    const req: { [key: string]: any } = {
      stage: "DEATHCERT",
      form_id: from_data.id,
      from_user_id: Number(user.id),
      to_user_id: from_data.userId,
      form_status: common.form_status,
      query_type: "PUBLIC",
      remark: queryRef.current?.value,
      query_status: "SENT",
      status: "NONE",
    };

    if (attachment != null) {
      const attach = await UploadFile(attachment);
      if (attach.status) {
        req.doc_url = attach.data;
      } else {
        return toast.error("Unable to upload attachment", { theme: "light" });
      }
    }

    const data = await ApiCall({
      query: `
            mutation createQuery($createQueryInput:CreateQueryInput!){
                createQuery(createQueryInput:$createQueryInput){
                  id,
                }
              }
            `,
      veriables: {
        createQueryInput: req,
      },
    });

    if (data.status) {
      const updatecommon = await ApiCall({
        query: `
                mutation updateCommonById($updateCommonInput:UpdateCommonInput!){
                    updateCommonById(updateCommonInput:$updateCommonInput){
                      id,
                    }
                  }
              `,
        veriables: {
          updateCommonInput: {
            id: common.id,
            query_status: "QUERYRAISED",
          },
        },
      });

      if (updatecommon.status) {
        setQueryBox((val) => false);
        return toast.success("Query sent successfully.", { theme: "light" });
      } else {
        return toast.error(updatecommon.message, { theme: "light" });
      }
    } else {
      return toast.error(data.message, { theme: "light" });
    }
  };

  const submitReplyQuery = async () => {
    if (
      replyQueryRef.current?.value == null ||
      replyQueryRef.current?.value == ""
    )
      return toast.error("Remark is required", { theme: "light" });
    const req: { [key: string]: any } = {
      stage: "DEATHCERT",
      form_id: from_data.id,
      from_user_id: Number(user.id),
      to_user_id: 5,
      form_status: common.form_status,
      query_type: "PUBLIC",
      remark: replyQueryRef.current?.value,
      query_status: "SENT",
      status: "NONE",
    };

    if (attachment != null) {
      const attach = await UploadFile(attachment);
      if (attach.status) {
        req.doc_url = attach.data;
      } else {
        return toast.error("Unable to upload attachment", { theme: "light" });
      }
    }

    const data = await ApiCall({
      query: `
                mutation createQuery($createQueryInput:CreateQueryInput!){
                    createQuery(createQueryInput:$createQueryInput){
                      id,
                    }
                  }
                `,
      veriables: {
        createQueryInput: req,
      },
    });

    if (data.status) {
      const updatecommon = await ApiCall({
        query: `
                    mutation updateCommonById($updateCommonInput:UpdateCommonInput!){
                        updateCommonById(updateCommonInput:$updateCommonInput){
                          id,
                        }
                      }
                  `,
        veriables: {
          updateCommonInput: {
            id: common.id,
            query_status: "INPROCESS",
          },
        },
      });

      if (updatecommon.status) {
        setReplyQueryBox((val) => false);
        return toast.success("Query Replied successfully.", {
          theme: "light",
        });
      } else {
        return toast.error(updatecommon.message, { theme: "light" });
      }
    } else {
      return toast.error(data.message, { theme: "light" });
    }
  };

  const [forwardbox, setForwardBox] = useState<boolean>(false);
  const forwardRef = useRef<HTMLTextAreaElement>(null);

  interface forwardqueryType {
    title: string;
    formstatus: number;
    querytype: string;
    authuserid: string;
    foacaluserid: string;
    intrauserid: string;
    interuserid: string;
    touserid: number;
    querystatus: string;
    status: string;
  }

  const [nextdata, setNextData] = useState<forwardqueryType>({
    title: "Send to SUPTD",
    authuserid: "0",
    foacaluserid: "0",
    intrauserid: "0",
    interuserid: "0",
    formstatus: 0,
    querytype: "NONE",
    touserid: 0,
    querystatus: "NONE",
    status: "NONE",
  });

  const forwardQuery = async (args: forwardqueryType) => {
    if (forwardRef.current?.value == null || forwardRef.current?.value == "")
      return toast.error("Remark is required", { theme: "light" });
    const req: { [key: string]: any } = {
      stage: "DEATHCERT",
      form_id: from_data.id,
      from_user_id: Number(user.id),
      to_user_id: args.touserid,
      form_status: args.formstatus,
      query_type: args.querytype,
      remark: forwardRef.current?.value,
      query_status: "SENT",
      status: args.status,
    };

    if (attachment != null) {
      const attach = await UploadFile(attachment);
      if (attach.status) {
        req.doc_url = attach.data;
      } else {
        return toast.error("Unable to upload attachment", { theme: "light" });
      }
    }

    const data = await ApiCall({
      query: `
            mutation createQuery($createQueryInput:CreateQueryInput!){
                createQuery(createQueryInput:$createQueryInput){
                  id,
                }
              }
            `,
      veriables: {
        createQueryInput: req,
      },
    });

    if (data.status) {
      const data = await ApiCall({
        query: `
                mutation updateCommonById($updateCommonInput:UpdateCommonInput!){
                    updateCommonById(updateCommonInput:$updateCommonInput){
                      id,
                    }
                  }
              `,
        veriables: {
          updateCommonInput: {
            id: common.id,
            auth_user_id: args.authuserid,
            focal_user_id: args.foacaluserid,
            intra_user_id: args.intrauserid,
            inter_user_id: args.interuserid,
            form_status: args.formstatus,
            query_status: args.querystatus,
          },
        },
      });

      if (!data.status) {
        toast.error(data.message, { theme: "light" });
      } else {
        setForwardBox((val) => false);
        // toast.success("Form sent successfully.", { theme: "light" });
        if (common.form_status == 1) {
          setPaymentBox((val) => true);
        } else if (common.form_status == 50) {
          await sendDocQuery();
        } else {
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        }
      }
    } else {
      return toast.error(data.message, { theme: "light" });
    }
  };

  const sendDocQuery = async () => {
    const getdoc = await ApiCall({
      query: `
            query searchQuery($searchQueryInput:SearchQueryInput!){
                searchQuery(searchQueryInput:$searchQueryInput){
                  id,
                  doc_url
                }
              }
          `,
      veriables: {
        searchQueryInput: {
          status: "ACTIVE",
          form_id: from_data.id,
          stage: "DEATHCERT",
          query_type: "INTRA",
        },
      },
    });
    if (getdoc.status) {
      const req: { [key: string]: any } = {
        stage: "DEATHCERT",
        form_id: from_data.id,
        from_user_id: Number(user.id),
        to_user_id: Number(from_data.userId),
        form_status: 75,
        query_type: "PUBLIC",
        remark: "Document",
        query_status: "SENT",
        status: "NONE",
        doc_url: getdoc.data.searchQuery[0].doc_url,
      };

      const createQuery = await ApiCall({
        query: `
                mutation createQuery($createQueryInput:CreateQueryInput!){
                    createQuery(createQueryInput:$createQueryInput){
                      id,
                    }
                  }
                `,
        veriables: {
          createQueryInput: req,
        },
      });

      if (createQuery.status) {
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    }
  };

  const [notings, setNotings] = useState<any[]>([]);

  const getNotings = async () => {
    const data = await ApiCall({
      query: `
                query searchQuery($searchQueryInput:SearchQueryInput!){
                    searchQuery(searchQueryInput:$searchQueryInput){
                        id,
                      from_user_id,
                      to_user_id
                      remark
                      doc_url,
                      createdAt,
                      query_type,
                        from_user{
                        name,
                        role
                      },
                      to_user{
                        name,
                        role
                      }
                    }
                  }
                `,
      veriables: {
        searchQueryInput: {
          form_id: from_data.id,
          stage: "DEATHCERT",
          query_type: isUser ? "PUBLIC" : "INTRA",
        },
      },
    });
    if (data.status) {
      setNotings((val) => data.data.searchQuery);
    }
  };
  useEffect(() => {
    getNotings();
  }, []);

  const [rejectbox, setRejectBox] = useState<boolean>(false);
  const [rejectid, setRejectid] = useState<number>(0);

  const reject = async (id: number) => {
    if (rejectid == 0)
      return toast.error("Select the form for rejection.", { theme: "light" });
    const data = await ApiCall({
      query: `
            mutation updateCommonById($updateCommonInput:UpdateCommonInput!){
                updateCommonById(updateCommonInput:$updateCommonInput){
                  id,
                }
              }
          `,
      veriables: {
        updateCommonInput: {
          id: id,
          query_status: "REJECTED",
        },
      },
    });

    if (!data.status) {
      setRejectBox(false);
      toast.error(data.message, { theme: "light" });
    } else {
      window.location.reload();
    }
  };

  const timelimit = useRef<HTMLInputElement>(null);

  const [payamt, setPayamt] = useState<{ [key: string]: number }>({
    type1: 0,
    amount1: 0,
    type2: 0,
    amount2: 0,
    type3: 0,
    amount3: 0,
  });

  const requestpayment = async () => {
    if (
      timelimit.current?.value == null ||
      timelimit.current?.value == undefined ||
      timelimit.current?.value == "" ||
      parseInt(timelimit.current?.value) == 0
    ) {
      toast.error("Time limit is required.", { theme: "light" });
    } else {
      let req: any = {
        form_id: from_data.id,
        deptuser_id: parseInt(user.id),
        user_id: parseInt(from_data.userId),
        form_type: "DEATHCERT",
        paymentstatus: "PENDING",
      };
      if (payamt.type1 != 0) req.type1 = payamt.type1;
      if (payamt.amount1 != 0) req.amount1 = payamt.amount1;
      if (payamt.type2 != 0) req.type2 = payamt.type2;
      if (payamt.amount2 != 0) req.amount2 = payamt.amount2;
      if (payamt.type3 != 0) req.type3 = payamt.type3;
      if (payamt.amount3 != 0) req.amount3 = payamt.amount3;
      if (parseInt(timelimit!.current!.value) != 0)
        req.daycount = parseInt(timelimit!.current!.value);
      if (
        payamt.type1 * payamt.amount1 +
          payamt.type2 * payamt.amount2 +
          payamt.type3 * payamt.amount3 !=
        0
      )
        req.paymentamout =
          payamt.type1 * payamt.amount1 +
          payamt.type2 * payamt.amount2 +
          payamt.type3 * payamt.amount3;

      const addpayment = await ApiCall({
        query: `
                mutation createPayment($createPaymentInput:CreatePaymentInput!){
                    createPayment(createPaymentInput:$createPaymentInput){
                      id,
                    }
                  }
              `,
        veriables: {
          createPaymentInput: req,
        },
      });

      if (!addpayment.status) {
        setPaymentBox(false);
        toast.error(addpayment.message, { theme: "light" });
      } else {
        const reqdata: { [key: string]: any } = {
          stage: "DEATHCERT",
          form_id: from_data.id,
          from_user_id: 51,
          to_user_id: Number(from_data.userId),
          form_status: common.form_status,
          query_type: "PUBLIC",
          remark: `Payment Request of Rs. (${req.paymentamout}) requested successfully from user.`,
          query_status: "SENT",
          status: "NONE",
        };

        const data = await ApiCall({
          query: `
                    mutation createQuery($createQueryInput:CreateQueryInput!){
                        createQuery(createQueryInput:$createQueryInput){
                          id,
                        }
                      }
                    `,
          veriables: {
            createQueryInput: reqdata,
          },
        });

        if (data.status) {
          setPaymentBox(false);
          toast.success("Payment request sent to user", { theme: "light" });

          let payreq: any = {
            id: from_data.id,
          };

          if (attachment != null) {
            const attach = await UploadFile(attachment);
            if (attach.status) {
              payreq.payment_doc = attach.data;
            } else {
              return toast.error("Unable to upload attachment", {
                theme: "light",
              });
            }
          }

          const savepaymentdoc = await ApiCall({
            query: `
                        mutation updateDeathCertificateById($updateDeathCertificateInput:UpdateDeathCertificateInput!){
                            updateDeathCertificateById(updateDeathCertificateInput:$updateDeathCertificateInput){
                              id,
                            }
                          }
                        `,
            veriables: {
              updateDeathCertificateInput: payreq,
            },
          });

          if (!savepaymentdoc.status) {
            toast.error(savepaymentdoc.message, { theme: "light" });
          } else {
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }
        } else {
          return toast.error(data.message, { theme: "light" });
        }
      }
    }
  };

  const handleInputChange = (key: string, value: number) => {
    setPayamt((prevPayamt) => ({
      ...prevPayamt,
      [key]: value,
    }));
  };

  const paymentType = useRef<HTMLSelectElement>(null);
  const refrancerRef = useRef<HTMLInputElement>(null);

  const submitpayment = async () => {
    if (
      refrancerRef.current?.value == null ||
      refrancerRef.current?.value == undefined ||
      refrancerRef.current?.value == ""
    ) {
      toast.error("Enter Payment Reference.", { theme: "light" });
    } else if (
      paymentType.current?.value == null ||
      paymentType.current?.value == undefined ||
      paymentType.current?.value == "" ||
      parseInt(paymentType.current?.value) == 0
    ) {
      toast.error("Select Payment Type.", { theme: "light" });
    } else {
      const submitpayment = await ApiCall({
        query: `
                mutation updatePaymentById($updatePaymentInput:UpdatePaymentInput!){
                    updatePaymentById(updatePaymentInput:$updatePaymentInput){
                      id,
                    }
                  }
              `,
        veriables: {
          updatePaymentInput: {
            id: loader.paymentinfo.id,
            paymentstatus: "PAID",
            reference: refrancerRef.current?.value,
            paymentType: paymentType.current?.value,
          },
        },
      });

      if (!submitpayment.status) {
        toast.error(submitpayment.message, { theme: "light" });
      } else {
        const req: { [key: string]: any } = {
          stage: "DEATHCERT",
          form_id: from_data.id,
          from_user_id: Number(user.id),
          to_user_id: 51,
          form_status: common.form_status,
          query_type: "PUBLIC",
          remark: `The payment of Rs. (${loader.paymentinfo.paymentamout}) requested from user is successfully paid vide ${paymentType.current?.value} with reference no ${refrancerRef.current?.value}.`,
          query_status: "SENT",
          status: "NONE",
        };

        const data = await ApiCall({
          query: `
                    mutation createQuery($createQueryInput:CreateQueryInput!){
                        createQuery(createQueryInput:$createQueryInput){
                          id,
                        }
                      }
                    `,
          veriables: {
            createQueryInput: req,
          },
        });

        if (data.status) {
          toast.success("Submitted successfully.", { theme: "light" });
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          return toast.error(data.message, { theme: "light" });
        }
      }
    }
  };

  return (
    <>
      {/* payment box start here */}
      <div
        className={`fixed top-0 left-0 bg-black bg-opacity-20 min-h-screen w-full  z-50 ${
          paymentbox ? "grid place-items-center" : "hidden"
        }`}
      >
        <div className="bg-white p-4 rounded-md w-96">
          <h3 className="text-2xl text-center font-semibold">
            Payment Request
          </h3>
          <div className="w-full h-[2px] bg-gray-800 my-4"></div>
          <div className="flex gap-3 my-2 justify-between">
            <p className="flex-1"></p>
            <p className="flex-1">Page Qty.</p>
            <p className="flex-1">Amount</p>
            <p className="flex-1">Total</p>
          </div>
          <div className="flex gap-3 my-2 justify-between">
            <p className="shrink-0 flex-1">A4</p>
            <input
              value={payamt.type1}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const newValue = parseInt(e.target.value) || 0;
                handleInputChange("type1", newValue);
              }}
              type="text"
              className="flex-1 w-20 bg-[#eeeeee] fill-none focus:outline-none outline-none arounded-md py-1 px-2"
            />
            <input
              value={payamt.amount1}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const newValue = parseInt(e.target.value) || 0;
                handleInputChange("amount1", newValue);
              }}
              type="text"
              className="flex-1 w-20 bg-[#eeeeee] fill-none focus:outline-none outline-none rounded-md py-1 px-2"
            />
            <p className="flex-1 shrink-0">{payamt.type1 * payamt.amount1}</p>
          </div>
          <div className="flex gap-3 my-2 justify-between">
            <p className="shrink-0 flex-1">A3</p>
            <input
              value={payamt.type2}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const newValue = parseInt(e.target.value) || 0;
                handleInputChange("type2", newValue);
              }}
              type="text"
              className="flex-1 w-20 bg-[#eeeeee] fill-none focus:outline-none outline-none rounded-md py-1 px-2"
            />
            <input
              value={payamt.amount2}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const newValue = parseInt(e.target.value) || 0;
                handleInputChange("amount2", newValue);
              }}
              type="text"
              className="flex-1 w-20 bg-[#eeeeee] fill-none focus:outline-none outline-none rounded-md py-1 px-2"
            />
            <p className="flex-1 shrink-0">{payamt.type2 * payamt.amount2}</p>
          </div>
          <div className="flex gap-3 my-2 justify-between">
            <p className="shrink-0 flex-1">Maps</p>
            <input
              value={payamt.type3}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const newValue = parseInt(e.target.value) || 0;
                handleInputChange("type3", newValue);
              }}
              type="text"
              className="flex-1 w-20 bg-[#eeeeee] fill-none focus:outline-none outline-none rounded-md py-1 px-2"
            />
            <input
              value={payamt.amount3}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const newValue = parseInt(e.target.value) || 0;
                handleInputChange("amount3", newValue);
              }}
              type="text"
              className="flex-1 w-20 bg-[#eeeeee] fill-none focus:outline-none outline-none rounded-md py-1 px-2"
            />
            <p className="flex-1 shrink-0">{payamt.type3 * payamt.amount3}</p>
          </div>
          <div className="w-full h-[1px] bg-gray-800 my-2"></div>
          <div className="flex gap-3 my-2 justify-between">
            <p className="shrink-0 flex-1">Total</p>
            <p className="shrink-0 flex-1">
              {payamt.type1 + payamt.type2 + payamt.type3}
            </p>
            <p className="shrink-0 flex-1">
              {payamt.amount1 + payamt.amount2 + payamt.amount3}
            </p>
            <p className="shrink-0 flex-1">
              {payamt.type1 * payamt.amount1 +
                payamt.type2 * payamt.amount2 +
                payamt.type3 * payamt.amount3}
            </p>
          </div>

          <div className="w-full h-[1px] bg-gray-800 my-2"></div>
          <div className="flex gap-3 my-2 justify-between">
            <p className="flex-2">Time Limit [Day]</p>
            <div className="flex-1"></div>
            <input
              ref={timelimit}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                e.target.value = e.target.value.replace(/\D/g, "");
              }}
              type="text"
              className="flex-1 w-20 bg-[#eeeeee] fill-none focus:outline-none outline-none rounded-md py-1 px-2"
            />
          </div>
          <div className="flex flex-wrap gap-6 mt-4">
            <button
              onClick={requestpayment}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium grow"
            >
              Request
            </button>
            <button
              onClick={() => setPaymentBox((val) => false)}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium grow"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      {/* payment box end here */}
      {/* reject box start here */}
      <div
        className={`fixed top-0 left-0 bg-black bg-opacity-20 min-h-screen w-full  z-50 ${
          rejectbox ? "grid place-items-center" : "hidden"
        }`}
      >
        <div className="bg-white p-4 rounded-md w-80">
          <h3 className="text-2xl text-center font-semibold">
            Are you sure you want to Reject?
          </h3>
          <div className="w-full h-[2px] bg-gray-800 my-4"></div>
          <div className="flex flex-wrap gap-6 mt-4">
            <button
              onClick={() => reject(rejectid)}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium grow"
            >
              Rejact
            </button>
            <button
              onClick={() => setRejectBox((val) => false)}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium grow"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      {/* reject box end here */}
      {/* query box start here */}
      <div
        className={`fixed top-0 left-0 bg-black bg-opacity-20 min-h-screen w-full  z-50 ${
          querybox ? "grid place-items-center" : "hidden"
        }`}
      >
        <div className="bg-white p-4 rounded-md w-80">
          <h3 className="text-2xl text-center font-semibold">Raise query</h3>

          <textarea
            ref={queryRef}
            placeholder="Information Needed"
            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none my-4"
          ></textarea>

          <div className="flex-none flex flex-col gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={attachmentRef}
                accept="*/*"
                onChange={(e) => handleLogoChange(e, setAttachment)}
              />
            </div>
            <button
              onClick={() => attachmentRef.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-[#0984e3] text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {attachment == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {attachment != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(attachment)}
                className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-yellow-500 text-center rounded-md font-medium"
                rel="noreferrer"
              >
                <Fa6SolidFileLines></Fa6SolidFileLines>
                <p>View Doc.</p>
              </a>
            ) : null}
          </div>
          <div className="w-full h-[2px] bg-gray-800 my-4"></div>
          <div className="flex flex-wrap gap-6 mt-4">
            <button
              onClick={submitQuery}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium grow"
            >
              Proceed
            </button>
            <button
              onClick={() => setQueryBox((val) => false)}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium grow"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      {/* query box end here */}
      {/* reply query box start here */}
      <div
        className={`fixed top-0 left-0 bg-black bg-opacity-20 min-h-screen w-full  z-50 ${
          replyquerybox ? "grid place-items-center" : "hidden"
        }`}
      >
        <div className="bg-white p-4 rounded-md w-80">
          <h3 className="text-2xl text-center font-semibold">Reply to query</h3>

          <textarea
            ref={replyQueryRef}
            placeholder="Information Needed"
            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none my-4"
          ></textarea>

          <div className="flex-none flex flex-col gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={attachmentRef}
                accept="*/*"
                onChange={(e) => handleLogoChange(e, setAttachment)}
              />
            </div>
            <button
              onClick={() => attachmentRef.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-[#0984e3] text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {attachment == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {attachment != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(attachment)}
                className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-yellow-500 text-center rounded-md font-medium"
                rel="noreferrer"
              >
                <Fa6SolidFileLines></Fa6SolidFileLines>
                <p>View Doc.</p>
              </a>
            ) : null}
          </div>
          <div className="w-full h-[2px] bg-gray-800 my-4"></div>
          <div className="flex flex-wrap gap-6 mt-4">
            <button
              onClick={submitReplyQuery}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium grow"
            >
              Proceed
            </button>
            <button
              onClick={() => setReplyQueryBox((val) => false)}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium grow"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      {/*reply query box end here */}
      {/* forward box start here */}
      <div
        className={`fixed top-0 left-0 bg-black bg-opacity-20 min-h-screen w-full  z-50 ${
          forwardbox ? "grid place-items-center" : "hidden"
        }`}
      >
        <div className="bg-white p-4 rounded-md w-80">
          <h3 className="text-2xl text-center font-semibold">
            {nextdata.title}
          </h3>
          <textarea
            ref={forwardRef}
            placeholder="Information Needed"
            className=" w-full border-2 border-gray-600 bg-transparent outline-none fill-none text-slate-800 p-2 h-28 resize-none my-4"
          ></textarea>
          <div className="flex-none flex flex-col gap-4 lg:flex-1 w-full lg:w-auto">
            <div className="hidden">
              <input
                type="file"
                ref={attachmentRef}
                accept="*/*"
                onChange={(e) => handleLogoChange(e, setAttachment)}
              />
            </div>
            <button
              onClick={() => attachmentRef.current?.click()}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-[#0984e3] text-center rounded-md font-medium"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink>{" "}
                {attachment == null ? "Attach Doc." : "Update Doc."}
              </div>
            </button>
            {attachment != null ? (
              <a
                target="_blank"
                href={URL.createObjectURL(attachment)}
                className="py-1 w-full sm:w-auto flex items-center gap-2  text-white text-lg px-4 bg-yellow-500 text-center rounded-md font-medium"
                rel="noreferrer"
              >
                <Fa6SolidFileLines></Fa6SolidFileLines>
                <p>View Doc.</p>
              </a>
            ) : null}
          </div>
          <div className="w-full h-[2px] bg-gray-800 my-4"></div>
          <div className="flex flex-wrap gap-6 mt-4">
            <button
              onClick={() => forwardQuery(nextdata)}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium grow"
            >
              Proceed
            </button>
            <button
              onClick={() => setForwardBox((val) => false)}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium grow"
            >
              Close
            </button>
          </div>
        </div>
      </div>
      {/* forward box end here */}
      <div className="bg-white rounded-md shadow-lg p-4 my-4 w-full">
        <h1 className="text-gray-800 text-3xl font-semibold text-center">
          Death Certificate Re-Issue Application
        </h1>
        <div className="w-full flex gap-4 my-4">
          <div className="grow bg-gray-700 h-[2px]"></div>
          <div className="w-10 bg-gray-500 h-[3px]"></div>
          <div className="grow bg-gray-700 h-[2px]"></div>
        </div>
        <p className="text-center font-semibold text-xl text-gray-800">
          {" "}
          Format of Application for obtaining old Death certificate.{" "}
        </p>

        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            {" "}
            1. Village Details{" "}
          </p>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">1.1</span> Applicant village
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {villagedata.name}
          </div>
        </div>

        {/*--------------------- section 1 start here ------------------------- */}
        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            {" "}
            2. Applicant Details(s){" "}
          </p>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.1</span> Applicant Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.name}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.2</span> Applicant address
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.address}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.3</span> Applicant Contact Number
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.mobile}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.4</span> Applicant Email
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.email}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.5</span> Applicant UID
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            XXXX-XXXX-{from_data.user_uid}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.6</span> Deceased Gender
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.gender}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.7</span> Deceased Date of Birth
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {new Date(from_data.date_of_birth)
              .toJSON()
              .slice(0, 10)
              .split("-")
              .reverse()
              .join("/")}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.8</span> Deceased Date of Death
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {new Date(from_data.date_of_death)
              .toJSON()
              .slice(0, 10)
              .split("-")
              .reverse()
              .join("/")}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.9</span> Place of Death
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.place_of_death}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.10</span> Deceased Father Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.father_name}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.11</span> Deceased Mother Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.mother_name}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.12</span> Deceased Husband/Wife Name
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.husband_name}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.13</span> Registration Number
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {from_data.registration_number}
          </div>
        </div>
        <div className="flex  flex-wrap gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700 ">
            <span className="mr-2">2.14</span> Date of Registration
          </div>
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal">
            {new Date(from_data.date_of_registration)
              .toJSON()
              .slice(0, 10)
              .split("-")
              .reverse()
              .join("/")}
          </div>
        </div>

        {/*--------------------- section 1 end here ------------------------- */}

        {/*--------------------- section 3 start here ------------------------- */}

        <>
          <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
            <p className="text-left font-semibold text-xl text-white">
              {" "}
              3. Document Attachment{" "}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
            <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
              <span className="mr-2">3.1</span> Deceased UIDAI Aadhaar Upload
              <p className="text-rose-500 text-sm">
                ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
              </p>
            </div>
            <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
              <a
                target="_blank"
                href={from_data.applicant_uid_url}
                className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                rel="noreferrer"
              >
                <div className="flex items-center gap-2">
                  <Fa6SolidLink></Fa6SolidLink> View Doc.
                </div>
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
            <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
              <span className="mr-2">3.2</span> Deceased Father UIDAI Upload
              <p className="text-rose-500 text-sm">
                ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
              </p>
            </div>
            <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
              <a
                target="_blank"
                href={from_data.father_uid_url}
                className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                rel="noreferrer"
              >
                <div className="flex items-center gap-2">
                  <Fa6SolidLink></Fa6SolidLink> View Doc.
                </div>
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
            <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
              <span className="mr-2">3.3</span> Deceased Mother UIDAI Upload
              <p className="text-rose-500 text-sm">
                ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
              </p>
            </div>
            <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
              <a
                target="_blank"
                href={from_data.mother_uid_url}
                className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                rel="noreferrer"
              >
                <div className="flex items-center gap-2">
                  <Fa6SolidLink></Fa6SolidLink> View Doc.
                </div>
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
            <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
              <span className="mr-2">3.4</span> Undertaking
              <p className="text-rose-500 text-sm">
                ( Maximum Upload Size 2MB & Allowed Format JPG / PDF / PNG )
              </p>
            </div>
            <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
              <a
                target="_blank"
                href={from_data.undertaking_url}
                className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                rel="noreferrer"
              >
                <div className="flex items-center gap-2">
                  <Fa6SolidLink></Fa6SolidLink> View Doc.
                </div>
              </a>
            </div>
          </div>
        </>
        {/*--------------------- section 3 end here ------------------------- */}

        {/*--------------------- section 4 start here ------------------------- */}

        <div className="w-full bg-[#0984e3] py-2 rounded-md px-4 mt-4">
          <p className="text-left font-semibold text-xl text-white">
            4. Applicant / Occupant Declaration and Signature{" "}
          </p>
        </div>

        <div className="flex gap-4 gap-y-2 px-4 py-2 my-2">
          <div className="text-xl font-normal text-left text-gray-700 ">
            4.1
          </div>
          <div className="flex items-start">
            <p className="text-xl font-normal text-left text-gray-700 pr-2">
              {from_data.iagree}
            </p>
            <label
              htmlFor="checkbox"
              className="text-xl font-normal text-left text-gray-700 "
            >
              I solemnly affirm & hereby give undertaking that the above
              information furnished by me are correct and true to the best of my
              knowledge and belief
            </label>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 gap-y-2 items-center px-4 py-2 my-2">
          <div className="flex-none lg:flex-1 w-full lg:w-auto text-xl font-normal text-left text-gray-700">
            <span className="mr-2">4.2</span> Applicant Signature Image
            <p className="text-rose-500 text-sm">
              ( Maximum Upload Size 4MB & Allowed Format JPG / PDF / PNG )
            </p>
          </div>
          <div className="flex-none flex gap-4 lg:flex-1 w-full lg:w-auto">
            <a
              target="_blank"
              href={from_data.signature_url}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
              rel="noreferrer"
            >
              <div className="flex items-center gap-2">
                <Fa6SolidLink></Fa6SolidLink> View Doc.
              </div>
            </a>
          </div>
        </div>
        {/*--------------------- section 4 end here ------------------------- */}
        {isSubmited ? (
          user.id == from_data.userId ? (
            <>
              {common.form_status == 75 ? (
                <a
                  target="_blank"
                  href={from_data.payment_doc}
                  className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-[#0984e3] text-center rounded-md font-medium"
                  rel="noreferrer"
                >
                  Download Document
                </a>
              ) : null}
              {common.query_status == "QUERYRAISED" ? (
                <button
                  onClick={() => setReplyQueryBox((val) => true)}
                  className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium"
                >
                  Reply to Query
                </button>
              ) : null}
            </>
          ) : (
            <>
              <div className="flex flex-wrap gap-6 mt-4">
                <Link
                  to={"/home/"}
                  className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium"
                >
                  Close
                </Link>
                {common.query_status == "REJECTED" ? null : (
                  <>
                    {user.id == common.auth_user_id ? (
                      <button
                        onClick={() => setQueryBox((val) => true)}
                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
                      >
                        Query
                      </button>
                    ) : null}
                    {user.id == common.auth_user_id ? (
                      <button
                        onClick={() => {
                          setRejectid((val) => common.id);
                          setRejectBox(true);
                        }}
                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium"
                      >
                        Reject
                      </button>
                    ) : null}
                    {/* atp button */}
                    {common.form_status == 1 && 53 ? (
                      <button
                        onClick={() => {
                          setForwardBox((val) => true);
                          setNextData((val) => ({
                            title: "Upload Document & Forward to Headclerk",
                            formstatus: 25,
                            querytype: "INTRA",
                            authuserid: "52",
                            foacaluserid: "51",
                            intrauserid: "51,53",
                            interuserid: "0",
                            touserid: 52,
                            querystatus: "PAYMENT",
                            status: "ACTIVE",
                          }));
                        }}
                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                      >
                        Forward to Headclerk
                      </button>
                    ) : null}

                    {/* jtp button */}
                    {common.form_status == 25 && user.id == 52 ? (
                      <button
                        onClick={() => {
                          setForwardBox((val) => true);
                          setNextData((val) => ({
                            title: "Forward to Suptd",
                            formstatus: 50,
                            querytype: "INTRA",
                            authuserid: "51",
                            foacaluserid: "51",
                            intrauserid: "51,52",
                            interuserid: "0",
                            touserid: 51,
                            querystatus: "INPROCESS",
                            status: "NONE",
                          }));
                        }}
                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                      >
                        Forward to Suptd
                      </button>
                    ) : null}
                    {common.form_status == 50 && user.id == 51 ? (
                      <button
                        onClick={() => {
                          forwardRef!.current!.value = `The Death Certificate documents requested as per application number ${from_data.id} pertaining to your request is as attached below.`;
                          setForwardBox((val) => true);
                          setNextData((val) => ({
                            title: "Convey to Applicant",
                            formstatus: 75,
                            querytype: "PUBLIC",
                            authuserid: "0",
                            foacaluserid: "51",
                            intrauserid: "0",
                            interuserid: "0",
                            touserid: from_data.userId,
                            querystatus: "APPROVED",
                            status: "NONE",
                          }));
                        }}
                        className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-cyan-500 text-center rounded-md font-medium"
                      >
                        Convey to Applicant
                      </button>
                    ) : null}
                  </>
                )}
              </div>
            </>
          )
        ) : user.id == from_data.userId ? (
          <>
            <div className="flex flex-wrap gap-6 mt-4">
              <Link
                to={"/home/"}
                className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-rose-500 text-center rounded-md font-medium"
              >
                Discard & Close
              </Link>
              <button
                onClick={submit}
                className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium"
              >
                Proceed
              </button>
            </div>
          </>
        ) : null}
      </div>

      {user.id == from_data.userId &&
      loader.payment &&
      loader.paymentinfo.paymentstatus == "PENDING" ? (
        <div className="p-6 bg-white rounded-lg shadow-lg my-8 grid place-items-center">
          <div className="bg-white p-4 rounded-md w-96">
            <h3 className="text-2xl text-center font-semibold">
              Payment Request
            </h3>
            <div className="w-full h-[2px] bg-gray-800 my-4"></div>
            <div className="flex gap-3 my-2 justify-between">
              <p className="flex-1"></p>
              <p className="flex-1 text-center">Page Qty.</p>
              <p className="flex-1 text-center">Amount</p>
              <p className="flex-1 text-center">Total</p>
            </div>
            <div className="flex gap-3 my-2 justify-between">
              <p className="shrink-0 flex-1">A4</p>
              <p className="shrink-0 flex-1 text-center">
                {loader.paymentinfo.type1 ?? 0}
              </p>
              <p className="shrink-0 flex-1 text-center">
                {loader.paymentinfo.amount1 ?? 0}
              </p>
              <p className="flex-1 shrink-0 text-center">
                {loader.paymentinfo.type1 ??
                  0 * loader.paymentinfo.amount1 ??
                  0}
              </p>
            </div>
            <div className="flex gap-3 my-2 justify-between">
              <p className="shrink-0 flex-1">A3</p>
              <p className="shrink-0 flex-1 text-center">
                {loader.paymentinfo.type2 ?? 0}
              </p>
              <p className="shrink-0 flex-1 text-center">
                {loader.paymentinfo.amount2 ?? 0}
              </p>
              <p className="flex-1 shrink-0 text-center">
                {loader.paymentinfo.type2 ??
                  0 * loader.paymentinfo.amount2 ??
                  0}
              </p>
            </div>
            <div className="flex gap-3 my-2 justify-between">
              <p className="shrink-0 flex-1">Maps</p>
              <p className="shrink-0 flex-1 text-center">
                {loader.paymentinfo.type3 ?? 0}
              </p>
              <p className="shrink-0 flex-1 text-center">
                {loader.paymentinfo.amount3 ?? 0}
              </p>
              <p className="flex-1 shrink-0 text-center">
                {loader.paymentinfo.type3 ??
                  0 * loader.paymentinfo.amount3 ??
                  0}
              </p>
            </div>
            <div className="w-full h-[1px] bg-gray-800 my-2"></div>
            <div className="flex gap-3 my-2 justify-between">
              <p className="shrink-0 flex-1">Total</p>
              <p className="shrink-0 flex-1 text-center">
                {loader.paymentinfo.type1 ??
                  0 + loader.paymentinfo.type2 ??
                  0 + loader.paymentinfo.type3 ??
                  0}
              </p>
              <p className="shrink-0 flex-1 text-center">
                {loader.paymentinfo.amount1 ??
                  0 + loader.paymentinfo.amount2 ??
                  0 + loader.paymentinfo.amount3 ??
                  0}
              </p>
              <p className="shrink-0 flex-1 text-center">
                {(loader.paymentinfo.type1 ??
                  0 * loader.paymentinfo.amount1 ??
                  0) +
                  (loader.paymentinfo.type2 ??
                    0 * loader.paymentinfo.amount1 ??
                    0) +
                  (loader.paymentinfo.type3 * loader.paymentinfo.amount3 ?? 0)}
              </p>
            </div>

            <div className="w-full h-[1px] bg-gray-800 my-2"></div>
            <div className="flex gap-3 my-2 justify-between">
              <p className="flex-2">Time Limit [Day]</p>
              <div className="flex-1"></div>
              <p className="flex-1">{loader.paymentinfo.paymentamout} </p>
            </div>
            <div className="flex gap-3 my-2 justify-between items-center">
              <p className="flex-2 shrink-0">Panyment Type</p>
              <select
                ref={paymentType}
                defaultValue={"0"}
                className="flex-2 px-4 bg-primary-700 fill-none outline-none border-2 border-black text-black py-2 w-96"
              >
                <option value="0" className=" text-black text-lg " disabled>
                  Select Payment Type
                </option>
                <option className=" text-black text-lg" value="CASH">
                  CASH
                </option>
                <option className=" text-black text-lg" value="CHEQUE">
                  CHEQUE
                </option>
                <option className=" text-black text-lg" value="NETBANKING">
                  NETBANKING
                </option>
                <option className=" text-black text-lg" value="UPI">
                  UPI
                </option>
                <option className=" text-black text-lg" value="CCDC">
                  CREDIT/DEBIT CARD
                </option>
              </select>
            </div>
            <div className="flex gap-3 my-2 justify-between items-center">
              <p className="flex-2 shrink-0">Panyment Reference</p>
              <input
                ref={refrancerRef}
                type="text"
                className="flex-2 bg-[#eeeeee] fill-none focus:outline-none outline-none arounded-md py-1 px-2"
              />
            </div>
            <button
              onClick={submitpayment}
              className="py-1 w-full sm:w-auto text-white text-lg px-4 bg-green-500 text-center rounded-md font-medium grow"
            >
              Pay
            </button>
          </div>
        </div>
      ) : null}
      <div className="p-6 bg-white rounded-lg shadow-lg my-8">
        <h1 className="text-gray-800 text-3xl font-semibold text-center">
          {user.id == from_data.userId ? "Department Comment" : "Notings"}
        </h1>
        <div className="w-full flex gap-4 my-4">
          <div className="grow bg-gray-700 h-[2px]"></div>
          <div className="w-10 bg-gray-500 h-[3px]"></div>
          <div className="grow bg-gray-700 h-[2px]"></div>
        </div>
        {notings.length == 0 ? (
          <h3 className="text-2xl font-semibold text-center bg-rose-500 bg-opacity-25 rounded-md border-l-4 border-rose-500 py-2  text-rose-500">
            No queries pending.
          </h3>
        ) : (
          <>
            {notings.map((val: any, index: number) => {
              return (
                <div key={index}>
                  <QueryTabs
                    isUser={val.from_user_id == user.id}
                    message={val.remark}
                    date={val.createdAt}
                    doc={val.doc_url}
                    from_user={
                      val.from_user.role == "USER" ? "User" : val.from_user.name
                    }
                    to_user={
                      val.to_user.role == "USER" ? "User" : val.to_user.name
                    }
                  />
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

export default DeathCertificateView;

// interface QueryTabsProps {
//   isUser: boolean;
//   message: string;
//   date: string;
//   from_user: string;
//   to_user: string;
//   doc: null | undefined | string;
// }
