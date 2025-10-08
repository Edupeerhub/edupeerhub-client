import { useState } from "react";
import Spinner from "../../components/common/Spinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { useAdmins, useCreateAdmin } from "../../hooks/admin";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../../lib/api/user/userApi";

export default function AdminSettingsPage() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  const { data: admins, isLoading, isError, error } = useAdmins();

  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const createAdminMutation = useCreateAdmin({
    onSuccess: () => {
      setFormState({ firstName: "", lastName: "", email: "", password: "" });
    },
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createAdminMutation.mutate(formState);
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Spinner />
      </div>
    );
  }

  // Restrict access to only superadmins
  if (!user?.admin?.isSuperAdmin) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Access Restricted
          </h2>
          <p className="text-gray-500 mt-1">
            You don’t have permission to manage administrators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-10 mx-auto">
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Manage Platform Administrators
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Review current administrators, add new team members, and manage super
          admin access.
        </p>
      </div>

      {/* ================= Admin List ================= */}
      <section className="bg-white border rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Admin Accounts</h2>
          <p className="text-sm text-gray-500 mt-1">
            Overview of administrators with access to the platform.
          </p>
        </div>
        <div className="p-6">
          {isError && <ErrorAlert error={error} />}
          {isLoading ? (
            <Spinner />
          ) : !admins || admins.length === 0 ? (
            <p className="text-sm text-gray-500">No admins found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin, index) => {
                    const user = admin.user || {};
                    const name =
                      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                      "—";
                    return (
                      <tr
                        key={user.id ?? index}
                        className={index < admins.length - 1 ? "border-b" : ""}
                      >
                        <td className="p-4 text-gray-700 flex items-center gap-2">
                          <img
                            src={
                              user.profileImageUrl ||
                              `https://ui-avatars.com/api/?name=${name}&background=4ca1f0&color=fff`
                            }
                            alt={name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          {name}
                        </td>
                        <td className="p-4 text-gray-600">
                          {user.email ?? "—"}
                        </td>
                        <td className="p-4 text-gray-600 capitalize">
                          {user.role ?? "—"}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              user.accountStatus === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {user.accountStatus ?? "—"}
                          </span>
                        </td>
                        <td className="p-4">
                          {admin.isSuperAdmin ? (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              Super Admin
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                              Admin
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* ================= Add New Admin ================= */}
      <section className="bg-white border rounded-xl shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Add New Admin</h2>
          <p className="text-sm text-gray-500 mt-1">
            Invite a new administrator to manage the platform.
          </p>
        </div>

        <form className="p-6 space-y-4" onSubmit={handleSubmit}>
          {createAdminMutation.error && (
            <ErrorAlert error={createAdminMutation.error} />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                name="firstName"
                value={formState.firstName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Ada"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                name="lastName"
                value={formState.lastName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="Okeke"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Temporary Password
              </label>
              <input
                type="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none "
                placeholder="Enter a secure password"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={createAdminMutation.isPending}
              className="px-6 py-3 rounded-md bg-blue-600 text-white font-medium hover:brightness-95 disabled:opacity-60"
            >
              {createAdminMutation.isPending ? "Creating..." : "Create Admin"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
