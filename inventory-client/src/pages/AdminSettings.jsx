import {
  FaCog,
  FaShieldAlt,
  FaDatabase,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";

function AdminSettings() {
  return (
    <div className="min-h-screen w-full max-w-full min-w-0 bg-white text-slate-900 overflow-x-hidden">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="w-full bg-white border-b border-slate-200">

        <div className="w-full max-w-full min-w-0 px-4 sm:px-6 lg:px-8 xl:px-10 py-6">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 shrink-0 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FaCog />
            </div>

            <div className="min-w-0">

              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                System Settings
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage administrator and system configuration.
              </p>

            </div>

          </div>

        </div>

      </header>

      {/* =================================================
          CONTENT
      ================================================= */}

      <main className="w-full max-w-full min-w-0 px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-8">

        {/* =================================================
            SETTINGS CARDS
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 w-full">

          {/* SECURITY */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm min-w-0">

            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <FaShieldAlt />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Administrator Security
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Administrator access is protected using JWT authentication and role-based authorization.
            </p>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">

              <FaCheckCircle />

              <span>
                System security active
              </span>

            </div>

          </div>

          {/* DATABASE */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm min-w-0">

            <div className="w-11 h-11 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <FaDatabase />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Database
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Inventory, users and transaction data are managed through the application database.
            </p>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">

              <FaCheckCircle />

              <span>
                Database connection active
              </span>

            </div>

          </div>

          {/* ACCESS CONTROL */}

          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm min-w-0">

            <div className="w-11 h-11 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <FaLock />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Access Control
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Administrative operations are restricted to accounts with administrator privileges.
            </p>

            <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">

              <FaCheckCircle />

              <span>
                Role protection active
              </span>

            </div>

          </div>

        </div>

        {/* =================================================
            SYSTEM CONFIGURATION
        ================================================= */}

        <div className="w-full min-w-0 mt-6 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

          <div className="px-5 sm:px-6 py-5 border-b border-slate-200">

            <h2 className="font-bold text-slate-900">
              System Configuration
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current administrator system configuration.
            </p>

          </div>

          <div className="divide-y divide-slate-200">

            {/* AUTHENTICATION */}

            <div className="flex flex-col gap-3 px-5 sm:px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="min-w-0">

                <p className="font-semibold text-slate-900">
                  Authentication
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  JWT-based authentication
                </p>

              </div>

              <span className="w-fit shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                ACTIVE
              </span>

            </div>

            {/* ROLE AUTHORIZATION */}

            <div className="flex flex-col gap-3 px-5 sm:px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="min-w-0">

                <p className="font-semibold text-slate-900">
                  Role Authorization
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Admin middleware protection
                </p>

              </div>

              <span className="w-fit shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                ACTIVE
              </span>

            </div>

            {/* AUDIT TRACKING */}

            <div className="flex flex-col gap-3 px-5 sm:px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="min-w-0">

                <p className="font-semibold text-slate-900">
                  Audit Tracking
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  Administrative activity monitoring
                </p>

              </div>

              <span className="w-fit shrink-0 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-700">
                ACTIVE
              </span>

            </div>

          </div>

        </div>

        {/* =================================================
            SYSTEM STATUS
        ================================================= */}

        <div className="mt-6 w-full bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-6">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div className="flex items-center gap-3 min-w-0">

              <div className="w-10 h-10 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FaCheckCircle />
              </div>

              <div className="min-w-0">

                <h3 className="font-bold text-slate-900">
                  System Status
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  Smart Inventory administration services are active.
                </p>

              </div>

            </div>

            <span className="w-fit shrink-0 inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-bold text-emerald-700">

              <span className="w-2 h-2 rounded-full bg-emerald-500" />

              OPERATIONAL

            </span>

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminSettings;