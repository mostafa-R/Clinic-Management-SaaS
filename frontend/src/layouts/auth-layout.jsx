import Link from "next/link";

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-3xl">🏥</div>
              <span className="text-xl font-bold text-gray-900">
                Clinic Management
              </span>
            </Link>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
            )}
          </div>

          {/* Form Content */}
          {children}
        </div>
      </div>

      {/* Right side - Image/Illustration */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800">
          <div className="flex h-full items-center justify-center p-12">
            <div className="text-center text-white">
              <div className="mb-6 text-6xl">🏥</div>
              <h3 className="mb-4 text-3xl font-bold">
                Streamline Your Clinic Management
              </h3>
              <p className="text-lg text-primary-100">
                Manage patients, appointments, billing, and more in one place
              </p>
              <div className="mt-12 grid gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">✓</div>
                  <div>
                    <h4 className="font-semibold">Patient Management</h4>
                    <p className="text-sm text-primary-100">
                      Complete digital records and history
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">✓</div>
                  <div>
                    <h4 className="font-semibold">Smart Scheduling</h4>
                    <p className="text-sm text-primary-100">
                      Automated reminders and booking
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">✓</div>
                  <div>
                    <h4 className="font-semibold">Financial Insights</h4>
                    <p className="text-sm text-primary-100">
                      Track revenue and expenses
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
