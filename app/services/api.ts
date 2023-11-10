import axios from "axios";
import { BaseUrl, uploadUrl } from "~/const";

interface imageReture {
  status: boolean;
  data: unknown;
  message: string;
  function: string;
}

type ApiRespose = {
  status: boolean;
  data: any;
  message: string;
};

export const ApiCall = async (args: {
  query: string;
  veriables: {
    [key: string]: unknown;
  };
  headers?: {
    [key: string]: string;
  };
}): Promise<ApiRespose> => {
  try {
    const req = await axios.post(
      BaseUrl,
      {
        query: args.query,
        variables: args.veriables,
      },
      { headers: args.headers }
    );
    if (
      req.data.data == null ||
      req.data.data == undefined ||
      req.data.data == ""
    ) {
      if (
        req.data.errors[0].extensions.originalError == undefined ||
        req.data.errors[0].extensions.originalError == null
      )
        return { status: false, data: [], message: req.data.errors[0].message };
      const errorMessage = Array.isArray(
        req.data.errors[0].extensions.originalError.message
      )
        ? req.data.errors[0].extensions.originalError.message[0]
        : req.data.errors[0].extensions.originalError.message;
      return { status: false, data: [], message: errorMessage };
    }

    return { status: true, data: req.data.data, message: "" };
  } catch (e: unknown) {
    if (e instanceof Error) {
      return { status: false, data: [], message: e.toString() };
    } else {
      return { status: false, data: [], message: "Unknown error" };
    }
  }
};

export async function UploadFile(file: File): Promise<imageReture> {
  let formData = new FormData();
  formData.append("file", file);
  const data = await axios({
    method: "post",
    url: `${uploadUrl}uploader/upload`,
    data: formData,
  });
  return data.data;
}
