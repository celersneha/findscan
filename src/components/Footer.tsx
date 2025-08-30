"use client";
import { Separator } from "@/components/ui/separator";
import { Github, Linkedin, Mail, MapPin, Code2 } from "lucide-react";
import { BsTwitterX } from "react-icons/bs";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "LinkedIn",
      href: "https://linkedin.com/in/celersneha",
      icon: Linkedin,
      color: "hover:text-blue-400",
    },
    {
      name: "GitHub",
      href: "https://github.com/celersneha",
      icon: Github,
      color: "hover:text-blue-400",
    },
    {
      name: "Twitter",
      href: "https://x.com/celersneha",
      icon: BsTwitterX,
      color: "hover:text-blue-400",
    },
    {
      name: "Email",
      href: "mailto:celersneha@gmail.com",
      icon: Mail,
      color: "hover:text-blue-400",
    },
  ];

  return (
    <footer className=" border-t border-border">
      <div className="container mx-auto px-4 py-10 ">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8">
          {/* Brand section */}
          <div className="flex flex-col gap-4 md:gap-6 items-start">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-lg md:text-xl font-bold">Sneha Sharma</h3>
                <p className="text-muted-foreground text-xs md:text-sm">
                  Full Stack Developer
                </p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-full md:max-w-md text-sm md:text-base">
              Passionate about creating innovative web solutions that combine
              beautiful design with powerful functionality. Let's build
              something amazing together.
            </p>
            <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground">
              <MapPin className="w-3 h-3 md:w-4 md:h-4" />
              <span>Available for remote opportunities worldwide</span>
            </div>
          </div>
          {/* Social */}
          <div className="flex flex-col items-start md:items-end gap-4">
            <h4 className="font-semibold text-base md:text-lg">
              Let's Connect
            </h4>
            <div className="flex flex-wrap gap-2 md:gap-3">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 p-2 md:p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group ${social.color}`}
                  >
                    <IconComponent className="w-3 h-3 md:w-4 md:h-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
        <Separator className="my-6 " />
        <div className="flex justify-center items-center text-xs md:text-sm text-muted-foreground text-center">
          <a
            href="https://github.com/celersneha"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            © {currentYear} FindScan. All rights reserved.
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
