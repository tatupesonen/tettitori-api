import axios from "axios";
import { Request, Response } from "express";
import { URLSearchParams } from "url";
import Role, { IRole } from "../schema/Role";
import User, { IUser } from "../schema/User";
import logger from "../util/logger";
import emailClient from "@sendgrid/mail";
emailClient.setApiKey(process.env.SENDGRID_APIKEY || "");

const RegisterUser = async (req: Request, res: Response) => {
  const data = req.body;
  if (!data.username && !data.recaptcha && !data.email)
    return res
      .status(400)
      .json({ message: "Missing fields in registration data" });

  const workplaceRole = (await Role.findOne({
    name: "workplace",
  }).lean()) as IRole;

  //Check that the user validated their recaptcha
  const params = new URLSearchParams();
  params.append("secret", process.env.RECAPTCHA_SECRET || "");
  params.append("response", data.recaptcha);
  const recaptchaCheck = await axios.post(
    "https://www.google.com/recaptcha/api/siteverify",
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  if (recaptchaCheck?.data?.success) {
    const password = Math.random().toString(36).slice(-11);
    //check that the given username doesn't already exist
    const exists = await User.exists({ username: data.username });
    if (exists)
      return res
        .status(409)
        .json({ message: "User with this username already exists" });
    const userdata = {
      password: password,
      username: data.username,
      email: data.email,
      role: workplaceRole._id,
    } as IUser;

    const user = new User(userdata);
    let userInDb = await user.save();

    if (userInDb) {
      logger.info("User created:" + userdata.username);
      const email = await emailClient.send({
        from: "admin@tettila.fi",
        to: `${userdata.email}`,
        subject: "Tunnuksesi Tettilään",
        templateId: process.env.SENDGRID_TEMPLATEID || "",
        dynamicTemplateData: {
          username: userdata.username,
          password: userdata.password,
        },
      });
      console.log(email);
      return res.status(201).json({ message: "User created" });
    }
  }
  return res.status(401).json({ message: "Recaptcha verification failed" });
};

export default { RegisterUser };
