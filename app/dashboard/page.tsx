import Image from "next/image";

export default function DashboardPage() {
  return (
    <div className="flex flex-col space-y-6 px-4 py-6 md:px-8">
      {/* Logo */}
      <div className="flex justify-center md:justify-start">
        <Image
          src="/logo.png"
          alt="Dashboard"
          width={250}
          height={120}
          className="w-[180px] md:w-[250px] h-auto"
        />
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-md p-4 md:p-8">
        <div className="flex flex-col-reverse items-center gap-8 md:flex-row md:justify-between">

          {/* Text Section */}
          <div className="w-full md:w-1/2">
            <p className="text-ngf-green font-bold text-2xl leading-tight text-center md:text-left sm:text-3xl lg:text-5xl">
              Women <br />
              Economic <br />
              Empowerment <br />
              (WEE)
            </p>
          </div>

          {/* Image Section */}
          <div className="flex justify-center w-full md:w-1/2">
            <Image
              src="/pix.svg"
              alt="Dashboard Illustration"
              width={600}
              height={600}
              className="w-full max-w-[280px] sm:max-w-[400px] md:max-w-[500px] h-auto"
            />
          </div>
        </div>

        {/* Footer Banner */}
        <div className="bg-ngf-green rounded-2xl px-4 py-5 mt-8">
          <p className="text-white text-center text-sm sm:text-base md:text-lg font-medium">
            &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}