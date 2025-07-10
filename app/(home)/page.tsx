"use client";

import GradientInsetBackground from "@/components/componentX/gradient-inset-background";
import MovingBackground from "@/components/componentX/moving-background";
import MovingGlow from "@/components/componentX/moving-glow";
import RadialFadePulsatingBackground from "@/components/componentX/radial-fade-pulsating-background";
import Navbar from "@/components/home/navbar";
import { BackgroundShine } from "@/components/ui/background-shine";
import { BorderBeam } from "@/components/ui/border-beam";
import GradientButton from "@/components/ui/gradient-button";
import { LampContainer } from "@/components/ui/lamp";
import { siteConfig } from "@/config/site";
import {
  blurInVariant,
  containerVariant,
  scaleInVariant,
} from "@/lib/variants";
import { ArrowRightIcon } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaGithub, FaTwitterSquare } from "react-icons/fa";

const LandingPage = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const toggleAuthDialog = () => {
    setShowAuthDialog(!showAuthDialog);
  };
  return (
    <>
      <Navbar toggleAuthDialog={toggleAuthDialog} />
      <motion.div
        variants={containerVariant}
        initial="hidden"
        whileInView="visible"
      >
        <div className="px-3 py-20 flex flex-col items-center justify-center text-center">
          <RadialFadePulsatingBackground />
          <motion.a
            href={siteConfig.links.twitter}
            target="_blank"
            variants={scaleInVariant}
            className="rounded group relative text-foreground px-3 py-1"
          >
            <MovingGlow />
            <GradientInsetBackground />
            <div className="absolute inset-0 group-hover:bg-muted/40 transition-all duration-200 z-[-3]" />
            <span
              className="z-10 text-sm 
          flex items-center justify-center gap-2"
            >
              <FaTwitterSquare className="size-3 " /> Follow For Updates
              <ArrowRightIcon className="size-3 transform-all duration-300 group-hover:translate-x-1" />
            </span>
          </motion.a>

          <motion.h1
            variants={blurInVariant}
            className="text-foreground text-center py-6 text-6xl md:text-7xl lg:text-8xl font-medium "
          >
            Open Source <br />
            <span className="text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text">
              LLM Chat
            </span>
          </motion.h1>
          <motion.p
            variants={blurInVariant}
            className="mb-8 text-lg md:text-xl tracking-tight text-muted-foreground "
          >
            Kickstart your project with a Chat AI template powered by
            <br />
            Gemini API
          </motion.p>
          <div className="flex items-center justify-center gap-4">
            <motion.div
              variants={scaleInVariant}
              className="relative border px-3 py-1 rounded flex items-center group cursor-pointer"
              onClick={toggleAuthDialog}
            >
              <MovingBackground />
              Get started
              <ArrowRightIcon
                className="ml-1 size-4 transition-all duration-300 
                group-hover:translate-x-1"
              />
            </motion.div>
            <motion.a
              href={siteConfig.links.githubRepo}
              target="_blank"
              variants={scaleInVariant}
              className="rounded group relative text-foreground px-3 py-1"
            >
              <MovingGlow />
              <GradientInsetBackground />
              <div className="absolute inset-0 group-hover:bg-muted/40 transition-all duration-200 z-[-3]" />
              <span className="z-10 flex items-center justify-center gap-2">
                <FaGithub className="size-3 " /> Github
              </span>
            </motion.a>
          </div>
        </div>
        {/* <div className="relative px-4 sm:px-8 ">
          <div className="relative  overflow-hidden rounded-sm border">
            <MovingGlow
              animationDuration={12}
              borderWidth={4}
              initialTransparent={300}
            />
            <div
              className="relative m-4 rounded-inherit "
              style={{
                maskImage:
                  "linear-gradient(to bottom, black 80%, transparent 100%)",
              }}
            >
              <DashboardPreview previewRepos={previewRepos} />
            </div>
          </div>
          <div
            className="absolute inset-x-0 bottom-0 h-1/4"
            style={{
              background:
                "linear-gradient(180deg,hsla(var(--background)/0),hsl(var(--background)))",
            }}
          />
        </div> */}

        {/* CTA Section */}
        {/* <div className="mt-20 max-w-[100vw] overflow-x-hidden scrollbar-hide">
          <LampContainer>
            <motion.div
              initial={{ opacity: 0.5, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center gap-8  "
            >
              <h1 className="text-foreground text-center py-4 text-5xl font-medium text-balance sm:text-6xl md:text-7xl lg:text-8xl  w-full">
                Start <br />
                <span className="text-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text inline-bloc ">
                  Building <br /> AI Chat Web App
                </span>
              </h1>
              <BackgroundShine>
                <Link
                  href={isAuthenticated ? "/chat" : "/auth/sign-in"}
                  className="flex items-center "
                >
                  Get started
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </Link>
              </BackgroundShine>
            </motion.div>
          </LampContainer>
        </div> */}
      </motion.div>
    </>
  );
};

export default LandingPage;
