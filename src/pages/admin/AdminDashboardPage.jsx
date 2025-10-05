import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import Spinner from "../../components/common/Spinner";
import ErrorAlert from "../../components/common/ErrorAlert";
import { usePendingTutors, useUserCounts, useUsers } from "../../hooks/admin";

const PREVIEW_LIMIT = 5;

function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "0";
  }

  return new Intl.NumberFormat().format(value);
}

function formatDate(value) {
  if (!value) return "—";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "—";
    }
    return date.toLocaleDateString();
  } catch (error) {
    return "—";
  }
}

function getUserName(user) {
  if (!user) return "—";
  if (user.fullName) return user.fullName;
  const nameParts = [user.firstName, user.lastName].filter(Boolean);
  if (nameParts.length) return nameParts.join(" ");
  return user.name || "—";
}

function StatCard({ title, value, delta, deltaClass }) {
  return (
    <div className="bg-white rounded-lg p-5 shadow-sm border">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-3 text-2xl font-semibold text-gray-900">{value}</div>
      <div className={`mt-2 text-sm ${deltaClass}`}>{delta}</div>
    </div>
  );
}

function TableHeader({ cols }) {
  return (
    <thead>
      <tr className="bg-blue-50">
        {cols.map((c) => (
          <th key={c} className="px-6 py-4 text-left text-sm text-gray-700">
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

function ViewButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full border bg-white text-blue-600 shadow-sm hover:bg-gray-50"
    >
      View
    </button>
  );
}

export default function AdminDashboardPage() {
  const {
    data: counts,
    isLoading: isLoadingCounts,
    isError: isCountsError,
    error: countsError,
  } = useUserCounts();
  const {
    data: pendingTutors,
    isLoading: isLoadingPendingTutors,
    isError: isPendingTutorsError,
    error: pendingTutorsError,
  } = usePendingTutors();
  const {
    data: studentsData,
    isLoading: isLoadingStudents,
    isError: isStudentsError,
    error: studentsError,
  } = useUsers({ role: "student", limit: PREVIEW_LIMIT });

  const students = studentsData?.users ?? [];

  const pendingCount = counts?.totals?.totalPendingTutors ?? 0;
  const tutorCount = counts?.totals?.totalTutors ?? 0;
  const studentCount = counts?.totals?.totalStudents ?? 0;

  const statCards = useMemo(
    () => [
      {
        title: "Total Tutors",
        value: formatNumber(tutorCount),
        delta: counts?.growth?.tutors ?? null,
        deltaClass:
          typeof counts?.growth?.tutors === "number" &&
          counts?.growth?.tutors < 0
            ? "text-red-500"
            : "text-green-600",
      },
      {
        title: "Total Students",
        value: formatNumber(studentCount),
        delta: counts?.growth?.students ?? null,
        deltaClass:
          typeof counts?.growth?.students === "number" &&
          counts?.growth?.students < 0
            ? "text-red-500"
            : "text-green-600",
      },
      {
        title: "Pending Tutor Application",
        value: formatNumber(pendingCount),
        delta: counts?.growth?.pendingTutors ?? null,
        deltaClass:
          typeof counts?.growth?.pendingTutors === "number" &&
          counts?.growth?.pendingTutors < 0
            ? "text-green-600"
            : "text-red-500",
      },
    ],
    [counts]
  );

  const pendingTutorPreview = useMemo(
    () => (pendingTutors ?? []).slice(0, PREVIEW_LIMIT),
    [pendingTutors]
  );

  const studentPreview = useMemo(
    () => (students ?? []).slice(0, PREVIEW_LIMIT),
    [students]
  );
  return (
    <div className="space-y-8 p-2 sm:p-0">
      {/* --- Stats cards --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isCountsError ? (
          <div className="sm:col-span-3">
            <ErrorAlert error={countsError} />
          </div>
        ) : null}

        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl p-5 shadow-sm border min-h-[120px] flex flex-col justify-between"
          >
            <div className="text-sm text-gray-500">{card.title}</div>
            {isLoadingCounts ? (
              <div className="py-4">
                <Spinner />
              </div>
            ) : (
              <>
                <div className="mt-3 text-2xl font-semibold">{card.value}</div>
                <div className={`mt-2 text-sm ${card.deltaClass}`}>
                  {card.delta != null ? `${card.delta}%` : "—"}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* --- Pending tutors --- */}
      <section className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h3 className="font-semibold text-lg">Pending Tutors Approval</h3>
          <Link className="text-sm text-blue-600" to="/admin/tutors">
            View All
          </Link>
        </div>

        {isPendingTutorsError && <ErrorAlert error={pendingTutorsError} />}

        {isLoadingPendingTutors ? (
          <Spinner />
        ) : pendingTutorPreview.length === 0 ? (
          <p className="text-sm text-gray-500">
            No pending tutors at the moment.
          </p>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden space-y-4">
              {pendingTutorPreview.map((tutor, index) => (
                <div
                  key={tutor?.id ?? index}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={tutor.user.profileImageUrl}
                      alt={`${tutor.user.firstName} ${tutor.user.lastName}`}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {getUserName(tutor)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDate(tutor?.user.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Bio</p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {tutor?.bio ?? "-"}
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      className="block w-full text-center px-4 py-2 bg-white border rounded-full shadow-sm text-blue-600 text-sm"
                      to={`/admin/tutors/${tutor?.id}`}
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full max-w-full table-auto text-sm">
                <thead>
                  <tr className="bg-blue-50 text-xs sm:text-sm">
                    <th className="p-3 sm:p-4 whitespace-nowrap text-left">
                      Name
                    </th>
                    <th className="p-3 sm:p-4 whitespace-nowrap text-left">
                      Bio
                    </th>
                    <th className="p-3 sm:p-4 whitespace-nowrap text-left">
                      Date Applied
                    </th>
                    <th className="p-3 sm:p-4 text-right whitespace-nowrap">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pendingTutorPreview.map((tutor, index) => (
                    <tr
                      key={tutor?.id ?? index}
                      className={
                        index < pendingTutorPreview.length - 1 ? "border-b" : ""
                      }
                    >
                      <td className="p-3 sm:p-4">
                        <div className="flex items-center gap-3 min-w-[150px]">
                          <img
                            src={tutor.user.profileImageUrl}
                            alt={`${tutor.user.firstName} ${tutor.user.lastName}`}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover flex-shrink-0"
                          />
                          <span className="text-sm text-gray-700 break-words">
                            {getUserName(tutor)}
                          </span>
                        </div>
                      </td>

                      <td className="p-3 sm:p-4 text-gray-600 text-xs sm:text-sm max-w-[200px] truncate break-words">
                        {tutor?.bio ?? "-"}
                      </td>

                      <td className="p-3 sm:p-4 text-gray-600 whitespace-nowrap">
                        {formatDate(tutor?.user.createdAt)}
                      </td>

                      <td className="p-3 sm:p-4 text-right whitespace-nowrap">
                        <Link
                          className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white border rounded-full shadow-sm text-blue-600 text-xs sm:text-sm"
                          to={`/admin/tutors/${tutor?.id}`}
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* --- Students --- */}
      <section className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <h3 className="font-semibold text-lg">Registered Students</h3>
          <Link className="text-sm text-blue-600" to="/admin/students">
            View All
          </Link>
        </div>

        {isStudentsError && <ErrorAlert error={studentsError} />}

        {isLoadingStudents ? (
          <Spinner />
        ) : studentPreview.length === 0 ? (
          <p className="text-sm text-gray-500">No students found.</p>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="sm:hidden space-y-4">
              {studentPreview.map((student, index) => {
                const status = student?.accountStatus || "—";
                return (
                  <div
                    key={student?.id ?? index}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={student.profileImageUrl}
                        alt={`${student.firstName} ${student.lastName}`}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {getUserName(student)}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {formatDate(student?.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span
                        className={`inline-block px-3 py-1 text-xs rounded-full ${
                          status === "active"
                            ? "bg-green-100 text-green-700"
                            : status === "inactive"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {status ?? "—"}
                      </span>
                      <Link
                        className="px-4 py-1.5 bg-white border rounded-full shadow-sm text-blue-600 text-sm"
                        to={`/admin/students/${student?.id}`}
                      >
                        View
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-[600px] w-full text-left text-sm">
                <thead>
                  <tr className="bg-blue-50 text-xs sm:text-sm">
                    <th className="p-3 sm:p-4">Name</th>
                    <th className="p-3 sm:p-4">Date Joined</th>
                    <th className="p-3 sm:p-4">Status</th>
                    <th className="p-3 sm:p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {studentPreview.map((student, index) => {
                    const status = student?.accountStatus || "—";
                    return (
                      <tr
                        key={student?.id ?? index}
                        className={
                          index < studentPreview.length - 1 ? "border-b" : ""
                        }
                      >
                        <td className="p-3 sm:p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={student.profileImageUrl}
                              alt={`${student.firstName} ${student.lastName}`}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
                            />
                            <span className="text-sm text-gray-700 truncate max-w-[120px] sm:max-w-none">
                              {getUserName(student)}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 sm:p-4 text-gray-600">
                          {formatDate(student?.createdAt)}
                        </td>
                        <td className="p-3 sm:p-4">
                          <span
                            className={`inline-block px-3 py-1 text-xs rounded-full ${
                              status === "active"
                                ? "bg-green-100 text-green-700"
                                : status === "inactive"
                                ? "bg-red-100 text-red-600"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {status ?? "—"}
                          </span>
                        </td>
                        <td className="p-3 sm:p-4 text-right">
                          <Link
                            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white border rounded-full shadow-sm text-blue-600 text-xs sm:text-sm"
                            to={`/admin/students/${student?.id}`}
                          >
                            View
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
