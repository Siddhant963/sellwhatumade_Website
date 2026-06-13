import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-[#fbf9f5] flex items-center justify-center py-20 px-6">
        <div className="max-w-lg mx-auto text-center">
          {/* Illustration */}
          <div className="relative mb-8 flex items-center justify-center">
            <div className="w-40 h-40 rounded-full bg-[#f4a460]/10 flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-[#f4a460]/20 flex items-center justify-center">
                <span className="text-5xl">🏺</span>
              </div>
            </div>
            <div className="absolute bottom-4 right-8 text-3xl opacity-60">🖌️</div>
          </div>

          <p className="text-7xl font-bold text-[#f4a460]/40 mb-2">404</p>
          <h1 className="text-2xl font-bold text-[#1b1c1a] mb-3 leading-tight">
            Oops, this page got lost in the craft room
          </h1>
          <p className="text-[#857467] leading-relaxed mb-8">
            Even the most skilled artisans occasionally misplace a tool. The page you&apos;re looking for might have been moved or never existed.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              href="/"
              className="btn-press px-6 py-3 bg-[#8d4f11] text-white font-semibold rounded-2xl hover:bg-[#6e3900] transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/marketplace"
              className="px-6 py-3 border border-[#d8c3b4] text-[#534439] font-semibold rounded-2xl hover:border-[#f4a460] transition-colors"
            >
              Browse Marketplace
            </Link>
          </div>

          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-[#857467]">
            {["Home", "Explore", "About", "Help"].map((item) => (
              <Link key={item} href={item === "Home" ? "/" : `/${item.toLowerCase()}`} className="hover:text-[#8d4f11] transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
