import axios from "axios";
import ErrorHandler from "./Errorhandler.js";

export const sendOtpToUser = async (mobile, otp, next) => {
  try {
    if (!mobile) return next(new ErrorHandler("Mobile no. is not valid", 400));
    console.log(mobile, otp);
    const options = {
      method: "POST",
      url: "https://control.msg91.com/api/v5/flow/",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        authkey: process.env.AUTH_KEY,
      },
      data: {
        template_id: process.env.TEMPLATE_ID,
        short_url: "1 (On) or 0 (Off)",
        recipients: [{ mobiles: `91${mobile}`, otp: otp }],
      },
    };

    await axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        console.log(otp);
      })
      .catch(function (error) {
        console.error(error);
      });
  } catch (e) {
    return next(new ErrorHandler(e.message, 500));
  }
};
