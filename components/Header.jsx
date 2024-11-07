import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  return (
    <div>
      <div className="w-full p-2 md:px-10 lg:px-16 bg-[#4F3267] text-white min-h-8 flex items-center justify-center text-xs text-center">
        <div className="announcement-slide">
          Flo with Florencia - Fashionable Jewellery for the Fashionable You
        </div>
      </div>
      <header className="shadow-lg border-b">
        <div className="p-2 md:px-10 lg:px-16">
          <div className="flex justify-between items-center gap-6">
            <div className="w-[160px]">
                <Link
                href="/">
              <Image
                src="/logo.svg"
                className="h-14"
                alt="Logo"
                width={180}
                height={56}
              />
                </Link>
            </div>
            <div className="max-lg:hidden flex gap-6 justify-center items-center flex-grow">
              <Link
                href="/"
                className="hover:text-indigo-600 h-full border-b-2 border-transparent hover:border-indigo-600 hover:border-b-2"
              >
                HOME
              </Link>
              <Link
                href="/products"
                className="hover:text-indigo-600 h-full border-b-2 border-transparent hover:border-indigo-600 hover:border-b-2"
              >
                PENDANT
              </Link>
              <Link
                href="/products"
                className="hover:text-indigo-600 h-full border-b-2 border-transparent hover:border-indigo-600 hover:border-b-2"
              >
                RINGS
              </Link>
              <Link
                href="/products"
                className="hover:text-indigo-600 h-full border-b-2 border-transparent hover:border-indigo-600 hover:border-b-2"
              >
                BALI
              </Link>
              <Link
                href="/products"
                className="hover:text-indigo-600 h-full border-b-2 border-transparent hover:border-indigo-600 hover:border-b-2"
              >
                FULL SET
              </Link>
            </div>
            



            <div className="flex gap-4 justify-end items-center lg:w-[160px]">
              <div>
                <Link href="/cart">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                </Link>
              </div>

              <div className="flex lg:hidden">
                <Sheet>
                  <SheetTrigger>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
</svg>

                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>MENU</SheetTitle>
                      <SheetDescription>
                       
                      <span className="flex flex-col gap-6 items-start flex-grow mt-5">
              <Link
                href="/"
                className="hover:text-indigo-600 h-full border-b-2 border-transparent hover:border-indigo-600 hover:border-b-2"
              >
                HOME
              </Link>
              <Link
                href="/products"
                className="hover:text-indigo-600 h-full border-b-2 border-transparent hover:border-indigo-600 hover:border-b-2"
              >
                PENDANT
              </Link>
              <Link
                href="/products"
                className="hover:text-indigo-600 h-full border-b-2 border-transparent hover:border-indigo-600 hover:border-b-2"
              >
                RINGS
              </Link>
              <Link
                href="/products"
                className="hover:text-indigo-600 h-full border-b-2 border-transparent hover:border-indigo-600 hover:border-b-2"
              >
                BALI
              </Link>
              <Link
                href="/products"
                className="hover:text-indigo-600 h-full border-b-2 border-transparent hover:border-indigo-600 hover:border-b-2"
              >
                FULL SET
              </Link>
            </span>

                      </SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
