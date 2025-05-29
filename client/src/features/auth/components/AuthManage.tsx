import { ReactNode } from "react";
import { motion } from "motion/react";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";

import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ResetPasswordForm from "./ResetPasswordForm";
import VerifyOtpForm from "./VerifyOtpForm";

import { ThemeSwitcher } from "@/components/ThemeSwitcher";

export default function AuthManage({
  currentForm,
}: {
  currentForm:
    | "sign-in"
    | "sign-up"
    | "forgot-password"
    | "reset-password"
    | "verify-otp";
}) {
  const formMap: Record<string, ReactNode> = {
    "sign-in": <SignInForm />,
    "sign-up": <SignUpForm />,
    "forgot-password": <ForgotPasswordForm />,
    "reset-password": <ResetPasswordForm />,
    "verify-otp": <VerifyOtpForm />,
  };

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 relative">
        <ThemeSwitcher className="absolute top-2 right-4" />
        <motion.div
          animate={{ opacity: 1 }}
          className="bg-cover flex  items-center justify-center bg-muted p-6 md:p-10 h-full"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-transparent max-w-sm w-full" shadow="none">
            <CardBody className="p-0">
              <div className="p-5 w-full">{formMap[currentForm]}</div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      <div className="flex-1 hidden lg:block">
        <Image
          alt="Image"
          className="h-screen object-cover"
          src="/davidcohen-R4VXMRFVcE4-unsplash.jpg"
        />
      </div>
    </div>
  );
}
